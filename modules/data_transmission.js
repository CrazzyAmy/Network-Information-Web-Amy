import { add_scenario, clear_multi_scenario } from './map_three.js'
import { ListData, Site, JsonReader, Building, Decoration } from './object_class.js'
import { buildings } from './data_control.js';
export { send_request, search_menu, search_detail, draw_menu, search_IpList }

//將要畫的線條畫出來

let curr_json = null
let curr_detail_json = null
let curr_IpLst_json = null
let curr_IpLst_detail_json = null
let curr_form_search_string = ''
let intoout = []
let outtoin = []
let total_detail_json = null
let ip_gateway_set = new Map();
let nextNum = 0


document.querySelector("#search_first").addEventListener('click', function () {
	search_detail("", "", "")
});

//開啟網頁時，做第一次的搜尋
$(document).ready(function () {
	console.log("start")
	console.log(document.location.href)
	clear_multi_scenario()
	let site1_from = [new Site("SS", 0, "", "")];
	let site1_to = [new Site("SS", 0, "", "")];
	add_scenario(site1_from, site1_to, 0xFF0000);
	//將日期訂為YYYY-MM-DD
	let today = new Date(document.getElementById("timeStart").value)
	// today_date format: YYYY-MM-DD
	let today_date_st = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
	let today_date_end = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")
	today_date_st = "2021-08-03"
	today_date_end = "2021-08-03"
	$("#timeStart").val(today_date_st)
	$("#timeEnd").val(today_date_end)
	today_date_st = document.getElementById("timeStart").value
	today_date_end = document.getElementById("timeEnd").value
	update_search_string()
	//發送搜尋請求
	//search_menu()第一步搜尋，search_detail第二步搜尋
	search_detail("", "", "")
	search_menu()
	search_IpList()
	//將 curr_detail_json分成內打外跟外打內
	// document.querySelector("#daily").addEventListener('click', function () {
	// 	search_detail_daily(today_date_st, today_date_end)
		
	// 	console.log('time')
	// 	console.log(document.getElementById("timeStart").value)
	// 	console.log(document.getElementById("timeEnd").value)
	// });
	// search_detail_daily(document.getElementById("timeStart").value,document.getElementById("timeEnd").value)
})

window.onload = function () {
}
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
  }
//監聽Checkbox，檢查顯示方向是內打外、外打內
$('input[name=dir_in_out]').change(function () {
	console.log('detect in to out checkbox changed!')
	clear_multi_scenario();
	if ($(this).is(':checked')) {
		if ($('input[name=dir_out_in]').is(':checked')) {
			update_parabola(curr_detail_json)
		}
		else {
			update_parabola(intoout)
		}
	}
	else {
		if ($('input[name=dir_out_in]').is(':checked')) {
			update_parabola(outtoin)
		}
		else {
			update_parabola(null)
		}
	}
});

