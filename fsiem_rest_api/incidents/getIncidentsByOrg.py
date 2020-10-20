import httplib2, ssl, re

from xml.dom.minidom import Node, Document, parseString

MAP = {'incidentTicketId': '', 'eventType': '', 'incidentTicketStatus': '', 'eventSeverity': '',
       'incidentTicketUser': '', 'incidentClearedUser': '', 'incidentClearedReason': '', 'phRecvTime': '',
       'incidentNotiRecipients': '', 'phCustId': '',
       'count': '', 'phEventCategory': '',
       'hostIpAddr': '', 'eventName': '', 'incidentComments': '', 'incidentSrc': '', 'eventSeverityCat': '',
       'bizService': ''
    , 'incidentTarget': '', 'incidentRptIp': '', 'incidentDetail': '', 'incidentStatus': '', 'incidentId': '',
       'incidentViewUsers': '', 'incidentViewStatus': '', 'incidentLastSeen': '', 'incidentFirstSeen': ''}


def getIncidentsByOrg(appServer, user, password, name):
    # translate orgName to phCustId
    phCustId = ''
    if name.lower() == "all":
        phCustId = "all"
    elif name.lower() == "super":
        phCustId = "1"
    else:
        orgs = getMonitoredOrganizations(appServer, user, password)
        for item in orgs:
            if name == item['name']:
                phCustId = item['domainId']
    if phCustId == '':
        print ("Org %s does not exist. Exit." % name)
        exit()

    url = "https://" + appServer + ":443/phoenix/rest/query/"
    urlfirst = url + "eventQuery"
    h = httplib2.Http(disable_ssl_certificate_validation=True)
    h.add_credentials(user, password)
    header = {'Content-Type': 'text/xml'}
    inXml = createQueryXML(phCustId)
    resp, content = h.request(urlfirst, "POST", inXml, header)
    queryId = content.decode()
    if 'error code="255"' in queryId:
        print ("Query Error, check sending XML file.")
        exit()

    urlSecond = url + "progress/" + queryId
    if resp['status'] == '200':
        resp, content = h.request(urlSecond)
    else:
        print ("appServer doesn't return query. Error code is %s" % resp['status'])
        exit()

    while content.decode() != '100':
        resp, content = h.request(urlSecond)

    outXML = []
    if content.decode() == '100':
        urlFinal = url + 'events/' + queryId + '/0/1000'
        resp, content = h.request(urlFinal)
        if content != '':
            outXML.append(content.decode())

    p = re.compile('totalCount="\d+"')
    mlist = p.findall(content)
    if mlist[0] != '':
        mm = mlist[0].replace('"', '')
        m = mm.split("=")[-1]
        num = 0
        if int(m) > 1000:
            num = int(m) / 1000
            if int(m) % 1000 > 0:
                num += 1
        if num > 0:
            for i in range(num):
                urlFinal = url + 'events/' + queryId + '/' + str(i * 1000 + 1) + '/1000'
                print (str(i * 1000 + 1) + '/1000')
                resp, content = h.request(urlFinal)
                if content != '':
                    outXML.append(content.decode())
    else:
        print ("no info in this report.")
        exit()
    param = dumpXML(outXML)
    return param


def createQueryXML(custId):
    doc = Document()
    reports = doc.createElement("Reports")
    doc.appendChild(reports)
    report = doc.createElement("Report")
    report.setAttribute("id", "All Incidents")
    report.setAttribute("group", "report")
    reports.appendChild(report)
    name = doc.createElement("Name")
    report.appendChild(name)
    nameText = doc.createTextNode("All Incidents")
    custScope = doc.createElement("CustomerScope")
    custScope.setAttribute("groupByEachCustomer", "true")
    report.appendChild(custScope)
    include = doc.createElement("Include")
    include.setAttribute("all", "true")
    custScope.appendChild(include)
    exclude = doc.createElement("Exclude")
    custScope.appendChild(exclude)

    description = doc.createElement("description")
    report.appendChild(description)

    select = doc.createElement("SelectClause")
    select.setAttribute("numEntries", "All")
    report.appendChild(select)
    attrList = doc.createElement("AttrList")
    select.appendChild(attrList)

    reportInterval = doc.createElement("ReportInterval")
    report.appendChild(reportInterval)
    window = doc.createElement("Window")
    window.setAttribute("unit", "Minute")
    window.setAttribute("val", '120')
    reportInterval.appendChild(window)

    pattern = doc.createElement("PatternClause")
    pattern.setAttribute("window", "3600")
    report.appendChild(pattern)
    subPattern = doc.createElement("SubPattern")
    subPattern.setAttribute("displayName", "Incidents")
    subPattern.setAttribute("name", "Incidents")
    pattern.appendChild(subPattern)
    single = doc.createElement("SingleEvtConstr")
    subPattern.appendChild(single)

    if(custId == "all"):
        singleText = doc.createTextNode("phEventCategory=1")
    else:
        singleText = doc.createTextNode("phEventCategory=1 and phCustId=" + custId + "")
    single.appendChild(singleText)

    filter = doc.createElement("RelevantFilterAttr")
    report.appendChild(filter)

    return doc.toxml()


