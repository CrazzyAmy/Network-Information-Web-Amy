import {scene_init_meshes, t_buildings, t_decorations, add_scenario, clear_multi_scenario} from '../map_three.js'
import {createBuilding, createPlane} from './three_helper.js';
import {ListData, Site, JsonReader, Building, Decoration} from './object_class.js'  
import { buildings } from '../data_control.js';
export {send_request,search_menu, search_detail, draw_menu, search_IpList}

//將要畫的線條畫出來

document.querySelector("#search_first").addEventListener('click', function(){
  /*clear_multi_scenario()
  aaa = aaa + 1
  aaa %= 7
  let site1_from =  [new Site("SS", 0, "")];
  let site1_to = [new Site("SS", 0, "")];
  add_scenario(site1_from, site1_to , 0xFF0000);*/
  search_detail("","","")
});
let aaa = 0

//開啟網頁時，做第一次的搜尋
$(document).ready(function(){
  clear_multi_scenario()
  aaa = aaa + 1
  aaa %= 7
  let site1_from =  [new Site("SS", 0, "")];
  let site1_to = [new Site("SS", 0, "")];
  add_scenario(site1_from, site1_to , 0xFF0000);
  //將日期訂為YYYY-MM-DD
  console.log("2".padStart(2,"0"))
   let today = new Date
   let today_date = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2,"0") + "-" + today.getDate().toString().padStart(2,"0")
   $("#timeStart").val(today_date)
   $("#timeEnd").val(today_date)
   update_search_string()
  //發送搜尋請求
   search_menu()
   search_IpList()
   search_detail("","","")
})
 window.onload = function(){
 }

//將初步搜尋資料傳給後台伺服器，並回傳json檔
let send_request = function(search_string)
{
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/test", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"
  console.log(search_string)
  request.send(search_string)
  console.log("Send request: " + search_string)
  request.onreadystatechange = function() {
    //收到資料後，畫大列表
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(request.responseText);
      curr_json = JSON.parse(request.responseText) 
      console.log(curr_json);
      if(curr_json.length == 0)return;
      $("#Event-name-list").empty();
      $("#IP-list").empty();
      

      //用json檔的資料，更新大列表
      let total_IP_count = 0
      let idx = ''
      let menu_data = curr_json
      for(idx in menu_data)
      {
        if(idx == "subarray")continue;
        $("#Event-name-list:last").append(
          '<li>' +
          '<button type="button" id="Event' + idx + '" class=" sever-' + menu_data[idx].eventSeverity + ' d-flex flex-row justify-content-around">' +
              '<div class="event-name">' + menu_data[idx].eventName + '</div>' +
              '<div class="count">' + menu_data[idx].totalIPCount + '</div>' +
          '</button>' +
          '</li>'
        )
        //console.log(idx)
        //console.log(typeof(idx))
        let para = idx
        document.querySelector("#Event" + idx).addEventListener('click', function(){draw_menu(para);});


        total_IP_count += menu_data[idx].totalIPCount
        
      }
      $("#event-num").text(total_IP_count)
      //將小列表的資訊儲存到global variable
      //以供未來使用
      curr_json = menu_data
      guess_location_menu()
    }
  }
  //console.log("get responseText:")
  //console.log(request.responseText)
  //console.log(typeof(request.responseText))

  //return JSON.parse(dummy_json)
  //return JSON.parse(dummy_json_two)
  //return JSON.parse(request.responseText) 
}


//第一步搜尋，接收資料，事件列表&IP列表
function search_menu(search_string)
{
  update_search_string()
  //傳送搜尋字串，接收json檔
  search_string = 'searchType=MENU&timeStart=20201223&timeEnd=20201225&buildingName=ALL&bulidingFloor=ALL'
  search_string = 'searchType=MENU&' + curr_form_search_string
  let menu_data = send_request(search_string)
  menu_data = curr_json
  //menu_data = JSON.parse(dummy_json)
  //將大列表&小列表的資訊清空
  /*
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
      '<button type="button" id="Event' + idx + '" class="' + menu_data[idx].eventSeverityCat + ' d-flex flex-row justify-content-around">' +
          '<div class="event-name">' + menu_data[idx].eventName + '</div>' +
          '<div class="count">' + menu_data[idx].totalIPCount + '</div>' +
      '</button>' +
      '</li>'
    )
    console.log(idx)
    console.log(typeof(idx))
    let para = idx
    document.querySelector("#Event" + idx).addEventListener('click', function(){draw_menu(para);});


    total_IP_count += menu_data[idx].totalIPCount
    
  }
  $("#event-num").text(total_IP_count)
  //將小列表的資訊儲存到global variable
  //以供未來使用
  curr_json = menu_data
  
  */
}

