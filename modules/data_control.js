import {scene_init_meshes, t_buildings, t_decorations, add_scenario} from './map_three.js'
import {createBuilding, createPlane} from './three_helper.js';
import {ListData, Site, JsonReader, Building, Decoration} from './object_class.js'  
let buildings = new ListData();
let decorations = new ListData();

let OnBuildingLoaded = function(){
    scene_init_meshes("buildings", buildings, t_buildings, createBuilding );
};
let OnDecorationLoaded = function() {
    scene_init_meshes("decorations", decorations, t_decorations, createPlane);
}
//載入校園地板跟建築物之參數，並生成3d模型
JsonReader.load_array(buildings, "/data/buildings.json" ,Building.fromJson, OnBuildingLoaded);
JsonReader.load_array(decorations, "/data/decorations.json", Decoration.fromJson, OnDecorationLoaded);
console.log(buildings.map.size)
export{ buildings , decorations}