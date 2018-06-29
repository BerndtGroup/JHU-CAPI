'use strict';

export default function() {

    var _self,
        actions,
        scrollTimeout,
        state = {};

    return {

        init: function(options) {
            _self = this;

            if (options.actions && options.actions.length) {
                actions = options.actions;

                _self.setPositions();
                _self.bindUIActions();
            }

        },

        bindUIActions: function() {
            // document.body.on('click', _self.events.bodyClick);
            $(document).on('load', _self.events.documentLoad);
            $(window).on('scroll', throttle(_self.events.windowScroll, 50));
            $(window).on('resize', debounce(_self.events.windowResize, 200));
        },

        events: {
            bodyClick: function() {
                window.setTimeout(function() {
                    _self.setPositions();
                    _self.triggerScrollActions();
                }, 500);
            },

            documentLoad: function() {
                _self.setPositions();
                _self.triggerScrollActions();
            },

            windowScroll: function() {
                _self.triggerScrollActions();
                window.clearTimeout(scrollTimeout);

                scrollTimeout = window.setTimeout(function() {
                    _self.triggerScrollActions(true);
                }, 15);
            },

            windowResize: function() {
                _self.setPositions();
                _self.triggerScrollActions();
            }
        },

        setPositions: function() {
            actions.map(function(action) {
                if (action.at) {
                    action.atCoords = action.at.getBoundingClientRect();
                    action.atStart = action.atCoords.top + window.pageYOffset + (action.buffer || 0);
                    action.atEnd = action.length ? action.atCoords.top + window.pageYOffset + (action.buffer || 0) + (action.length || 0) : Infinity;
                }

                if (action.beginningThrough) {
                    action.beginningThroughCoords = action.beginningThrough.getBoundingClientRect();
                    action.beginningThroughStart = 0 + (action.buffer || 0);
                    action.beginningThroughEnd = action.beginningThroughCoords.bottom + window.pageYOffset;
                }

                if (action.inside) {
                    action.insideCoords = action.inside.getBoundingClientRect();
                    action.insideStart = action.insideCoords.top + window.pageYOffset + (action.buffer || 0);
                    action.insideEnd = action.insideCoords.bottom + window.pageYOffset;
                }

                if (action.before) {
                    action.beforeCoords = action.before.getBoundingClientRect();
                    action.beforeStart = 0 + (action.buffer || 0);
                    action.beforeEnd = action.length ? 0 + (action.buffer || 0) + (action.length || 0) : action.beforeCoords.top + window.pageYOffset;
                }

                if (action.after) {
                    action.afterCoords = action.after.getBoundingClientRect();
                    action.afterStart = action.afterCoords.bottom + window.pageYOffset + (action.buffer || 0);
                    action.afterEnd = action.length ? action.afterCoords.bottom + window.pageYOffset + (action.buffer || 0) + (action.length || 0) : Infinity;
                }

                return action;
            });
        },

        triggerScrollActions: function(flushActions) {
            _self.setDirection();

            actions.forEach(function(action, actionIndex) {

                if ((actionIndex !== state.activeActionIndex || flushActions) && _self.actionConditionsAreValid(action)) {
                    _self.triggerAction(action);
                    state.activeActionIndex = actionIndex;
                }
            });
        },

        setDirection: function() {
            state.pageYOffset = state.pageYOffset || window.pageYOffset;

            if (window.pageYOffset < state.pageYOffset) {
                // Added for CIT to reset scrollstart position
                // _self.setPositions();
                state.direction = 'up';
            } else if (window.pageYOffset > state.pageYOffset) {
                state.direction = 'down';
            } else {
                state.direction = 'none';
            }

            state.pageYOffset = window.pageYOffset;
        },

        actionConditionsAreValid: function(action) {
            var valid = true,
                locations = ['at', 'beginningThrough', 'inside', 'before', 'after'],
                i = 0;

            if (action.direction && action.direction !== state.direction) {
                valid = false;
            }

            while (valid && locations[i]) {
                if (action[locations[i]] && (
                    window.pageYOffset < action[locations[i] + 'Start'] ||
                    window.pageYOffset > action[locations[i] + 'End']
                )) {
                    valid = false;
                }

                i++;
            }

            return valid;
        },

        triggerAction: function(action) {
            action.fn();
        }

    };

}
