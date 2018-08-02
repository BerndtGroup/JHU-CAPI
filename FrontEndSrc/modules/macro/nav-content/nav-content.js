'use strict';

export default function() {

    var $window = $(window),
        $document = $(document),
        $body = $('body'),
        _self,
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
                    header: $body.find('.js-header'),
                    navGuide: $body.find('.js-nav-guide'),
                    links: $wrap.find('.js-nav-content__item'),
                    navSections: $body.find('.js-nav-section')
                }

                _self.bindUIActions();
            }
        },

        bindUIActions: function() {
            $ui.links.on('click', _self.navLinkClick);
            $window.on('load resize scroll', _self.updateNavState);
            $window.on('load resize scroll', _self.updateSelectedNavLink);
        },

        setActiveNavLink: function($activeLink) {
            $activeLink.parent().addClass('is-active');
        },

        updateNavState: function() {
            if ($document.scrollTop() + window.innerHeight < $ui.navGuide.offset().top && $(this).scrollTop() > $('.l-content-primary').offset().top + parseInt($('.rtf').css('marginTop')) - $ui.header.outerHeight()) {
                $wrap.addClass('is-sticky');
            } else {
                $wrap.removeClass('is-sticky');
            }
        },

        updateSelectedNavLink: function() {
            var currentPosition = $(this).scrollTop();

            $ui.navSections.each(function() {
                var $section = $(this),
                    id = $section.attr('id'),
                    $link = $('a[href="#' + id + '"]'),
                    top = $(this).offset().top - $ui.header.outerHeight(),
                    bottom = top + $(this).outerHeight();

                if (currentPosition >= top && currentPosition <= bottom) {
                    $ui.links.parent().removeClass('is-active');
                    _self.setActiveNavLink($link);
                }
            });
        },

        scrollTo: function(target) {
            $('html, body').animate({
                scrollTop: $(target).offset().top - $ui.header.height()
            }, 500);
        },

        navLinkClick: function(e) {
            var $link = $(this),
                target = $link.attr('href'),
                isActive = $link.parent().hasClass('is-active');

            if (isActive) {
                return;
            }

            e.preventDefault();
            _self.scrollTo(target);
        }
    };
}
