/*
 *
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ($, window, document, undefined) {

    'use strict';

    // Create the defaults once
    var pluginName = 'timeout';

    var defaults = {

        // delay between input and invocation
        delay: 500,

        // whether or not to invoke the callback on focus lost
        blur: false,

        // whether or not to invoke the callback on enter
        enter: false,

        //
        start: null,

        //
        callback: null,
    };

    // The actual plugin constructor
    function Timeout(element, options) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(Timeout.prototype, {
        init: function () {

            //
            this.registerInput();

            //
            if(this.settings.blur) {
                this.registerBlur();
            }

            //
            if(this.settings.enter) {
                this.registerEnterPress();
            }
        },

        //
        registerInput: function(){
            var $this = this;
            $(this.element).on('input paste drop cut keydown', function(){
                return $this.onInput.call($this);
            });
        },

        //
        registerEnterPress: function(){
            var $this = this;
            $(this.element).keydown(function(e){
                if(e.which === 13){
                    return $this.onTimeout.call($this);
                }
            });
        },

        //
        registerBlur: function(){
            var $this = this;
            $(this.element).blur(function(){
                return $this.onTimeout.call($this);
            });
        },

        //
        startTimer: function(){
            if(this.timer === null){
                var $this = this;
                this.timer = setTimeout(function(){
                    return $this.onTimeout();
                }, this.settings.delay);
            }
        },

        //
        stopTimer: function(){
            clearTimeout(this.timer);
            this.timer = null;
        },

        //
        onTimeout: function(){
            this.stopTimer();
            return this.settings.callback.call(this.element);
        },

        //
        restartTimer: function(){
            this.stopTimer();
            this.startTimer();
        },

        //
        onInput: function () {

            //
            if(this.settings.start !== null){
                this.settings.start.call(this.element);
            }

            var text = $(this.element).val();
            if (text) {
                this.restartTimer();
            }
        }
    });

    $.fn[pluginName] = function (options) {
        return this.each(function() {
            return new Timeout(this, options);
        });
    };

})(jQuery, window, document);
