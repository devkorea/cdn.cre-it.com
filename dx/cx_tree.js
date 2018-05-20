

        (function(app_) {

	app_.widget('ui.cx_tree', {
        options : {
              degug: false
            , expand_char: '+'
            , collapse_char: '-'
            , collapse_tree: true
            , add__expand_all: true
            , add__collapse_all: true
            , expand_all_text: 'Expand All'
            , collapse_all_text: 'Collapse All'
        },
        cfg : {
              version: '0.0.0.1'
        },
        mod : {},
        row : [],
        tr : {},        // cx_grid.row.tr



        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		async_row: function(action_, ul_, rows_) {
            try {
                if (this.options.debug) console.log('cx_tree.async_row');
                var _self = this, is_start = false, _check = -1, _display = '', rowindex = 0;
//console.clear();
//console.info(rows_);
//console.error(_self.tr);
////console.error(_self.row);

                $.each(rows_, function (idx1_, row_) {
                    if (row_ == undefined) {
                        //console.error(idx1_, 'undefined');
                        return true;
                    }

                    if (row_.constructor == Object) {
                        if (ul_.get(0) == row_.ul.get(0)) {
                            $.each(row_.tr, function (idx2_, idx_) {
                                if (_self.row[idx_] != undefined && _self.row[idx_].constructor == Object) {
                                    //_self.async_row(action_, _self.row[idx_].ul, _self.row[idx_]);
                                    if (action_ != _self.tr[idx_].data('toggle')) {
                        if (action_ == 'expand' && ul_.css('display') == 'none') {
//console.error(ul_.css('display'), ul_.get(0));
                            return;
                        }
                                        _self.tr[idx_].toggle();    // 자신도 토글
                                        _self.tr[idx_].data('toggle', action_);
                                    } else {

                                    }
                                    _self.async_row(action_, _self.row[idx_].ul, _self.row[idx_]);
                                } else {
                                    if (action_ != _self.tr[idx_].data('toggle')) {
                                        // 부모를 확인해 닫혔다면 토글 안함
//console.error(ul_.css('display'), ul_);
//console.error(action_);
                        if (action_ == 'expand' && ul_.css('display') == 'none') {
//console.error(ul_.css('display'), ul_.get(0));
                            return;
                        }

                                        _self.tr[idx_].toggle();    // 자신도 토글
                                        _self.tr[idx_].data('toggle', action_);
                                    } else {

                                    }
                                }
                            });
                        }
                    } else if (row_.constructor == Array) {

                        $.each(row_, function (idx1_, idx_) {
                            if (_self.row[idx_] != undefined && _self.row[idx_].constructor == Object) {
                                //_self.async_row(action_, _self.row[idx_].ul, _self.row[idx_]);
                                if (action_ != _self.tr[idx_].data('toggle')) {
                        if (action_ == 'expand' && ul_.css('display') == 'none') {
//console.error(ul_.css('display'), ul_.get(0));
                            return;
                        }
                                    _self.tr[idx_].toggle();    // 자신도 토글
                                    _self.tr[idx_].data('toggle', action_);
                                } else {

                                }
                                _self.async_row(action_, _self.row[idx_].ul, _self.row[idx_]);
                            } else {
//console.error(action_);
                        if (action_ == 'expand' && ul_.css('display') == 'none') {
//console.error(ul_.css('display'), ul_.get(0));
                            return;
                        }

                                if (action_ != _self.tr[idx_].data('toggle')) {
                                    _self.tr[idx_].toggle();    // 자신도 토글
                                    _self.tr[idx_].data('toggle', action_);
                                } else {
                                }

                            }
                        });
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.async_row ■■■';
            }
		},  // cx_tree.async_row

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		expand: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.expand');
                var _self = this;
                branch.siblings('span').removeClass('collapse').addClass('expand');
                method = method || 'instant';
                branch = branch.jquery ? branch : $(branch, this.element);
                this.__expand(branch, method);
                this.async_row('expand', branch, _self.row);
//console.error(22222, method);
//                var a = branch.siblings('span').children('.' + this.cfg.expand_link_class);
//                this._set_link_to__collapse(a);
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
		__expand: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.__expand');
                if(method == 'instant') {
                    branch.show();
                } else if(method == 'slide') {
                    branch.slideDown();
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.__expand ■■■';
            }
		},  // cx_tree.__expand

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		collapse: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.collapse');
                var _self = this;
                branch.siblings('span').removeClass('expand').addClass('collapse');
                method = method || 'instant'
                branch = branch.jquery ? branch : $(branch, this.element);
                this.__collapse(branch, method);
                this.async_row('collapse', branch, _self.row);
//                var a = branch.siblings('span').children('.' + this.cfg.collapse_link_class);
//                this._set_link_to__expand(a);
////                this._trigger('collapse', 0, branch)
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.collapse ■■■';
            }
		},  // cx_tree.collapse

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		__collapse: function(branch, method) {
            try {
                if (this.options.debug) console.log('cx_tree.__collapse');
                if(method == 'instant') {
                    branch.hide();
                } else if(method == 'slide') {
                    branch.slideUp();
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.__collapse ■■■';
            }
		},  // cx_tree.__collapse








        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_add__collapse_all_link: function() {
            try {
                if (this.options.debug) console.log('cx_tree._add__collapse_all_link');
                var _self = this;
                var a__collapse_all = $('<a class="' + this.cfg.collapse_all_link_class + '" href="#">' + this.options.collapse_all_text + '</a>');
                this.element.before(a__collapse_all);
                a__collapse_all.click(function() {
                    $('ul', _self.element).hide();
                    if(!_self.options.with_root) { _self.element.children('ul').show(); };
                    _self.update();
                    _self._trigger('collapse_all', 0, _self.element);
                    return false;
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._add__collapse_all_link ■■■';
            }
		},  // // cx_tree._add__collapse_all_link

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_add__expand_all_link: function() {
            try {
                if (this.options.debug) console.log('cx_tree._add__expand_all_link');
                var _self = this;
                var a__expand_all = $('<a class="' + this.cfg.expand_all_link_class + '" href="#">' + this.options.expand_all_text + '</a>');
                this.element.before(a__expand_all);
                a__expand_all.click(function() {
                    $('ul', _self.element).show();
                    _self.update();
                    _self._trigger('expand_all', 0, _self.element);
                    return false;
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._add__expand_all_link ■■■';
            }
		},  // cx_tree._add__expand_all_link

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
		is__collapsed: function(ui_) {
            try {
                if (this.options.debug) console.log('cx_tree.is__collapsed');
                ui_ = ui_.jquery ? ui_ : $(ui_, this.element);
                return ui_.is(':hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.is__collapsed ■■■';
            }
		},  // cx_tree.is__collapsed

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_set_link_to__collapse: function(a) {
            try {
                if (this.options.debug) console.log('cx_tree._set_link_to__collapse');
                var _self = this;
                a.removeClass(this.cfg.expand_link_class)
                a.addClass(this.cfg.collapse_link_class);
                a.html(this.options.collapse_char);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._set_link_to__collapse ■■■';
            }
		},  // cx_tree._set_link_to__collapse

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		_set_link_to__expand: function(a) {
            try {
                if (this.options.debug) console.log('cx_tree._set_link_to__expand');
                var _self = this;
                a.removeClass(this.cfg.collapse_link_class)
                a.addClass(this.cfg.expand_link_class);
                a.html(this.options.expand_char);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree._set_link_to__expand ■■■';
            }
		},  // cx_tree._set_link_to__expand

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
		set_tree: function() {
            try {
                if (this.options.debug) console.log('cx_tree.set_tree');
                var _self = this, rowindex = 1;
                this.find_root();
                $('span', this.element).css('cursor', 'default');
//                if(this.options.collapse_tree) {    // 노드가 열려있으면 닫아주기
                if (_self.cfg.tree.open == 'collapse') {    // 노드가 열려있으면 닫아주기
                    $('ul', this.element).hide();
                    this.element.children('ul').show();
                }
//console.error(_self.options.parent.row.tr.length);
//                _self.row = [];
                $('ul', this.element).each(function(idx_) {
                    var ul = $(this);
//console.error(ul, ul.children('li').length, idx_);
                    // tree 가 열리거나 닫힐때 따라 움직일 row
//                    _self.row[idx_] = {'ul':ul, 'tr':[_self.options.parent.row.tr[rowindex++]]};

//                    for(var i=0; i<ul.children('li').length; i++)
//                    for(var i=0; i<ul.children('li').children('ul').children('li').length; i++)
//                        rowindex++;
//                        _self.row[idx_].tr.push(rowindex++);
//                    console.error(_self.row.length);
//                    _self.row.push(ul);
//                    _self.li = ul;
//                    _self.row.ul = ul;
                    var span = ul.siblings('span');
                    if (ul.children('li').length == 0) {
//                        console.log(ul.children('span'));
                        //span.addClass('child');
//                        span.children('a.' + common_link_class).remove();
                    } else {
//console.error(span);
//console.error(ul.get(0));
//console.error(ul.get(0), ul.children('li').length, span.get(0));
                        span.addClass(_self.cfg.tree.open);
                        span.click(function() {
                            _self.is__collapsed(ul) ? _self.expand(ul) : _self.collapse(ul);
                            return false;
                        });

                        $.each(ul.children('li'), function (idx_, item_) {
                            if ($(item_).children('ul').length == 0) {
                                // tree 가 열리거나 닫힐때 따라 움직일 row
//                                _self.row[_self.row.length-1].tr.push(_self.options.parent.row.tr[rowindex++]);
//                                _self.row[_self.row.length-1].tr.push(rowindex++);
//                        console.error(_self.row[_self.row.length-1].tr);
//                    _self.li.push($(this));

                                $(item_).children('span').addClass('child');
//                                console.error($(item_).children('span'));
                            }
                            //console.log(idx_, item_, $(item_).children('ul').length);
                        });

//                        var required_link_class = _self.is__collapsed(ul) ? _self.cfg.expand_link_class : _self.cfg.collapse_link_class;
//                        var a = span.children('a.' + required_link_class);
//                        if(a.length == 0) {
//                            span.children('a.' + _self.cfg.common_link_class).remove();
//                            var character;
//                            if (_self.is__collapsed(ul)) {
//                                character = _self.options.expand_char;
//                            } else {
//                                character = _self.options.collapse_char;
//                            }
//                            a = $('<a href="#" class="' + required_link_class + ' ' + _self.cfg.common_link_class + '">' + character + '</a>');
//                            //span.prepend(a);
//                            //a.click(function() {
//                            span.addClass('collapse');
//                            span.click(function() {
//                                _self.is__collapsed(ul) ? _self.expand(ul) : _self.collapse(ul);
//                                return false;
//                            });
//                        }
                    }
                });
                this.element.show();


//                var ll = this.element.find('li');
//                $.each(ll, function (idx_, item_) {
//                    if (idx_ > 0)
//                        _self.row[rowindex].toggle()
//                    rowindex++;
//                });
//$.each(_self.row, function (idx_, item_) {
//
//  console.log(idx_, item_.ul.get(0), item_.tr);
//});
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.set_tree ■■■';
            }
		}, // cx_tree.set_tree
        /*----------------------------------------------
        * @cx_tree
            -9: root
             0: 형제만 있거나 마지막
             1: 자손있음
            -1: 다음이 조상, 즉 자손없음
        * @returns  {void}
        ----------------------------------------------*/
		draw_tree: function(data_) {
            try {
                if (this.options.debug) console.log('cx_tree.draw_tree');
                var _self = this, i=0, is_close = false;
                _self.tr = _self.options.parent.row.tr;
                _self.row = [];
//console.error(data_);
                    //_self.row[idx_] = {'ul':ul, 'tr':[]};
                var _root = $('<ul>'), _ul = [], _li = [], _pidx = -1;
                $.each(data_, function (idx_, row_) {
                    _pidx = row_['tree_pidx'];
                    switch (row_.tree_node) {
                    case -9:    // root (row_[_self.cfg.tree.value]);
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (root: '+row_['depth']+')</span>'));

                        _ul[idx_] = $('<ul>');
                        _li[idx_].append(_ul[idx_]);
                        _root.append(_li[idx_]);
                        _self.row[idx_] = {'ul':_ul[idx_], 'tr':[]};
                        break;
                    case -2:    // 마지막 (자신의 부모를 닫음)
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (마지막: '+row_['depth']+')</span>'));
                        _ul[_pidx].append(_li[idx_]);
                        _self.row[_pidx].tr.push(idx_);
                        break;
                    case -1:    // 다음이 조상, 즉 형제도 자손도 없음
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (다음조상: '+row_['depth']+')</span>'));
                        _ul[_pidx].append(_li[idx_]);
                        _self.row[_pidx].tr.push(idx_);
                        break;
                    case 10:     // 첫번째 자식
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (첫자식: '+row_['depth']+')</span>'));
                        _ul[_pidx].append(_li[idx_]);
                        _self.row[_pidx].tr.push(idx_);
                        break;
                    case 11:     // 형제
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (형제: '+row_['depth']+')</span>'));
                        _ul[_pidx].append(_li[idx_]);
                        _self.row[_pidx].tr.push(idx_);
                        break;
                    case 1:     // 자손있음 (ul 을 오픈시켜줌) - 닫히는 놈도 포함됨
                        _li[idx_] = $('<li>');
                        _li[idx_].append($('<span data-rowindex="'+idx_+'">'+row_['tree_node'] + ' / '+row_['oid']+' (내가자식: '+row_['depth']+')</span>'));
                        _ul[idx_] = $('<ul>');
                        _li[idx_].append(_ul[idx_]);
                        _ul[_pidx].append(_li[idx_]);
                        _self.row[_pidx].tr.push(idx_);
                        _self.row[idx_] = {'ul':_ul[idx_], 'tr':[]};

                        break;
                    }
                });
//console.error(_self.row);
                this.element.append(_root);
//                this.element.show();
                this.set_tree();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.draw_tree ■■■';
            }
		},  // cx_tree.draw_tree

        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		make_tree: function(data_) {
            try {
                if (this.options.debug) console.log('cx_tree.make_tree');
                var _self = this;
                var _html = '<ul><li>'+data_[_self.cfg.tree.value]+'</li>';


//                    if (item_.tree == 1)
//                $.each(data_, function (idx_, item_) {
//
//
////                        _html += _self.make_tree();
//                  console.log(idx_, item_);
//                });
//                return _html + '</ul>';
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.make_tree ■■■';
            }
		},  // cx_tree.make_tree


        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		set_data: function(param_) {
            try {
                if (this.options.debug) console.log('cx_tree.set_data');
                param_['act'] = this.element.attr('id');
                var _res = app_.submit({'act':this.cfg.act, data:param_, now_tab:this.cfg.now_tab, debug:false});
                this.callback_search(_res);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.set_data ■■■';
            }
		},  // cx_tree.set_data
        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
		callback_search: function(res_) {
            try {
                if (this.options.debug) console.log('cx_tree.callback_search');
//console.error(res_);
//console.error(this.cfg);
                if (res_ != false && res_.result === true) {
                    this.element.html(res_.data);
                } else {
                    this.element.html('');
                }
                this.set_tree();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.callback_search ■■■';
            }
		},  // cx_tree.callback_search








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
                this.clear();
                var _self = this;
                this.cfg = $.extend(this.cfg, this.options.cfg);
                this.mod = $.extend(this.mod, this.options.mod);
                this.row = [];
                this.li = {};

                if (_self.cfg.tree == undefined || _self.cfg.tree.key == undefined || _self.cfg.tree.value == undefined || _self.cfg.tree.open == undefined)
                    throw '■■■ error: cx_tree._init -> undefined cfg.tree(key, value, open)  ■■■';

                if (this.cfg.mytab < 0) // 탭이 없으면 -1
                    this.cfg.pt_idx = this.cfg.p;
                else
                    this.cfg.pt_idx = this.cfg.p + '' + this.cfg.mytab;

//console.error(this.cfg);

//this.set_tree();
//                this.find_root();
//                $('span', this.element).css('cursor', 'default');
//                if(this.options.collapse_tree) {    // 노드가 열려있으면 닫아주기
//                    $('ul', this.element).hide();
//                    this.element.children('ul').show();
//                }
//                this.set_tree();
//                this.element.show();
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
        /*----------------------------------------------
        * @cx_tree
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_tree.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , expand_link_class : 'ui-tree-expand'
                    , collapse_link_class : 'ui-tree-collapse'
                    , common_link_class : 'ui-tree-handler'
                    , expand_all_link_class : 'ui-tree-expand-all'
                    , collapse_all_link_class : 'ui-tree-collapse-all'
                    , draggable_over_class : 'ui-tree-draggable-over'
                },
                this.mod = {};
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tree.clear ■■■';
            }
        },  // cx_tree.clear

	});
        })(cxApp);
