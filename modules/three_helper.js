
import { LineGeometry } from './lines/LineGeometry.js';
export { MAX_POINTS, drawCount, createPlane, createBuilding, initParabola, setParabola, updateParabola };
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
  geometry = new THREE.PlaneGeometry(width, depth);
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
  let floor = building.floor, c = building.color;
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
    Mesh.position.set(x, y + i * height / floor - floor + 1, z );
    Mesh.castShadow = true;
    Mesh.receiveShadow = false;
    console.log("BoxGeometry" + Mesh.Name + "Added");
    group.add(Mesh);
  }
}
//建立拋物線(scene參考)
function initParabola(group)
{
  	// geometry
	var geometry = new LineGeometry();
	// attributes
	var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	// drawcalls
	drawCount = 2; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );
	// material
  var material = new LineMaterial( {
    color: 0xff0000,
    linewidth: 5,
    vertexColors: true,
    dashed: false
  });
	// line
  var	parab = new Line2( geometry,  material );
  group.add( parab );
  return parab;
}
//設定拋物線參數(參考, 起點, 終點, 加速度參數)
function setParabola(parab,start,end,a) 
{
	//y equation: y = -ky^2
	var positions = parab.geometry.attributes.position.array;
	var index = 0;
  var v = new THREE.Vector3();
  v.add(end);
  v.addScaledVector(start, -1.0);
  v.multiplyScalar(1.0 / MAX_POINTS);
  tk = (MAX_POINTS-1);
  yv0 = end.y - start.y - (a * tk * tk / 2.0);
  yv0 /= tk;
  console.log(yv0);
  for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) 
  {
		positions[ index ++ ] = start.x + v.x*i;
		positions[ index ++ ] = yv0 * i + a*i*i/2.0 + start.y ;
		positions[ index ++ ] = start.z + v.z*i;
	}
}
///更新拋物線方程
function updateParabola(parab)
{
  drawCount = ( drawCount + 1 ) % MAX_POINTS;
	draw_min = Math.max(drawCount - 100, 0 );
	parab.geometry.setDrawRange( draw_min, drawCount );

  if ( drawCount == 0 ) 
  {
		parab.geometry.attributes.position.needsUpdate = true; // required after the first render
    parab.material.color.setHSL( Math.random(), 1, 0.5 );
	}
}
