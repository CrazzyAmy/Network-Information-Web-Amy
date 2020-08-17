  let scene, camera, renderer, plane, road;
  let EECS, Library, CC, SS, Admin, PA, Bus, Hum, Law, School;

  let rayCast = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;
  let Schools = new THREE.Group();
  let geometry, material;
  let ADD = 0.005;
  let theta = 0;
  let change = true;
  let parab1,parab2,parab3;
  //let BuildingMaterial = new THREE.MeshLambertMaterial({
  //color: 0xdf846e
  //})
  let RoadMaterial = new THREE.MeshLambertMaterial({
    color: 0xf9f0ce,
    side: THREE.DoubleSide
  })
  // 校園
  let createSchool = function () {
    // 地板
    geometry = new THREE.PlaneGeometry(150, 150);
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    Schools.add(plane);

    // 法政路
    geometry = new THREE.PlaneGeometry(5, 150);
    road = new THREE.Mesh(geometry, RoadMaterial)
    road.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    road.position.set(-21, 1, 0)
    road.receiveShadow = true
    Schools.add(road);

    // 公政大道
    geometry = new THREE.PlaneGeometry(150, 5);
    road = new THREE.Mesh(geometry, RoadMaterial)
    road.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    road.position.set(0, 1, -21)
    road.receiveShadow = true
    Schools.add(road);

    // 中央大道
    geometry = new THREE.PlaneGeometry(5, 150);
    road = new THREE.Mesh(geometry, RoadMaterial)
    road.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    road.position.set(6, 1, 0)
    road.receiveShadow = true
    Schools.add(road);

    // 法商大道
    geometry = new THREE.PlaneGeometry(150, 5);
    road = new THREE.Mesh(geometry, RoadMaterial)
    road.rotation.x = -0.5 * Math.PI // 使平面與 y 軸垂直，並讓正面朝上
    road.position.set(0, 1, 11)
    road.receiveShadow = true
    Schools.add(road);

    scene.add(Schools);
  }

  let onMouseMove = function (e) {

    e.preventDefault();

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    rayCast.setFromCamera(mouse, camera);
    let intersects = rayCast.intersectObjects(scene.children);
    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object && "emissive" in intersects[0].object.material) {
          if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          INTERSECTED.material.emissive.setHex(0xff00ff);
      }

    } else {

      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = null;

    }
  };

  let onMouseClick = function (e) {
   
  };
  let scene_init_buildings = function () {
    for(let i=0;i<buildings.length;i++)
    {
      let b = buildings.list[i];
      let location = new THREE.Vector3(b.location[0],b.location[1],b.location[2]);
      let size = new THREE.Vector3(b.size[0],b.size[1],b.size[2]);
      createBox(b.id,scene,location, size, b.color, b.floor);
    }
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
    camera.position.set(100, 130, 100)
    camera.lookAt(scene.position)

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
    
    
    parab1 = initParabola(scene);
    setParabola(parab1, new THREE.Vector3(-8,8,-30), new THREE.Vector3(-35,9,-35), -0.003 );
    parab2 = initParabola(scene);
    setParabola(parab2, new THREE.Vector3(-8,4,-45), new THREE.Vector3(20,8,-37), -0.003 );
    parab3 = initParabola(scene);
    setParabola(parab3, new THREE.Vector3(20,7,-5), new THREE.Vector3(-35,9,-5), -0.003 );
  
    // 建立物體
    createSchool();
    mouse.x = mouse.y = -1;

    // 建立渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    // 建立 OrbitControls
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true // 啟用阻尼效果
    cameraControl.dampingFactor = 0.25 // 阻尼系數
    //cameraControl.autoRotate = true    // 啟用自動旋轉

    // 將渲染器的 DOM 綁到網頁上
    document.getElementById("scene").appendChild(renderer.domElement)
    document.addEventListener("mousemove", onMouseMove, false);
    //document.addEventListener("click", onMouseClick, false);
  }
  // 渲染場景
  let mainLoop = function () {

    cameraControl.update()
    requestAnimationFrame(mainLoop)
    updateParabola(parab1);
    updateParabola(parab2);
    updateParabola(parab3);
    renderer.render(scene, camera)
  }

  // 監聽螢幕寬高來做簡單 RWD 設定
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  init();
  mainLoop();