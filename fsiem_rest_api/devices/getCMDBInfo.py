import sys, base64, urllib2, ssl

'''
1. Get short description of all devices
url = https://<<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/devices
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/devices?organization=ACME

2. Get short description of all devices in an address range
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/devices?includeIps=<includeIpSet>&excludeIps=<excludeIpSet>
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/devices?organization=ACME&includeIps=<includeIpSet>&excludeIps=<excludeIpSet>

3. Get full information about one devices
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/device?ip=<deviceIp>&loadDepend=true
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/device?organization=ACME&ip=<deviceIp>&loadDepend=true

4. Get a section of information (Applications, Interfaces, Processors, Storages) about one devices
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/device?ip=<deviceIp>&loadDepend=true&fields=<sectionName>
url = https://<FortiSIEM_Supervisor_IP>/phoenix/rest/cmdbDeviceInfo/device?organization=ACME&ip=<deviceIp>&loadDepend=true&fields=<sectionName>
'''


def getCMDBInfo(appServer, user, password):
    auth = 'Basic %s' % base64.encodestring(user + ':' + password)
    url = 'https://' + appServer + '/phoenix/rest/cmdbDeviceInfo/devices'
    request = urllib2.Request(url)
    request.add_header('Authorization', auth.rstrip())
    request.add_header('User-Agent', 'Python-urllib2/2.7')
    request.get_method = lambda: 'GET'
    try:
        ssl._https_verify_certificates(enable=False)
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        opener = urllib2.build_opener(urllib2.HTTPSHandler(debuglevel=False, context=ctx))
        urllib2.install_opener(opener)
        handle = urllib2.urlopen(request)
        outXML = handle.read()
        print (outXML)
    except urllib2.HTTPError, error:
        if (error.code != 204):
            print (error)


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Usage: getCMDBInfo.py appServer user password')
        print('Example: python getCMDBInfo.py 192.168.20.116 super/admin adm1n')
        sys.exit()
    getCMDBInfo(sys.argv[1], sys.argv[2], sys.argv[3])
