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


// NUMBER OF MAXIMUM CLIENTES
/**
 * @author RowerPulido
 */
let MAXIMUM_CLIENTS = 100
let actualContainers = []
let actualClients = []
const MINUTES_TO_UPDATE_CLIENTS = 20
// THE WEEK STARTS ON MONDAY WITH THE INDEX 1
let rateOfClientsByDay = [/*NO_DAY*/ 0, 1, 1.1, 1.2, 1.4, 1.6, 1.8, 2]

// THE WEEK STARTS ON MONDAY WITH THE INDEX 1
let rateOfProbabilityByDay = [/*NO_DAY*/ 0, 15, 20, 25, 30, 35, 40, 45]

/**
 * Load actual dishes from the server every 300000 miliseconds = 5 min
 */
setInterval(getContainers, minutesToMiliseconds(5))


// data to do configuration
// =================================
// 
let toDate = new Date();
let optionsToDate = {
    weekday: 'long'
};
var nameOfDay = toDate.toLocaleDateString('es-MX', optionsToDate);
var rate = get_rate();
var countPeople = 0; //actual Clients


/// =================================

// get data from apis
var _xmlHttpRequest = new XMLHttpRequest();
var holiday_api = "http://localhost:80/ecaptainSimulador/apis/hapi.php"
var island_status_api = "http://127.0.0.1:8000/api/v1/island/status/"
const API_CONSUME = 'http://127.0.0.1:8000/api/v1/container/consume'
const API_REFILL = 'http://127.0.0.1:8000/api/v1/container/refill'

// main Function.
function init() {
    //Load Containers from the server
    getContainers()

    startTime();
    document.getElementById('day').innerHTML = 'Day: ' + nameOfDay;
    document.getElementById('holiday').innerHTML = 'isHoliday: ' + isHoliday();
    document.getElementById('rate').innerHTML = 'Rate: Base ' + rate + '%';
    document.getElementById('rateWithFactors').innerHTML = 'Rate with Factors: 0%';
    document.getElementById('rateTotal').innerHTML = 'Rate Total: 0%';
    document.getElementById('total_person').innerHTML = 'Total people: ' + countPeople;
    // setInterval(function () {
    //     get_count_people()
    // }, 120000);
    // setInterval(function () {
    //     remove_person()
    // }, 300000);

    setInterval(getNewClients, minutesToMiliseconds(MINUTES_TO_UPDATE_CLIENTS))
}

// get info of Containers from db.
function get_info_by_island(id) {
    $.getJSON(island_status_api + 1, function (response) {
        console.log(response)
    })

}

function getNewClients() {
    const MAX_CLIENTS = 4
    let todayRateClients = rateOfClientsByDay[moment().isoWeekday()]
    let todayProbabilityClients = rateOfProbabilityByDay[moment().isoWeekday()]

    if (isHoliday()) {
        todayProbabilityClients += 20
        todayRateClients += 1
    }

    if (actualHour >= 8 && actualHour <= 10) {
        todayProbabilityClients += 5
    }
    else if (actualHour >= 10 && actualHour <= 12) {
        todayProbabilityClients += 10
    }
    else if (actualHour >= 12 && actualHour <= 14) {
        todayProbabilityClients += 15
    }
    else if (actualHour >= 14 && actualHour <= 16) {
        todayProbabilityClients += 25
    }
    else if (actualHour >= 16 && actualHour <= 18) {
        todayProbabilityClients += 20
    }
    else if (actualHour >= 18 && actualHour <= 20) {
        todayProbabilityClients += 10
    }
    else if (actualHour >= 20 && actualHour <= 21.30) {
        todayProbabilityClients += 5
    }
    else {
        console.log('Fuera del horario de apertura')
        todayProbabilityClients = 0
        return false
    }

    if (isInRange(getRndInteger(0, 100), 0, todayProbabilityClients)) {
        let quantityOfNewClients = getRndInteger(0, todayRateClients * MAX_CLIENTS)
        if (actualClients.length + quantityOfNewClients <= MAXIMUM_CLIENTS && quantityOfNewClients > 0) {
            console.log('Quantity of New Clients :' + quantityOfNewClients)
            let duration = getRndInteger(20, 60)
            for (let i = quantityOfNewClients; i > 0; i--) {
                actualClients.push(new Client(duration))
            }
            return true
        } else {
            console.log('No se encuentran los suficientes lugares disponibles');
        }
    }

}

// get holydays
function isHoliday() {
    var isHoliday = false

    $.ajax({
        url: holiday_api + "?year=" + moment().format('YYYY') + "&month=" + moment().format('MM') + "&day=" + moment().format('DD'),
        async: false,
        dataType: 'JSON',
        success: function (response) {
            if (response.status == 200)
                isHoliday = response.holidays.length != 0
        }
    })

    return isHoliday
}

