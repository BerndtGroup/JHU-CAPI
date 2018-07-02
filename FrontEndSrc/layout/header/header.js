'use strict';

import ScrollActions from '../../js/imports/scroll-actions.js';

export default function() {

    var _self,
        $wrap,
        $ui;

    return {

        init: function(options) {
            _self = this;

            if (options.wrap) {
                $wrap = $(options.wrap);
            }

            if ($wrap) {
                $ui = {
                    mobileToggle: $wrap.find('.js-hamburger'),
                    primaryNavL1: $wrap.find('.js-nav-primary-l1')
                };

                _self.bindUIActions();
                _self.implementScrollActions();
            }
        },

        bindUIActions: function() {
            $ui.mobileToggle.on('click', _self.events.toggleMobileMenu)
            $ui.primaryNavL1.on('click', _self.events.toggleMobileSubmenu)
        },

        events: {
            toggleMobileMenu: function() {
                $wrap.toggleClass('is-menu-open')
            },

            toggleMobileSubmenu: function(e) {
                $(e.target).closest('.js-nav-primary-l1').toggleClass('is-menu-open')
            }
        },

        implementScrollActions: function() {
            ScrollActions().init({
                actions: [
                {
                    inside: document.body,
                    direction: 'down',
                    fn: function() {
                        $wrap.addClass('is-collapsed')
                    }
                },
                {
                    at: document.body,
                    direction: 'up',
                    length: 200,
                    fn: function() {
                        $wrap.removeClass('is-collapsed')
                    }
                }
             ]
            });
        }
    };
}