$('input[name=dir_out_in]').change(function () {
	console.log('detect out to in checkbox changed!')
	clear_multi_scenario();
	if ($(this).is(':checked')) {
		if ($('input[name=dir_in_out]').is(':checked')) {
			update_parabola(curr_detail_json)
		}
		else {
			update_parabola(outtoin)
		}
	}
	else {
		if ($('input[name=dir_in_out]').is(':checked')) {
			update_parabola(intoout)
		}
		else {
			update_parabola(null)
		}
	}
});
//將初步搜尋資料傳給後台伺服器，並回傳json檔
function send_request(search_string) {
	var request = new XMLHttpRequest();
	request.open("POST", "http://120.126.151.195:5000/events_form", true)
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	// request.responseType = "text"
	//
	const v0 = (document.cookie).split(';')[0]
	const v1 = (document.cookie).split(';')[1]
	const v2 = (document.cookie).split(';')[2]
	let strerror=v0, struser=v1, strsession=v2
	if(v0.search("error=")!= -1){
	strerror = v0.replace("error=","")
	}
	if(v0.search(" userId=")!= -1){
	struser = v0.replace(" userId=","")
	}
	if(v0.search(" session=")!= -1){
	strsession = v0.replace(" session=","")
	}
	if(v1.search("error=")!= -1){
	strerror = v1.replace("error=","")
	}
	if(v1.search(" userId=")!= -1){
	struser = v1.replace(" userId=","")
	}
	if(v1.search(" session=")!= -1){
	strsession = v1.replace(" session=","")
	}
	if(v2.search("error=")!= -1){
	strerror = v2.replace("error=","")
	}
	if(v2.search(" userId=")!= -1){
	struser = v2.replace(" userId=","")
	}
	if(v2.search(" session=")!= -1){
	strsession = v2.replace(" session=","")
	}
	request.send(JSON.stringify({"L_date": document.getElementById("timeStart").value, "R_date": document.getElementById("timeEnd").value, "eventServerity": document.getElementById("eventSeverityCat").value, "building": document.getElementById("selectBuilding").value, "floor": document.getElementById("selectFloor").value, "dataCount":document.getElementById("dataCount").value, "eventSeverityLimit": document.getElementById("upfloor").value, "session":strsession,"userId":struser,"error":strerror}))
	// console.log("Send request: " + search_string)
	request.onreadystatechange = function () {
		//收到資料後，畫大列表
		if (this.readyState === 4 && this.status === 200) {
			// Typical action to be performed when the document is ready:
			curr_json = JSON.parse(request.responseText)
			console.log(curr_json);
			console.log(curr_json.length)
			if (curr_json.length == 0) return;
			$("#Event-name-list").empty();
			$("#IP-list").empty();


			//用json檔的資料，更新大列表
			let total_IP_count = 0
			let idx = ''
			let menu_data = curr_json
			$("#Event-name-list:last").append(
				'<li>'+
					'<div class="row justify-content-around" style="color:black;font-size:13px;">'+
						'<div class="col-1">'+'Lv.'+'</div>'+
						'<div class="col-3">'+'srcip'+'</div>'+
						'<div class="col-2">'+'數量'+ '</div>'+
						'<div class="col-2">'+'主目的地'+'</div>'+
						'<div class="col-2">'+'建築'+'</div>'+
						'<div class="col-1">'+'樓'+ '</div>'+
					'</div>'+
				'</li>'
			)
			for (idx in menu_data) {
				let menu_data_data = menu_data[idx]
				console.log(idx)
				let i = ''
				if(idx=='counts'){
					$("#event-num").text(menu_data[idx]);
					console.log(menu_data[idx])
				}else{
					for (i in menu_data_data){
						if (i == "subarray") continue;
						$("#Event-name-list:last").append(
							'<li style="background-color: white;">' +
							'<button type="button" id="Event' + i + '" class="row sever-' + menu_data[idx][i].eventSeverity + ' align-item-center list-group-item-action list-group-item-warning" style="padding-right:50px; " onclick ="draw_menu(\'' + menu_data[idx][i].source_ip + '\', ' + menu_data[idx][i].eventSeverity + ', ' + i + ')">' +
							'<div class="severity col-1">' + 'Lv.' + menu_data[idx][i].eventSeverity + '</div>' +
							'<div class="source-ip col-3">' + fix_ip(menu_data[idx][i].source_ip) + '</div>' +
							'<div class="count col-3">' + menu_data[idx][i].counts + '</div>' +
							'<div class="build col-4">' + menu_data[idx][i].building + '</div>' +
							'<div class="floor col-1">' + menu_data[idx][i].floor + 'F' + '</div>' +
							'</button>' +
							'</li>'
						)
						
						total_IP_count += menu_data[idx].totalIPCount
					}
				}
				
			}
			
			// $("#event-num").text(total_IP_count)
			//將小列表的資訊儲存到global variable
			//以供未來使用
			curr_json = menu_data
			console.log(curr_json)
		}
	}
}


//第一步搜尋，接收資料，事件列表&IP列表
function search_menu(search_string) {
	update_search_string()
	//傳送搜尋字串，接收json檔
	search_string = 'searchType=MENU&timeStart=20201223&timeEnd=20201225&buildingName=ALL&bulidingFloor=ALL&eventSeverityCat=ALL'
	search_string = 'searchType=MENU&' + curr_form_search_string
	let menu_data = send_request(search_string)
	menu_data = curr_json
}

