/*
 * This file is part of OptionJS.
 *
 * OptionJS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * OptionJS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with OptionJS.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function () {
    'use strict';

    var successfulAssertionCounter = 0,
        errorAssertionCounter = 0,

        some = OPTION.some(0),
        none = OPTION.none;

    function showAssertionResult (expected, actual) {
        var testResultsElement = document.getElementById('test-results-table'),
            rowElement = testResultsElement.insertRow(testResultsElement.rows.length),
            assertionCaller;

        try {
            throw new Error;
        } catch (e) {
            assertionCaller = e.stack.replace('Error\n', '').split('\n')[2].trim();
        }

        function __show (value) {
            if (value && value.defined) {
                return 'Some(' + value.get() + ')';
            } else if (value && value.empty) {
                return 'None';
            } else {
                return JSON.stringify(value);
            }
        }

        rowElement.insertCell(0).innerHTML = assertionCaller;
        rowElement.insertCell(1).innerHTML = __show(expected);
        rowElement.insertCell(2).innerHTML = __show(actual);
        rowElement.insertCell(3).innerHTML = expected === actual;
    }

    function assertEquals (expected, actual) {
        if (expected === actual) {
            successfulAssertionCounter++;
        } else {
            errorAssertionCounter++;
            console.error('Assertion error. expected: ', expected, ' actual: ', actual);
        }

        showAssertionResult(expected, actual);
    }

    ////////////////
    // TestCreate //
    ////////////////

    (function testCreateFromNone () {
        assertEquals(none, OPTION(none));
    })();

    (function testCreateFromSome () {
        assertEquals(some, OPTION(some));
    })();

    (function testCreateNoneFromNull () {
        assertEquals(none, OPTION(null));
    })();

    (function testCreateNoneFromUndefined () {
        assertEquals(none, OPTION(undefined));
    })();

    (function testCreateNoneWithCustomEmptyValue () {
        assertEquals(none, OPTION(0, 0));
    })();

    (function testCreateNoneWithCustomEmptyValue () {
        var option = OPTION(0, function (x) { return x === 0; });

        assertEquals(none, option);
    })();

    (function testCreateSome () {
        assertEquals(0, OPTION(0).get());
    })();

    (function testCreateSomeWithCustomEmptyValue () {
        assertEquals(null, OPTION(null, 0).get());
    })();

    (function testCreateSomeWithCustomEmptyCallback () {
        var option = OPTION(null, function (x) { return x === 0; });

        assertEquals(null, option.get());
    })();

    /////////////////
    // TestForEach //
    /////////////////

    (function testForEachOnNone () {
        var called = false;

        none.forEach(function (x) { called = true; });

        assertEquals(false, called);
    })();

    (function testForEachOnSome () {
        var value;

        OPTION(0).forEach(function (x) { value = x; });

        assertEquals(0, value);
    })();

    ////////////////
    // TestFilter //
    ////////////////

    (function testFalseFilterOnNone () {
        assertEquals(none, none.filter(function (x) { return false; }));
    })();

    (function testFalseFilterOnSome () {
        assertEquals(none, some.filter(function (x) { return false; }));
    })();

    (function testTrueFilterOnNone () {
        assertEquals(none, none.filter(function (x) { return true; }));
    })();

    (function testTrueFilterOnSome () {
        assertEquals(some, some.filter(function (x) { return true; }));
    })();

    /////////////
    // TestGet //
    /////////////

    (function testGetOnNone () {
        var throwed = false;

        try {
            none.get();
        } catch (e) {
            throwed = true;
        }

        assertEquals(true, throwed);
    })();

    (function testGetOnSome () {
        assertEquals(0, OPTION(0).get());
    })();

    ///////////////////
    // TestGetOrElse //
    ///////////////////

    (function testGetOrElseOnSome () {
        assertEquals(0, OPTION(0).getOrElse(1));
    })();

    (function testGetOrElseOnNone () {
        assertEquals(0, none.getOrElse(0));
    })();

    (function testGetOrElseOnSomeWithCallback () {
        assertEquals(0, OPTION(0).getOrElse(function () { return 1; }));
    })();

    (function testGetOrElseOnNoneWithCallback () {
        assertEquals(0, none.getOrElse(function () { return 0; }));
    })();

    ////////////////////
    // TestGetOrThrow //
    ////////////////////

    (function testGetOrThrowOnSome () {
        assertEquals(0, OPTION(0).getOrThrow(new Error));
    })();

    (function testGetOrThrowOnSome () {
        var throwed = false;

        try {
            none.getOrThrow(new Error);
        } catch (e) {
            throwed = true;
        }

        assertEquals(true, throwed);
    })();

    /////////////////
    // TestDefined //
    /////////////////

    (function testDefinedOnSome () {
        assertEquals(true, some.defined);
    })();

    (function testDefinedOnNone () {
        assertEquals(false, none.defined);
    })();

    ///////////////
    // TestEmpty //
    ///////////////

    (function testEmptyOnSome () {
        assertEquals(false, some.empty);
    })();

    (function testEmptyOnNone () {
        assertEquals(true, none.empty);
    })();

    /////////////
    // TestMap //
    /////////////

    (function testIdentityOnNone () {
        assertEquals(none, none.map(function (x) { return x; }));
    })();

    (function testIdentityOnSome () {
        assertEquals(some.get(), some.map(function (x) { return x; }).get());
    })();

    (function testIdentityOptionOnNone () {
        assertEquals(none, none.map(function (x) { return OPTION(x); }));
    })();

    (function testIdentityOptionOnSome () {
        assertEquals(some.get(), some.map(function (x) { return OPTION(x); }).get());
    })();

    ////////////////
    // TestOrElse //
    ////////////////

    (function testOrElseOnSome () {
        assertEquals(some, some.orElse(0));
    })();

    (function testOrElseOnNone () {
        assertEquals(0, none.orElse(0).get());
    })();

    (function testOrElseOnSomeWithCallback () {
        assertEquals(0, OPTION(0).orElse(function () { return 1; }).get());
    })();

    (function testOrElseOnNoneWithCallback () {
        assertEquals(0, none.orElse(function () { return 0; }).get());
    })();

    ///////////////////
    // show counters //
    ///////////////////

    document.getElementById('successful-assertion-counter').innerHTML = successfulAssertionCounter;
    document.getElementById('error-assertion-counter').innerHTML = errorAssertionCounter;

})();
