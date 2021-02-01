import mysql.connector
import datetime
def create_account(_database = "sys",table_name = "account"):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    temp=input()
    ##temp=temp[:-1]
    sql = "INSERT INTO %s (user,passoword,fortseim_account,fortseim_password,IP,level,date) VALUES (%s,%s,%s,%s,%s,%s,%s)"%table_name
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
                print ("ip out of range (0<=ip number<=255)")
                return 'fuck'
        return 0
    except:
        print ("ip should be int")
        return 'fuck'

def select_duplicate(user,password,fortseim_account,fortseim_password,IP,level,_database = "sys",table_name = "account"):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    command="SELECT * FROM %s WHERE user = '%s' or passoword='%s' or fortseim_account='%s' or fortseim_password='%s' or IP='%s' or level='%s' "%(table_name,user,password,fortseim_account,fortseim_password,IP,level)   
    mycursor.execute(command)
    result_set = mycursor.fetchall()
    if result_set :
        print("input duplicate in database")
        return True
    return False

def delete_account(_database = "sys",table_name = "account"):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    temp=input()
    ##temp=temp[:-1]
    val=()
    val=temp.split(',')
    sql = "DELETE FROM %s WHERE user = '%s' and passoword ='%s'"%(table_name,val[0],val[1])
    mycursor.execute(sql)
    mydb.commit()   

def create_table(_database = "sys",table_name="account"):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    ##format : mycursor.execute("CREATE TABLE account (user VARCHAR(50), password VARCHAR(50),fortseim_account VARCHAR(50),fortseim_password VARCHAR(50),IP VARCHAR(30),level VARCHAR(10))")
    command = "CREATE TABLE " + table_name +" (eventType varchar(255),eventSeverity varchar(255),deviceTime datetime,eventName varchar(255),eventSeverityCat varchar(255),srcIpAddr varchar(255),destIpAddr varchar(255))"
    ##columncount = int(input('How many columns ?'))
    ##i=0
    ##while i < columncount:
        ##commands = input("column name ?") + " " + input("data type ?")
        ##command += commands + ","
        ##i+=1
    ##command = command[:-1] + ")"
    print(command)
    mycursor.execute(command)

def new_column(_database = "sys",table_name = "none"):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()

    if table_name == "none":
        table_name = input("Input table name :")
    adding_column = input("Input adding column : ")
    column_type = input("Input column type : ")
    
    ##mycursor.execute("alter table account Add date DATETIME")
    command = "ALTER TABLE " + table_name + " ADD " + adding_column + " " + column_type
    mycursor.execute(command)

def alter_table(table_name = 'events'):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "event",
    )
    mycursor = mydb.cursor()
    command = "SELECT * FROM events where "


if __name__ == '__main__':
    i=1
    datetime_dt = datetime.datetime.today().day
    while i <= 31:
        day = "d" + str(i)
        ##create_table('event',day)
        i+=1
    ##create_account()
    ##delete_account()
    new_column('event','events')
    print("Succeed")
    
