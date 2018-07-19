// porcents
// rate = 100% wihtout holiday // to quantity of consume
    // rate value = 1;
// rate = 180% with holiday
    // rate value = (value * 1.80) + value.
// range hour to consume.
    // open - 8:30am
        /* depending on the day of the week */
        // 8:30 - 12:00 ratePorcent = 10%
        // 12:00 - 14:00 ratePorcent = 15%
        // 14:00 - 17:00 ratePorcent = 20%
        // 17:00 - 20:00 ratePorcent = 17%
        // 20:00 - 21:50 ratePorcent = 12%;
        // 22:00 ratePorcent = 0% 
    // close - 22:00

// generate to count of peopel
    // get hour and get day to generate people

/* equation */


// 1 k = 1000 g
// grams by person 
    // carne = 250 - 300g - media = 275g
    // carne ave = 250 - 300g - media = 275g
    // arroz = 50 - 150g - media = 100g
    // pastas = 60 - 95g - media = 78g
    // mariscos = 300 - 550g - media = 425g
    // verduras = 200 - 250g - media = 225g
    // fruta = 400 - 700g - media = 550g
    // helado = 100g


// food porcents
    // camaron enchilado = 65%
    // camaron natural = 60%
    // combinacion = 50%
    // camaron empanizado = 45%
    // arroz = 35%


// data to do configuration
// =================================
// 
let toDate = new Date();
let optionsToDate = {
    weekday: 'long'
};
var nameOfDay = toDate.toLocaleDateString('es-MX', optionsToDate);
var rate = get_rate();
var countPeople = 0;


/// =================================

// get data from apis
var _xmlHttpRequest = new XMLHttpRequest();
var holiday_api = "http://localhost:80/ecaptainSimulador/apis/hapi.php";
var island_status_api = "http://127.0.0.1:8000/api/v1/island/status/";
// main Function.
function init(){
    startTime();
    //console.log('Day: '+nameOfDay);
    //console.log('Rate: ' + get_rate());
    //console.log('isHoliday: '+get_holydays());
    document.getElementById('day').innerHTML = 'Day: '+nameOfDay;
    document.getElementById('holiday').innerHTML = 'isHoliday: '+get_holydays();
    document.getElementById('rate').innerHTML = 'Rate: Base '+ rate +'%';
    document.getElementById('rateWithFactors').innerHTML = 'Rate with Factors: 0%';
    document.getElementById('rateTotal').innerHTML = 'Rate Total: 0%';
    document.getElementById('total_person').innerHTML = 'Total people: '+countPeople;
    setInterval(function () 
    { 
        get_count_people()
    }, 120000);
    setInterval(function()
    {
        remove_person()
    },300000);
    
    //console.log(get_info_by_island(1));
   
}

// get info of Containers from db.
function get_info_by_island(id){
    _xmlHttpRequest.open("GET", island_status_api+id,true);
    _xmlHttpRequest.onreadystatechange = function(){
        if (_xmlHttpRequest.status == 200 && _xmlHttpRequest.readyState == 4){
            console.log(_xmlHttpRequest.responseText);
        }
    }
    _xmlHttpRequest.send();
    
}

// get holydays
function get_holydays(){
    var isHoliday = false;
    _xmlHttpRequest.open("GET", holiday_api+"?year=2018&month=7&day=4", true);
    _xmlHttpRequest.onreadystatechange = function(){
        if (_xmlHttpRequest.status == 200 && _xmlHttpRequest.readyState == 4){
            var respone = JSON.parse( _xmlHttpRequest.responseText);
            var holiday = respone.holidays;
            if (holiday.length == 0){
                isHoliday = true;
            }
        }
    }
    _xmlHttpRequest.send();
    return isHoliday;
}

function get_rate(){
    var rate = 1;
    switch (nameOfDay) {
        case 'domingo':
            rate = 12;
            break;
        case 'lunes':
            rate = 7;
            break;
        case 'martes':
            rate = 6;
            break;
        case 'miércoles':
            rate = 5;
            break;
        case 'jueves':
            rate = 8;
            break;
        case 'viernes':
            rate = 9;
            break;
        case 'sabado':
            rate = 11;
            break;
        default:
            rate = 1;
            break;
    }
    return rate;
}

