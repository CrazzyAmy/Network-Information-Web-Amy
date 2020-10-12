import sys, base64, urllib2, ssl


def restPost(appServer, user, password, file):
    f = open(file, 'r')
    content = f.read()
    f.close()
    url = 'https://' + appServer + '/phoenix/rest/dashboard/html/add'
    auth = 'Basic %s' % base64.encodestring(user + ':' + password)
    request = urllib2.Request(url, data=content)
    request.add_header('Authorization', auth.rstrip())
    request.add_header('Content-Type', 'text/xml')
    request.add_header('Content-Length', len(content))
    request.add_header('User-Agent', 'Python-urllib2/2.7')
    request.get_method = lambda: 'PUT'
    try:
        ssl._https_verify_certificates(enable=False)
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        opener = urllib2.build_opener(urllib2.HTTPSHandler(debuglevel=False, context=ctx))
        urllib2.install_opener(opener)
        handle = urllib2.urlopen(request)
        print('Response HTTP Code: %s' % handle.getcode())
    except urllib2.HTTPError, error:
        if (error.code != 204):
            print (error)


if __name__ == '__main__':
    if len(sys.argv) != 5:
        print('Usage: addDashboard.py appServer user password dashboardDefFile')
        print('Example: python addDashboard.py 192.168.20.116 super/admin adm1n dashboardDef.xml')
        sys.exit()
    restPost(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
