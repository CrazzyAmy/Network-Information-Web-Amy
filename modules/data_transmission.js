

//將搜尋資料傳給後台伺服器，並回傳json檔
let send_request = function(search_string)
{
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/test", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  request.send(search_string)
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(request.responseText);
    }
  }
  console.log(request.responseText)

  return JSON.parse(request.responseText) 
}
/*
let send_form_menu = function()
{
    var request = new XMLHttpRequest();
    var requesttext = "searchType=MENU&"
    request.open("POST","http://120.126.151.195:5000/test",true)
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.responseType = "text"
    //將Form資訊轉換成字串String
    requesttext += $('#dataForm').serialize();
    console.log(requesttext);
    console.log(typeof(requesttext))
    //return;
    //************************
    request.send(requesttext)
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        console.log(request.responseText);
      }
    }
    console.log(request.responseText)
    // request.open("POST","http://10.201.28.213:8080/test",true)
    // request.send()
}
*/

//第一步搜尋，接收資料，事件列表&IP列表
function search_menu(search_string)
{
  //傳送搜尋字串，接收json檔
  menu_data = send_request(search_string)

  //將大列表&小列表的資訊清空
  $(".Event-name-list").empty();
  $(".IP-list").empty();
  

  //用json檔的資料，更新大列表
  for(info in menu_data)
  {
    $(".Event-name-list:last").append(
      '<li>' +
      '<button type="button" class="' + info.eventServityCat + ' d-flex flex-row justify-content-around">' +
          '<div class="event-name">' + info.eventName + '</div>' +
          '<div class="count">' + info.totalIPCount + '</div>' +
      '</button>' +
      '</li>'
    )
  }
  //將小列表的資訊儲存到...
  //以供未來使用
  
}

//第二部搜尋，接收資料，畫出事件線條
function search_detail(search_string)
{

}


