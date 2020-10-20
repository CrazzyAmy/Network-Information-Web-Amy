export {JsonReader, ListData , Building, Decoration, Site}
class JsonReader
{
    static load_array(array_ref ,path, func_format , func_call_back)
    {
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.send(null)
        request.onreadystatechange = function() 
        {
            if ( request.readyState === 4 && request.status === 200 ) 
            {
                let listdata = JSON.parse(request.responseText);
                let array = listdata[Object.keys(listdata)[0]]; // first array element
                for (let i = 0; i < array.length;i++)
                    array_ref.add(func_format(array[i]));
                func_call_back();
            }
        }
    }
}
class ListData 
{
    constructor() {
      this.list = [];
      this.map = new Map();
    }
    add(building){
        this.list.push(building);
        this.map.set(building.id, building);
    }
    get array(){
        return this.list;
    }
    get length(){
        return this.list.length;
    }

}

class Building
{
    constructor(id,title, location ,size, color, floor)
    {
        this.id = id;
        this.title = title;
        this.location = location
        this.size = size;
        this.color = color;
        this.floor = floor;
        this.floor_height = this.size[1] / this.floor;
        this.toJson = function (){
            return ("{" +
                "\"id\":\"" + this.id + "\"," +
                "\"title\":\"" + this.title + "\"," +
                "\"location\":\"" + this.location + "\"," +
                "\"size\":\"" + this.size + "\"," +
                "\"color\":" + this.color + "," +
                "\"floor\":" + this.floor + "}");
        };
    }
    static fromJson = function (obj){
        let color = parseInt(obj.color.replace(/^#/, ''), 16)
        return new Building (obj.id, obj.title, obj.location, obj.size, color, obj.floor);
    };
    get_pos(floor_id)
    {
        let height = this.size[1];
        let x = this.location[0], y = this.location[1] + floor_id * this.floor_height, z = this.location[2];  //location
        return [x,y,z];
    }
}
class Decoration
{
    constructor(id, title, type ,location ,size, color)
    {
        this.id = id;
        this.title = title;
        this.type = type;
        this.location = location
        this.size = size;
        this.color = color;
        this.toJson = function (){
            return ("{" +
                "\"id\":\"" + this.id + "\"," +
                "\"title\":\"" + this.title + "\"," +
                "\"type\":\"" + this.type + "\"," +
                "\"size\":\"" + this.size + "\"," +
                "\"color\":" + this.color + "}");
        };
    }
    static fromJson = function (obj){
        let color = parseInt(obj.color.replace(/^#/, ''), 16)
        return new Decoration (obj.id, obj.title, obj.type ,obj.location, obj.size, color);
    };
}
class Site
{
    constructor(building_id, floor_id, location_id)
    {
        this.building_id = building_id;
        this.floor_id = floor_id;
        this.location_id = location_id;
    }
}