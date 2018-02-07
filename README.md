stateless-maybe-js
==================

This is a porting of the maybe monad, or [option type](https://en.wikipedia.org/wiki/Option_type), in JavaScript.

## Installation

```HTML
<script type="text/javascript" src="path/to/maybe.js"></script>
```

## How to create new Maybe

`maybe(someValue)` creates a new maybe object wrapping `someValue`, by default a `nothing` is returned if the value is `null` or `undefined`.

The `maybe` function takes a second optional argument that can change the *emptiness* definition. <br>
E.g.: `maybe(0, 0) === maybe.nothing`

If another maybe is passed to the `maybe` function, the maybe object itself is returned. <br>
If the second argument is callable then it's applied to `value` and a `nothing` is returned if it yields false.

`maybe.nothing` is a `nothing` instance.

`maybe.just(someValue)` returns a new `just` wrapping `someValue`.

## Using Maybes

```javascript
function getUser(id) {
    ...

    // if `user` is undefined or null
    // `nothing` is returned
    return maybe(user);
}

// get user's date of birth
// or 'unknown' if user doesn't exist
// or property doesn't exist
getUser(...)
    .map(user => user.dateOfBirth)
    .getOrElse('unknown');
```

## Maybe object properties

### `maybe.type`
Contains the string `'maybe'`.

### `maybe.empty`
`true` if the maybe is a `nothing`, false otherwise.

### `maybe.nonEmpty`
Negation of `maybe.empty`.

### `maybe.filter(Function fn)`
If the maybe is non-empty and the given function returns false on its value, returns a `nothing`.
Returns the maybe itself otherwise.

### `maybe.map(Function fn)`
If the maybe is non-empty returns another maybe wrapping the result of the function applied to the maybe value.
Returns `nothing` otherwise.

### `maybe.forEach(Function fn)`
Applies the given function to the value if non-empty, does nothing otherwise.
Returns maybe itself.

### `maybe.get()`
Returns the value of the maybe or throws an `Error` if the maybe is empty.

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
Return the value casted to string id the maybe is non-empty, the empty string otherwise.
