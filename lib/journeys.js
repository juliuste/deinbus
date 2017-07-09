'use strict'

const request = require('node-fetch')
const merge = require('lodash.merge')
const moment = require('moment-timezone')

const defaults = {
    passengers: {
        adults: 1,
        children: 0
    }
}

const validStation = (s) => (/^[A-Z]+$/.test(s) && s.length === 3)

const transformTicket = (t) => ({
    price: {
        amount: t.price / 100,
        currency: 'EUR'
    },
    child: t.child,
    description: t.description
    // todo: originalPrice?
})

const transformJourney = (j) => ({
    type: 'journey',
    id: j['@id'],
    legs: [{
        origin: j.origin['@id'],
        destination: j.origin['@id'],
        departure: new Date(j.departure),
        arrival: new Date(j.arrival)
    }],
    transfers: j.numChangeovers,
    transferInfo: j.changeoverInfo,
    price: {
        amount: j.total / 100,
        currency: 'EUR',
        bookable: j.isBookable,
        bookableUntil: new Date(j.bookableUntil),
        soldOut: j.isSoldOut,
        tickets: j.tickets.map(transformTicket)
    },
    insufficientCapacity: j.hasInsufficientCapacity,
    minChildBirthdate: moment.tz(j.minChildBirthdate, 'YYYY-MM-DD', 'Europe/Berlin').toDate(),
    maxUnattendedChildBirthdate: moment.tz(j.maxUnattendedChildBirthdate, 'YYYY-MM-DD', 'Europe/Berlin').toDate()
    // todo: regularProce, specialPrice?
})

const journeys = (origin, destination, date = Date.now(), opt) => {
    if(!validStation(origin)) throw new Error('origin must be a valid station id')
    if(!validStation(destination)) throw new Error('destination must be a valid station id')

    opt = merge({}, defaults, opt)

    date = moment.tz(date, 'Europe/Berlin').format("YYYY-MM-DD")

    return request(`https://www.deinbus.de/api/tripsearch?date=${date}&origin=${origin}&destination=${destination}&adults=${opt.passengers.adults}&children=${opt.passengers.children}`, {method: 'get'})
    .then((res) => res.json())
    .then((res) => res.items.map(transformJourney))
}

module.exports = journeys