//搜尋IP List總表資訊
function search_IpList(search_string)
{
  search_string = "searchType=IPLST&" + curr_form_search_string
  console.log(search_string)
  curr_IpLst_json = null;
  
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/ip_lst_menu", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  request.send(search_string)
  console.log("search_IpList() Send request: " + search_string)
  //收到資料後，畫出右側的IP列表
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //curr_IpLst_json = JSON.parse(dummy_json_IP)
      curr_IpLst_json = JSON.parse(request.responseText) 
      console.log("search_IpList() Receive response: ")
      console.log(curr_IpLst_json)
      
      //用json檔的資料，更新IP列表
      let total_IP_count = 0
      let idx = ''
      let IpLst = curr_IpLst_json
      for(idx in IpLst)
      {
        if(idx == "subarray")continue;
        $("#IP-main-list:last").append(
          '<li>' +
          '<button type="button" id="IPlstEvent' + idx + '" class=" d-flex flex-row justify-content-around">' +
              '<div class="event-name">' + IpLst[idx].IP + '</div>' +
              '<div class="count">' + IpLst[idx].score + '</div>' +
          '</button>' +
          '</li>'
        )
        //console.log(idx)
        //console.log(typeof(idx))
        let para = idx
        document.querySelector("#IPlstEvent" + idx).addEventListener('click', function(){draw_IP_related(para);});
        document.querySelector("#IPlstEvent" + idx).addEventListener('click', function(){search_detail_IP(IpLst.IP);});


        total_IP_count += IpLst[idx].totalIPCount
        
      }
      $("#event-num").text(total_IP_count)
    }
  }


  /*TEST 
  curr_IpLst_json = JSON.parse(dummy_json_IP)
  console.log(curr_IpLst_json)
  $("#IP-main-list").empty()
  
  //用json檔的資料，更新IP列表
  let total_IP_count = 0
  let idx = ''
  let IpLst = curr_IpLst_json
  for(idx in IpLst)
  {
    if(idx == "subarray")continue;
    $("#IP-main-list:last").append(
      '<li>' +
      '<button type="button" id="IP-main-list' + idx + '" class=" d-flex flex-row justify-content-around">' +
          '<div class="event-name">' + IpLst[idx].IP + '</div>' +
          '<div class="count">' + IpLst[idx].score + '</div>' +
      '</button>' +
      '</li>'
    )
    let para = idx
    document.querySelector("#IP-main-list" + idx).addEventListener('click', function(){draw_IP_related(para);});
    document.querySelector("#IP-main-list" + idx).addEventListener('click', function(){search_detail_IP(IpLst.IP);});
    
  }

  /*TEST END*/ 
}

//點擊IP List總表按鈕時，顯現右側下方相關IP表
function draw_IP_related(index)
{
  console.log("draw_IP_related(" + index + ")")
  search_detail(curr_IpLst_json[index].IP)
  $("#IP-related-list").empty();
  let data = curr_IpLst_json[index].connectedIP
  for(let idx in data)
  {
    if(idx == "subarray")continue;
    $("#IP-related-list:last").append(
      '<li>' +
        '<button type="button" id="IP-related' + idx +'" class=" d-flex flex-row justify-content-around">' +
          '<div class="IP">' + 
           '<div>' + data[idx].IP + '</div>' +
          '</div>' +
          '<div class="count">' + data[idx].score + '</div>' +
        '</button>' + 
      '</li>'
    )
  }
}
//點擊IP List總表按鈕時，搜尋資料，畫出事件線條
function search_detail_IP(search_IP, search_eventName, search_eventSeverityCat, id)
{
  let detail_search_string = 'searchType=IPLSTDETAIL&' + curr_form_search_string + '&IpAddr=' + search_IP + '&eventName=' + search_eventName
  
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/ip_lst_detail", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  request.send(detail_search_string)
  console.log("Send request: " + detail_search_string)
  //收到資料後，畫出3D場景中的線條
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      //console.log(request.responseText);
      curr_IpLst_detail_json = JSON.parse(request.responseText) 
      if(curr_IpLst_detail_json.length == 0)return;

      console.log(curr_IpLst_detail_json);
      ip_gateway_set = new Map();
      curr_detail_json = curr_IpLst_detail_json[0]
      guess_location_detail()
      update_parabola()
      curr_detail_json = curr_IpLst_detail_json[1]
      guess_location_detail()
      update_parabola()
      curr_detail_json = curr_IpLst_detail_json[2]
      guess_location_detail()
      update_parabola()

      clear_multi_scenario() 

      draw_detail(search_IP, search_eventName, search_eventSeverityCat)
      /*
          需要做對應的修正
          將curr_detail_json改成curr_IpLst_detail_json
      */
      //$("#IP-"+id).children().toggle()
    }
  }
}

