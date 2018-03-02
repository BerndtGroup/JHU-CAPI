'use strict';

// main.js
// browser entrypoint, initialization of modules

// Polyfills
import 'classlist-polyfill';

// Utilities
import $ from './imports/bling.js';

// Project Modules
import Portlet from 'modules/macro/portlet/portlet.js';


document.querySelector('html').classList.remove('no-js');


$('.js-portlet').forEach(function(wrap) {
    Portlet().init({
        wrap: wrap
    });
});