def dumpXML(xmlList):
    param = []
    for xml in xmlList:
        doc = parseString(xml)
    for node in doc.getElementsByTagName("events"):
        for node1 in node.getElementsByTagName("event"):
            mapping = {}
            for node2 in node1.getElementsByTagName("attributes"):
                for node3 in node2.getElementsByTagName("attribute"):
                    itemName = node3.getAttribute("name")
                    for node4 in node3.childNodes:
                        if node4.nodeType == Node.TEXT_NODE:
                            message = node4.data
                            if '\n' in message:
                                message = message.replace('\n', '')
                            mapping[itemName] = message
            param.append(mapping)

    return param


def generateResult(param):
    if len(param) == 0:
        print ("No records found. Exit")
        exit()
    else:
        s=''
        print ("Total records %d" % len(param))
        data=open("data3.txt",'w+')
        for row in param:
            for title in row:
                ss=title+'  '+row[title]
                s+=''.join(ss)
                s+='\n'
        data.write(s)
        data.close()
        f(s)

def f(s):
    x=s.count('destGeoOrg')
    print(x)


def getMonitoredOrganizations(appServer, user, password):
    url = "https://" + appServer + "/phoenix/rest/config/Domain"
    h = httplib2.Http(disable_ssl_certificate_validation=True)
    h.add_credentials(user, password)
    resp, content = h.request(url, "GET")
    outXML = content.decode()
    param = dumpXML2(outXML)
    return param

def dumpXML2(xml):
    param = []
    doc = parseString(xml)
    for node in doc.getElementsByTagName("domains"):
        for node1 in node.getElementsByTagName("domain"):
            xmlId = node1.getAttribute("xmlId")
            if xmlId in ['Domain$system', 'Domain$service', 'Domain$Super']:
                pass
            else:
                mapping = {'name': '', 'domainId': '', 'disabled': '', 'initialized': '', 'include': '', 'exclude': ''}
                for node2 in node1.getElementsByTagName("domainId"):
                    for node3 in node2.childNodes:
                        if node3.nodeType == Node.TEXT_NODE:
                            mapping['domainId'] = node3.data
                for node4 in node1.getElementsByTagName("excludeRange"):
                    for node5 in node4.childNodes:
                        if node5.nodeType == Node.TEXT_NODE:
                            mapping['exclude'] = node5.data
                for node6 in node1.getElementsByTagName("includeRange"):
                    for node7 in node6.childNodes:
                        if node7.nodeType == Node.TEXT_NODE:
                            mapping['include'] = node7.data
                for node8 in node1.getElementsByTagName("name"):
                    for node9 in node8.childNodes:
                        if node9.nodeType == Node.TEXT_NODE:
                            mapping['name'] = node9.data
                for node10 in node1.getElementsByTagName("disabled"):
                    for node11 in node10.childNodes:
                        if node11.nodeType == Node.TEXT_NODE:
                            mapping['disabled'] = node11.data
                for node12 in node1.getElementsByTagName("initialized"):
                    for node13 in node12.childNodes:
                        if node13.nodeType == Node.TEXT_NODE:
                            mapping['initialized'] = node13.data
                param.append(mapping)
    return param


if __name__ == '__main__':
    import sys


param = getIncidentsByOrg('120.126.192.133','super/henry','ntpunsl814!','super')
generateResult(param)