//點擊大列表(按鈕)，更新小列表#IP-list資訊
function draw_menu(index)
{
  console.log(index)
  console.log(typeof(index))
  console.log(curr_json)
  console.log(curr_json[index])
  console.log(typeof(curr_json[index]))
  let IP_list_data = curr_json[index].IP
  $("#IP-list:last").empty()
  for(let idx in IP_list_data)
  {
    if(idx == "subarray")continue;
    $("#IP-list:last").append(
      '<li>' +
        '<button type="button" id="IP-' + idx +'" class=" sever-' +curr_json[index].eventSeverity + ' d-flex flex-row justify-content-around">' +
          '<div class="IP">' + 
           '<div>' + IP_list_data[idx].buildingTitle + (IP_list_data[idx].buildingName == "GW" ? "":(IP_list_data[idx].buildingFloor == 0? "B1":IP_list_data[idx].buildingFloor)+ "F")  +  '</div>' +  
           '<div>' + IP_list_data[idx].name + '</div>' +
          '</div>' +
          '<div class="count">' + IP_list_data[idx].count + '</div>' +
        '</button>' + 
      '</li>'
    )
    let para = IP_list_data[idx].name
    document.querySelector("#IP-" + idx).addEventListener('click', function(){search_detail(IP_list_data[idx].name, curr_json[index].eventName, curr_json[index].eventSeverityCat, idx);});

  } 

}

//第二部搜尋，接收資料，畫出事件線條
function search_detail(search_IP, search_eventName, search_eventSeverityCat, id)
{
  let detail_search_string = 'searchType=DETAIL&' + curr_form_search_string + '&IpAddr=' + search_IP + '&eventName=' + search_eventName
  

  var request = new XMLHttpRequest();
  if (search_IP == 0){
    request.open("POST", "http://120.126.151.195:5000/first_query_plus", true)
  }
  else{
    request.open("POST", "http://120.126.151.195:5000/second_query", true)
  }
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  request.send(detail_search_string)
  console.log("Send request: " + detail_search_string)
  //收到資料後，畫出3D場景中的線條
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      //console.log(request.responseText);
      curr_detail_json = JSON.parse(request.responseText) 
      console.log("search_detail")
      console.log(curr_detail_json);
      if(curr_detail_json.length == 0)return;

      //現階段沒有詳細IP表
      //把curr_detail_json，根據IP，猜建築位置
      ip_gateway_set = new Map();
      guess_location_detail()
      //console.log("search_detail")
      //console.log(curr_detail_json);
      update_parabola()
      draw_detail(search_IP, search_eventName, search_eventSeverityCat)
      clear_multi_scenario()
      //$("#IP-"+id).children().toggle()
    }
  }
}

