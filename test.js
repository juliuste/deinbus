'use strict'

const moment = require('moment-timezone')
const isBool = require('lodash.isboolean')
const isDate = require('lodash.isdate')
const tape = require('tape')
const deinbus = require('./index')

const validStation = (s) => (/^[A-Z]+$/.test(s) && s.length === 3)

tape('deinbus.stations', (t) => {
	deinbus.stations().then((stations) => {
		t.plan(6)
		t.ok(stations.length > 5, 'stations length')
		const berlin = stations.filter((s) => s.id === 'BEZ')[0]
		t.ok(berlin.type === 'station', 'station type')
		t.ok(berlin.id === 'BEZ', 'station id')
		t.ok(berlin.name === 'Berlin (ZOB)', 'station name')
		t.ok(berlin.destinations.length > 5, 'station destinations length')
		t.ok(!!berlin.destinations[0], 'station destination')
	})
	.catch((e) => {throw new Error(e)})
})

tape('deinbus.journeys', (t) => {
	deinbus.journeys("BEZ", "LPZ", moment.tz("Europe/Berlin").add(3, "days")).then((journeys) => {
		t.plan(21)

		t.ok(journeys.length > 0, 'journeys length')
		t.ok(journeys[0].type === 'journey', 'journey type')
		t.ok(journeys[0].id.length >= 3, 'journey id')

		t.ok(journeys[0].legs.length > 0, 'journey legs length')
		t.ok(validStation(journeys[0].legs[0].origin), 'journey leg origin')
		t.ok(validStation(journeys[0].legs[0].destination), 'journey leg destination')
		t.ok(isDate(journeys[0].legs[0].departure), 'journey leg departure')
		t.ok(isDate(journeys[0].legs[0].arrival), 'journey leg arrival')

		t.ok(journeys[0].transfers >= 0, 'journey transfers')
		t.ok('string' === typeof journeys[0].transferInfo, 'journey transferInfo')

		t.ok(journeys[0].price.amount > 0, 'journey price amount')
		t.ok(journeys[0].price.currency === 'EUR', 'journey price currency')
		t.ok(journeys[0].price.tickets.length > 0, 'journey price tickets length')
		t.ok(isBool(journeys[0].price.bookable), 'journey price bookable')
		t.ok(isDate(journeys[0].price.bookableUntil), 'journey price bookableUntil')
		t.ok(isBool(journeys[0].price.soldOut), 'journey price soldOut')
		console.log(journeys[0].price.tickets[0].amount)
		t.ok(journeys[0].price.tickets[0].price.amount > 0, 'journey price ticket price amount')
		t.ok(journeys[0].price.tickets[0].price.currency === 'EUR', 'journey price ticket price currency')

		t.ok(isBool(journeys[0].insufficientCapacity), 'journey insufficientCapacity')
		t.ok(isDate(journeys[0].minChildBirthdate), 'journey minChildBirthdate')
		t.ok(isDate(journeys[0].maxUnattendedChildBirthdate), 'journey maxUnattendedChildBirthdate')
	})
	.catch((e) => {throw new Error(e)})
})
