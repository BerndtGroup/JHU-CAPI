'use strict'

// main.js
// browser entrypoint, initialization of modules

import $ from 'jquery'
window.$ = window.jQuery = $

import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
window.debounce = debounce
window.throttle = throttle


// Project Modules
import Tiles from 'modules/macro/tiles/tiles.js'
import Header from 'layout/header/header.js'
import ImageBlockModal from 'modules/macro/image-block-modal/image-block-modal.js'
import NavContent from 'modules/macro/nav-content/nav-content.js'

$('html').removeClass('no-js')

$('.js-header').each(function(index, wrap) {
    Header().init({
        wrap: wrap
    })
})

$('.js-tiles').each(function(index, wrap) {
    Tiles().init({
        wrap: wrap
    })
})

$('.js-nav-content-wrap').each(function(index, wrap) {
    NavContent().init({
        wrap: wrap
    })
})

$('.js-image-block-modal').each(function(index, wrap) {
    ImageBlockModal().init({
        wrap: wrap
    })
})
