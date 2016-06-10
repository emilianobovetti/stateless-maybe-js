OptionJS
========

This is a porting of the [option type](https://en.wikipedia.org/wiki/Option_type) in JavaScript.

## Installation

```HTML
<script type="text/javascript" src="path/to/option.js"></script>
```

## Creating Options

`OPTION(value, empty)` creates a new Option object based on the value.
The second parameter is optional, by default a None is returned if the value is `null` or `undefined`, or an `OPTION.some(value)` otherwise.

This behavior can be changed with the second parameter.
E.g. `OPTION(0, 0) === OPTION.none`

If another option is passed to the OPTION function, the option itself is returned.

If `empty` is callable then it's applied to `value` and a None is returned if it yields a falsy value.

`OPTION.none` is a None instance.

`OPTION.some(value)` returns a new Some wrapping `value`.

## Option object properties

### `option.type`
Contains the string `'option'`.

### `option.defined`
`true` if the option is non-empty.

### `option.empty`
`true` if the option is empty.

### `option.filter(Function fn)`
If the option is non-empty and the given function returns false on its value, returns a None.
Returns the option itself otherwise.

### `option.map(Function fn)`
If the option is non-empty returns another option wrapping the result of the function applied to the option value.
Returns a None otherwise.

### `option.forEach(Function fn)`
Applies the given function to the option value if non-empty, does nothing otherwise.
Returns Option itself.

### `option.get()`
Returns the value of the option or throws an Error if the Option is empty.

### `option.getOrElse(mixed orElse)`
If the Option is non-empty returns its value, returns `orElse` otherwise.

`orElse` can be:

1. a function - which is called and its result returned if the option is empty.
2. any other value - which is returned in case the option is empty.

### `option.getOrThrow(throwable e)`
Returns the value of the option or throws `e` if the option is empty.

### `option.orElse(mixed orElse)`
Acts like `getOrElse`, but returns an option instead of its value.

### `option.toString()`
Return the value casted to string id the option is non-empty, the empty string otherwise.
