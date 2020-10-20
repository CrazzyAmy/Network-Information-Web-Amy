import {scene_init_meshes, t_buildings, t_decorations, set_scenario} from './map_three.js'
import {createBuilding, createPlane} from './modules/three_helper.js';
import * as ObjClass from './modules/object_class.js'  
let buildings = new ObjClass.ListData();
let decorations = new ObjClass.ListData();

let OnBuildingLoaded = function(){
    scene_init_meshes("buildings", buildings, t_buildings, createBuilding );
    set_scenario();
};
let OnDecorationLoaded = function() {
    scene_init_meshes("decorations", decorations, t_decorations, createPlane);
}
ObjClass.JsonReader.load_array(buildings, "/data/buildings.json" ,ObjClass.Building.fromJson, OnBuildingLoaded);
ObjClass.JsonReader.load_array(decorations, "/data/decorations.json", ObjClass.Decoration.fromJson, OnDecorationLoaded);

export{ buildings , decorations}