import * as THREE from '../node_modules/three/build/three.module.js';
export { MAX_POINTS, drawCount, createPlane, createBuilding, getRandomColor };
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
    var material = new THREE.MeshLambertMaterial({
      color: c,
      opacity : 0.9,
      transparent : true
    });
    var Mesh = new THREE.Mesh(geometry, material);
    Mesh.Name = building.id;
    Mesh.position.set(x, y + y_shift + i * height / floor - floor + 1, z );
    Mesh.castShadow = true;
    Mesh.receiveShadow = false;
    console.log("BoxGeometry" + Mesh.Name + "Added");
    group.add(Mesh);
  }
}
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}