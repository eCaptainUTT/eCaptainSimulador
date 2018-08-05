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
//DEFINE THE LOCALE DATE
moment.locale('es-us')

let MAXIMUM_CLIENTS = 100
let actualContainers = []
let actualClients = []
let MINUTES_TO_UPDATE_CLIENTS = 5
const PERCENTAGE_TO_MAKE_REFILL = 0.20
// THE WEEK STARTS ON MONDAY WITH THE INDEX 1
let rateOfClientsByDay = [/*NO_DAY*/ 0, 1, 1.1, 1.2, 1.4, 1.6, 1.8, 2]

// THE WEEK STARTS ON MONDAY WITH THE INDEX 1
let rateOfProbabilityByDay = [/*NO_DAY*/ 0, 20, 25, 30, 35, 40, 45, 50]
let actualProbability = rateOfProbabilityByDay[moment().isoWeekday()]
let actualRate = rateOfClientsByDay[moment().isoWeekday()]
/**
 * Load actual dishes from the server every 300000 miliseconds = 5 min
 */
setInterval(getContainers, minutesToMiliseconds(5))

setInterval(refillContainers, minutesToMiliseconds(2))




/// =================================

// get data from apis
var _xmlHttpRequest = new XMLHttpRequest();
var holiday_api = "http://localhost:80/ecaptainSimulador/apis/hapi.php"
var island_status_api = "http://142.93.82.45/api/v1/island/status/"
const API_CONSUME = 'http://142.93.82.45/api/v1/container/consume'
const API_REFILL = 'http://142.93.82.45/api/v1/container/refill'

// main Function.
function init() {
    //Load Containers from the server
    getContainers()

    startTime();
    updateStats()

    setInterval(getNewClients, minutesToMiliseconds(MINUTES_TO_UPDATE_CLIENTS))
}

/**
 * Update the stats showed on the screen
 */
function updateStats() {
    $('#day').html('Day: ' + moment().format('dddd'));
    $('#holiday').html('Is Holiday : ' + (isHoliday() ? 'Yes' : 'No'));
    $('#probability').html('Probability Base: ' + rateOfProbabilityByDay[moment().isoWeekday()] + ' %');
    $('#probabilityTotal').html('Total Probability: ' + actualProbability + ' %');
    $('#rateOfClients').html('Rate Base of Clients: ' + rateOfClientsByDay[moment().isoWeekday()])
    $('#rateTotalOfClients').html('Total Rate of Clients: ' + actualRate)
    $('#total_person').html('Total Persons: ' + actualClients.length)
    $('#rateTotalOfClients').hide()
}

// get info of Containers from db.
function get_info_by_island(id = 1) {
    $.getJSON(island_status_api + id, function (response) {
        console.log(response)
    })

}

function getNewClients() {

    let actualHour = moment().format('H.mm')
    actualHour = parseFloat(actualHour)
    if (moment().set({ 'minutes': 0, 'hour': 8 }) <= moment() && moment() <= moment().set({ 'minutes': 0, 'hour': 22 })) {
        const MAX_CLIENTS = 4
        let todayRateClients = rateOfClientsByDay[moment().isoWeekday()]
        let todayProbabilityClients = rateOfProbabilityByDay[moment().isoWeekday()]

        if (isHoliday()) {
            todayProbabilityClients += 20
            todayRateClients += 1
        }

        if (actualHour >= 8 && actualHour <= 10) {
            todayProbabilityClients += 5
            MINUTES_TO_UPDATE_CLIENTS = 15
        }
        else if (actualHour >= 10 && actualHour <= 12) {
            todayProbabilityClients += 10
            MINUTES_TO_UPDATE_CLIENTS = 10
        }
        else if (actualHour >= 12 && actualHour <= 14) {
            todayProbabilityClients += 15
            MINUTES_TO_UPDATE_CLIENTS = 5
        }
        else if (actualHour >= 14 && actualHour <= 16) {
            todayProbabilityClients += 25
            MINUTES_TO_UPDATE_CLIENTS = 3
        }
        else if (actualHour >= 16 && actualHour <= 18) {
            todayProbabilityClients += 20
            MINUTES_TO_UPDATE_CLIENTS = 10
        }
        else if (actualHour >= 18 && actualHour <= 20) {
            todayProbabilityClients += 10
            MINUTES_TO_UPDATE_CLIENTS = 20
        }
        else if (actualHour >= 20 && actualHour <= 21.30) {
            todayProbabilityClients += 5
            MINUTES_TO_UPDATE_CLIENTS = 25
        }
        else {
            console.log('Fuera del horario de apertura')
            todayProbabilityClients = 0
            MINUTES_TO_UPDATE_CLIENTS = 10
            return false
        }

        actualProbability = todayProbabilityClients
        if (isInRange(getRndInteger(0, 100), 0, todayProbabilityClients)) {
            actualRate = todayRateClients * MAX_CLIENTS
            let quantityOfNewClients = getRndInteger(1, actualRate)
            updateStats()
            if (actualClients.length + quantityOfNewClients <= MAXIMUM_CLIENTS && quantityOfNewClients > 0) {
                console.log('Quantity of New Clients :' + quantityOfNewClients)
                let duration = getRndInteger(20, 60)

                if (moment().add(duration, 'minute') <= moment().set({ hour: 22, minute: 0 })) {
                    for (let i = quantityOfNewClients; i > 0; i--) {
                        actualClients.push(new Client(duration))
                    }
                }
                updateStats()
                return true
            } else {
                console.log('New Clients : ' + (actualClients.length + quantityOfNewClients) + 'MAXIMUM_CLIENTS : ' + MAXIMUM_CLIENTS)
                console.log('No se encuentran los suficientes lugares disponibles');
            }
        }
    } else {
        actualClients = []
        console.log('Fuera del horario de atencion');
        fillContainers()
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

/*
 */
function startTime() {
    $('#hour').html('Time: ' + moment().format('h:mm:ss'))
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
 * Verify if the containers has the percent or less , and if has that weight 
 * do a refill
 * @author RowerPulido
 */
function refillContainers() {
    $.each(actualContainers, function (i, c) {
        try {
            if (c.actual_status.actual_weight <= (c.actual_status.capacity * PERCENTAGE_TO_MAKE_REFILL)) {
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
 * Fill the containers
 * @author RowerPulido
 */
function fillContainers() {
    $.each(actualContainers, function (i, c) {
        try {
            if (c.actual_status.actual_weight != c.actual_status.capacity) {
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