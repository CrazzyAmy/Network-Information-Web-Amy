import {scene_init_meshes, t_buildings, t_decorations, add_scenario} from '../map_three.js'
import {createBuilding, createPlane} from './three_helper.js';
import {ListData, Site, JsonReader, Building, Decoration} from './object_class.js'  
export {send_request,search_menu, search_detail, draw_menu}

//將搜尋資料傳給後台伺服器，並回傳json檔
let send_request = function(search_string)
{
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/test", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  request.send(search_string)
  console.log("Send request: " + search_string)
  //這邊要等event發生才會回傳字串!!!!
  //!!!
  //!!!
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(request.responseText);
      curr_json = JSON.parse(request.responseText) 
    }
  }
  console.log("get responseText:")
  console.log(request.responseText)
  console.log(typeof(request.responseText))

  //return JSON.parse(dummy_json)
  //return JSON.parse(dummy_json_two)
  //return JSON.parse(request.responseText) 
}


//第一步搜尋，接收資料，事件列表&IP列表
function search_menu(search_string)
{
  //傳送搜尋字串，接收json檔
  search_string = 'searchType=MENU&timeStart=20201020&timeEnd=20201230&buildingName=EECS&bulidingFloor=5F'
  let menu_data = send_request(search_string)
  menu_data = curr_json
  menu_data = JSON.parse( dummy_json)
  //將大列表&小列表的資訊清空
  $("#Event-name-list").empty();
  $("#IP-list").empty();
  

  //用json檔的資料，更新大列表
  let total_IP_count = 0
  let idx = ''
  for(idx in menu_data)
  {
    if(idx == "subarray")continue;
    $("#Event-name-list:last").append(
      '<li>' +
      '<button type="button" onclick="draw_menu(' + idx + ')" class="' + menu_data[idx].eventSeverityCat + ' d-flex flex-row justify-content-around">' +
          '<div class="event-name">' + menu_data[idx].eventName + '</div>' +
          '<div class="count">' + menu_data[idx].totalIPCount + '</div>' +
      '</button>' +
      '</li>'
    )
    total_IP_count += menu_data[idx].totalIPCount
  }
  $("#event-num").text(total_IP_count)
  //將小列表的資訊儲存到global variable
  //以供未來使用
  curr_json = menu_data
}

//點擊大列表(按鈕)，更新小列表#IP-list資訊
function draw_menu(index)
{
  IP_list_data = curr_json[index].IP
  $("#IP-list:last").empty()
  for(idx in IP_list_data)
  {
    if(idx == "subarray")continue;
    $("#IP-list:last").append(
      '<li>' +
        '<button type="button" class="d-flex flex-row justify-content-around">' +
          '<div class="IP">' + IP_list_data[idx].name + '</div>' +
          '<div class="count">' + IP_list_data[idx].count + '</div>' +
        '</button>' + 
      '</li>'
    )
  } 
}

//第二部搜尋，接收資料，畫出事件線條
function search_detail(search_IP)
{
  detail_search_string = 'searchType=DETAIL&' + curr_form_search_string 
}

//form搜尋string的onchange事件
//在更改搜尋選項時，將搜尋字串做更新
function update_search_string()
{
  curr_form_search_string = $('#dataForm').serialize();
  console.log(curr_form_search_string)
}


let curr_json = null
let curr_form_search_string = ''

let dummy_json = '[  {      "eventName": "Some really serious event",      "eventSeverity":"9",      "eventSeverityCat": "HIGH",      "totalIPCount": 22,      "IP": [          {          "name": "93.174.93.72",          "count": 9          },          {          "name": "175.24.95.240",          "count": 6          },          {          "name": "120.126.152.226",          "count": 4          },          {          "name": "120.126.152.225",          "count": 3          }      ]  },  {      "eventName": "Something less important",      "eventSeverity":"5",      "eventSeverityCat": "MID",      "totalIPCount": 50,      "IP": [          {          "name": "93.174.93.72",          "count": 24          },          {          "name": "175.24.95.240",          "count": 14          },          {          "name": "120.126.152.226",          "count": 12          }      ]  }]';
let dummy_json_two = '[{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.129","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"142.93.121.47"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.127","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"71.6.232.5"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.98","deviceTime":"2020-12-17-16-7-9","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"193.42.40.135"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.177","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"162.142.125.95"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.217","deviceTime":"2020-12-17-16-6-49","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"194.61.54.112"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.154","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"103.114.105.219"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.125","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"167.248.133.66"},{"IP_count":2,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.218","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"45.129.33.176"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.195","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"45.129.33.47"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.207","deviceTime":"2020-12-17-16-19-35","eventName":"Traffic denied by policy","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-deny","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"85.173.248.184"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.161","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"83.97.20.35"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.108","deviceTime":"2020-12-17-16-19-23","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"49.7.20.135"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.151","deviceTime":"2020-12-17-16-19-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"164.90.186.5"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.198","deviceTime":"2020-12-17-16-19-17","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"114.107.236.75"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.177","deviceTime":"2020-12-17-16-19-23","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"52.14.170.215"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.181","deviceTime":"2020-12-17-16-19-36","eventName":"Traffic denied by policy","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-deny","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"79.178.52.230"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.197","deviceTime":"2020-12-17-16-20-55","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"219.71.120.118"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.215","deviceTime":"2020-12-17-16-21-9","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"185.202.2.238"},{"IP_count":2,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.196","deviceTime":"2020-12-17-16-21-29","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"13.115.247.15"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.184","deviceTime":"2020-12-17-16-21-35","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"195.154.170.81"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.89","deviceTime":"2020-12-17-16-21-35","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"162.243.232.174"}]'