//搜尋IP List總表資訊
function search_IpList(search_string) {
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
	request.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			curr_IpLst_json = JSON.parse(request.responseText)
			console.log("search_IpList() Receive response: ")
			console.log(curr_IpLst_json)

			//用json檔的資料，更新IP列表
			let total_IP_count = 0
			let idx = ''
			let IpLst = curr_IpLst_json
			// if (IpLst[idx].IP.substr(0,1)=='0'){
			//   let Ip_List=IpLst[idx].IP.substr(1,14);
			// }else{
			//   let Ip_List=IpLst[idx].IP;
			// }
			for (idx in IpLst) {
				IpLst[idx].IP = fix_ip(IpLst[idx].IP)
				if (idx == "subarray") continue;
				$("#IP-main-list:last").append(
					'<li >' +
					'<button type="button" id="IPlstEvent' + idx + '" class=" sever-' + menu_data[idx][i].eventSeverity + ' d-flex flex-row justify-content-start " style="padding-right:25px;">' +
					'<div class="event-name">' + IpLst[idx].IP + '</div>' +
					'<div class="count" style="margin-right:25px;">' + IpLst[idx].score + '</div>' +
					'</button>' +
					'</li>'
				)
				//console.log(idx)
				//console.log(typeof(idx))
				let para = idx
				document.querySelector("#IPlstEvent" + idx).addEventListener('click', function () { draw_IP_related(para); });
				document.querySelector("#IPlstEvent" + idx).addEventListener('click', function () { search_detail_IP(IpLst.IP); });
				total_IP_count += IpLst[idx].eventCount.LOW + IpLst[idx].eventCount.MID + IpLst[idx].eventCount.HIGH
			}
			$("#iplst-num").text(total_IP_count)
		}
	}
}
//點擊IP List總表按鈕時，顯現右側下方相關IP表
function draw_IP_related(index) {
	console.log("draw_IP_related(" + index + ")")
	search_detail(curr_IpLst_json[index].IP)
	$("#IP-related-list").empty();
	let datas = curr_IpLst_json[index].connectedIP
	for (let idx in datas) {
		datas[idx].IP = fix_ip(datas[idx].IP)
		if (idx == "subarray") continue;
		$("#IP-related-list:last").append(
			'<li>' +
			'<button type="button" id="IP-related' + idx + '" class=" d-flex flex-row justify-content-start" style="padding-right:25px;">' +
			'<div class="IP">' +
			'<div>' + datas[idx].IP + '</div>' +
			'</div>' +
			'<div class="count" style="margin-right:25px;">' + datas[idx].score + '</div>' +
			'</button>' +
			'</li>'
		)
	}
}
//點擊IP List總表按鈕時，搜尋資料，畫出事件線條
function search_detail_IP(search_IP, search_eventName, search_eventSeverityCat, id) {
	let detail_search_string = 'searchType=IPLSTDETAIL&' + curr_form_search_string + '&IpAddr=' + search_IP + '&eventName=' + search_eventName

	var request = new XMLHttpRequest();
	request.open("POST", "http://120.126.151.195:5000/ip_lst_detail", true)
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	request.responseType = "text"
	const value1 = (document.cookie).split('=')[1]
	const value4 = (document.cookie).split('=')[4]
	request.send(detail_search_string)
	console.log("Send request: " + detail_search_string)
	//收到資料後，畫出3D場景中的線條
	request.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//console.log(request.responseText);
			curr_IpLst_detail_json = JSON.parse(request.responseText)
			if (curr_IpLst_detail_json.length == 0) return;

			console.log(curr_IpLst_detail_json);
			//ip_gateway_set = new Map();
			//clear_multi_scenario() 
			curr_detail_json = curr_IpLst_detail_json[0]
			update_parabola(curr_detail_json)
			curr_detail_json = curr_IpLst_detail_json[1]
			update_parabola(curr_detail_json)
			curr_detail_json = curr_IpLst_detail_json[2]
			update_parabola(curr_detail_json)

			//clear_multi_scenario() 
			//等資料齊全開啟
			//draw_detail(search_IP, search_eventName, search_eventSeverityCat)
			/*
				需要做對應的修正
				將curr_detail_json改成curr_IpLst_detail_json
			*/
			//$("#IP-"+id).children().toggle()
		}
	}
}

