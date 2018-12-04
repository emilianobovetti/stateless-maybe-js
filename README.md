# stateless-maybe-js

[![Build Status](https://travis-ci.org/emilianobovetti/stateless-maybe-js.svg?branch=master)](https://travis-ci.org/emilianobovetti/stateless-maybe-js)
[![dist/maybe.min.js file size](https://badge-size.herokuapp.com/emilianobovetti/stateless-maybe-js/master/dist/maybe.min.js)](https://github.com/emilianobovetti/stateless-maybe-js/blob/master/dist/maybe.min.js) [![Greenkeeper badge](https://badges.greenkeeper.io/emilianobovetti/stateless-maybe-js.svg)](https://greenkeeper.io/) [![Coverage Status](https://coveralls.io/repos/github/emilianobovetti/stateless-maybe-js/badge.svg?branch=master)](https://coveralls.io/github/emilianobovetti/stateless-maybe-js?branch=master) [![TypeScript](https://img.shields.io/badge/TypeScript-.d.ts-blue.svg)](https://github.com/emilianobovetti/stateless-maybe-js/blob/master/src/maybe.d.ts) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This code was ported to [fpc](https://github.com/emilianobovetti/fpc) as an es6 module. Check [here](https://github.com/emilianobovetti/fpc/blob/master/docs/maybe.md) `fpc`'s `Maybe` docs.

Portable, lightweight, zero-dependency implementation of [maybe monad](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29#The_Maybe_monad) — or [option type](https://en.wikipedia.org/wiki/Option_type) — in vanilla JavaScript.

## Why

There are a bunch of maybe-js libraries, all very similar to each other, so here's why I wrote this one.

- Syntax

    `Maybe`s are collections. I think a reasonable interface should be consistent with the collection interface of the host programming language.

    This choice enforces the least surprise principle:
    When you have to deal with a `Maybe` object you can use `filter`, `map` and `forEach` as you would with an array.
    Think of a `Maybe` as an array of at most one element.

- Stateless

    I tried to follow functional paradigm as much as possible.

    Every `Maybe` object is an instance of `Just` or `Nothing`, which one is decided during creation. Once an object is created it will never be explicitly modified by the library.

    The wrapped value, anyway, is not side effect free: `filter`, `map` and `forEach` will apply a function on that value. Functions passed to those methods shouldn't modify the wrapped value (as far as possible) in order to keep everything stateless.

- Portability

    This code could work nearly anywhere, natively:

    Here's my test environment for [IE6](https://github.com/emilianobovetti/stateless-maybe-js-ie6-test-env).

    Here TypeScript [type definitions](https://github.com/emilianobovetti/stateless-maybe-js/blob/master/src/maybe.d.ts).

    Besides you don't need a whole FP framework to simply create a `Maybe`, the [minified](https://github.com/emilianobovetti/stateless-maybe-js/blob/master/dist/maybe.min.js) version is lightweight.

- Type consistency

    One thing I don't like in other approaches is that sometimes you can't tell the type of an expression at a glance.

    Every method here returns either a `Maybe` *or* a non-`Maybe` value, and I think this property helps a lot method chaining.

- Information hiding

    When the wrapped value is publicly exposed the user code can still do something like

    ```javascript
    if (maybe.value == null) {
      // ...
    }
    ```

    nullifying the purpose of the library.

    Here, on the other hand, the wrapped value is hidden and user code has to rely on public methods and properties.

Read more on [design](DESIGN.md).

## Installation

```
$ npm install stateless-maybe-js
```

For browser installation all you need is to include the script:

```html
<script type="text/javascript" src="path/to/dist/maybe.min.js"></script>
```

or require in node:

```javascript
const maybe = require('stateless-maybe-js');
```

## Build

A Makefile will call yarn for you and then [uglify-js](https://github.com/mishoo/UglifyJS2) to produce `./dist/maybe.min.js`. Just point your console to the project path and run `make`.

## How to create new Maybe

`maybe(someValue)` creates a new `Maybe` object wrapping `someValue`.

If `someValue` is `null` or `undefined` the result will be a `Nothing` instance, otherwise it'll be `Just(someValue)`.

```javascript
var m1 = maybe('hello, world');
var m2 = maybe(undefined);
var m3 = maybe(null);

m1.empty; // false
m2.empty; // true
m3.empty; // true
```

`Maybe` objects aren't nested by constructor function.

```javascript
var m = maybe('hello, world');

// when maybe() receives a maybe monad
// it simply returns the maybe itself
m === maybe(m); // true
```

If the emptiness definition isn't trivial (i.e. `null` or `undefined`), you can use `maybe.nothing` and `maybe.just()`.

```javascript
function maybeYoungPeople (people, maxAge, atLeast) {
  var areYoung = people
    .reduce((acc, p) => acc && p.age <= maxAge, true);

  if (people.length >= atLeast && areYoung) {
    return maybe.just(people);
  } else {
    return maybe.nothing;
  }
}

var people = [ { age: 10 }, { age: 15 } ];

maybeYoungPeople(people, 16, 2).empty; // false
maybeYoungPeople(people, 14, 2).empty; // true
maybeYoungPeople(people, 16, 3).empty; // true
```

Note that `maybe.just()`, unlike `maybe()`, doesn't make any check. A `Just` instance is *always* created.

```javascript
// `Maybe`s *can* contain null or undefined
var m1 = maybe.just(null);

m1.empty; // false
m1.get(); // null

var m2 = maybe('hello, world');

// `Maybe`s *can* be nested with `maybe.just()`
m2 !== maybe.just(m2);
m2 === maybe.just(m2).get();
```

In a nutshell with `maybe.just()` you are explicitly asking for a `Just` instance.

If you want to be sure the wrapped value isn't `null` or `undefined`, avoid `maybe.just()`.

```javascript
var m = notSure === 0
  ? maybe.nothing
  : maybe(notSure);
```

## Check if a value is a Maybe

```javascript
maybe.isInstance(null); // false
maybe.isInstance(maybe(null)); // true
```

## Type specific constructors

All type-specific constructors also unbox their value before making checks, so `0` and `Object(0)` are treated identically.

### `maybe.string(value)`
Checks if `typeof value` is `string` and it's not an empty string.

```javascript
maybe.string(1) === maybe.nothing;
maybe.string('') === maybe.nothing;

maybe.string(Object('hello')).get() === 'hello';
```

### `maybe.number(value)`
Returns `maybe.just(value)` if `typeof value === 'number'` and `value` isn't `NaN`.

```javascript
// strings are *not* numbers
maybe.number('1') === maybe.nothing;
maybe.number(0/0) === maybe.nothing;
maybe.number(NaN) === maybe.nothing;

maybe.number(Object(1)).get() === 1;
```

### `maybe.object(value)`
Checks if `typeof value` is `object` and it's not `null`.

```javascript
maybe.object('') === maybe.nothing;
maybe.object(null) === maybe.nothing;

maybe.object(Object('hello')) === maybe.nothing;
maybe.object(Object(1)) === maybe.nothing;
```

## Using Maybes

```javascript
function maybeGetUser (id) {
  // ...

  return maybe(user);
}

// get user's date of birth or 'unknown'
// if user doesn't exist or user.dateOfBirth
// doesn't exist, is null or undefined
maybeGetUser(id)
  .map(user => user.dateOfBirth)
  .getOrElse('unknown');
```

You can use the `maybe()` function to wrap a lot of useful objects.

```javascript
function maybeGetElementById (id) {
  return maybe(document.getElementById(id));
}

// remove an element if exist
maybeGetElementById('some-id')
  .forEach(element => element.remove());

// get header's height or 0
maybeGetElementById('header-id')
  .map(header => header.offsetHeight)
  .getOrElse(0);

// execute a function if an element exist
// or another function if it doesn't
maybeGetElementById('some-other-id')
  .forEach(e => console.log('element found!'))
  .orElse(() => console.log('element not found'));

// maybe.toString() returns an empty string
// on nothing
maybeGetElementById('some-node')
  .map(e => e.innerText)
  .toString();
```

Dealing with many `Maybe`s seems hard at first and nesting functions might seem the only way to go. In this case `filter` could be a good option.
For example we could write a function to update meta description only if the meta tag exists and the given description is a non-empty string:

```javascript
// plain javascript
function updateMetaDescription (desc) {
  var metaDescription = document.getElementById('meta-description');

  if (metaDescription !== null && typeof desc === 'string' && desc !== '') {
    metaDescription.setAttribute('content', desc);
  }
}

// now nesting maybe.forEach
function updateMetaDescription (desc) {
  maybe(document.getElementById('meta-description'))
    .forEach(function (element) {
      maybe.string(desc).forEach(function () {
        // okay, this is worse
        element.setAttribute('content', desc);
      });
    });
}

// using maybe.filter
function updateMetaDescription (desc) {
  maybe(document.getElementById('meta-description'))
    .filter(() => maybe.string(desc).nonEmpty)
    .forEach(el => el.setAttribute('content', desc));
}
```

## Other usage examples

- [stateless-maybe-js in react](https://codepen.io/emilianobovetti/pen/GBgMVw?editors=0010)

- [Cache function result](https://gist.github.com/emilianobovetti/9245d6b0c3dc03461446fadc6a3c75da)

- [Touch event handler](https://github.com/emilianobovetti/hearweart/blob/6e9f150bcd225b9af9a636e6e267d3699578fa14/assets/js/main.js#L151)

## Properties

### `maybe.empty`
`true` if the maybe is `nothing`, `false` otherwise.

### `maybe.nonEmpty`
Negation of `maybe.empty`.

## Methods

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

## TypeScript

Since `2.1.0` TypeScript is also supported:

```ts
import * as maybe from 'stateless-maybe-js';

// Optionally import `Maybe` interface for type annotations
import { Maybe } from 'stateless-maybe-js';

// Instead of `maybe()` we can use `maybe.from()`.
let maybeStr: Maybe<string> = maybe.from('1');

// `filter` method won't change the type, so this assignment is valid
maybeStr = maybeStr.filter(str => str.trim() !== '');

function parseNum(str: string): Maybe<number> {
    const parsed = parseFloat(str);

    return isNaN(parsed) ? maybe.nothing : maybe.just(parsed);
}

let maybeNum: Maybe<number> = maybeStr.map(parseNum).forEach(console.log);
```