//清除舊有線條、換新線條
function update_parabola()
{
  let detail = curr_detail_json
  let site_from = []
  let site_to = []
  let color = []
  let tmpcolor = 0
  let colorR = [0xFF0000, 0xE60000, 0xBD0000, 0x800000]
  let colorY = [0xFFF129, 0xE6D925, 0xBDB21E, 0x807814]
  let colorG = [0xBDBDBD, 0x919191, 0x6B6B6B, 0x3B3B3B]
  let eventlocationset = new Map()

  for(let i in curr_detail_json)
  {
    if(i == "subarray")continue;
    //因為 JS 的 map 沒辦法用 array 當做 key
    //所以只好將 srcbuilding, srcfloor, dstbuilding, dstfloor, EventSeverCat四個字串用空白連結起來
    let location_string = detail[i].srcbuildingName + " " +detail[i].srcbuildingFloor
    location_string += " " + detail[i].destbuildingName + " " + detail[i].destbuildingFloor
    location_string += " " + detail[i].eventSeverityCat[0]
    if(typeof(eventlocationset.get(location_string)) == "undefined"){
      eventlocationset.set(location_string, 1)
    }
    else{
      let eventcnt = eventlocationset.get (location_string)
      eventlocationset.set(location_string, eventcnt + 1)
    }
  }

  eventlocationset.forEach(function(value, key){
    //續上方註解，將 location_string 的空白分開成 4-tuple
    //detail[0] 代表 srcbuilding，detail[1] 代表 srcfloor，detail[2] 代表 dstbuilding，detail[3]代表dstfloor
    //value代表總統計值，key代表src/dst資訊
    let detail = key.split(' ')
    site_from.push(new Site(detail[[0]], detail[1],""))
    site_to.push(new Site(detail[2], detail[3],""))
    let EventSeverCat = detail[4]
    //console.log(detail[4])
    let ColorBrightness = Math.ceil(Math.log10(value + 1)) >= 3 ? 3 : Math.ceil(Math.log10(value + 1))
    if(EventSeverCat == "H") tmpcolor = colorR[ColorBrightness]
    else if(EventSeverCat == "M") tmpcolor = colorY[ColorBrightness]
    else tmpcolor = colorG[ColorBrightness]
    //console.log(key + " " + value + " " +tmpcolor)
    color.push(tmpcolor)
  })
  
  /*
  for(let i in curr_detail_json)
  {
    if(i == "subarray")continue;
    site_from.push(new Site(detail[i].srcbuildingName, detail[i].srcbuildingFloor,""))
    site_to.push(new Site(detail[i].destbuildingName, detail[i].destbuildingFloor,""))
    let EventSeverCat = detail[0].eventSeverityCat[0]
    if(EventSeverCat == "H") color.push(0xFF0000)
    else if(EventSeverCat == "M") color.push(0xFFF129)
    else color.push(0xB4B4B4)
  }
  */
  add_scenario(site_from, site_to , color);
  //清除畫面上的線條
  //clear_multi_scenario()
}

//現階段沒有詳細IP表
//把curr_detail_json，根據IP，猜建築位置
function guess_location_detail()
{
  for(let i in curr_detail_json)
  {
    if(i == "subarray")continue;
    let srcip = curr_detail_json[i].srcIpAddr.split(".")
    let destip = curr_detail_json[i].destIpAddr.split(".")
    //let ip_gateway_set = new Map();

    
    curr_detail_json[i]["srcbuildingName"] = buildings.list[ Math.floor( srcip[1] * 8 / 256 )].id
    curr_detail_json[i]["srcbuildingTitle"] = buildings.list[ Math.floor( srcip[1] * 8 / 256 )].title
    curr_detail_json[i]["srcbuildingFloor"] = srcip[2] % buildings.list[ Math.floor( srcip[1] * 8 / 260 )].floor +1
    curr_detail_json[i]["destbuildingName"] = buildings.list[ Math.floor( destip[1] * 8 / 256 )].id
    curr_detail_json[i]["destbuildingTitle"] = buildings.list[ Math.floor( destip[1] * 8 / 256 )].title
    curr_detail_json[i]["destbuildingFloor"] = destip[2] % buildings.list[ Math.floor( destip[1] * 8 / 260 ) ].floor +1
    
    if(!(srcip[0]=="120" && srcip[1]=="126" || srcip[0] == "10" || srcip[0]=="192" && srcip[1]=="168"))
    {
      if(ip_gateway_set.has(srcip)) // 如果srcIpAddr已經有對應的Gateway
      {
        curr_detail_json[i]["srcbuildingName"] = ip_gateway_set.get(srcIpAddr)
        curr_detail_json[i]["srcbuildingTitle"] = "校外"
        curr_detail_json[i]["srcbuildingFloor"] = "1"
      }
      else // 如果srcIpAddr沒有對應的Gateway
      {
        ip_gateway_set.set(srcip, "GW" + nextNum)
        curr_detail_json[i]["srcbuildingName"] = "GW" + nextNum
        nextNum = (nextNum + 11) % 188
      }
      //curr_detail_json[i]["srcbuildingName"] = "GW"
      curr_detail_json[i]["srcbuildingTitle"] = "校外"
      curr_detail_json[i]["srcbuildingFloor"] = "1"
    }
    if(!(destip[0]=="120" && destip[1]=="126" || destip[0] == "10" || destip[0]=="192" && destip[1]=="168"))
    {
      if(ip_gateway_set.has(destip)) // 如果destIpAddr已經有對應的Gateway
      {
        curr_detail_json[i]["destbuildingName"] = ip_gateway_set.get(destIpAddr)
        curr_detail_json[i]["destbuildingTitle"] = "校外"
        curr_detail_json[i]["destbuildingFloor"] = "1"
      }
      else // 如果destIpAddr沒有對應的Gateway
      {
        ip_gateway_set.set(destip, ("GW" + nextNum))
        curr_detail_json[i]["destbuildingName"] = "GW" + nextNum
        nextNum = (nextNum + 11) % 188
      }
      //curr_detail_json[i]["destbuildingName"] = "GW"
      curr_detail_json[i]["destbuildingTitle"] = "校外"
      curr_detail_json[i]["destbuildingFloor"] = "1"
    }
    //console.log(curr_detail_json[i]["srcbuildingName"])
    //console.log(curr_detail_json[i]["srcbuildingFloor"])
    //console.log(curr_detail_json[i]["destbuildingName"])
    //console.log(curr_detail_json[i]["destbuildingFloor"])
  }
}
function guess_location_menu()
{
  for(let i in curr_json)
  {
    if(i == "subarray")continue;
    for(let j in curr_json[i].IP)
    {
      if(j == "subarray")continue;
      let ip = curr_json[i].IP[j].name.split(".")
      curr_json[i].IP[j]["buildingName"] = buildings.list[ Math.floor( ip[1] * (buildings.list.length-1) / 256)].id
      curr_json[i].IP[j]["buildingTitle"] = buildings.list[ Math.floor( ip[1] * (buildings.list.length-1) / 256 )].title
      curr_json[i].IP[j]["buildingFloor"] = ip[2] % buildings.list[ Math.floor( ip[1] * (buildings.list.length-1) / 260 )].floor +1
      if(!(ip[0]=="120" && ip[1]=="126" || ip[0] == "10" || ip[0]=="192" && ip[1]=="168"))
      {
        curr_json[i].IP[j]["buildingName"] = "GW"
        curr_json[i].IP[j]["buildingTitle"] = "校外"
        curr_json[i].IP[j]["buildingFloor"] = "1"
      }
    }
  }
}