//點擊大列表(按鈕)，更新小列表#IP-list資訊
function draw_menu(index, serv, j) {
	var request = new XMLHttpRequest();
	const v0 = (document.cookie).split(';')[0]
	const v1 = (document.cookie).split(';')[1]
	const v2 = (document.cookie).split(';')[2]
	let strerror=v0, struser=v1, strsession=v2
	if(v0.search("error=")!= -1){
	strerror = v0.replace("error=","")
	}
	if(v0.search(" userId=")!= -1){
	struser = v0.replace(" userId=","")
	}
	if(v0.search(" session=")!= -1){
	strsession = v0.replace(" session=","")
	}
	if(v1.search("error=")!= -1){
	strerror = v1.replace("error=","")
	}
	if(v1.search(" userId=")!= -1){
	struser = v1.replace(" userId=","")
	}
	if(v1.search(" session=")!= -1){
	strsession = v1.replace(" session=","")
	}
	if(v2.search("error=")!= -1){
	strerror = v2.replace("error=","")
	}
	if(v2.search(" userId=")!= -1){
	struser = v2.replace(" userId=","")
	}
	if(v2.search(" session=")!= -1){
	strsession = v2.replace(" session=","")
	}
	request.open("POST", "http://120.126.151.195:5000/events_form_detail", true)
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	// request.responseType = "text"
	// let Search_string_destip = 'ip=' + index + "&eventSeverity=" + serv +'&date=2021-08-24'
	request.send(JSON.stringify({ "ip": index, "eventSeverity": serv,"L_date": document.getElementById("timeStart").value, "R_date": document.getElementById("timeEnd").value, "session": strsession, "userId": struser, "error": strerror}))
	// request.send(Search_string_destip)
	// console.log(Search_string_destip)
	console.log(j)
	request.onreadystatechange = function () {
		//收到資料後，畫大列表
		if (this.readyState === 4 && this.status === 200) {
			// Typical action to be performed when the document is ready:
			curr_json = JSON.parse(request.responseText)
			console.log(curr_json);
			console.log(curr_json.length)
			if (curr_json.length == 0) return;
			$("#IP-list").empty();


			//用json檔的資料，更新大列表
			let total_IP_count = 0
			let idx = ''
			let menu_data = curr_json
			
			$("#IP-list:last").append(
				'<li>'+
					'<div class="row justify-content-around" style="color:black;font-size:13px;">'+
						'<div class="col-2">'+'數量'+ '</div>'+
						'<div class="col-2">'+'事件名稱'+ '</div>'+
						'<div class="col-3">'+'ip事件名稱'+ '</div>'+
						'<div class="col-2">'+'destip'+'</div>'+
					'</div>'+
				'</li>'
			)
			for (idx in menu_data) {
				if(idx=='counts'){
					$("#event-num").text(menu_data[idx]);
					console.log(menu_data[idx])
				}
				else if(idx == 'data'){
					console.log(idx)
					console.log(menu_data[idx][0].counts )
					let menu_data_data = menu_data[idx]
					let i = ''
					for (i in menu_data_data){
						if(i=='subarray')continue;
						console.log(menu_data[idx][i].eventSeverity)
						$("#IP-list:last").append(
							'<li>' +
							
							'<button type="button" id="Event' + i + '" class=" sever-' + serv + ' d-flex flex-row justify-content-between" style="padding-right:25px">' +
							'<div class="count">' + menu_data[idx][i].counts + '</div>' +
							'<div class="eventName">' + menu_data[idx][i].eventName + '</div>' +
							'<div class="ipseventName">' + menu_data[idx][i].ipsEventName + '</div>' +
							'<div class="source-ip">' + fix_ip(menu_data[idx][i].destination_ip)  + '</div>' +
							'</button>' +
							'</li>'
						)
						let para = idx
						total_IP_count += menu_data[idx].totalIPCount
					}
					// $("#event-num").text(total_IP_count)
					//將小列表的資訊儲存到global variable
					//以供未來使用
					curr_json = menu_data
					console.log(curr_json)
				}
				
				
			}
		}
	}
}

