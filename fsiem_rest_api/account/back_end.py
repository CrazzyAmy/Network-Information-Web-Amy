from flask import Flask
from flask import render_template
from flask import request
from flask import send_file
from flask import make_response
from datetime import timedelta
from event_query import *
import pandas as pd
import datetime
import mysql.connector
import json
from flask import jsonify
app = Flask(__name__)
@app.route("/second_query", methods=['POST'])
def search_detail():
    request_value=request.form
    start=request_value.get('timeStart')
    end=request_value.get('timeEnd')
    building=request_value.get('buildingName')
    building_floor=request_value.get('bulidingFloor')
    eventname=request_value.get('eventName')
    src_IP=request_value.get('IpAddr')
    buildings={'EECS':'電資大樓','LAW':'法學大樓','PA':'公共事務大樓','BUS':'商學大樓','HUM':'人文大樓','SS':'社會科學大樓','ADM':'行政大樓','LIB':'圖書館','CC':'資訊中心'}
    if building=='ALL' :
        building=''
    else :
        building=buildings[building]
    if  building_floor=='ALL':
        building_floor=''
    
    start=start[:4]+'-'+start[4:6]+'-'+start[6:]+' 00:00:00'
    end=end[:4]+'-'+end[4:6]+'-'+end[6:]+' 23:59:59'
    lines=choose_data_ip_attack_building_total(building+building_floor,start,end)
    answer=[]
    for i in lines:
        case={}
        attr=i
        if eventname==attr[0] and attr[5]==src_IP:
            case.update({'destIpAddr':attr[6]})
            case.update({'deviceTime':attr[2]})
            case.update({'eventName':attr[0]})
            case.update({'eventSeverity':attr[1]})
            case.update({'eventSeverityCat':attr[4]})
            case.update({'eventType':attr[3]})
            case.update({'srcIpAddr':attr[5]})
            print(attr)
            building=attr[7].split('-')
            if building[1] != '0':
                src_building=building[1][0:-2]
                src_building=buildings[src_building]
                floor=building[1][-2:]
                case.update({'buildingName':src_building})
                case.update({'buildingFloor':floor})
            else:
                case.update({'buildingName':None})
                case.update({'buildingFloor':None})
            answer.append(case)
    resp=jsonify(answer)
    resp.headers['Access-Control-Allow-Origin']='*'
    return resp
def IP_select(IP):
    command=""
    if IP!='ALL' and IP!=None:
        command+='srcIpAddr="'
        command+=IP
        command+='" or destIpAddr="'
        command+=IP
        command+='"'
    return command
def time_select(start,end):
    command=""
    if start!='ALL' and start!=None:
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
    if building!='ALL' and building!=None:
        print(building)
        buildings={'EECS':'電資大樓','LAW':'法學大樓','PA':'公共事務大樓','BUS':'商學大樓','HUM':'人文大樓','SS':'社會科學大樓','ADM':'行政大樓','LIB':'圖書館','CC':'資訊中心'}
        command+='="'
        command+=building
        command+='" '
    return command
def Severity_select(severity):
    print(severity)
    command=""
    if severity!='ALL' and severity!=None:
        command+=str('eventSeverityCat')
        command+='="'
        command += str(severity)
        command+='" '
    return command
def floor_select(building_floor):
    command=""
    if building_floor!="ALL" and building_floor!=None:
        command+='floor="'
        command+=building_floor
        command+='" '
    return command

@app.route("/test", methods=['POST'])
def search_request():
    request_value=request.form
    start=request_value.get('timeStart')
    end=request_value.get('timeEnd')
    building=request_value.get('buildingName')
    building_floor=request_value.get('bulidingFloor')
    buildings={'EECS':'電資大樓','LAW':'法學大樓','PA':'公共事務大樓','BUS':'商學大樓','HUM':'人文大樓','SS':'社會科學大樓','ADM':'行政大樓','LIB':'圖書館','CC':'資訊中心'}
    if building=='ALL' :
        building=''
    else :
        building=buildings[building]
    if  building_floor=='ALL':
        building_floor=''
    ##資料結構
    start=start[:4]+'-'+start[4:6]+'-'+start[6:]+' 00:00:00'
    end=end[:4]+'-'+end[4:6]+'-'+end[6:]+' 23:59:59'
    #2020-10-20 00:00:00
#2020-12-30 23:59:59
#電資大樓5F
    #將從資料庫獲得的資料包裝成json傳回前端
    lines=choose_data_ip_attack_building_total(building+building_floor,start,end)
    event_name={}
    event_eventSeverity={}
    event_eventSeverityCat={}
    event_IP={}
    for i in lines:
        attr=i
        if attr[0] in event_name:
            event_name[attr[0]]+=1
            index=-1
            for j in range(len(event_IP[attr[0]])):
                if event_IP[attr[0]][j]['name']==attr[5]:
                    index=j
                    break
            if index<0:
                temp_dict={'name':attr[5],'count':1}
                event_IP[attr[0]].append(temp_dict)
            else:
                event_IP[attr[0]][index]['count']+=1        
        else:
            event_name.update({attr[0]:1})
            event_eventSeverity.update({attr[0]:attr[1]})
            event_eventSeverityCat.update({attr[0]:attr[4]})
            temp_dict={'name':attr[5],'count':1}
            temp_dict2=[]
            temp_dict2.append(temp_dict)
            event_IP.update({attr[0]:temp_dict2})
    answer=[]
    for i in event_IP:
        temp=event_IP[i]
        event_IP[i]=sorted(event_IP[i],key=lambda temp: temp['count'])
        event_IP[i]=temp[0:4]
        temp1={}
        temp1.update({'eventName':i})
        temp1.update({'totalIPCount':event_name[i]})
        temp1.update({'eventSeverity':event_eventSeverity[i]})
        temp1.update({'eventSeverityCat':event_eventSeverityCat[i]})
        temp1.update({'IP':event_IP[i]})
        answer.append(temp1)
    with app.app_context():       
        resp=jsonify(answer)
        resp.headers['Access-Control-Allow-Origin']='*'
    return resp
@app.route("/")
def get():
    return send_file("index1.html")
if __name__ == '__main__':
    app.run(host='120.126.151.195',port=5000)