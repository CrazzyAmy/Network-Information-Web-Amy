import * as THREE from '../node_modules/three/build/three.module.js';
export { MAX_POINTS, drawCount, createPlane, createBuilding};


let MAX_POINTS = 200;
let drawCount;
//建立平面
function createPlane(plane, group)
{
  let PlaneMaterial = new THREE.MeshLambertMaterial({
    color: plane.color,
    side: THREE.DoubleSide
  });
  let x = plane.location[0], y = plane.location[1], z = plane.location[2];  //location
  let width = plane.size[0], depth = plane.size[1];
  var geometry = new THREE.PlaneGeometry(width, depth);
  plane = new THREE.Mesh(geometry, PlaneMaterial);
  plane.position.set(x, y, z);
  plane.rotation.x = -0.5 * Math.PI; //修正size[1]為深度(depth) width, height -> width, depth 
  plane.receiveShadow = true;
  group.add(plane);
} 
//建立長方立方體
function createBuilding(building, group) 
{
  let width = building.size[0], height = building.size[1], depth = building.size[2]; //size
  let x = building.location[0], y = building.location[1], z = building.location[2];  //location
  let floor = building.floor, c = building.color, y_shift = height / 2.0 ;
  //依照層數建立每層的立方體 註: Mesh.position為中心位置
  for(let i =0;i < floor; i++)
  {
    var geometry = new THREE.BoxGeometry(width, height / floor, depth)
    var material
    //更改成如果遇到世界地圖的方格，就改成 BasicMaterial，也就是正常不透明的材質
    if(width == 3 && height == 3 && depth ==3){
        material = new THREE.MeshToonMaterial({color: c, opacity : 0.7, transparent : true})
    }else if(i == floor - 1){
        var canvas = document.createElement("canvas")
        canvas.width = width * 20
        canvas.height = depth * 20
        var context = canvas.getContext("2d");
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#" + c.toString(16);
        context.fillRect(0, 0, width * 20, depth * 20);
        context.fillStyle = "#000000";
        context.font = "50pt Arial";
        context.fillText(building.title, canvas.width / 2, canvas.height / 2);

        material = []
        for(var ii = 0; ii < geometry.faces.length; ii++){
          var texture = new THREE.Texture(canvas);
          texture.needsUpdate = true;
          if(ii == 2) material.push(new THREE.MeshBasicMaterial({color: c, map: texture}))
          else material.push(new THREE.MeshLambertMaterial({color: c, opacity : 0.8, transparent : true}))
        }
    }else{
        material = new THREE.MeshLambertMaterial({color: c, opacity : 0.8, transparent : true})
    }
    var Mesh = new THREE.Mesh(geometry, material);
    Mesh.name = building.id + "_" + (i + 1).toString();
    Mesh.position.set(x, y + y_shift + i * height / floor - floor + 1, z );
    Mesh.castShadow = true;
    Mesh.receiveShadow = false;
    //console.log("BoxGeometry" + Mesh.name + "Added");

    group.add(Mesh);

  }
}