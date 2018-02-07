stateless-maybe-js
==================

This is a porting of the maybe monad, or [option type](https://en.wikipedia.org/wiki/Option_type), in JavaScript.

There are a bunch of maybe-js libraries, all very similar to each other, so here's why I wrote this one:

1. Stateless: I tried to follow functional paradigm as much as possible. Once an object is created it will be never modified by the library. The wrapped value, anyway, is not side effect free: `filter`, `map` and `forEach` will apply a function on that value, but if you use functions without side effects in this context you'll get real stateless monads!

2. Syntax: with least surprise principle in mind I tried to use a well established syntax, similar to Scala's [Option](https://www.scala-lang.org/api/current/scala/Option.html) type. `filter`, `map` and `forEach` should sound and look familiar, and I think this really improves code readability.

3. Robustness: the code is tested as possible. Beside that no `this` or `new` were harmed in the writing of this library. `maybe('hello')`, `maybe.call({}, 'hello')` and `maybe.apply(null, [ 'hello' ])` will just produce the same result. Isn't it cool?

## Installation

For browser installation all you need is to include the script.

```HTML
<script type="text/javascript" src="path/to/dist/maybe.min.js"></script>
```

## Build

A Makefile will call yarn for you and then uglifyjs to produce `./dist/maybe.min.js`. Just point your console to the project path and run `make`.

Run `make test` if you want tu run all unit tests.

## How to create new Maybe

`maybe(someValue)` creates a new maybe object wrapping `someValue`. By default `nothing` is returned if the value is `null` or `undefined`.

The `maybe` function takes a second optional argument that can change the *emptiness* definition. <br>
E.g.: `maybe(0, 0) === maybe.nothing`

You can also use a function for *emptiness*, e.g.:

```javascript

var isEmpty = function (value) {
    return value === null || value === undefined || value === 0;
};

maybe(0, isEmpty).empty // true
```

`Maybe`s aren't nested. `var m = maybe('hello'); m === maybe(m)`

You can get `nothing` reference directly from `maybe.nothing` if you want, or you can get a `just` instance by calling `maybe.just(someValue)`. Pay attention: in this way no check are done, the object returned is always a `just`, so `maybe.just(null).empty` is `false`!

## Using Maybes

```javascript
function getUser(id) {
    // ...

    return maybe(user);
}

// get user's date of birth
// or 'unknown' if user doesn't exist
// or property doesn't exist
getUser(id)
    .map(user => user.dateOfBirth)
    .getOrElse('unknown');
```

You can use the `maybe` function to wrap a lot of useful objects, e.g.:

```javascript
var maybeGetElementById = function (id) {
    return maybe(document.getElementById(id));
};

// remove element if exist
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
    .toString()
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
