def findip():
    ip=input()

    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "account_test",
    )
    mycursor = mydb.cursor()
    commend="SELECT * FROM account_test.account WHERE IP ='%s' "%(ip)
    mycursor.execute(commend)
    result_set = mycursor.fetchall()
    for _ in result_set:
        if _ ==NULL:
            _='unknown'
