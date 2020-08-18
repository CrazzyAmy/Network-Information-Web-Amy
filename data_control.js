let buildings = new ListData();
let decorations = new ListData();
JsonReader.load_array(buildings, "/data/buildings.json" ,Building.fromJson, 
                      function(){ scene_init_meshes("buildings", buildings, t_buildings, createBuilding) });
JsonReader.load_array(decorations, "/data/decorations.json", Decoration.fromJson,
                      function(){ scene_init_meshes("decorations", decorations, t_decorations, createPlane) });