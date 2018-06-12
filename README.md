# stateless-maybe-js [![Build Status](https://travis-ci.org/emilianobovetti/stateless-maybe-js.svg?branch=master)](https://travis-ci.org/emilianobovetti/stateless-maybe-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This is a porting of the [maybe monad](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29#The_Maybe_monad), or [option type](https://en.wikipedia.org/wiki/Option_type), in JavaScript.

There are a bunch of maybe-js libraries, all very similar to each other, so here's [why I wrote this one](DESIGN.md).

## Installation

```
$ npm install stateless-maybe-js
```

For browser installation all you need is to include the script:

```HTML
<script type="text/javascript" src="path/to/dist/maybe.min.js"></script>
```

or require in node:

```javascript
const maybe = require('stateless-maybe-js')
```

## Build

A Makefile will call yarn for you and then uglifyjs to produce `./dist/maybe.min.js`. Just point your console to the project path and run `make`. `make test` is a shortcut for `yarn run test`.

## How to create new Maybe

`maybe(someValue)` creates a new maybe object wrapping `someValue`. A `nothing` is returned if the value is `null` or `undefined`. E.g.:

```javascript
var m1 = maybe('hello, world')
var m2 = maybe(undefined)
var m3 = maybe(null)

m1.empty // false
m2.empty // true
m3.empty // true
```

`maybe` objects aren't nested by constructor function.

```javascript
var m = maybe('hello, world')

// when maybe() receives a maybe monad
// just returns itself
m === maybe(m) // true
```

If the emptiness definition isn't trivial (i.e. `null` or `undefined`), you can use `maybe.nothing` and `maybe.just()`. E.g.:

```javascript
function maybeYoungPeople (people, maxAge, atLeast) {
  var areYoung = people
    .reduce((acc, p) => acc && p.age <= maxAge, true)

  if (people.length >= atLeast && areYoung) {
    return maybe.just(people)
  } else {
    return maybe.nothing
  }
}

var people = [ { age: 10 }, { age: 15 } ]

maybeYoungPeople(people, 16, 2).empty // false
maybeYoungPeople(people, 14, 2).empty // true
maybeYoungPeople(people, 16, 3).empty // true
```

Note that `maybe.just()`, unlike `maybe()`, doesn't make any emptiness check. A `just` instance is always created.

```javascript
var m = maybe.just(null)

m.empty // false
m.get() // null
```

## Type specific constructors

### `maybe.string(value)`
Checks if `typeof value` is `string` and it's not an empty string.

### `maybe.number(value)`
Returns `maybe.just(value)` if `typeof value === 'number'`.

### `maybe.object(value)`
Checks if `typeof value` is `object` and it's not `null`.

## Using Maybes

```javascript
function maybeGetUser (id) {
  // ...

  return maybe(user)
}

// get user's date of birth or 'unknown'
// if user doesn't exist or user.dateOfBirth
// doesn't exist, is null or undefined
maybeGetUser(id)
  .map(user => user.dateOfBirth)
  .getOrElse('unknown')
```

You can use the `maybe` function to wrap a lot of useful objects. E.g.:

```javascript
function maybeGetElementById (id) {
  return maybe(document.getElementById(id))
}

// remove an element if exist
maybeGetElementById('some-id')
  .forEach(element => element.remove())

// get header's height or 0
maybeGetElementById('header-id')
  .map(header => header.offsetHeight)
  .getOrElse(0)

// execute a function if an element exist
// or another function if it doesn't
maybeGetElementById('some-other-id')
  .forEach(e => console.log('element found!'))
  .orElse(() => console.log('element not found'))

// maybe.toString() returns an empty string
// on nothing
maybeGetElementById('some-node')
  .map(e => e.innerText)
  .toString()
```

If there are a lot of objects wrapped in `maybe`s, then it might seem hard to handle them and nesting functions might seem the only way to go. In this case `filter` could be a good option.
For example we could write a function to update meta description only if the meta tag exists and the given description is a non-empty string:

```javascript
// plain javascript
function updateMetaDescription (desc) {
  var metaDescription = document.getElementById('meta-description')

  if (metaDescription !== null && typeof desc === 'string' && desc !== '') {
    metaDescription.setAttribute('content', desc)
  }
}

// now nesting maybe.forEach
function updateMetaDescription (desc) {
  maybe(document.getElementById('meta-description'))
    .forEach(function (element) {
      maybe.string(desc).forEach(function () {
        // okay, this is worse
        element.setAttribute('content', desc)
      })
    })
}

// using maybe.filter
function updateMetaDescription (desc) {
  maybe(document.getElementById('meta-description'))
    .filter(() => maybe.string(desc).nonEmpty)
    .forEach(el => el.setAttribute('content', desc))
}
```

## Other usage examples

- [Cache function result](https://gist.github.com/emilianobovetti/9245d6b0c3dc03461446fadc6a3c75da)

- [Touch event handler](https://github.com/emilianobovetti/hearweart/blob/8bf6eed1e8d43983fd1094c08e0284aab50b29ab/assets/js/main.js#L151)

## Maybe object properties

### `maybe.empty`
`true` if the maybe is `nothing`, false otherwise.

### `maybe.nonEmpty`
Negation of `maybe.empty`.

### `maybe.filter(Function fn)`
If the maybe is non-empty and `fn(value) == false`, returns `nothing`.
Returns the maybe itself otherwise.

### `maybe.map(Function fn)`
If the maybe is non-empty returns `maybe(fn(value))`.
Returns `nothing` otherwise.

### `maybe.forEach(Function fn)`
Applies the given function to the value if non-empty, does nothing otherwise.
Always returns maybe itself.

### `maybe.get()`
Returns wrapped value or throws an `Error` if the maybe is empty.

### `maybe.getOrElse(mixed orElse)`
If the maybe is non-empty returns its value, returns `orElse` otherwise.

`orElse` can be:

1. a function - which is called and its result returned if the maybe is empty.
2. any other value - which is returned in case the maybe is empty.

### `maybe.getOrThrow(throwable e)`
Returns the value of the maybe or throws `e` if the maybe is empty.

### `maybe.orElse(mixed orElse)`
Acts like `getOrElse`, but returns an maybe instead of its value.

### `maybe.toString()`
Returns the value casted to string if the maybe is non-empty, an empty string otherwise.
