
let MAX_POINTS = 200;
let drawCount;

function createBox(id,scene ,location, size, c, floor) 
{
  for(let i =0;i < floor; i++)
  {
    var geometry = new THREE.BoxGeometry(size.x, size.y / floor, size.z)
    var material = new THREE.MeshLambertMaterial({
      color: c,
      opacity : 0.9,
      transparent : true
    });
    var Mesh = new THREE.Mesh(geometry, material);
    Mesh.Name = id;
    Mesh.position.set(location.x, location.y + i * size.y / floor - floor, location.z );
    Mesh.castShadow = true;
    Mesh.receiveShadow = false;
    console.log(Mesh.Name + " Added");
    scene.add(Mesh);
  }
}
function initParabola(scene)
{
  	// geometry
	var geometry = new THREE.BufferGeometry();
	// attributes
	var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	// drawcalls
	drawCount = 2; // draw the first 2 points, only
	geometry.setDrawRange( 0, drawCount );
	// material
  var material = new THREE.LineDashedMaterial( {
    color: 0xff0000,
    linewidth: 2,
    scale: 3,
    dashSize: 3,
    gapSize: 3,
  });
	// line
  var	parab = new THREE.Line( geometry,  material );
  scene.add( parab );
  return parab;
}
// update positions
//建立拋物線(參考, 起點, 終點, 加速度參數)
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