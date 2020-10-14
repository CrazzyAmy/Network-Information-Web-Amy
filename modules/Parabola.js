import * as THREE from '../node_modules/three/build/three.module.js';
import {Line2} from '../node_modules/three/examples/jsm/lines/Line2.js'
import {LineMaterial} from '../node_modules/three/examples/jsm/lines/LineMaterial.js'
import {LineGeometry} from '../node_modules/three/examples/jsm/lines/LineGeometry.js'
export { Parabola };
var MAX_POINTS = 200;

//0 , n -> 0, 1, 2, 3, 4, ... , n - 1
Array.prototype.subarray = function(start, count) {
    if(start + count <= this.length )
        return this.slice(start, start + count);   
};
class Parabola{
    constructor(){
        this.now_animate_id = 0;
    }
    init(group){
        this.geometry = new LineGeometry();
        // 最大200點
        this.positions = []; // 3 vertices per point
        //geometry.setPositions( positions );
        // drawcalls
        //drawCount = 200; // draw the first 2 points, only
        //geometry.setDrawRange( 0, drawCount );
        // material
        this.material = new LineMaterial({
            linewidth: 4,
            vertexColors: false,
            //resolution:  // to be set by renderer, eventually
            dashed: false
        });
        // line
        this.line = new Line2(this.geometry, this.material);
        this.line.scale.set(1, 1, 1);
        ///重要: 利用螢幕大小重新設定線寬
        this.material.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport 
        group.add(this.line);
    }
    set(color,start, end, a)
    {
        this.material.color= new THREE.Color( color );       
        this.material.needsUpdate = true; 
         //y equation: y = -ky^2
         var v = new THREE.Vector3();
         v.add(end);
         v.addScaledVector(start, -1.0);
         v.multiplyScalar(1.0 / MAX_POINTS);
         var tk = (MAX_POINTS - 1);
         var yv0 = end.y - start.y - (a * tk * tk / 2.0);
         yv0 /= tk;
         console.log(yv0);
         for (var i = 0, l = MAX_POINTS; i < l; i++) {
             this.positions.push(start.x + v.x * i, yv0 * i + a * i * i / 2.0 + start.y, start.z + v.z * i);
         }
    }
    //call in render loop: 
    animate(show_count)
    {
        if(this.positions?.count == 0 || show_count == null)
            return;
        if(show_count > MAX_POINTS)
            show_count = MAX_POINTS;
        this.now_animate_id %= MAX_POINTS;
        //eg . show_count = 30
        //now_animate_id = 290 then show 290 : 299 , 0 : 19
        let segment = (this.now_animate_id + show_count <= MAX_POINTS) 
                ? this.positions.subarray(this.now_animate_id * 3, show_count * 3)   
                : this.positions.subarray(this.now_animate_id * 3, (MAX_POINTS - this.now_animate_id) * 3 ) ;
        
        this.geometry.setPositions(segment);
        this.line.computeLineDistances();
        this.now_animate_id++;
    }
    show(from_id , count)
    {
        const subarray = this.positions.subarray(from_id, count * 3);
        this.geometry.setPositions(subarray);
        this.line.computeLineDistances();
    }
}