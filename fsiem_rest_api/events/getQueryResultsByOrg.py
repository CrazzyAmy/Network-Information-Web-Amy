#!/usr/bin/env python

import httplib2, re, datetime, mysql.connector
from xml.dom.minidom import Node, parseString, parse
import xml.etree.ElementTree as xet
import pandas as pd
#import ip_to_place
from ip_to_place import query_ip

cases = 10
ipdict = {}

def getQueryResultByOrg(appServer, user, password, inXml):
    url = "https://" + appServer + ":443/phoenix/rest/query/"
    urlfirst = url + "eventQuery"
    h = httplib2.Http(disable_ssl_certificate_validation=True)
    h.add_credentials(user, password)
    header = {'Content-Type': 'text/xml'}
    if '.xml' not in inXml:
        inXml += '.xml'

    doc = parse(inXml)
    t = doc.toxml()
    if '<DataRequest' in t:
        t1 = t.replace("<DataRequest", "<Reports><Report")
    else:
        t1 = t
    if '</DataRequest>' in t1:
        t2 = t1.replace("</DataRequest>", "</Report></Reports>")
    else:
        t2 = t1

    resp, content = h.request(urlfirst, "POST", t2, header)
    queryId = content.decode("utf-8")
    if 'error code="255"' in queryId:
        print ("Query Error, check sending XML file.")
        exit()

    urlSecond = url + "progress/" + queryId
    if resp['status'] == '200':
        resp, content = h.request(urlSecond)
    else:
        print ("appServer doesn't return query. Error code is %s" % resp['status'])
        exit()

    while content.decode("utf-8") != '100':
        resp, content = h.request(urlSecond)

    outXML = []
    if content.decode("utf-8") == '100':
        urlFinal = url + 'events/' + queryId + '/0/1000'
        resp, content = h.request(urlFinal)
        if content != '':
            outXML.append(content.decode("utf-8"))

    p = re.compile('totalCount="\d+"')
    mlist = p.findall(content.decode("utf-8"))
    if mlist[0] != '':
        mm = mlist[0].replace('"', '')
        m = mm.split("=")[-1]
        m=int(m)
        num = 0
        if m > 1000:
            num = m / 1000
            if m % 1000 > 0:
                num += 1
        if num > 0:
            for i in range(cases):
                urlFinal = url + 'events/' + queryId + '/' + str((i + 1) * 1000) + '/1000'
                resp, content = h.request(urlFinal)
                if content != '':
                    outXML.append(content.decode("utf-8"))
                '''
                pr="content length = "+str(len(content))
                pr="i = "+str(i+2)+"   "+pr
                print(pr)
                '''
    else:
        print ("no info in this report.")
        exit()
    data = dumpXML(outXML)
    return data

def dumpXML(xmlList):
    param=''
    for xmls in xmlList:
        param+=xmls
    return param

def Write_in_SQL(param,datetime_dt):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "event",
    )
    mycursor = mydb.cursor()
    ##table_name = "d" + datetime_dt
    ##sql = "INSERT INTO "+ table_name +" (eventType,eventSeverity,deviceTime,eventName,eventSeverityCat,srcIpAddr,destIpAddr) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    params=param.split('--END--')
    params.pop(-1)
    params = time_format(params)
    val=[]
    i=0
    for contents in params:
        contents=contents[:-1]
        val.append(contents.split(','))
        try:
            a,b = ipdict[val[i][5]]
            c,d = ipdict[val[i][6]]
        except KeyError:
            a,b,c,d = '0','0','0','0'
        val[i].append(a+"-"+c)
        val[i].append(b+"-"+d)
        i+=1
    ##mycursor.executemany(sql, val)
    ##mydb.commit()
    sql = "INSERT INTO events (eventType,eventSeverity,deviceTime,eventName,eventSeverityCat,srcIpAddr,destIpAddr,building_floor,room) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
    mycursor.executemany(sql, val)
    mydb.commit()

def filterr(s):
    length=0
    numstart=0
    numend=0
    output=''
    var=['\"eventType\"', '\"eventSeverity\"','\"deviceTime\"','\"eventName\"','\"eventSeverityCat\"','\"srcIpAddr\"','\"destIpAddr\"']
    flag=0
    while flag==0:
        i=0
        while i<7:
            firstfoundnum=s.find(var[i],numend)
            if firstfoundnum==-1:
                flag=1
                output=output[:-7]
                break
            numstart=firstfoundnum+len(var[i])+1
            numend=numstart
            c=s[numstart]
            while c!='<':
                numend+=1
                c=s[numend]
            output+=s[numstart:numend]
            output+=','
            i+=1
        output+='--END--'
        length+=1
    return output,length-1

def time_format(data):
    i = 0
    for content in data:
        content=content.split(",")
        s = content[2].split(" ")
        content[2]=s[5]+"-" + month(s[1]) + "-" + s[2] + "-" + s[3]
        content = ",".join(content)
        data[i] = content
        i += 1
    return data

def month(day):
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return months.index(month) + 1

def mainjob():
    datetime_dt = str(datetime.datetime.today().day)
    data = getQueryResultByOrg('120.126.192.133','super/henry','ntpunsl814!','top_fortisiem_events_by_count.xml')
    data,length=filterr(data)
    if length == 0:
        return 0
    Write_in_SQL(data,datetime_dt)
    return length

if __name__ == '__main__':
    df = pd.read_csv('output.csv', encoding = "ANSI", sep = ',')
    df = df.fillna(0)
    for i in df.index:
        ipdict[df['IP位址'][i]] = (str(df['大樓'][i]) + str(df['樓層'][i]), str(df['使用單位'][i]))

    times=100
    i=0
    while i < times:
        length=mainjob()
        if length == 0:
            print('No more new events')
            break
        i+=1
        print("Round "+str(i)+" done. Number of events: "+str(length))