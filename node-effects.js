YUI.add('node-effects', function(Y) {
    
    if (!Y.Lang.isArray(Y.Node.PLUGINS)) {
        Y.Node.PLUGINS = [];
    }
    
    Y.Node.PLUGINS.push(Y.plugin.NodeFX);

    var _end = function(fn) {
        //THIS DOESN'T WORK!!!
        //this.fx.detachAll();
        //this.fx.reset();

        //HACK
        this.unplug(Y.plugin.NodeFX);
        this.fx = null;
        this.plug(Y.plugin.NodeFX);

        if (Y.Lang.isFunction(fn)) {
            fn();
        }
    };

    var _hidden = function() {
        this.addClass('hidden');
        this.setStyle('display', 'none');
    };

    var _show = function() {
        this.removeClass('hidden');
        this.setStyle('display', '');
    };

    Y.Node.prototype.effect = function(name, fn, opt) {
        if (Y.x.Effects.CONFIG[name]) {
            Y.x.Effects._run.call(this, Y.x.Effects.CONFIG[name], fn, opt);
        } else if (Y.x.Effects[name]) {
            Y.x.Effects[name].call(this, fn, opt);
        }
    };
    Y.NodeList.prototype.effect = function(name, fn, opt) {
        if (Y.x.Effects[name]) {
            this.each(function(node) {
                Y.x.Effects[name].call(node, fn, opt);
            });
        }
    };
    
    Y.namespace('x.Effects');
    Y.x.Effects = {
        CONFIG: {
            fade: {
                hide: true,
                attrs: { to: { opacity: 0 }, duration: .5 } 
            },
            appear: {
                show: true,
                attrs: { to: { opacity: 1 }, duration: .5 } 
            },
            pulse: {
                attrs: {
                    to: {
                        opacity: 0
                    },
                    from: {
                        opacity: 1
                    },
                    iterations: 10,
                    duration: .25,
                    direction: 'alternate'
                }
            },
            blindup: {
                hide: true,
                attrs: { to: { height: 0 }, duration: .75 } 
            },
            blindleft: {
                hide: true,
                attrs: { to: { width: 0 }, duration: .75 } 
            },
            shrink: {
                hide: true,
                attrs: { to: { height: 5, width: 5, opacity: 0 } }
            }
        },
        _run: function(config, fn, opts) {
            //Remove when fixed..
            this.fx.set('node', this);
            if (fn) {
                fn = Y.bind(fn, this);
            }
            if (config.hide) {
                this.fx.on('end', Y.bind(_hidden, this));
            }
            if (config.show) {
                this.fx.on('start', Y.bind(_show, this));
            }
            this.fx.after('end', Y.bind(_end, this, fn));

            this.fx.setAttrs(config.attrs).run();
            
        },
        drop: function(fn) {
            var o = {
                hide: true,
                attrs: {
                    to: {
                        top: this.getY() + (this.get('offsetHeight') / 2),
                        opacity: 0
                    },
                    duration: .75
                }
            };
            Y.x.Effects._run.call(this, o, fn)
        },
        blinddown: function(fn, config) {
            if (!config || !config.height) {
                Y.log('You must give a height to expand to.', 'error', 'Effects');
                return;
            }
            Y.x.Effects._run.call(this, {
                attrs: {
                    to: {
                        height: config.height
                    }
                }
            }, fn)
        },
        blindright: function(fn, config) {
            if (!config || !config.width) {
                Y.log('You must give a width to expand to.', 'error', 'Effects');
                return;
            }
            Y.x.Effects._run.call(this, {
                attrs: {
                    to: {
                        width: config.width
                    }
                }
            }, fn)
        },
        fold: function(fn, config) {
            //Remove when fixed..
            this.fx.set('node', this);
            if (fn) {
                fn = Y.bind(fn, this);
            }
            this.fx.on('end', Y.bind(function() {
                //Remove when fixed..
                this.fx.set('node', this);
                this.fx.on('end', Y.bind(_hidden, this));
                this.fx.after('end', Y.bind(_end, this, fn));
                this.fx.setAttrs({ to: { width: 0 }}).run();
            }, this));
            this.fx.after('end', Y.bind(_end, this));
            this.fx.setAttrs({ to: { height: 10 } }).run();
        },
        unfold: function(fn, config) {
            //Remove when fixed..
            this.fx.set('node', this);
            if (fn) {
                fn = Y.bind(fn, this);
            }
            this.fx.on('end', Y.bind(function() {
                //Remove when fixed..
                this.fx.set('node', this);
                this.fx.after('end', Y.bind(_end, this, fn));
                this.fx.setAttrs({ to: { height: config.to.height }}).run();
            }, this));
            this.fx.after('end', Y.bind(_end, this));
            this.setStyle('height', '10px');
            this.fx.setAttrs({ to: { width: config.to.width } }).run();
        },
        shakelr: function(fn) {
            var max = 5, count = 1, offset = -10;
            //Remove when fixed..
            this.fx.set('node', this);
            if (fn) {
                fn = Y.bind(fn, this);
            }
            this.fx.after('end', Y.bind(function() {
                this.fx.detachAll('end');
                var o = offset;
                if (count <= max) {
                    if (count % 2) {
                        o = -(offset);
                    }
                    count++;
                    this.fx.setAttrs({ to: { left: o}, duration: .25, easing: Y.Easing.easeOut }).run();
                } else {
                    this.fx.set('node', this);
                    this.fx.after('end', Y.bind(_end, this));
                    this.fx.setAttrs({ to: { left: 0 }, duration: .25, easing: Y.Easing.easeOut}).run();
                }
            }, this));
            this.fx.setAttrs({ to: { left: offset}, duration: .25, easing: Y.Easing.easeOut }).run();
        },
        shaketb: function(fn) {
            var max = 5, count = 1, offset = -10;
            //Remove when fixed..
            this.fx.set('node', this);
            if (fn) {
                fn = Y.bind(fn, this);
            }
            this.fx.after('end', Y.bind(function() {
                this.fx.detachAll('end');
                var o = offset;
                if (count <= max) {
                    if (count % 2) {
                        o = -(offset);
                    }
                    count++;
                    this.fx.setAttrs({ to: { top: o}, duration: .25, easing: Y.Easing.easeOut }).run();
                } else {
                    this.fx.set('node', this);
                    this.fx.after('end', Y.bind(_end, this));
                    this.fx.setAttrs({ to: { top: 0 }, duration: .25, easing: Y.Easing.easeOut}).run();
                }
            }, this));
            this.fx.setAttrs({ to: { top: offset}, duration: .25, easing: Y.Easing.easeOut }).run();
        },
        grow: function(fn, config) {
            if (!config || !config.width || !config.height) {
                Y.log('You must give a width and a height to expand to.', 'error', 'Effects');
                return;
            }
            Y.x.Effects._run.call(this, {
                attrs: {
                    to: {
                        width: config.width,
                        height: config.height,
                        opacity: 1
                    }
                }
            }, fn)
        },
    };



}, '1.0', { requires: ['node', 'anim'], skinnable:false});
