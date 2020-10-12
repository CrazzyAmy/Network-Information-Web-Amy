import httplib2, ssl
from xml.dom.minidom import Node, Document, parseString


def getMonitoredDevicesByOrg(appServer, user, password, name):
    url = "https://" + appServer + "/phoenix/rest/deviceInfo/monitoredDevices"
    h = httplib2.Http(disable_ssl_certificate_validation=True)
    h.add_credentials(user, password)
    resp, content = h.request(url, "GET")
    outXML = content.decode()
    if name == "super":
        name = "Super"
    dumpXML(outXML, name)


def dumpXML(xml, name):
    param = []
    doc = parseString(xml)
    for node in doc.getElementsByTagName("perfMonDevices"):
        for node1 in node.getElementsByTagName("device"):
            orgName = ''
            for org in node1.getElementsByTagName("organization"):
                for orgN in org.childNodes:
                    if orgN.nodeType == Node.TEXT_NODE:
                        orgName = orgN.data
            if name.lower() == "all" or name == orgName:
                mapping = {'accessIp': '', 'deviceName': '', 'deviceType': '', 'organization': orgName,
                           'monitors': ''}
                monitors = []
                for node2 in node1.getElementsByTagName("accessIp"):
                    for node3 in node2.childNodes:
                        if node3.nodeType == Node.TEXT_NODE:
                            mapping['accessIp'] = node3.data
                for node4 in node1.getElementsByTagName("deviceName"):
                    for node5 in node4.childNodes:
                        if node5.nodeType == Node.TEXT_NODE:
                            mapping['deviceName'] = node5.data
                for node6 in node1.getElementsByTagName("deviceType"):
                    for node7 in node6.childNodes:
                        if node7.nodeType == Node.TEXT_NODE:
                            mapping['deviceType'] = node7.data
                for monis in node1.getElementsByTagName("monitors"):
                    for mon in monis.getElementsByTagName("monitor"):
                        moniPair = ''
                        for cat in mon.getElementsByTagName("category"):
                            for catN in cat.childNodes:
                                if catN.nodeType == Node.TEXT_NODE:
                                    moniPair = catN.data
                        for met in mon.getElementsByTagName("method"):
                            for metN in met.childNodes:
                                if metN.nodeType == Node.TEXT_NODE:
                                    moniPair += "-" + metN.data
                        monitors.append(moniPair)
                mapping['monitors'] = monitors
                param.append(mapping)
    for node in doc.getElementsByTagName("eventPullingDevices"):
        for node1 in node.getElementsByTagName("device"):
            orgName = ''
            for org in node1.getElementsByTagName("organization"):
                for orgN in org.childNodes:
                    if orgN.nodeType == Node.TEXT_NODE:
                        orgName = orgN.data
            if name == "all" or name == orgName:
                mapping = {'accessIp': '', 'deviceName': '', 'deviceType': '', 'organization': orgName, 'monitors': ''}
                monitors = []
                for node2 in node1.getElementsByTagName("accessIp"):
                    for node3 in node2.childNodes:
                        if node3.nodeType == Node.TEXT_NODE:
                            mapping['accessIp'] = node3.data
                for node4 in node1.getElementsByTagName("deviceName"):
                    for node5 in node4.childNodes:
                        if node5.nodeType == Node.TEXT_NODE:
                            mapping['deviceName'] = node5.data
                for node6 in node1.getElementsByTagName("deviceType"):
                    for node7 in node6.childNodes:
                        if node7.nodeType == Node.TEXT_NODE:
                            mapping['deviceType'] = node7.data
                for monis in node1.getElementsByTagName("monitors"):
                    for mon in monis.getElementsByTagName("monitor"):
                        moniPair = ''
                        for cat in mon.getElementsByTagName("category"):
                            for catN in cat.childNodes:
                                if catN.nodeType == Node.TEXT_NODE:
                                    moniPair = catN.data
                        for met in mon.getElementsByTagName("method"):
                            for metN in met.childNodes:
                                if metN.nodeType == Node.TEXT_NODE:
                                    moniPair += "-" + metN.data
                        monitors.append(moniPair)
                        print(moniPair)
                mapping['monitors'] = monitors
                param.append(mapping)
    print ("deviceName,accessIp,deviceType,Organization,Monitors\n\n")
    for item in param:
        monitors = item['monitors']
        mon = ','.join(monitors)
        print ("%s,%s,%s,%s,%s\n" % (item['deviceName'], item['accessIp'],
                                    item['deviceType'], item['organization'], mon))


if __name__ == '__main__':
    import sys

    if len(sys.argv) != 5:
        print ("Usage: getMonitoredDevicesByOrg.py appServer user password orgName")
        exit()
    getMonitoredDevicesByOrg(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
