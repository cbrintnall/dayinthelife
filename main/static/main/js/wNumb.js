(function (factory) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define([], factory);

    } else if ( typeof exports === 'object' ) {

        // Node/CommonJS
        module.exports = factory();

    } else {

        // Browser globals
        window.wNumb = factory();
    }

} (function() {
	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}


		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			// return passAll(options, formatTo, input);
			var hor = Math.floor(input / 60);
			if (hor > 12) {
				hor -= 12;
			} else if (hor == 0) {
				hor = 12;
			}
			var min = Math.floor(input % 60);
			var date = hor.toString() + ":" + min.toString();
			if (date.slice(-1) == "0" && min != 30) {
				date += 0;
			}
			return date;
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	return wNumb;
}));
