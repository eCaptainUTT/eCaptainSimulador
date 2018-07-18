// porcents
// rate = 100% wihtout holiday // to quantity of consume
    // rate value = 1;
// rate = 180% with holiday
    // rate value = (value * .80) + value.

// data to do configuration
// =================================
// 
let toDate = new Date();
let optionsToDate = {
    weekday: 'long'
};
var nameOfDay = toDate.toLocaleDateString('es-MX', optionsToDate);
/// =================================

// get data from apis
var _xmlHttpRequest = new XMLHttpRequest();
var holiday_api = "http://localhost/ecaptainSimulador/apis/hapi.php";

// main Function.
function init(){
    /*
    setInterval(function () {
        get_holydays();
        console.log('day: '+nameOfDay);
        console.log('rate: ' + get_rate());
    },1500);
    */
    get_holydays();
    console.log('Day: '+nameOfDay);
    console.log('Hour: '+toDate.getHours());
    console.log('Rate: ' + get_rate());
   
}

// get info of Containers from db.
function get_info_all(){
    
}

// get holydays
function get_holydays(){
    _xmlHttpRequest.open("GET", holiday_api+"?year=2018&month=7&day=4", true);
    _xmlHttpRequest.onreadystatechange = function(){
        if (_xmlHttpRequest.status == 200 && _xmlHttpRequest.readyState == 4){
            console.log(_xmlHttpRequest.responseText);
        }
    }
    _xmlHttpRequest.send();
}


function get_rate(){
    var rate = 1;
    switch (nameOfDay) {
        case 'domingo':
            rate = 3.3;
            break;
        case 'lunes':
            rate = 1.4;
            break;
        case 'martes':
            rate = 1.6
            break;
        case 'miércoles':
            rate = 1.7;
            break;
        case 'jueves':
            rate = 1.8
            break;
        case 'viernes':
            rate = 2.5;
            break;
        case 'sabado':
            rate = 3;
            break;
        default:
            rate = 1.2;
            break;
    }
    return rate;
}