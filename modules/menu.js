/*HTML各個介面的控制*/ 
const $ = jQuery;

let openmenu = function(classname){
    $(classname).toggle();
}

let opensetting = function(){
    $("#setting").toggle();
}

let menuinit = function(){
    $("#setting").hide();
    $("#setting-user").hide();
}

menuinit();