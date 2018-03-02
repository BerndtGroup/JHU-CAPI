'use strict';

export default function() {

    var _self,
        wrap;

    return {

        init: function(options) {
            _self = this;

            if (options.wrap) {
                wrap = options.wrap;
            }

            if (wrap) {
                _self.bindUIActions();
            }
        },

        bindUIActions: function() {
            wrap.on('click', _self.events.wrapClick);
        },

        events: {
            wrapClick: function() {
                console.log('1');
            }
        }

    };

}
