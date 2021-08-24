import {send_request,search_menu, search_detail, draw_menu, search_IpList} from "./data_transmission.js";


document.querySelector("#search_first").addEventListener('click', search_menu);
document.querySelector("#search_first").addEventListener('click', search_IpList);
$("#ip-main-list").show()
$("#event-main-list").show()
$("#search").show()

var w = document.documentElement.clientWidth;
if( w < 768 )
{
  $("#ip-main-list").hide()
  $("#event-main-list").hide()
  $("#search").show()
}

window.addEventListener("resize", function(){
  var w = document.documentElement.clientWidth;
  if( w < 768 )
  {
    $("#ip-main-list").hide()
    $("#event-main-list").hide()
    $("#search").show()
  }
});


//右側面板之樓層設定，並生成相對應列表
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