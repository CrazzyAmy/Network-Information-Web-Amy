import mysql.connector
import datetime
def findip():
    ip=input()
    #在指定資料庫中找出指定IP
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "event",
    )
    mycursor = mydb.cursor()
    table_name = "d"+str(datetime.datetime.today().day)
    command="SELECT * FROM "+table_name+" WHERE srcIpAddr ='%s' OR destIpAddr = '%s'"%(ip,ip)
    mycursor.execute(command)
    result_set = mycursor.fetchall()
    for _ in result_set:
        if _ ==None:
            _='unknown'
        print(_)
if __name__ == "__main__":
    findip()
