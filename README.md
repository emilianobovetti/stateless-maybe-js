stateless-maybe-js
==================

This is a porting of the [maybe monad](https://en.wikipedia.org/wiki/Monad_%28functional_programming%29#The_Maybe_monad), or [option type](https://en.wikipedia.org/wiki/Option_type), in JavaScript.

There are a bunch of maybe-js libraries, all very similar to each other, so here's why I wrote this one:

1. Stateless: I tried to follow functional paradigm as much as possible. Once an object is created it will be never modified by the library, instead new `maybe`s are created when needed. The wrapped value, anyway, is not side effect free: `filter`, `map` and `forEach` will apply a function on that value, but if you use functions without side effects in this context you'll get real stateless monads!

2. Syntax: with least surprise principle in mind I tried to use a well established syntax, similar to Scala's [Option](https://www.scala-lang.org/api/current/scala/Option.html) type. `filter`, `map` and `forEach` should sound and look familiar, and I think this really improves code readability.

3. Simplicity: no fancy functions that would require crazy tests or updates, the code is trivial, anyone can read and modify as needed.

4. Robustness: I'm trying to test as much as possible. Beside that no `this` or `new` were harmed in the writing of this library. `maybe('hello')`, `maybe.call({}, 'hello')` and `maybe.apply(null, [ 'hello' ])` will just produce the same result. Isn't it cool?

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
const maybe = require('stateless-maybe-js');
```

## Build

A Makefile will call yarn for you and then uglifyjs to produce `./dist/maybe.min.js`. Just point your console to the project path and run `make`.

Since I'm really lazy `make test` is a shortcut for `yarn run test`.

## How to create new Maybe

`maybe(someValue)` creates a new maybe object wrapping `someValue`. By default `nothing` is returned if the value is `null` or `undefined`.

The `maybe` function takes a second optional argument that can change the *emptiness* definition. <br>
E.g.: `maybe(0, 0) === maybe.nothing`

You can also use a function here if emptiness is non trivial. E.g.:

```javascript

var isEmpty = function (value) {
    return value === null || value === undefined || value === 0;
};

maybe(0, isEmpty).empty // true
```

`Maybe`s aren't nested by constructor function.

```javascript
var m = maybe('hello, world');

// when maybe() receives a maybe monad
// just returns itself
m === maybe(m); // true
```

You can get `nothing` reference directly from `maybe.nothing` if you want, no need to call functions, `nothing` is stateless so only one object exists.

You can get a `just` instance by calling `maybe.just(someValue)`. Pay attention: in this way no emptiness check are made, a `just` instance is always created.

```javascript
var m = maybe.just(null);

m.empty // false
m.get() // null
```

This could be useful to create maybe monads when the emptiness logic is non trivial. E.g.:

```javascript
var maybeYoungPeople = function (people, maxAge, atLeast) {
    var areYoung = people
        .reduce((acc, p) => acc && p.age <= maxAge, true);

    if (people.length >= atLeast && areYoung) {
        return maybe.just(people);
    } else {
        return maybe.nothing;
    }
};

var people = [ { age: 10 }, { age: 15 } ];

maybeYoungPeople(people, 16, 2).empty; // false
maybeYoungPeople(people, 14, 2).empty; // true
maybeYoungPeople(people, 16, 3).empty; // true
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
var maybeGetUser = function (id) {
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

You can use the `maybe` function to wrap a lot of useful objects. E.g.:

```javascript
var maybeGetElementById = function (id) {
    return maybe(document.getElementById(id));
};

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

If there are a lot of objects wrapped in `maybe`s, then it might seem hard to handle them and nesting functions might seem the only way to go. In this case `filter` could be a good option.
For example we could write a function to update meta description only if the meta tag exists and the given description is a non-empty string:

```javascript
// plain javascript
var updateMetaDescription = function (desc) {
    var metaDescription = document.getElementById('meta-description');

    if (metaDescription !== null && typeof desc === 'string' && desc !== '') {
        metaDescription.setAttribute('content', desc);
    }
};

// now nesting maybe.forEach
var updateMetaDescription = function (desc) {
    maybe(document.getElementById('meta-description'))
        .forEach(function (element) {
            maybe.string(desc).forEach(function () {
                // okay, this is worse
                element.setAttribute('content', desc);
            });
        });
};

// using maybe.filter
var updateMetaDescription = function (desc) {
    maybe(document.getElementById('meta-description'))
        .filter(() => maybe.string(desc).nonEmpty)
        .forEach((el) => el.setAttribute('content', desc));
};
```

## Maybe object properties

### `maybe.type`
Contains the string `'maybe'`.

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
