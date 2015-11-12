# Input Timeout JQuery Plugin

![Bower](https://img.shields.io/bower/v/jquery-input-timeout.svg?style=flat-square)

A convenient way to trigger an event after a given timeout when a text element's value is updated. 

This is useful for fields that make HTTP requests on input, such as autocomplete fields and fields that
update a model as the user changes a value. It's aim is to minimize the number of requests while maximizing 
the user experience. It wouldn't be optimal to make a request for every single keystroke.

It also handles drop, paste and cut events.

I haven't done extensive browser support testing for it yet so use with care.

### Install ###
```
bower install jquery-input-timeout
```

### Usage


```js

var options = {
    enter: false, // whether to trigger the callback on enter
    blur:  false, // whether to trigger the callback on focus lost
    delay: 500,   // threshold between input and event trigger
}

/*
 * You can register a callback directly by passing a function
 * as the second parameter to the plugin initializer
 *
 * You can also pass the callback as the first argument,
 * in which case the options will all be set to the default values.
 *
 */
$('input').timeout(options, function(){
    // called when the event is triggered
});

/*
 * Alternatively you can omit the second parameter and handle the 
 * timeout event arbitrarily. Note that the timeout event will be 
 * fired even if an explicit callback function is specified.
 */
$('input').timeout(options);

$('input').on('timeout', function(){
    // called when the event is triggered
});
```

Note: the scope of `this` in the callback will be the target input element.
