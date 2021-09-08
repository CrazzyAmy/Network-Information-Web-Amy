  export {scene_init_meshes, t_buildings, t_decorations, add_scenario, clear_multi_scenario}
  import * as THREE from '../node_modules/three/build/three.module.js';
  import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
  import { Parabola }from './Parabola.js';
  import { Trace , Scenario, MultiScenario} from './Scenario.js';
  import { buildings} from "./data_control.js"
  let scene, camera, renderer, orbitControl, spotLight;

  let rayCast = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;
  let t_decorations = new THREE.Group();
  let t_buildings = new THREE.Group();
  let multi_scenario = new MultiScenario([]);
  let buildingcnt = new Map();
  let buildingname = ["EECS", "LAW", "PA", "BUS", "HUM", "SS", "ADM", "LIB", "CC", ""];
  let buildingfloor = [10, 9, 10, 10, 14, 9, 8, 9, 5, 2];
  let tmpBuildingName;
  

  //建築顯示浮動式視窗
  var LatestMouseProjection = undefined; // this is the latest projection of the mouse on object (i.e. intersection with ray)
  var OpenToolTip = false;
  // tooltip will not appear immediately. If object was hovered shortly,
  // - the timer will be canceled and tooltip will not appear at all.
    
  let onMouseMove = function (e) {
    e.preventDefault();
    const {top, left, width, height} = renderer.domElement.getBoundingClientRect();

    mouse.x = -1 + 2 * (e.clientX - left) / width;
    mouse.y = 1 - 2 * (e.clientY - top) / height;

    rayCast.setFromCamera(mouse, camera);
    let ojbects = [];
    //Line2 不可被intersect
    scene.children.forEach(element => {
      if(element.type != 'Line2')
        ojbects.push(element);
    });
    let intersects = rayCast.intersectObjects(ojbects, true);
    if (intersects.length > 0 && intersects[0].object.name.substring(0,2) != "GW" &&
        intersects[0].object.name.length > 0){
      if (intersects[0].object.parent == t_buildings &&  //只有建物需要高亮
            "emissive" in intersects[0].object.material[0] && //指定材質可高亮
            INTERSECTED != intersects[0].object)           //重複事件確認
      {
        for(let i = 0; i < INTERSECTED?.material.length; i++){
          INTERSECTED?.material[i].emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = intersects[0].object;
        for(let i = 0; i < INTERSECTED.material.length; i++){
          INTERSECTED?.material[i].emissive.setHex(INTERSECTED.currentHex);
          INTERSECTED.currentHex = INTERSECTED.material[i].emissive.getHex();
          INTERSECTED.material[i].emissive.setHex(INTERSECTED.currentHex + 0x882222); //高亮
        }
      }
    }
    else{
      if(INTERSECTED != null){
        for(let i = 0; i < INTERSECTED.material.length; i++){
          INTERSECTED?.material[i].emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
      }
    }
  }
  
  let onMouseDown = function (e) {
    e.preventDefault();
    const {top, left, width, height} = renderer.domElement.getBoundingClientRect();
    mouse.x = -1 + 2 * (e.clientX - left) / width;
    mouse.y = 1 - 2 * (e.clientY - top) / height;

    rayCast.setFromCamera(mouse, camera);
    let ojbects = [];
    //Line2 不可被intersect
    scene.children.forEach(element => {
      if(element.type != 'Line2')
        ojbects.push(element);
    });
    //處理建築浮動視窗
    let intersects = rayCast.intersectObjects(ojbects, true);
    if(intersects.length > 0)tmpBuildingName = intersects[0].object.name.split('_')[0];
    console.log(tmpBuildingName, OpenToolTip);
    if (intersects.length > 0) {
      LatestMouseProjection = intersects[0].point;
      if (LatestMouseProjection && OpenToolTip == false && tmpBuildingName.substring(0,2) != "GW" && tmpBuildingName.length > 0) {
        OpenToolTip = true;
        showTooltip(e);
      }
    }
  }

  // 於滑鼠遊標移動至建物時，顯示建物名稱
  // 將浮動視窗設定在位置(client.X, client.Y)
  function showTooltip(e) {
    var divElement = $("#tooltip");
    if(tmpBuildingName.substring(0,2)== 'GW' || tmpBuildingName.length == 0)return;
    else{
      let shortname = tmpBuildingName;
      let floor = 0;
      //let selected_floor = HoveredObj.name.split('_')[1]
      var fullname;
      switch(shortname){
        case "EECS":
          fullname = "電機資訊學院"
          floor = 9;
          break;
        case "LAW":
          fullname = "法律學院"
          floor = 8;
          break;
        case "PA":
          fullname = "公共事務學院"
          floor = 9;
          break;
        case "BUS":
          fullname = "商學院"
          floor = 9;
          break;
        case "HUM":
          fullname = "人文學院"
          floor = 13;
          break;
        case "SS":
          fullname = "社會科學學院"
          floor = 8;
          break;
        case "ADM":
          fullname = "行政大樓"
          floor = 7;
          break;
        case "LIB":
          fullname = '圖書館'
          floor = 8;
          break;
        case "CC":
          fullname = "資訊中心"
          floor = 4;
          break;
        default:
          fullname = ""
      }
      //divElement.text(fullname);
      $("#tooltip_name").text(fullname);
      // $("#tooltip_name").empty();
      $("#tooltip_list").empty();
      for(let i = 1; i<= floor; i++)
      {
        let tmp = buildingcnt.get(shortname)[i]
        $("#tooltip_list").append(
          '<li id="tooltip_list_element">'+
          '<div class="floor">' + i + 'F</div>' + 
          '<div class="eventCount">' + tmp +'</div>' +
          '<div class="eventbtn">' + '<button type="button" class="btn btn-outline-secondary" style="margin-left: 5px;font-size:8px; width: 50px;">檢視</button>' +'</div>' +
          '</li>'
        );
      }
      
      $("#tooltip_list").height( (floor * 28) );
      $("#tooltip").height( 28 + floor * 28);
      //console.log(HoveredObj);
    }

    if (divElement && LatestMouseProjection) {
      divElement.css({
        display: "block",
        opacity: 0.0,
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        width: `200px`
      });

      setTimeout(function() {
        divElement.css({
            opacity: 1.0
        });
      }, 25);
    }
  }

  $("#tooltip_close").click(function(){
    $("#tooltip").hide();
    OpenToolTip = false;
  });

  let scene_init_meshes = function(name, listdata, t_ref, func_create)
  {
    //設定並重置THREE.Group
    t_ref.Name = name;
    t_ref.remove(...t_buildings.children); // clear
    for(let i=0;i<listdata.length;i++)
      func_create(listdata.list[i], t_ref);
    scene.add(t_ref);
  }

  // 初始化場景、渲染器、相機、物體
  let init = function () {
    // 建立場景
    scene = new THREE.Scene();
    let sWidth = document.getElementById("scene").clientWidth, sHeight =  document.getElementById("scene").clientHeight
    scene.background = new THREE.Color(0x64C3F7);
    // 建立相機
    camera = new THREE.PerspectiveCamera(70, sWidth / sHeight, 1, 10000)
    camera.position.set(50, 50, 50);
    camera.lookAt(scene.position);
    
    spotLight = new THREE.SpotLight(0xDEEDF7, 1);
    //spotLight.position.set(15, 50, -15);
    spotLight.position.set(0, 500, 0);
    spotLight.angle = Math.PI;
    spotLight.penumbra = 0.05;
    spotLight.decay = 2;
    spotLight.distance = 0;
    spotLight.lookAt(0, 0, 0)

    // shadow
    spotLight.castShadow = true;
    spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 10, 2500));
    spotLight.shadow.bias = 0.0001;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 1024;

    scene.add(spotLight);
    
    // 建立物體
    mouse.x = mouse.y = -1;

    // 建立渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize( sWidth, sHeight) // 場景大小
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 建立 OrbitControls
    orbitControl = new OrbitControls(camera, renderer.domElement)

    // 將渲染器的 DOM 綁到網頁上
    document.getElementById("scene").appendChild(renderer.domElement)
    renderer.domElement.addEventListener("mousemove", onMouseMove, false);
    renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  }

  //外打內跟內打外事件資料結構之初始化
  let initbuildingcnt = function(){
    for(let i = 0; i < 10; i++){
      var tmp = []
      for(let j = 0; j < buildingfloor[i]; j++) tmp.push(0)
      buildingcnt.set(buildingname[i], tmp)
    }
  }

  let add_scenario = function(sites_from, sites_to, color)
  {
    console.log(sites_from, sites_to)
    if(sites_from.length == 0) return;
    for(let i = 0; i < sites_from.length; i++){
      console.log(sites_from[i].building_id, sites_to[i].building_id)
      if(sites_from[i].building_id === undefined || sites_to[i].building_id == undefined)continue;
      // .match(/^[A-Z]+$/ is regular expression, to decide whether the string is all captical characters
      //all captical characters == inner buildings of school(LAW, BUS, ...), otherwise is the part of worldmap wall(GW123, ...)
      //用來統計各樓層的事件個數，與tooltip相關
      if(sites_from[i].building_id == sites_from[i].building_id.toUpperCase()){
        let tmp = buildingcnt.get(sites_from[i].building_id)
        tmp[sites_from[i].floor_id] += 1
        buildingcnt.set(sites_from[i].building_id, tmp)
        sites_from[i].floor_id = buildingfloor[buildingname.indexOf(sites_from[i].building_id)]
      }
      if(sites_to[i].building_id == sites_to[i].building_id.toUpperCase()){
        let tmp = buildingcnt.get(sites_to[i].building_id)
        tmp[sites_to[i].floor_id] += 1
        buildingcnt.set(sites_to[i].building_id, tmp)
        sites_to[i].floor_id = buildingfloor[buildingname.indexOf(sites_to[i].building_id)]
      }
    }
  
    let traces = [];
    for(let i=0;i<sites_from.length;i++)
       traces.push(new Trace(sites_from[i],sites_to[i]));
    let scenario = new Scenario(traces);
    //Set Three
    for(let i=0;i<scenario.traces.length;i++)
    {
      let trace = scenario.traces[i];
      //取得建築資料參考及位置，如果Trace.Site有building info，則將building info轉成three.js座標
      //否則則將經緯度轉成three.js的座標
      let from, to;
      if(trace.site_from.building_id != null){
        let b_from = buildings.map.get(trace.site_from.building_id);
        from = b_from.get_pos(trace.site_from.floor_id);
      }
      else{
        from = [-250 + Math.pow(Math.cos(Math.PI * 40 / 180), 2) * parseFloat(trace.site_from.longitude)
                -trace.site_from.latitude, 
                250 + Math.cos(Math.PI * 40 / 180) * Math.sin(Math.PI * 40 / 180) * parseFloat(trace.site_from.longitude)]
      }

      if(trace.site_to.building_id != null){
        let b_to = buildings.map.get(trace.site_to.building_id);
        to = b_to.get_pos(trace.site_to.floor_id);
      }
      else{
        to = [-250 + Math.pow(Math.cos(Math.PI * 40 / 180), 2) * parseFloat(trace.site_to.longitude)
          -trace.site_to.latitude, 
          250 + Math.cos(Math.PI * 40 / 180) * Math.sin(Math.PI * 40 / 180) * parseFloat(trace.site_to.longitude)]
      }
        
      let p = new Parabola();
      let Color = color[i]
      p.init(scene);
      p.set(Color, new THREE.Vector3(from[0],from[1],from[2]), new THREE.Vector3(to[0],to[1],to[2]), -0.003);
      //p.set(THelper.getRandomColor(), new THREE.Vector3(from[0],from[1],from[2]), new THREE.Vector3(to[0],to[1],to[2]), -0.003);
      scenario.parab_list.push(p);
    }
    
    multi_scenario.scenarios.push(scenario);
    //完成一次動畫後要做的事件
    scenario.parab_list[0].OnAnimated = function() {
      //換下一個scenario
      multi_scenario.scenario_id++;
      multi_scenario.scenario_id %= multi_scenario.scenarios.length;
      //去建築高亮
      t_buildings?.children.forEach( mesh =>{
        const words = mesh.name.split('_'); // "buildingId_floorID"
        let color = new THREE.Color(buildings.map.get(words[0]).color);
        //mesh?.material.emissive.setHex(color.getHex);
      });
    }
  }

  //清除scenario，事件拋物線條
  let clear_multi_scenario = function()
  {
    //在parabola.OnAnimated清除，才不會殘留線條痕跡
    multi_scenario.scenarios[0]?multi_scenario.scenarios[0].parab_list[0].OnAnimated = function(){
        //將multi_scenario的所有scenarios清空
        let tmp_scenario = multi_scenario.scenarios[1]
        multi_scenario.scenarios = []
        multi_scenario.scenarios.push(tmp_scenario)
        multi_scenario.scenario_id = 0
        //去建築高亮
        t_buildings?.children.forEach( mesh =>{
        const words = mesh.name.split('_'); // "buildingId_floorID"
        let color = new THREE.Color(buildings.map.get(words[0]).color );
        for(let i = 0; i < mesh?.material.length; i++)
        mesh?.material[i].emissive.setHex(color.getHex);
      });
    }:null;
  }

  // 渲染場景
  let mainLoop = function () {

    requestAnimationFrame(mainLoop);
    //畫拋物線
    multi_scenario.get_display_scenario()?.parab_list.forEach(parab => {
      parab.animate(120);
    });
    //高亮建築
    multi_scenario.get_display_scenario()?.traces.forEach( trace =>{
      let bFrom = t_buildings.getObjectByName(trace.site_from.building_id + "_" + trace.site_from.floor_id)
      let bTo = t_buildings.getObjectByName(trace.site_to.building_id + "_" + trace.site_to.floor_id)
      let cFrom =  new THREE.Color(buildings.map.get(trace.site_from.building_id).color).getHex()
      let cTo =  new THREE.Color(buildings.map.get(trace.site_to.building_id).color).getHex()
      for(let i = 0; i < bFrom?.material[i].length; i++)
        bFrom?.material[i].emissive.setHex(0xFFFF22); 
      for(let i = 0; i < bTo?.material[i].length; i++)
        bTo?.material[i].emissive.setHex(0xFFA230); 
    });
    orbitControl.update()
    renderer.render(scene, camera)
  }

  // 監聽螢幕寬高來做簡單 RWD 設定
  window.addEventListener('resize', function () {
    let height = document.getElementById("scene").offsetHeight
    let width = document.getElementById("scene").offsetWidth 
    
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  })

  init();
  initbuildingcnt();
  mainLoop();
