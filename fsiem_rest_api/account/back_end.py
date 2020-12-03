from flask import Flask
from flask import render_template
from flask import request
from flask import send_file
from flask import make_response
from datetime import timedelta
import pandas as pd
import datetime
import mysql.connector
import json
from flask import jsonify
def IP_select(IP):
    command=""
    if IP!='ALL':
        command+='srcIpAddr="'
        command+=IP
        command+='" or destIpAddr="'
        command+=IP
        command+='"'
    return command
def time_select(start,end):
    command=""
    if start!='ALL':
        command+='deviceTime>="'
        command+=str(start)
    if start!='ALL' and end!='ALL':
        command+='" and '
    if end!='ALL':
        command+='deviceTime<="'
        command+=str(end)
        command+='" '
    return command
def buildings_select(building):
    command=""
    if building!='ALL':
        print(building)
        buildings={'EECS':'電資大樓','LAW':'法學大樓','PA':'公共事務大樓','BUS':'商學大樓','HUM':'人文大樓','SS':'社會科學大樓','ADM':'行政大樓','LIB':'圖書館','CC':'資訊中心'}
        command+='="'
        command+=buildings[building]
        command+='" '
    return command
def Severity_select(severity):
    command=""
    if severity!='ALL':
        command+=str('eventSeverityCat')
        command+='="'
        command += str(severity)
        command+='" '
    return command
def floor_select(building_floor):
    command=""
    if building_floor!="ALL":
        command+='floor="'
        command+=building_floor
        command+='" '
    return command
def 
app = Flask(__name__)
@app.route("/test", methods=['POST'])
def search_request():
    ###resp=make_response('eventSeverityCat')
    ###buildings=make_response('buildings')
    ###time=make_response('time')
    ###detail=request.form.get('eventSeverityCat')
    request_value=request.form
    #接收request
    mydb = mysql.connector.connect(
        host = "127.0.0.1",
        user = "root",
        password = "ntpunsl814!",
        database = "sys",
    )
    #連接資料庫
    ##以下為處理條件
    mycursor = mydb.cursor()
    command = 'SELECT * FROM sys.event WHERE '
    command+=Severity_select(request_value.get('eventSeverityCat'))
    ##command+=buildings_select(request_value.get('buildingName'))
    #command+=time_select(request_value.get('timeStart'),request_value.get('timeEnd'))
    #command+=IP_select(request_value.get('IpAddr'))
    command+='order by eventSeverity'
    mycursor.execute(command)
    result_set = mycursor.fetchall()
    print(command)
    ##資料結構
    response={}
    #將從資料庫獲得的資料包裝成json傳回前端
    data_type=['eventType','eventSeverity','deviceTime','eventName','eventSeverityCat','srcIpAddr','destIpAddr']
    i=0
    for contents in result_set:
        count=0
        temp={}
        for content in contents:
            temp.update({data_type[count]:content})
            count+=1
        response.update({i:temp})
        i+=1
    resp=jsonify(response)
    resp.headers['Access-Control-Allow-Origin']='*'
    return resp
@app.route("/")
def get():
    return send_file("index1.html")
if __name__ == '__main__':
    app.run(host='120.126.151.195',port=5000)