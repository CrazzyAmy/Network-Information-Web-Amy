import {send_request,search_menu, search_detail, draw_menu} from "./modules/data_transmission.js";


document.querySelector("#search_first").addEventListener('click', search_menu);

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