1. Get CMDB Device Info
Usage: getCMDBInfo.py appServer user password
Example: python getCMDBInfo.py 192.168.20.116 super/admin adm1n

2. Get Monitored devices
Usage: getMonitoredDevicesByOrg.py appServer user password orgName
Example: python getMonitoredDevicesByOrg.py 192.168.20.116 super/admin adm1n super

3. Update device monitoring
Usage: updateMonitor.py appServer user password deviceDefFile
Example: python updateMonitor.py 192.168.20.116 super/admin adm1n deviceMonitorDef.xml

4. Get incident status of Linux and Windows agents
Usage: getAgentStatus.py appServer user password orgId,hostName
Example: python getAgentStatus.py 192.168.20.116 super/admin adm1n 2000,centos7

