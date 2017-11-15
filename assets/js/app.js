/**
 * Main entry file for app logic
 */

// Apply SVG polyfill to load external SVG's in unsupported browsers
require('svgxuse');

// Global functions
require('./global/_global');

// Config
app.config = {
	breakpoints: {
		sm: 30,
		md: 40,
		lg: 60,
		xl: 74
	}
};

'use strict';

(function (window, document, app, $) {
    /**
     * Generic helper and utility methods
     * Do not use for site-specific logic
     *
     * @type {Object}
     */
    app.util = {
        /**
         * Useful environment variable to see if we're dealing with a touch device
         *
         * @author Boye Oomens <boye@e-sites.nl>
         * @type {Boolean}
         */
        isTouchDevice: function () {
            var msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture,
                touch = (( 'ontouchstart' in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch);

            return !!touch;
        }



    };
}(window, document, app, jQuery));