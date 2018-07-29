let clientNumber = 0;

function Client(durationMinutes = 30) {
    this.id = ++clientNumber
    this.DURATION_MINUTES = durationMinutes
    this.arrivalTime = moment()
    this.departureTime = moment().add(this.DURATION_MINUTES, 'minutes')
    this.maximumNumberOfServings = getRndInteger(1, 4)
    this.timesServed = 0
    this.MAXIMUM_DISHES = 4
    console.log('Cliente creado :' + this.id);


    this.interval = this.startInterval()
}

Client.prototype.makeConsume = function (idContainer, consumeVal = 0.1) {
    idClient = this.id
    $.ajax({
        url: API_CONSUME,
        async: true,
        method: 'POST',
        dataType: 'JSON',
        success: function (response) {
            // console.log(idClient + " Do Consume ");
            console.log('CONSUME AL CONTENEDOR : ' + idContainer)
        },
        data: {
            id: idContainer,
            consume: consumeVal
        }
    })
}

Client.prototype.startInterval = function () {
    var id = this.id
    var maxDishes = this.MAXIMUM_DISHES
    var timesServed = this.timesServed
    var makeConsume = this.makeConsume
    var maxNumbOfServings = this.maximumNumberOfServings

    var interval = setInterval(function () {
        if (timesServed < maxNumbOfServings) {
            let dishes = 0
            $.each(actualContainers, function (i, c) {
                if (maxDishes >= dishes)
                    if (getRndInteger(0, 100) <= c.actual_status.dish.category.probability) {
                        makeConsume(c.actual_status.id, getRndDouble(0.05, c.actual_status.dish.category.portion).toFixed(3))
                        dishes++
                    }
            })
            timesServed++
            console.log('times served : ' + timesServed);
        } else {
            console.log('Cliente eliminado : ' + id);
            clearInterval(interval)
            deleteClient(id)
        }
    }, minutesToMiliseconds(this.DURATION_MINUTES) / this.maximumNumberOfServings)
    return interval
}

function deleteClient(id) {
    $.each(actualClients, function (i, c) {
        try {
            if (c.id == id) {
                actualClients.splice(i, 1)
            }
        } catch (error) {
            //console.log(error);
        }
    })
}