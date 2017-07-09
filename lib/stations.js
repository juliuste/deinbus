'use strict'

const fetch = require('node-fetch')

const transformStation = (s) => ({
    type: 'station',
    id: s['@id'],
    name: s.name,
    destinations: s.destinations.map((d) => d['@id'])
})

const stations = () =>
    fetch('https://www.deinbus.de/api/schedule/stops', {method: 'get'})
    .then((res) => res.json())
    .then((res) => res.items.map(transformStation))

module.exports = stations
