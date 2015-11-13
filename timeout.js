/**
 * Input Timeout JQuery Plugin
 *
 * Makes it easy to handle an event that fires after a text input's value is updated, given a delay threshold.
 * This is useful for fields that make HTTP requests on input, such as autocomplete fields and fields that update
 * a model as the user changes a value.
 *
 * @author Rudolf Theunissen <rudolf.theunissen@gmail.com>
 * @license MIT <http://opensource.org/licenses/mit-license.php>
 * @link https://github.com/rtheunissen/jquery-input-timeout
 * @version 2.0.0
 */
;(function($, window, document) {

    'use strict';

    var defaults = {

        // delay between input and triggering a timeout event
        delay: 500,

        // whether or not to trigger a timeout event on focus lost
        blur: false,

        // whether or not to trigger a timeout event on enter
        enter: false,
    };

    /**
     * Constructor to create a new timeout input object
     */
    function Timeout(element, options, callback) {

        // set this element as the input object
        this.element = element;

        // check if options were skipped
        if ($.isFunction(options)) {
            callback = options;
            options = {};
        }

        // initialize the options specified for this instance
        this.setOptions(options);

        // register the callback that was or wasn't provided
        this.registerCallback(callback);

        // register the input events on the given element
        this.registerInput();

        // register the keydown event to trigger a timeout on enter
        this.registerEnter();

        // register the blur event for when the element loses focus
        this.registerBlur();
    }

    /**
     * Extend the Timeout prototype to prevent prototype conflicts
     */
    $.extend(Timeout.prototype, {

        /**
         * Sets this instance's options as an extension of the defaults
         */
        setOptions: function(options) {
            this.options = $.extend({}, defaults, options);
        },

        /**
         * Register the given callback to be called on timeout
         */
        registerCallback: function(callback) {
            return callback && this.element.on('timeout', callback);
        },

        /**
         * Called when the delay has passed, so stop the timer and trigger the event
         */
        onTimeout: function() {
            this.stopTimer();
            this.element.trigger('timeout');
        },

        /**
         * Triggered on a keydown event, and checks if the key was the 'enter' key
         */
        onKeyDown: function(event) {
            if (event.which === 13) {
                return this.onTimeout();
            }
        },

        /**
         * Triggered when the text value of the input element has been updated
         */
        onTextInput: function() {
            return this.restartTimer();
        },

        /**
         * Defines the events for which to listen to in order to determine a text update
         */
        getInputEvents: function() {
            return 'input paste drop cut change';
        },

        /**
         * Registers event listeners on the input to trigger a text update handler
         */
        registerInput: function() {
            this.element.on(this.getInputEvents(), $.proxy(this.onTextInput, this));
        },

        /**
         * Registers the event to trigger a timeout when the enter key is pressed
         */
        registerEnter: function() {
            return this.options.enter && this.element.keydown($.proxy(this.onKeyDown, this));
        },

        /**
         * Registers the event to trigger a timeout when the input loses focus
         */
        registerBlur: function() {
            return this.options.blur && this.element.blur($.proxy(this.onTimeout, this));
        },

        /**
         * Creates a new timer to trigger a timeout event when the timer delay passes
         */
        createTimer: function() {
            return setTimeout($.proxy(this.onTimeout, this), this.options.delay);
        },

        /**
         * Starts a new timer is the timer is not currently running
         */
        startTimer: function() {
            return this.timer || (this.timer = this.createTimer());
        },

        /**
         * Clears the timer and falsifies its state to indicate that it's not running
         */
        stopTimer: function() {
            clearTimeout(this.timer);
            this.timer = false;
        },

        /**
         * Simply stops and starts the timer for an effective restart
         */
        restartTimer: function() {
            this.stopTimer();
            this.startTimer();
        },
    });

    // register the 'timeout' function on the global JQuery object
    $.fn['timeout'] = function(options, callback) {
        return this.each(function() {
            return new Timeout($(this), options, callback);
        });
    };

})(jQuery, window, document);
