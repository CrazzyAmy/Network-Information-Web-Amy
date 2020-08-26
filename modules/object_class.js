export {JsonReader, ListData , Building, Decoration}
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
      this.list = []
    }
    add(building){
        this.list.push(building);
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