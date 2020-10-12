import * as THREE from '../node_modules/three/build/three.module.js';
import {Line2} from '../node_modules/three/examples/jsm/lines/Line2.js'
import {LineMaterial} from '../node_modules/three/examples/jsm/lines/LineMaterial.js'
import {LineGeometry} from '../node_modules/three/examples/jsm/lines/LineGeometry.js'
export { Parabola };
var MAX_POINTS = 200;
class Parabola{
    constructor(){

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
            color: 0xff0000,
            linewidth: 10,
            vertexColors: true,
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
    set(start, end, a)
    {
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
         this.geometry.setPositions(this.positions);
         this.line.computeLineDistances();
    }
}