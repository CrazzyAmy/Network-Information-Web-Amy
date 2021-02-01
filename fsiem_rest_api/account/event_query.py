import mysql.connector
import time
def choose_data(place,time_start,time_end,_database = 'event',table_name = 'events'):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    #command="SELECT * FROM %s WHERE deviceTime <'%s' "%(table_name,localtime)
    #command = SELECT * FROM event.events where building_floor like '%電資大樓6F%'
    command = "SELECT *, count(*) AS number FROM %s WHERE "%table_name
    if place!=None:
        command += "building_floor like '%s' AND "%("%"+place+"%")
    
    if time_start:
        command += "deviceTime >='%s' AND "%time_start
    if time_end:
        command += "deviceTime <='%s' AND"%time_end

    command = command[:-3]

    command += "GROUP BY eventName order by eventSeverity , count(*) desc"
    print(command)
    mycursor.execute(command)

    src_result = mycursor.fetchall()
    mydb.commit()
    #src_result = sorted(src_result, key = lambda src_result : src_result[7],reverse=True)
    return src_result
def choose_data_ip_attack_building_total(place,time_start,time_end,_database = 'event',table_name = 'events'):
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = _database,
    )
    mycursor = mydb.cursor()
    command = "SELECT * FROM %s WHERE "%table_name
    print(place)
    if place!='':
        command += "building_floor like '%s' AND "%("%"+place+"%")
    
    if time_start:
        command += "deviceTime >='%s' AND "%time_start
    if time_end:
        command += "deviceTime <='%s' AND"%time_end
    command = command[:-3]
    command+='order by eventSeverity DESC '
    command+='LIMIT 100000'
    print(command)
    mycursor.execute(command)
    src_result = mycursor.fetchall()
    mydb.commit()
    #src_result = sorted(src_result, key = lambda src_result : src_result[7],reverse=True)
    return src_result
if __name__ == '__main__':
    #localtime = time.localtime(time.time())
    #date=str(localtime.tm_year)+'-'+str(localtime.tm_mon)+'-'+str(localtime.tm_mday)
    print(choose_data('','2020-12-15 18:06:20','2020-12-31 16:59:10'))
    #電資大樓
    #6F