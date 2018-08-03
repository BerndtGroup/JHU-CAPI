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
                    tiles: $wrap.find('.js-tile'),
                    links: $wrap.find('.js-tile a')
                }

                _self.bindUIActions()
            }
        },

        bindUIActions: function() {
            $ui.tiles.on('mouseenter', _self.events.tileOpen)
            $ui.tiles.on('mouseleave', _self.events.tileClose)
            if ($ui.links.length > 0) {
                $ui.links.on('focus', _self.events.tileOpen)
                $ui.links.on('blur', _self.events.tileClose)
            }
        },

        events: {
            tileOpen: function(e) {
                $(e.target).closest('.js-tile').addClass('is-open')
            },

            tileClose: function(e) {
                $(e.target).closest('.js-tile').removeClass('is-open')
            },
        }
    }
}
