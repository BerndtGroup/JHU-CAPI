'use strict';

export default function() {

    var $body = $('body'),
        activeSlideIndex = 0,
        _self,
        $wrap,
        internal,
        $ui

    return {

        init: function(options) {
            _self = this

            if (options.wrap) {
                $wrap = $(options.wrap)
            }

            if ($wrap) {
                $ui = {
                    nextBtn: $wrap.find('.js-image-block-modal__next'),
                    previousBtn: $wrap.find('.js-image-block-modal__previous'),
                    toggleBtn: $body.find('.js-image-block__expand-toggle'),
                    slides: $wrap.find('.js-image-block-modal__slide'),
                    totalSlides: $wrap.find('.js-image-block-modal__slide').length,
                };

                internal = {
                    isOpen: false
                };

                _self.bindUIActions();
            }
        },

        bindUIActions: function() {
            if ($ui.toggleBtn) {
                $ui.toggleBtn.on('click', _self.events.toggleBtnClick);
                $ui.toggleBtn.on('keypress', _self.events.toggleBtnClick);
                $ui.nextBtn.on('click', _self.events.nextBtnClick);
                $ui.previousBtn.on('click', _self.events.previousBtnClick);
                $body.on('click', function(e) {
                    _self.closeModal(e);
                });
            }
        },

        events: {
            toggleBtnClick: function(e) {
                var index = $('.js-image-block__expand-toggle').index(this);
                e.preventDefault();
                _self.toggleModal(index);
            },

            nextBtnClick: function(e) {
                e.preventDefault();
                _self.showNextSlide();
            },

            previousBtnClick: function(e) {
                e.preventDefault();
                _self.showPreviousSlide();
            }
        },

        toggleModal: function(index) {
            if ($wrap.hasClass('is-closed')) {
                _self.openModal(index);
            } else if ($wrap.hasClass('is-open')) {
                _self.closeModal(index);
            }
        },

        showSlide: function(index) {
            $ui.slides.removeClass('is-active');
            $ui.nextBtn.removeClass('is-active');
            $ui.previousBtn.removeClass('is-active');
            $ui.slides.eq(index).addClass('is-active');
            activeSlideIndex = index;
        },

        showNextSlide: function(e) {
            var nextSlideIndex = activeSlideIndex + 1 >= $ui.totalSlides ? 0 : activeSlideIndex + 1;
            e && e.preventDefault();
            _self.showSlide(nextSlideIndex);
        },

        showPreviousSlide: function(e) {
            var prevSlideIndex = activeSlideIndex - 1 < 0 ? $ui.totalSlides - 1 : activeSlideIndex - 1;
            e && e.preventDefault();
            _self.showSlide(prevSlideIndex);
        },

        openModal: function(index) {
            $wrap.removeClass('is-closed');
            $wrap.addClass('is-open');
            $body.addClass('no-scroll');
            setTimeout(function() { internal.isOpen = true; }, 50);
            _self.showSlide(index);
            $body.on('touchmove', function(e) {
                e.preventDefault()
            });
        },

        closeModal: function(e) {
            e.preventDefault();

            if (internal.isOpen && !$(e.target).closest('.js-image-block-modal__next, .js-image-block-modal__previous, .js-image-block__expand-toggle, .js-image-block-modal__text').length) {
                $wrap.removeClass('is-open').addClass('is-closed');
                $body.removeClass('no-scroll');
                $body.off('touchmove');
                internal.isOpen = false;
            }
        }
    }
}
