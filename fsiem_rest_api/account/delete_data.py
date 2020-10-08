import mysql.connector
import time
def delete_data(localtime):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    commend="SELECT * FROM account_test.account WHERE date <'%s' "%(localtime)
    mycursor.execute(commend)
    result_set = mycursor.fetchall()
    mydb.commit()  
if __name__ == '__main__':
    localtime = time.localtime(time.time())
    date=str(localtime.tm_year)+'-'+str(localtime.tm_mon)+'-'+str(localtime.tm_mday)
    delete_data(date)