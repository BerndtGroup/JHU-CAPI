'use strict';

// const detectMobile = () => {
//     const mobileCheck = setInterval(() => {
//     }, 150)
// }

// detectMobile()

// $(window).on('resize', debounce(detectMobile(), 150))
const Media = () => {
    const detectIE =  () => {
        var ua = window.navigator.userAgent

        var msie = ua.indexOf('MSIE ')
        if (msie > 0) {
            // IE 10 or older
            return true
        }

        var trident = ua.indexOf('Trident/')
        if (trident > 0) {
            // IE 11
            return true
        }

        return false
    }

    const detectEdge = () => {
        if (/Edge\/\d+/i.test(navigator.userAgent)) {
            return true
        }
    }

    const detectiOS = () => {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            return true
        }
    }

    const detectFirefox = () => {
        if (/firefox/i.test(navigator.userAgent)) {
            return true
        }
    }

    const detectMobileSafari = () => {
        const ua = window.navigator.userAgent
        const iOS = !!ua.match(/iP(ad|hone)/i)
        const webkitUa = !!ua.match(/WebKit/i)

        if (iOS && webkitUa && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i)) {
            return true
        }
    }

    const detectMobileChrome = () => {
        const ua = window.navigator.userAgent
        const iOS = !!ua.match(/iP(ad|hone)/i)
        const webkitUa = !!ua.match(/WebKit/i)

        if (iOS && webkitUa && ua.match(/CriOS/i) && !ua.match(/OPiOS/i)) {
            return true
        }
    }

    const detectSafari = () => {
        const ua = window.navigator.userAgent
        const webkitUa = !!ua.match(/Version\/[\d\.]+.*Safari/)

        return webkitUa
    }

    const iOSversion = () => {
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
            const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/)
            return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
        } else {
            return false
        }
    }

    return {
        _init: () => {
            var iOSv = iOSversion()
            if (iOSv) {
                if (iOSv[0] >= 11) {
                    $('html').addClass('is-iOS-11')
                    Window.isiOS11 = true
                }
            } else {
                Window.isiOS11 = false
            }

            if (detectSafari()) {
                $('html').addClass('is-safari')
                Window.isSafari = true
            } else {
                Window.isSafari = false
            }

            if (detectMobileSafari()) {
                $('html').addClass('is-mobile-safari')
                Window.isMobileSafari = true
            } else {
                Window.isMobileSafari = false
            }

            if (detectMobileChrome()) {
                $('html').addClass('is-mobile-chrome')
                Window.isMobileChrome = true
            } else {
                Window.isMobileChrome = false
            }

            if (detectIE()) {
                $('html').addClass('is-ie')
                Window.isIE = true
            } else {
                Window.isIE = false
            }

            if (detectEdge()) {
                $('html').addClass('is-edge')
                Window.isEdge = true
            } else {
                Window.isEdge = false
            }

            if (detectiOS()) {
                $('html').addClass('is-iOS')
                Window.isiOS = true
            } else {
                Window.isiOS = false
            }

            if (detectFirefox()) {
                $('html').addClass('is-firefox')
                Window.isFirefox = true
            } else {
                Window.isFirefox = false
            }
        }
    }
}

module.exports = Media
