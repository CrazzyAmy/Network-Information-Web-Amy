
class JsonReader
{
    static load_buildings(buildings_ref ,path)
    {
        var request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.send(null)
        request.onreadystatechange = function() {
            if ( request.readyState === 4 && request.status === 200 ) 
            {
                let json = JSON.parse(request.responseText);
                let array = new Array();
                for (let i = 0; i < json.buildings.length;i++)
                    buildings_ref.add(Building.fromJson(json.buildings[i]));
            }
        }
    }
}
class Buildings 
{
    constructor() {
      this.buildings = []
    }
    add(building){
        this.buildings.push(building);
    }
    get array(){
        return this.buildings;
    }
    get length(){
        return this.buildings.length;
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
        return new Building (obj.id, obj.title, obj.location, obj.size, obj.color, obj.floor);
    };
}
class Decoration
{

}