function get_count_people(){
    
    // 5.3 min = 318000 mili
    // 25 min = 1500000 mili
    var hour = toDate.getHours()+'.'+toDate.getMinutes();
    var addPeople = 0;
    var rateWithFactos = 0;
    var ratewithPeople = 0;
    if (get_holydays())
        rateBase = rateBase + 7;
    
    if (hour >= 8.35 && hour <= 8.40)
        countPeople = 1;

    if (hour >= 8.40 && hour <= 12.00)
        addPeople = Math.floor(Math.random() * (rate - 1)) + 1;
    if (hour >= 12.00 && hour <= 14.00){
        addPeople = Math.floor(Math.random() * ( ((rate * 3) + rate)- 1)) + 1;
        rateWithFactos = get_rate() * 0.20;
    }
        
    if (hour >= 14.00 && hour <= 17.00){
        addPeople = Math.floor(Math.random() * (((rate * 4) + rate) - 1)) + 1;
        rateWithFactos = get_rate() * 0.50;
    }
    if (hour >= 17.00 && hour <= 20.00){
        addPeople = Math.floor(Math.random() * (rate - 1)) + 1;
        rateWithFactos = get_rate() * 0.80;
    }
        
    if (hour >= 20.00 && hour <= 21.45){
        addPeople = Math.floor(Math.random() * ((rate / 2) - 1)) + 1;
        rateWithFactos = get_rate() * 0.13;
        remove_person();
    }
    if (hour >= 21.45 && hour <= 22.00)
        removeMassivePerson(countPeople);

    if (countPeople >= 90 && countPeople <= 96 )
        ratewithPeople = (rate * 0.20) + rate;

    if (countPeople > 500)
        addPeople = 0;

    
    countPeople = countPeople + addPeople;
    
    document.getElementById('rate').innerHTML = 'Rate Base: '+ rate +'%';
    document.getElementById('rateWithFactors').innerHTML = 'Rate with Factors: '+(rateWithFactos+ratewithPeople)+'%';
    document.getElementById('rateTotal').innerHTML = 'Rate Total: '+(rate+rateWithFactos+ratewithPeople)+'%';
    document.getElementById('total_person').innerHTML = 'Total people: '+countPeople;
    
    return 'person to sum: '+ addPeople;
}

function remove_person(){
    var hour = toDate.getHours()+'.'+toDate.getMinutes();
    var removePeople = 0;
    if (hour >= 8.40 && hour <= 12.00)
        // Math.floor(Math.random() * (max - min)) + min;
        removePeople = Math.floor(Math.random() * (25 - 15)) + 15;
    if (hour >= 8.40 && hour <= 12.00)
        removePeople = Math.floor(Math.random() * (25 - 18)) + 18;
    if (hour >= 12.00 && hour <= 14.00)
        removePeople = Math.floor(Math.random() * (35 - 25)) + 25;
    if (hour >= 14.00 && hour <= 17.00)
        removePeople = Math.floor(Math.random() * (15 - 10)) + 10;
    if (hour >= 17.00 && hour <= 20.00)
        removePeople = Math.floor(Math.random() * (30 - 1)) + 1;
    if (hour >= 20.00 && hour <= 21.45){
        removePeople = countPeople / 4;
    }
    if (hour >= 21.45 && hour <= 22.00)
        removeMassivePerson(countPeople);

    if (countPeople < removePeople)
        removePeople = countPeople;
    
    countPeople = countPeople - removePeople;
    document.getElementById('total_person').innerHTML = 'Total people: '+countPeople;
    return 'person to remove: '+ removePeople;
}

function removeMassivePerson(count){
    countPeople = countPeople - count;
}

function consume(){

}



























/*
 */
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('hour').innerHTML ="Hour: "+ h + ":" + m + ":" + s ;

    setTimeout(startTime, 500);
}
/**
 * function check nums and add zero
 * @param {any} i
 */
function checkTime(i) {
    if (i < 10) { i = "0" + i; }  // add zero in front of numbers < 10
    return i;
}