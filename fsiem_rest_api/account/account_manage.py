import mysql.connector
def create_account():
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    temp=raw_input()
    temp=temp[:-1]
    sql = "INSERT INTO account (user,passoword,fortseim_account,fortseim_password,IP,level,date) VALUES (%s,%s,%s,%s,%s,%s,%s)"
    val=()
    val=temp.split(',')
    if IP_to_int(val[4]) == 'fuck':
        return 0
    val[5]=int(val[5])
    mycursor.execute(sql,val)
    mydb.commit()  

def IP_to_int(ip):
    ip=ip.split('.')
    try:
        for ips in ip:
            if not (0 <= int(ips) <= 255):
                print "ip out of range (0<=ip number<=255)"
                return 'fuck'
        return 0
    except:
        print "ip should be int"
        return 'fuck'

def select_duplicate(user,password,fortseim_account,fortseim_password,IP,level):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    commend="SELECT * FROM account_test.account WHERE user = '%s' or passoword='%s' or fortseim_account='%s' or fortseim_password='%s' or IP='%s' or level='%s' "%(user,password,fortseim_account,fortseim_password,IP,level)   
    mycursor.execute(commend)
    result_set = mycursor.fetchall()
    if result_set :
        print("intput duplicate in database")
        return True
    return False

def delete_account():
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    temp=raw_input()
    temp=temp[:-1]
    val=()
    val=temp.split(',')
    sql = "DELETE FROM account WHERE user = '%s' and passoword ='%s'"%(val[0],val[1])
    mycursor.execute(sql)
    mydb.commit()   

def create_table(table_name):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    mycursor.execute("CREATE TABLE account (user VARCHAR(50), password VARCHAR(50),fortseim_account VARCHAR(50),fortseim_password VARCHAR(50),IP VARCHAR(30),level VARCHAR(10))")

def new_column(column_name):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    mycursor.execute("alter table account Add date DATETIME")

if __name__ == '__main__':
    create_account()
    ##delete_account()
    
    print("Succeed")
    

