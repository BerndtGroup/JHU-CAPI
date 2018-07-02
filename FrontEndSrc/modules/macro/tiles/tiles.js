'use strict';

export default function() {

    var _self,
        $wrap,
        $ui

    return {

        init: function(options) {
            _self = this

            if (options.wrap) {
                $wrap = $(options.wrap)
            }

            if ($wrap) {
                $ui = {
                    tiles: $wrap.find('.js-tile')
                }

                _self.bindUIActions()
            }
        },

        bindUIActions: function() {
            $ui.tiles.on('mouseenter', _self.events.tileHover)
            $ui.tiles.on('mouseleave', _self.events.tileClose)
            $ui.tiles.on('focus', _self.events.tileOpen)
        },

        events: {
            tileHover: function(e) {
                $($(e.target).closest('.js-tile')).toggleClass('is-open')
            },

            tileOpen: function(e) {
                $($(e.target).closest('.js-tile')).addClass('is-open')
            },

            tileClose: function(e) {
                $($(e.target).closest('.js-tile')).removeClass('is-open')
            },
        }
    }
}