window.draw_menu = draw_menu

//第二步搜尋，接收資料，畫出事件線條
function search_detail(search_IP, search_eventName, search_eventSeverityCat, id) {
	
	update_search_string();
	let detail_search_string = 'searchType=DETAIL&' + curr_form_search_string + '&IpAddr=' + search_IP + '&eventName=' + search_eventName
	var request = new XMLHttpRequest();
	if (search_IP == 0) {
		request.open("POST", "http://120.126.151.195:5000/first_query_plus", true)
	}
	else {
		request.open("POST", "http://120.126.151.195:5000/second_query", true)
	}
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	request.responseType = "text"

	request.send(detail_search_string)
	console.log("Send request: " + detail_search_string)
	//收到資料後，畫出3D場景中的線條
	request.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			//console.log(request.responseText);
			curr_detail_json = JSON.parse(request.responseText);
			if (curr_detail_json.length == 0) return;

			//現階段沒有詳細IP表
			//把curr_detail_json，根據IP，猜建築位置
			//ip_gateway_set = new Map();
			//將curr_detail_json裡面的資料再拆成intoout跟outtoin
			// curr_detail_json.forEach(function(element){ 
			//   console.log(element)
			//   //所有大樓裡面，只有GW是G開頭，所以用這個來判斷srcName/destName是否在外面
			//   //其實還有intoin的case，但先暫時歸類在intoout的case好了
			//   //或許checkbox名字可以改成 from inner / from outer，這樣或許會比較好
			//   if (element['srcbuildingName'][0] == 'G')
			//     outtoin.push(element)
			//   else
			//     intoout.push(element)
			// })
			total_detail_json = curr_detail_json
			update_parabola(curr_detail_json)
			// draw_detail(search_IP, search_eventName, search_eventSeverityCat, curr_detail_json)
			clear_multi_scenario();
			//$("#IP-"+id).children().toggle()
		}
	}
}

//清除舊有線條、換新線條
function update_parabola(detail) {
	console.log(detail)
	let site_from = []
	let site_to = []
	let color = []
	let tmpcolor = 0
	let colorR = [0xFF0000, 0xE60000, 0xBD0000, 0x800000]
	let colorY = [0xFFF129, 0xE6D925, 0xBDB21E, 0x807814]
	let colorG = [0xBDBDBD, 0x919191, 0x6B6B6B, 0x3B3B3B]
	let eventlocationset = new Map()

	if (detail == null) return;

	for (let i in detail) {
		if (i == "subarray") continue;
		//因為 JS 的 map 沒辦法用 array 當做 key
		//所以只好將 srcbuilding, srcfloor, dstbuilding, dstfloor, EventSeverCat四個字串用空白連結起來
		let location_string = "";
		if(detail[i].srcbuildingName || detail[i].dstbuildingName){
			if (detail[i].srcbuildingName === null)
				location_string += detail[i].longitude + " " + detail[i].latitude;
			else
				location_string += detail[i].srcbuildingName + " " + detail[i].srcbuildingFloor;

			if (detail[i].dstbuildingName === null)
				location_string += " " + detail[i].longitude + " " + detail[i].latitude;
			else
				location_string += " " + detail[i].dstbuildingName + " " + detail[i].dstbuildingFloor;
			location_string += " " + detail[i].eventSeverityCat[0]
		}

		if (eventlocationset.get(location_string)) {
			eventlocationset.set(location_string, 1)
		}
		else {
			let eventcnt = eventlocationset.get(location_string)
			eventlocationset.set(location_string, eventcnt + 1)
		}
	}

	eventlocationset.forEach(function (value, key) {
		//續上方註解，將 location_string 的空白分開成 4-tuple
		//detail[0] 代表 srcbuilding，detail[1] 代表 srcfloor，detail[2] 代表 dstbuilding，detail[3]代表dstfloor
		//value代表總統計值，key代表src/dst資訊
		let detail = key.split(' ')
		if (detail[0].indexOf('.') > -1) {
			site_from.push(new Site("", "", detail[0], detail[1]));
			site_to.push(new Site(detail[2], detail[3], "", ""));
		}
		else {
			site_from.push(new Site(detail[0], detail[1], "", ""));
			site_to.push(new Site("", "", detail[2], detail[3]));
		}
		

		let EventSeverCat = detail[4]

		//let ColorBrightness = Math.ceil(Math.log10(value + 1)) >= 3 ? 3 : Math.ceil(Math.log10(value + 1))
		let ColorBrightness = 0;
		if (EventSeverCat == "H") tmpcolor = colorR[ColorBrightness]
		else if (EventSeverCat == "M") tmpcolor = colorY[ColorBrightness]
		else tmpcolor = colorG[ColorBrightness]
		console.log(key + " " + value + " " +tmpcolor)
		color.push(tmpcolor)
	})
	add_scenario(site_from, site_to, color);
	console.log(site_from, site_to, color);
	clear_multi_scenario();
}

