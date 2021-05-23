import {scene_init_meshes, t_buildings, t_decorations, add_scenario} from './map_three.js'
import {createBuilding, createPlane} from './modules/three_helper.js';
import {ListData, Site, JsonReader, Building, Decoration} from './modules/object_class.js'  
let buildings = new ListData();
let decorations = new ListData();

//{"id":"LIB""floor":8 }, {"id":"EECS","floor":9 }, {"id":"CC", "floor":4 }, {"id":"SS", "floor":8 }, 
//{"id":"ADM", "floor":7 }, {"id":"PA","floor":9 }, {"id":"LAW","floor":8 }, {"id":"BUS","floor":9 } ,
//{"id":"HUM","floor":13 }

let site1_from =  [new Site("SS", 3, ""), new Site("SS", 3, ""), new Site("SS", 3, ""), new Site("SS", 3, "")];
let site1_to = [new Site("PA", 4, ""), new Site("LAW", 5, ""), new Site("BUS", 6, ""), new Site("CC", 3, "")];

let site2_from =  [new Site("ADM", 4, ""), new Site("ADM", 5, ""), new Site("LAW", 3, ""), new Site("LAW", 3, "")];
let site2_to = [new Site("LIB", 4, ""), new Site("EECS", 5, ""), new Site("CC", 2, ""), new Site("BUS", 3, "")];

let OnBuildingLoaded = function(){
    scene_init_meshes("buildings", buildings, t_buildings, createBuilding );
    //add_scenario(site1_from, site1_to , 0xE60000);
    //add_scenario(site2_from, site2_to , 0xFF0FF0);
};
let OnDecorationLoaded = function() {
    scene_init_meshes("decorations", decorations, t_decorations, createPlane);
}
JsonReader.load_array(buildings, "/data/buildings.json" ,Building.fromJson, OnBuildingLoaded);

JsonReader.load_array(decorations, "/data/decorations.json", Decoration.fromJson, OnDecorationLoaded);
console.log(buildings.map.size)
export{ buildings , decorations}