//點擊小列表時，更新左側sidebar的資訊
function draw_detail(search_IP, search_eventName, search_eventSeverityCat)
{
  $("#left_eventName").text(curr_detail_json[0].eventName)
  $("#left_eventSeverityCat").text(curr_detail_json[0].eventSeverityCat)
  $("#left_time").text(curr_detail_json[0].deviceTime)
  $("#left_srcbuilding").text(curr_detail_json[0].srcbuildingTitle + (curr_detail_json[0].srcbuildingName == "GW" ? "":(curr_detail_json[0].srcbuildingFloor == 0? "B1":curr_detail_json[0].srcbuildingFloor) + "F"))
  $("#left_srcIP").text(curr_detail_json[0].srcIpAddr)
  $("#left_destbuilding").text(curr_detail_json[0].destbuildingTitle + (curr_detail_json[0].destbuildingName == "GW" ? "":(curr_detail_json[0].destbuildingFloor == 0? "B1":curr_detail_json[0].destbuildingFloor) + "F"))
  $("#left_destIP").text(curr_detail_json[0].destIpAddr)
  //大樓樓層Select
  for(let i in curr_detail_json)
  {
    if(i == "subarray")continue;
    //檢查是否有重複option
    if($("#left_destbuilding option[name=" + curr_detail_json[i].destbuildingName + curr_detail_json[i].destbuildingFloor + "]").length > 0)continue;
    $("#left_destbuilding:last").append(
      '<option value="' + i + '" name="' + curr_detail_json[i].destbuildingName + curr_detail_json[i].destbuildingFloor + '">' + curr_detail_json[i].destbuildingTitle + ( curr_detail_json[i].destbuildingName=="GW"?"":curr_detail_json[i].destbuildingFloor + 'F') + '</option>'
    )
  }
  $("#left_destbuilding").change(function(){
    $("#left_destIP").val("");
    $("#left_destIP option").hide();
    $("#left_destIP option[name=" + curr_detail_json[this.value].destbuildingName + curr_detail_json[this.value].destbuildingFloor + "]").show();
  })
  //目標IP Select
  for(let i in curr_detail_json)
  {
    if(i == "subarray")continue;
    $("#left_destIP:last").append(
      '<option value="' + i + '" name="' + curr_detail_json[i].destbuildingName + curr_detail_json[i].destbuildingFloor + '">' + curr_detail_json[i].destIpAddr + '</option>'
    )
  }
  $("#left_destIP").change(function(){
    //$("#left_destbuilding").text(curr_detail_json[this.value].destbuildingTitle + (curr_detail_json[this.value].destbuildingName == "GW" ? "":(curr_detail_json[this.value].destbuildingFloor == 0? "B1":curr_detail_json[this.value].destbuildingFloor) + "F"))
    $("#left_time").text(curr_detail_json[this.value].deviceTime)
  })
}