//點擊小列表時，更新左側sidebar的資訊
function draw_detail(search_IP, search_eventName, search_eventSeverityCat, searchArray) {
    console.log("draw_detail")
	//收到資料後，畫大列表
	
		if (searchArray.length == 0) return;
		$("#Event-name-list").empty();
		$("#IP-list").empty();


		//用json檔的資料，更新大列表
		let total_IP_count = 0
		let idx = ''
		let search_data = searchArray
		$("#Event-name-list:last").append(
			'<li>'+
				'<div class="row justify-content-around" style="color:black;font-size:13px;">'+
					'<div class="col-1">'+'Lv.'+'</div>'+
					'<div class="col-3">'+'srcip'+'</div>'+
					'<div class="col-4">'+'destip'+ '</div>'+
					'<div class="col-4">'+'建築'+'</div>'+
				'</div>'+
			'</li>'
		)
		let i = ''
		for (i in search_data) {
			if (i == "subarray") continue;
			$("#Event-name-list:last").append(
				'<li style="background-color: white;">' +
				'<button type="button" id="Event' + i + '" class="row sever-' + search_data[i].eventSeverity + ' align-item-center list-group-item-action list-group-item-warning" style="padding-right:50px; ">' +
				'<div class="severity col-1">' + 'Lv.' + search_data[i].eventSeverity + '</div>' +
				'<div class="source-ip col-3">' + fix_ip(search_data[i].srcIpAddr) + '</div>' +
				'<div class="count col-4">' + fix_ip(search_data[i].destIpAddr) + '</div>' +
				'<div class="build col-4">' + search_data[i].dstbuildingName + '</div>' +
				'</button>' +
				'</li>'
			)
			console.log(i.eventSeverity)
			
			total_IP_count ++
		}
		
		// $("#event-num").text(total_IP_count)
		//將小列表的資訊儲存到global variable
		//以供未來使用
		$("#event-num").val(total_IP_count)
		curr_json = search_data
		console.log(curr_json)
		
}



function sortList(id) {
	var lb = document.getElementById(id);
	var arrTexts = new Array();
	var arrValues = new Array();
	var arrOldTexts = new Array();

	for (var i = 0; i < lb.length; i++) {
		arrTexts[i] = lb.options[i].text;
		arrValues[i] = lb.options[i].value;
		arrOldTexts[i] = lb.options[i].text;
	}

	arrTexts.sort();

	for (var i = 0; i < lb.length; i++) {

		lb.options[i].text = arrTexts[i];
		for (var j = 0; j < lb.length; j++) {
			if (arrTexts[i] == arrOldTexts[j]) {
				lb.options[i].value = arrValues[j];
				j = lb.length;
			}
		}
	}
}


//form搜尋string的onchange事件
//在更改搜尋選項時，將搜尋字串做更新
function update_search_string() {
	curr_form_search_string = $('#dataForm').serialize();
	console.log(curr_form_search_string)
}

function fix_ip(ip) {
	return ip.split(".").map(Number).join(".")
}