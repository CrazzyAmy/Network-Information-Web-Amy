  export {scene_init_meshes, t_buildings, t_decorations}
  import * as THelper from './modules/three_helper.js';
  import * as THREE from './node_modules/three/build/three.module.js';
  import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";
  import { Parabola }from './modules/Parabola.js';
  let scene, camera, renderer, orbitControl, spotLight;

  let rayCast = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;
  let t_decorations = new THREE.Group();
  let t_buildings = new THREE.Group();

  let parab1, parab2, parab3;
  let p1;
  let onMouseMove = function (e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    rayCast.setFromCamera(mouse, camera);
    let intersects = rayCast.intersectObjects(scene.children, true);
    if (intersects.length > 0) 
    {
      if (  intersects[0].object.parent == t_buildings &&  //只有建物需要高亮
            "emissive" in intersects[0].object.material && //指定材質可高亮
            INTERSECTED != intersects[0].object)           //重複事件確認
      {
          INTERSECTED?.material.emissive.setHex(INTERSECTED.currentHex);
          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex + 0x882222); //高亮
      }
    } 
    else 
    {
      INTERSECTED?.material.emissive.setHex(INTERSECTED.currentHex);
      INTERSECTED = null;
    }
  };
  function opencsvFile()
  {
    var input = document.createElement('input');
    input.type = 'file';
    input.click();
  }
  let onMouseClick = function (e) {
   
  };
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
    scene.background = new THREE.Color(0xffffff);
    // 建立相機
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(100, 130, 100);
    camera.lookAt(scene.position);
    
    spotLight = new THREE.SpotLight(0x666666, 1);
    //spotLight.position.set(15, 50, -15);
    spotLight.position.set(0, 500, 0);
    spotLight.angle = Math.PI;
    spotLight.penumbra = 0.05;
    spotLight.decay = 1;
    spotLight.distance = 0;
    spotLight.lookAt(0, 0, 0)

    // shadow
    spotLight.castShadow = true;
    spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 10, 2500));
    spotLight.shadow.bias = 0.0001;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 1024;

    scene.add(spotLight);

    parab1 = THelper.initParabola(scene);
    THelper.setParabola(parab1, new THREE.Vector3(-8,8,-30), new THREE.Vector3(-35,9,-35), -0.003 );
    parab2 = THelper.initParabola(scene);
    THelper.setParabola(parab2, new THREE.Vector3(-8,4,-45), new THREE.Vector3(20,8,-37), -0.003 );
    parab3 = THelper.initParabola(scene);
    THelper.setParabola(parab3, new THREE.Vector3(20,7,-5), new THREE.Vector3(-35,9,-5), -0.003 );
    p1 = new Parabola();
    p1.init(scene);
    p1.set(0x443322,new THREE.Vector3(20,7,-5), new THREE.Vector3(-35,9,-5), -0.003);
    // 建立物體
    mouse.x = mouse.y = -1;

    // 建立渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(document.getElementById("scene").clientWidth, document.getElementById("scene").clientHeight) // 場景大小
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 建立 OrbitControls
    orbitControl = new OrbitControls(camera, renderer.domElement)
    orbitControl.enableDamping = true // 啟用阻尼效果
    orbitControl.dampingFactor = 0.25 // 阻尼系數
    //orbitControl.autoRotate = true    // 啟用自動旋轉

    // 將渲染器的 DOM 綁到網頁上
    document.getElementById("scene").appendChild(renderer.domElement)
    document.addEventListener("mousemove", onMouseMove, false);
    //document.addEventListener("click", onMouseClick, false);
  }
  // 渲染場景
  let mainLoop = function () {

    orbitControl.update()
    requestAnimationFrame(mainLoop)
    THelper.updateParabola(parab1);
    THelper.updateParabola(parab2);
    THelper.updateParabola(parab3);
    p1.animate(120);
    renderer.clearDepth(); // important!

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
  mainLoop();
