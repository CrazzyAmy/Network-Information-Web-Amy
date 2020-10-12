import sys, base64, urllib2, ssl


def getDiscoveryResult(appServer, user, password):
    auth = 'Basic %s' % base64.encodestring(user + ':' + password)
    url = url = 'https://' + appServer + '/phoenix/rest/deviceMon/status?taskId=XXX'
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
        print outXML
    except urllib2.HTTPError, error:
        if (error.code != 204):
            print error


if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Usage: getDiscoveryResult.py appServer user password')
        print('Example: python getDiscoveryResult.py 192.168.20.116 super/admin adm1n')
        sys.exit()
    getDiscoveryResult(sys.argv[1], sys.argv[2], sys.argv[3])