//form搜尋string的onchange事件
//在更改搜尋選項時，將搜尋字串做更新
function update_search_string()
{
  curr_form_search_string = $('#dataForm').serialize();
  console.log(curr_form_search_string)
}


let curr_json = null
let curr_detail_json = null
let curr_IpLst_json = null
let curr_IpLst_detail_json = null
let curr_form_search_string = ''
let ip_gateway_set = new Map();
let nextNum = 0

let dummy_json = '[  {      "eventName": "Some really serious event",      "eventSeverity":"9",      "eventSeverityCat": "HIGH",      "totalIPCount": 22,      "IP": [          {          "name": "93.174.93.72",          "count": 9          },          {          "name": "175.24.95.240",          "count": 6          },          {          "name": "120.126.152.226",          "count": 4          },          {          "name": "120.126.152.225",          "count": 3          }      ]  },  {      "eventName": "Something less important",      "eventSeverity":"5",      "eventSeverityCat": "MID",      "totalIPCount": 50,      "IP": [          {          "name": "93.174.93.72",          "count": 24          },          {          "name": "175.24.95.240",          "count": 14          },          {          "name": "120.126.152.226",          "count": 12          }      ]  }]';
let dummy_json_two = '[{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.129","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"142.93.121.47"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.127","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"71.6.232.5"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.98","deviceTime":"2020-12-17-16-7-9","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"193.42.40.135"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.177","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"162.142.125.95"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.217","deviceTime":"2020-12-17-16-6-49","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"194.61.54.112"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.154","deviceTime":"2020-12-17-16-7-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"103.114.105.219"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.125","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"167.248.133.66"},{"IP_count":2,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.218","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"45.129.33.176"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.195","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"45.129.33.47"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.207","deviceTime":"2020-12-17-16-19-35","eventName":"Traffic denied by policy","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-deny","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"85.173.248.184"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.161","deviceTime":"2020-12-17-16-19-30","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"83.97.20.35"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.108","deviceTime":"2020-12-17-16-19-23","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"49.7.20.135"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.151","deviceTime":"2020-12-17-16-19-15","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"164.90.186.5"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.198","deviceTime":"2020-12-17-16-19-17","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"114.107.236.75"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.177","deviceTime":"2020-12-17-16-19-23","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"52.14.170.215"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.181","deviceTime":"2020-12-17-16-19-36","eventName":"Traffic denied by policy","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-deny","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"79.178.52.230"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.197","deviceTime":"2020-12-17-16-20-55","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"219.71.120.118"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.215","deviceTime":"2020-12-17-16-21-9","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"185.202.2.238"},{"IP_count":2,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.196","deviceTime":"2020-12-17-16-21-29","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"13.115.247.15"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.184","deviceTime":"2020-12-17-16-21-35","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"195.154.170.81"},{"IP_count":1,"building_floor":"0-\u96fb\u8cc7\u5927\u6a135F","destIpAddr":"120.126.151.89","deviceTime":"2020-12-17-16-21-35","eventName":"Permitted traffic flow ended","eventSeverity":"1","eventSeverityCat":"LOW","eventType":"PAN-OS-TRAFFIC-end-allow","room":"0-\u5b78\u751f\u5be6\u9a57\u5ba4","srcIpAddr":"162.243.232.174"}]'
let dummy_json_IP ='[  {      "IP": "120.126.5.14",      "score": 886,      "eventCount":       {        "LOW": 4567,        "MID": 89,        "HIGH": 0      },      "eventSeverityHighest": 6,      "connectedIP":       [        {          "IP": "120.126.25.1",          "score": 200.5,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        },        {          "IP": "120.126.25.2",          "score": 200.5,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        },        {          "IP": "120.126.25.23",          "score": 255,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        }      ]  },{      "IP": "120.126.5.24",      "score": 755,      "eventCount":       {        "LOW": 4567,        "MID": 89,        "HIGH": 0      },      "eventSeverityHighest": 6,      "connectedIP":       [        {          "IP": "210.261.52.9",          "score": 155,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        },        {          "IP": "210.261.52.8",          "score": 68,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        },        {          "IP": "210.216.52.7",          "score": 40,          "eventCount":           {            "LOW": 4,            "MID": 5,            "HIGH": 0          },          "eventSeverityHighest": 6        }      ]  }]'