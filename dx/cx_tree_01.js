

        (function(app_) {

	app_.widget('ui.cx_tree', {
        options : {
              degug: false
            , expand_char: '+'
            , collapse_char: '-'
            , collapse_tree: true
            , add_expand_all: true
            , add_collapse_all: true
            , expand_all_text: 'Expand All'
            , collapse_all_text: 'Collapse All'
        },
        cfg : {
              version: '0.0.0.1'
            , expand_link_class : 'ui-tree-expand'
            , collapse_link_class : 'ui-tree-collapse'
            , common_link_class : 'ui-tree-handler'
            , expand_all_link_class : 'ui-tree-expand-all'
            , collapse_all_link_class : 'ui-tree-collapse-all'
            , draggable_over_class : 'ui-tree-draggable-over'

        },



        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		expand: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.expand');
                var _self = this;
                method = method || 'instant'
                branch = branch.jquery ? branch : $(branch, this.element);
                this._expand(branch, method);
                var a = branch.siblings('span').children('.' + this.cfg.expand_link_class);
                this._set_link_to_collapse(a);
//                this._trigger('expand', 0, branch)
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.expand ■■■';
            }
		},  // cx_tree.extend

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_expand: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree._expand');
                if(method == 'instant') {
                    branch.show();
                } else if(method == 'slide') {
                    branch.slideDown();
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._expand ■■■';
            }
		},  // cx_tree._expand

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		collapse: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.collapse');
                var _self = this;
                method = method || 'instant'
                branch = branch.jquery ? branch : $(branch, this.element);
                this._collapse(branch, method);
                var a = branch.siblings('span').children('.' + this.cfg.collapse_link_class);
                this._set_link_to_expand(a);
//                this._trigger('collapse', 0, branch)

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.collapse ■■■';
            }
		},  // cx_tree.collapse

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_collapse: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree._collapse');
                if(method == 'instant') {
                    branch.hide();
                } else if(method == 'slide') {
                    branch.slideUp();
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._collapse ■■■';
            }
		},  // cx_tree._collapse

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_add_collapse_all_link: function() {
            try {
                if (this.options.debug) console.log('cx_tree._add_collapse_all_link');
                var _self = this;
                var a_collapse_all = $('<a class="' + this.cfg.collapse_all_link_class + '" href="#">' + this.options.collapse_all_text + '</a>');
                this.element.before(a_collapse_all);
                a_collapse_all.click(function() {
                    $('ul', _self.element).hide();
                    if(!_self.options.with_root) { _self.element.children('ul').show(); };
                    _self.update();
                    _self._trigger('collapse_all', 0, _self.element);
                    return false;
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._add_collapse_all_link ■■■';
            }
		},  // // cx_tree._add_collapse_all_link

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_add_expand_all_link: function() {
            try {
                if (this.options.debug) console.log('cx_tree._add_expand_all_link');
                var _self = this;
                var a_expand_all = $('<a class="' + this.cfg.expand_all_link_class + '" href="#">' + this.options.expand_all_text + '</a>');
                this.element.before(a_expand_all);
                a_expand_all.click(function() {
                    $('ul', _self.element).show();
                    _self.update();
                    _self._trigger('expand_all', 0, _self.element);
                    return false;
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._add_expand_all_link ■■■';
            }
		},  // cx_tree._add_expand_all_link

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
        set_drag: function() {
            try {
                if (this.options.debug) console.log('cx_tree.set_drag');
                var _self = this;
                var draggable_options = {};
                draggable_options.handle = options.handle_for_dragging + ':first';
                draggable_options.cursor = 'move';
                if($.browser.opera) {
                    draggable_options.stop = function(event, ui) {
                        ui.helper.attr('style', 'position: relative');
                    }
                } else {
                    draggable_options.revert = 'invalid';
                }
                $('li', _self.element).draggable(draggable_options);
                $(options.handle_for_dragging, _self.element).droppable({
                    over: function() {
                        $(this).addClass(draggable_over_class);
                    },
                    tolerance: 'pointer',
                    out: function() {
                        $(this).removeClass(draggable_over_class);
                    },
                    drop: function(event, ui) {
                        $(this).removeClass(draggable_over_class);
                        var li = $(this).closest('li');
                        if(li.length == 0) { li = _self.element; };
                        var ul = li.children('ul');
                        if(ul.length == 0) { ul = $('<ul></ul>'); li.append(ul); };
                        ui.draggable.appendTo(ul);
                        ui.draggable.attr('style', 'position: relative');
                        _self.update();
                        _self._trigger('drop', 0, {draggable: ui.draggable, droppable: li});
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.set_drag ■■■';
            }
		},  // cx_tree.set_drag

        //==============================================================================================
        // method
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
        update: function() {
            try {
                if (this.options.debug) console.log('cx_tree.update');
			    this._build_tree_handlers();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.update ■■■';
            }
		},  // cx_tree.update

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		is_collapsed: function(branch) {
            try {
                if (this.options.debug) console.log('cx_tree.is_collapsed');
                branch = branch.jquery ? branch : $(branch, this.element);
                return branch.is(':hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.is_collapsed ■■■';
            }
		},  // cx_tree.is_collapsed

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_set_link_to_collapse: function(a) {
            try {
                if (this.options.debug) console.log('cx_tree._set_link_to_collapse');
                var _self = this;
                a.removeClass(this.cfg.expand_link_class)
                a.addClass(this.cfg.collapse_link_class);
                a.html(this.options.collapse_char);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._set_link_to_collapse ■■■';
            }
		},  // cx_tree._set_link_to_collapse

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_set_link_to_expand: function(a) {
            try {
                if (this.options.debug) console.log('cx_tree._set_link_to_expand');
                var _self = this;
                a.removeClass(this.cfg.collapse_link_class)
                a.addClass(this.cfg.expand_link_class);
                a.html(this.options.expand_char);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._set_link_to_expand ■■■';
            }
		},  // cx_tree._set_link_to_expand

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_parent: function() {
            try {
                if (this.options.debug) console.log('cx_tree._parent');
                var parent;
                if(this.options.with_root) {
                    parent = this.element.parent();
                } else {
                    parent = this.element;
                }
                return parent;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._parent ■■■';
            }
		},  // cx_tree._parent

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		find_root: function() {
            try {
                if (this.options.debug) console.log('cx_tree.find_root');
                if(this.element.children('span').length > 0) {
                    this.options.with_root = true
                } else {
                    this.options.with_root = false
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.find_root ■■■';
            }
		},  // cx_tree.find_root

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_build_tree_handlers: function() {
            try {
                if (this.options.debug) console.log('cx_tree._build_tree_handlers');
                var _self = this;
                var self = this.element;
                $('ul', this.element).each(function() {
                    var ul = $(this);
                    var span = ul.siblings('span');
                    if(ul.children('li').length == 0) {
                        span.children('a.' + common_link_class).remove();
                    } else {
                        var required_link_class = _self.is_collapsed(ul) ? _self.cfg.expand_link_class : _self.cfg.collapse_link_class;
                        var a = span.children('a.' + required_link_class);
                        if(a.length == 0) {
                            span.children('a.' + _self.cfg.common_link_class).remove();
                            var character;
                            if (_self.is_collapsed(ul)) {
                                character = _self.options.expand_char;
                            } else {
                                character = _self.options.collapse_char;
                            }
                            a = $('<a href="#" class="' + required_link_class + ' ' + _self.cfg.common_link_class + '">' + character + '</a>');
                            span.prepend(a);
                            a.click(function() {
                                _self.is_collapsed(ul) ? _self.expand(ul) : _self.collapse(ul);
                                return false;
                            });
                        }
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._build_tree_handlers ■■■';
            }
		}, // cx_tree._build_tree_handlers

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_tree._create');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._create ■■■';
            }

        },  // cx_tree._create

		_init: function() {
            try {
                if (this.options.debug) console.log('cx_tree._init');
                this.find_root();
//console.error(this._parent().children('ul'));
                if(this.options.collapse_tree) {    // 노드가 열려있으면 닫아주기
                    $('ul', this.element).hide();
                    this.element.children('ul').show();
//                    this._parent().children('ul').show();
                }
                this._build_tree_handlers();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._init ■■■';
            }
		},  // cx_tree._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_tree.destroy');
                this.element.removeAttr('some-...');
                $._self.prototype.destroy.apply( this, arguments);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.destroy ■■■';
            }
        },  // cx_tree.destroy

		set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_tree.cfg');
			    this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.cfg ■■■';
            }
		},  // cx_tree.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_tree.cfg');
			    this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.cfg ■■■';
            }
		},  // cx_tree.cfg

	});
        })(cxApp);
