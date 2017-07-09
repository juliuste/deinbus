# deinbus

JavaScript client for the [deinbus](https://www.deinbus.de) coach travel API. Complies with the [friendly public transport format](https://github.com/public-transport/friendly-public-transport-format) (`FPTF 0.0`)

[![npm version](https://img.shields.io/npm/v/deinbus.svg)](https://www.npmjs.com/package/deinbus)
[![Build Status](https://travis-ci.org/juliuste/deinbus.svg?branch=master)](https://travis-ci.org/juliuste/deinbus)
[![dependency status](https://img.shields.io/david/juliuste/deinbus.svg)](https://david-dm.org/juliuste/deinbus)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/deinbus.svg)](https://david-dm.org/juliuste/deinbus#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/deinbus.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install --save deinbus
```

## Usage

This package contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

### `stations`

Using `deinbus.stations`, you can get all stations operated bei Deinbus.

```js
const stations = require('deinbus').stations

stations().then(console.log)
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve in an array of `station`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows:

```js
[
    {
        type: 'station',
        id: 'BEZ',
        name: 'Berlin (ZOB)',
        destinations: [
            'ASL',
            'ERF',
            'FRA'
            // …
        ]
    }
    // …
]
```

### journeys

Using `deinbus.journeys`, you can get directions and prices for routes from A to B.

```js
const journeys = require('deinbus').journeys

journeys(origin, destination, date = Date.now(), opt = defaults)

const BerlinZOB = 'BEZ'
const Leipzig = 'LPZ'
const date = new Date() // ignores specific time, searches the entire day (based on Europe/Berlin timezone)

journeys(BerlinZOB, Leipzig, date)
.then(console.log)
.catch(console.error)
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an array of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format) which looks as follows.
*Note that the legs are not fully spec-compatible, as the `schedule` is missing and for API-specific reasons, the journey always contains exactly one leg (see also: `transfers` key).*

```js
[
    {
        "type": "journey",
        "id": "BEZ_LPZ_2017-07-13_0715",
        "legs": [
            {
                "origin": "BEZ",
                "destination": "BEZ",
                "departure": "2017-07-13T05:15:00.000Z", // JS Date() object
                "arrival": "2017-07-13T07:25:00.000Z" // JS Date() object
            }
        ],
        "transfers": 0,
        "transferInfo": "",
        "price": {
            "amount": 8.5,
            "currency": "EUR",
            "bookable": true,
            "bookableUntil": "2017-07-13T05:00:00.000Z", // JS Date() object
            "soldOut": false,
            "tickets": [
                {
                    "price": {
                        "amount": 8.5,
                        "currency": "EUR"
                    },
                    "child": false,
                    "description": null
                }
                // …
            ]
        },
        "insufficientCapacity": false,
        "minChildBirthdate": "2002-07-13T22:00:00.000Z", // JS Date() object
        "maxUnattendedChildBirthdate": "2011-07-12T22:00:00.000Z" // JS Date() object
    }
    // …
]
```

----

`defaults`, partially overridden by the `opt` parameter, looks like this:

```js
const defaults = {
    passengers: {
        adults: 1,
        children: 0
    }
}
```

## See also

- [FPTF](https://github.com/public-transport/friendly-public-transport-format) - "Friendly public transport format"
[FPTF-modules](https://github.com/public-transport/friendly-public-transport-format/blob/master/modules.md) - modules that also use FPTF

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/deinbus/issues).
