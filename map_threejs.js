var THREE = require("three-js")();
  const MAX_POINTS=500;
  let scene, camera, renderer, plane, road, line;
  let EECS, Library, CC, SS, Admin, PA, Bus, Hum, Law, School;
  let rayCast = new THREE.Raycaster();
  let mouse = new THREE.Vector2(), INTERSECTED;
  let Schools = new THREE.Group();
  let geometry, material;
  let ADD = 0.005;
  let theta = 0;
  let change = true;
  //let BuildingMaterial = new THREE.MeshLambertMaterial({
  //color: 0xdf846e
  //})
  let RoadMaterial = new THREE.MeshLambertMaterial({
    color: 0xf9f0ce,
    side: THREE.DoubleSide
  })

  // EECS
  let createEECS = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 20)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    EECS = new THREE.Mesh(geometry, material);
    EECS.position.set(px, py, pz)
    EECS.castShadow = true;
    EECS.receiveShadow = true;
    scene.add(EECS);
  }
  // Library
  let createLibrary = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 10)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    Library = new THREE.Mesh(geometry, material)
    Library.position.set(px, py, pz)
    Library.castShadow = true;
    Library.receiveShadow = true
    scene.add(Library);
  }
  // ComputerCenter
  let createCC = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(15, py * 2, 10)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    CC = new THREE.Mesh(geometry, material)
    CC.position.set(px, py, pz)
    CC.castShadow = true;
    CC.receiveShadow = true
    scene.add(CC);
  }
  // SS
  let createSS = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 25)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    SS = new THREE.Mesh(geometry, material)
    SS.position.set(px, py, pz)
    SS.castShadow = true;
    SS.receiveShadow = true
    scene.add(SS);
  }
  // AdminCenter
  let createAdmin = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 25)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    Admin = new THREE.Mesh(geometry, material)
    Admin.position.set(px, py, pz)
    Admin.castShadow = true;
    Admin.receiveShadow = true
    scene.add(Admin);
  }
  // PA
  let createPA = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 25)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    PA = new THREE.Mesh(geometry, material)
    PA.position.set(px, py, pz)
    PA.castShadow = true;
    PA.receiveShadow = true
    scene.add(PA);
  }
  // Business
  let createBus = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 25)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    Bus = new THREE.Mesh(geometry, material)
    Bus.position.set(px, py, pz)
    Bus.castShadow = true;
    Bus.receiveShadow = true
    scene.add(Bus);
  }
  // Humanities
  let createHum = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(25, py * 2, 15)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    Hum = new THREE.Mesh(geometry, material)
    Hum.position.set(px, py, pz)
    Hum.castShadow = true;
    Hum.receiveShadow = true
    scene.add(Hum);
  }
  // Law
  let createLaw = function (px, py, pz) {
    geometry = new THREE.BoxGeometry(20, py * 2, 35)
    material = new THREE.MeshLambertMaterial({
      color: 0xdf846e
    })
    Law = new THREE.Mesh(geometry, material)
    Law.position.set(px, py, pz)
    Law.castShadow = true;
    Law.receiveShadow = true
    scene.add(Law);
  }
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
      if (INTERSECTED != intersects[0].object) {

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

    spotLight = new THREE.SpotLight(0xffffff, 1);
    //spotLight.position.set(15, 50, -15);
    spotLight.position.set(0, 50, 0);
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
    //drawline();

    // 建立物體
    createEECS(-35, 9, -35);
    createLibrary(-8, 8, -30);
    createCC(-8, 4, -45);
    createSS(20, 4, -37);
    createAdmin(20, 7, -5);
    createPA(-35, 9, -5);
    createBus(20, 9, 32);
    createHum(50, 13, 22);
    createLaw(-37, 8, 32);
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
  function drawline()
  {
    	// geometry
	  let geometry = new THREE.BufferGeometry();
    // attributes
    let positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    // drawcalls
    let drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange( 0, drawCount );

    // material
    material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });

    // line
    line = new THREE.Line( geometry,  material );
    scene.add( line );
  }
  function updatePositions() {

    let positions = line.geometry.attributes.position.array;
  
    let x = y = z = index = 0;
    for ( let i = 0, l = MAX_POINTS; i < l; i ++ ) {
  
      positions[ index ++ ] = x;
      positions[ index ++ ] = y;
      positions[ index ++ ] = z;
  
      x += ( Math.random() - 0.5 ) * 30;
    }
  }
  // 渲染場景
  let mainLoop = function () {

    //spotLight.position.x = 100 * Math.sin(theta)
    //spotLight.position.z = 100 * Math.cos(theta)
    //theta += ADD
    //spotLight.lookAt(0, 0, 0)

    cameraControl.update()
    requestAnimationFrame(mainLoop)
    updatePositions()
    renderer.render(scene, camera)
  }

  // 監聽螢幕寬高來做簡單 RWD 設定
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  init();
  drawline();
  mainLoop();