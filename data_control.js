import * as ObjClass from './modules/object_class.js'  
let buildings = new ObjClass.ListData();
let decorations = new ObjClass.ListData();
ObjClass.JsonReader.load_array(buildings, "/data/buildings.json" ,ObjClass.Building.fromJson, 
                      function(){ scene_init_meshes("buildings", buildings, t_buildings, createBuilding) });
ObjClass.JsonReader.load_array(decorations, "/data/decorations.json", ObjClass.Decoration.fromJson,
                      function(){ scene_init_meshes("decorations", decorations, t_decorations, createPlane) });