function get_rate() {
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

function get_count_people() {

    // 5.3 min = 318000 mili
    // 25 min = 1500000 mili
    var hour = toDate.getHours() + '.' + toDate.getMinutes();
    var addPeople = 0;
    var rateWithFactos = 0;
    var ratewithPeople = 0;
    if (isHoliday())
        rateBase = rateBase + 7;

    if (hour >= 8.35 && hour <= 8.40)
        countPeople = 1;

    if (hour >= 8.40 && hour <= 12.00)
        addPeople = Math.floor(Math.random() * (rate - 1)) + 1;
    if (hour >= 12.00 && hour <= 14.00) {
        addPeople = Math.floor(Math.random() * (((rate * 3) + rate) - 1)) + 1;
        rateWithFactos = get_rate() * 0.20;
    }

    if (hour >= 14.00 && hour <= 17.00) {
        addPeople = Math.floor(Math.random() * (((rate * 4) + rate) - 1)) + 1;
        rateWithFactos = get_rate() * 0.50;
    }
    if (hour >= 17.00 && hour <= 20.00) {
        addPeople = Math.floor(Math.random() * (rate - 1)) + 1;
        rateWithFactos = get_rate() * 0.80;
    }

    if (hour >= 20.00 && hour <= 21.45) {
        addPeople = Math.floor(Math.random() * ((rate / 2) - 1)) + 1;
        rateWithFactos = get_rate() * 0.13;
        remove_person();
    }
    if (hour >= 21.45 && hour <= 22.00)
        removeMassivePerson(countPeople);

    if (countPeople >= 90 && countPeople <= 96)
        ratewithPeople = (rate * 0.20) + rate;

    if (countPeople > 500)
        addPeople = 0;

    if (MAXIMUM_CLIENTS < countPeople + addPeople)
        addPeople = 0

    countPeople = countPeople + addPeople;

    document.getElementById('rate').innerHTML = 'Rate Base: ' + rate + '%';
    document.getElementById('rateWithFactors').innerHTML = 'Rate with Factors: ' + (rateWithFactos + ratewithPeople) + '%';
    document.getElementById('rateTotal').innerHTML = 'Rate Total: ' + (rate + rateWithFactos + ratewithPeople) + '%';
    document.getElementById('total_person').innerHTML = 'Total people: ' + countPeople;

    return 'person to sum: ' + addPeople;
}

function remove_person() {
    var hour = toDate.getHours() + '.' + toDate.getMinutes();
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
    if (hour >= 20.00 && hour <= 21.45) {
        removePeople = countPeople / 4;
    }
    if (hour >= 21.45 && hour <= 22.00)
        removeMassivePerson(countPeople);

    if (countPeople < removePeople)
        removePeople = countPeople;

    countPeople = countPeople - removePeople;
    document.getElementById('total_person').innerHTML = 'Total people: ' + countPeople;
    return 'person to remove: ' + removePeople;
}

function removeMassivePerson(count) {
    countPeople = countPeople - count;
}


/*
 */
function startTime() {
    $('#hour').html('Hour: ' + moment().format('h:mm:ss'))
    setTimeout(startTime, 500);
}


/**
 * Generate a random integer between the minimun and the maximum
 * 
 * @param {int} min minimum value to random @default 0
 * @param {int} max maximum value to random @default 100
 * @author RowerPulido
 */
function getRndInteger(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a double number between the minimun and the maximum
 * @param {number} min minimum value @default 0
 * @param {number} max maximum value @default 100
 * @author RowerPulido
 */
function getRndDouble(min = 0, max = 100) {
    return Math.random() * (max - min) + min
}

/**
 * returns the seconds 
 * @param {int} minutes 
 */
function minutesToMiliseconds(minutes) {
    return minutes * 60 * 1000
}

function getContainers() {
    actualContainers = []
    //Load dishes from island 1
    $.getJSON(island_status_api + 1, function (response) {
        response.data.containers.forEach(c => {
            actualContainers.push(c)
        });
    })
    //Load dishes from island 2
    $.getJSON(island_status_api + 2, function (response) {
        response.data.containers.forEach(c => {
            actualContainers.push(c)
        });
    })
    //Load dishes from island 3
    $.getJSON(island_status_api + 3, function (response) {
        response.data.containers.forEach(c => {
            actualContainers.push(c)
        });
    })

    refillContainers()
}

/**
 * Verify if the containers has 15 percent or less , and if has that weight 
 * do a refill
 * @author RowerPulido
 */
function refillContainers() {
    $.each(actualContainers, function (i, c) {
        try {
            if (c.actual_status.actual_weight <= (c.actual_status.capacity * 0.15)) {
                $.ajax({
                    url: API_REFILL,
                    async: true,
                    method: 'POST',
                    dataType: 'JSON',
                    success: function (response) {
                        console.log(response)
                        if (response[0].STATUS == 0) {
                            console.log('SE HA REALIZADO UN REFILL AL CONTENEDOR ' + c.id)
                        } else
                            console.log('ALGO FALLO AL REALIZAR EL REFILL ' + c.id)
                    },
                    data: {
                        id: c.id
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    })
}


/**
 * returns a boolean if the value its on range
 * 
 * @param {any} value value to compare
 * @param {any} from value who starts the range
 * @param {any} to limit value
 * @author RowerPulido
 */
function isInRange(value, from, to) {
    return (value >= from && value <= to)
}