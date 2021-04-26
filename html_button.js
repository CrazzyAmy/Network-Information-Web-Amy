import {send_request,search_menu, search_detail, draw_menu, search_IpList} from "./modules/data_transmission.js";



document.querySelector("#search_first").addEventListener('click', search_menu);
document.querySelector("#search_first").addEventListener('click', search_IpList);
$("#ip-main-list").hide()
$("#event-main-list").show()
$("#search").hide()

//切換列表
document.querySelector("#switch-search").addEventListener('click', function(){
  $("#ip-main-list").hide()
  $("#event-main-list").hide()
  $("#search").show()
})

document.querySelector("#switch-event").addEventListener('click', function(){
  $("#ip-main-list").hide()
  $("#event-main-list").show()
  $("#search").hide()
  $("#event-num").show()
  $("#iplst-num").hide()
})

document.querySelector("#switch-ip").addEventListener('click', function(){
  $("#ip-main-list").show()
  $("#event-main-list").hide()
  $("#search").hide()
  $("#event-num").hide()
  $("#iplst-num").show()
})

document.querySelector("#selectBuilding").addEventListener('change', function(){
  $("#selectFloor").empty()
  let floor = 0;
  switch(this.value){
    case "ALL":
      floor = 0
      break;
    case "EECS":
      floor = 9
      break;
    case "LAW":
      floor = 8
      break;
    case "PA":
      floor = 9
      break;
    case "BUS":
      floor = 9
      break;
    case "HUM":
      floor = 13
      break;
    case "SS":
      floor = 8
      break;
    case "ADM":
      floor = 7
      break;
    case "LIB":
      floor = 8
      break;
    case "CC":
      floor = 4
      break;
  }

  $("#selectFloor:last").append(
    '<option value="ALL">ALL</option>'
  )
  $("#selectFloor:last").append(
    '<option disabled>------------------------------------------</option>'
  )

  for(let i = 1; i<floor; i++)
  {
    $("#selectFloor:last").append(
      '<option value="' + i + ' ">' + i + 'F</option>'
    )
  }
})



//登入
document.querySelector("#login").addEventListener("click",function(){
  var request = new XMLHttpRequest();
  request.open("POST", "http://120.126.151.195:5000/login", true)
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  request.responseType = "text"

  let search_string = $('#loginForm').serialize();
  request.send(search_string)
  console.log("Send request: " + search_string)
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      console.log(request.responseText);
    }
  }
})


//註冊
document.querySelector("#register").addEventListener("click",function(){
    var request = new XMLHttpRequest();
    request.open("POST", "http://120.126.151.195:5000/account_register", true)
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    request.responseType = "text"
  
    let search_string = $('#registerForm').serialize();
    request.send(search_string)
    console.log("Send request: " + search_string)
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        console.log(request.responseText);
      }
    }
  })