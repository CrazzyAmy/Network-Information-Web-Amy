#!/usr/bin/env python

import httplib2
import re
from xml.dom.minidom import Node, parseString, parse
import mysql.connector
import xml.etree.ElementTree as xet

cases=0

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
    mlist = p.findall(content)
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
                pr="content length = "+str(len(content))
                pr="i = "+str(i+2)+"   "+pr
                print(pr)
    else:
        print ("no info in this report.")
        exit()
    data = dumpXML3(outXML)
    return data

def dumpXML2(xmlList):
    param=[]
    for xmls in xmlList:
        param.append(xmls.split('\n'))
    return param

def dumpXML3(xmlList):
    param=''
    for xmls in xmlList:
        param+=xmls
    return param

def Write_in_SQL(param):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "sys",
    )
    mycursor = mydb.cursor()
    '''
    mycursor.execute("CREATE TABLE aaa (eventType VARCHAR(255), eventSeverity VARCHAR(255),deviceTime VARCHAR(255),eventName VARCHAR(255),eventSeverityCat VARCHAR(255),srcIpAddr VARCHAR(255),destIpAddr VARCHAR(255))")
    '''
    sql = "INSERT INTO aaa (eventType,eventSeverity,deviceTime,eventName,eventSeverityCat,srcIpAddr,destIpAddr) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    params=param.split('--END--')
    params.pop(-1)
    val=[]
    for contents in params:
        contents=contents[:-1]
        val.append(contents.split(','))
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

def mainjob():
    data = getQueryResultByOrg('120.126.192.133','super/henry','ntpunsl814!','top_fortisiem_events_by_count.xml')
    f=open("data3.txt",'w+')
    data=data.encode('ascii', 'ignore')
    f.write(data)
    data,length=filterr(data)
    Write_in_SQL(data)
    return length

if __name__ == '__main__':
    try:
        ##s=input("rounds:")
        print("Rounds: 100")
        s='100'
        times=int(s)
        i=0
        while i<times:
            length=mainjob()
            i+=1
            print("Round "+str(i)+" done. Number of events: "+str(length)+"  Execute time: "+str(time.localtime().tm_year)+"."+str(time.localtime().tm_mon)+"."+str(time.localtime().tm_mday)+" "+str(time.localtime().tm_hour)+":"+str(time.localtime().tm_min)+":"+str(time.localtime().tm_sec))
    except NameError as err:
        print("Process stopped due to exceptions.")