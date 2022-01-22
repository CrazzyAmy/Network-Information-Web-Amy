import * as THREE from '../node_modules/three/build/three.module.js';
export { MAX_POINTS, drawCount, createPlane, createBuilding };


let MAX_POINTS = 200;
let drawCount;
//建立平面
function createPlane(plane, group) {
	let x = plane.location[0], y = plane.location[1], z = plane.location[2];  //location
	let width = plane.size[0], depth = plane.size[1];
	var geometry = new THREE.PlaneGeometry(width, depth);
	if(plane.material.length == 0){
		plane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: plane.color, side: THREE.DoubleSide}));
	}
	else{
		let texture = new THREE.TextureLoader().load(plane.material);
		plane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({map: texture}));
	}
	plane.position.set(x, y, z);
	plane.rotation.x = -0.5 * Math.PI; //修正size[1]為深度(depth) width, height -> width, depth 
	plane.receiveShadow = true;
	group.add(plane);
}

//建立長方立方體
function createBuilding(building, group) {
	let width = building.size[0], height = building.size[1], depth = building.size[2]; //size
	let x = building.location[0], y = building.location[1], z = building.location[2];  //location
	let floor = building.floor, c = building.color, y_shift = height / 2.0;
	//依照層數建立每層的立方體 註: Mesh.position為中心位置
	for (let i = 0; i < floor; i++) {
		var geometry = new THREE.BoxGeometry(width, height / floor, depth)
		var material = [];
		var Mesh;
		//世界地圖
		if (building.title == "WorldMap") {
			geometry = new THREE.PlaneGeometry(width, height)
			let texture = new THREE.TextureLoader().load("picture/texture/worldmap.jpg")
			for (var ii = 0; ii < geometry.faces.length; ii++) {
				material.push(new THREE.MeshBasicMaterial({ map: texture }));
			}
			Mesh = new THREE.Mesh(geometry, material);
			//旋轉世界地圖至合適角度
			Mesh.rotateY(Math.PI / 180 * 40);
		}

		//GW現在定義成無關緊要的裝飾（北大岩、正門、牆壁等等），注意transparent : false
		else if (building.id.substring(0, 2) == "GW") {
			for (let ii = 0; ii < geometry.faces.length; ii++) {
				material.push(new THREE.MeshStandardMaterial({ color: c, opacity: 0.8 }))
			}
			Mesh = new THREE.Mesh(geometry, material);
		}

		//頂樓則宣告畫布，並貼在長方體的頂面
		else if (i == floor - 1) {
			let textCanvas = document.createElement("Canvas")
			textCanvas.width = width * 20
			textCanvas.height = depth * 20
			let context = textCanvas.getContext("2d");
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillStyle = "#" + c.toString(16);
			context.fillRect(0, 0, width * 20, depth * 20);
			context.fillStyle = "#000000";

			//如果超過六個中文字則從置中兩行變成置中三行
			//之後如果有多行需求，則將文字先 split 成 list，然後用迴圈逐一對 list 中的 element 手動調整位置
			if (building.title.length < 6) {
				context.font = "50pt Arial";
				context.fillText(building.title, textCanvas.width / 2, textCanvas.height / 2 - 30);
				context.font = "40pt Arial";
				context.fillText("(" + building.floor + "F)", textCanvas.width / 2, textCanvas.height / 2 + 30);
			}
			else {
				let buildingSubtitle0 = building.title.substring(0, building.title.length / 2);
				let buildingSubtitle1 = building.title.substring(building.title.length / 2);
				context.font = "50pt Arial";
				context.fillText(buildingSubtitle0, textCanvas.width / 2, textCanvas.height / 2 - 70);
				context.font = "50pt Arial";
				context.fillText(buildingSubtitle1, textCanvas.width / 2, textCanvas.height / 2);
				context.font = "40pt Arial";
				context.fillText("(" + building.floor + "F)", textCanvas.width / 2, textCanvas.height / 2 + 60);
			}

			material = []
			for (let ii = 0; ii < geometry.faces.length; ii++) {
				let textureTop = new THREE.Texture(textCanvas);
				textureTop.needsUpdate = true;
				if (ii == 2) material.push(new THREE.MeshStandardMaterial({ map: textureTop }));
				else material.push(new THREE.MeshStandardMaterial({ color: c, opacity: 0.8, transparent: false }))
			}
			Mesh = new THREE.Mesh(geometry, material);
		}
		else {
			for (var ii = 0; ii < geometry.faces.length; ii++) {
				let textureFront = new THREE.TextureLoader().load("picture/texture/LAW_1.png");
				textureFront.offset = new THREE.Vector2(0, i / (floor - 1));
				textureFront.repeat = new THREE.Vector2(1, 1 / (floor - 1));
				textureFront.needsUpdate = true;
				if (ii == 4) material.push(new THREE.MeshBasicMaterial({ map: textureFront }));
				else material.push(new THREE.MeshStandardMaterial({ color: c, opacity: 0.8, transparent: false }))
			}
			Mesh = new THREE.Mesh(geometry, material);
		}
		Mesh.name = building.id + "_" + (i + 1).toString();
		Mesh.position.set(x, y + y_shift + i * height / floor - floor + 1, z);
		Mesh.castShadow = true;
		Mesh.receiveShadow = false;
		//console.log("BoxGeometry" + Mesh.name + "Added");
		group.add(Mesh);
	}
}