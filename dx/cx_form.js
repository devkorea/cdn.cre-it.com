        (function(app_) {
    app_.widget('ui.cx_form', {
        options: {
              debug: false

        },
        cfg: {},
        mod: {},
        modi: {},
        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_form.evt_click');
//                this._trigger('evt_click', 0, evt_);
                if (this.options.cfg.multi == false) {
                    switch (item_.type) {
                    case 'label':
                        item_.$obj.cx_label('evt_click', evt_, item_);
                        break;
                    case 'hidden':
                        //item_.$obj.cx_hidden('evt_click', evt_, item_);
                        break;
                    case 'date':
                        item_.$obj.cx_date('evt_click', evt_, item_);
                        break;
                    case 'int':
                        item_.$obj.cx_int('evt_click', evt_, item_);
                        break;
                    case 'float':
                        item_.$obj.cx_float('evt_click', evt_, item_);
                        break;
                    case 'radio':
                        item_.$obj.cx_radio('evt_click', evt_, item_);
                        break;
                    case 'check':
                        item_.$obj.cx_check('evt_click', evt_, item_);
                        break;
                    case 'text':
                        item_.$obj.cx_text('evt_click', evt_, item_);
                        break;
                    case 'combo':
                        item_.$obj.cx_combo('evt_click', evt_, item_);
                        break;
                    case 'button':
                        item_.$obj.cx_button('evt_click', evt_, item_);
                        break;
                    case 'pop':
                        item_.$obj.cx_pop('evt_click', evt_, item_);
                        break;
                    }
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.evt_click ■■■';
            }
        },  // cx_form.evt_click
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_form.evt_keydown');
                //this._trigger('evt_keydown', 0, evt_);
                switch (evt_.keyCode) {
                case 13:
                    var _rowindex = -1;
                    if (this.options.cfg.multi == true) {
                        _rowindex = $(evt_.currentTarget).data('rowindex');
                    }
                    if (item_.required) {
                        if (!item_.$obj.val()) { // cx_combo 때문에
                            //console.error('필수인데 값이 없으므로 이벤트를 처리하지 않음');
                            return false;
                        }
                    }
                    if (typeof item_.check == 'function'){  // 모듈에서 값을 체크함
                        if (item_.check(evt_, item_) == false)
                            return false;
                    }
//console.error(item_.type, item_.id, item_.next_type, item_.$next);
//console.error(item_.check);
                        if (item_.$next) {
                            switch (item_.next_type) {
                            case 'label':
                                item_.$next.cx_label('set_focus', _rowindex);
                                break;
                            case 'hidden':
                                //item_.$next.cx_hidden('set_focus');
                                break;
                            case 'date':
                                item_.$next.cx_date('set_focus', _rowindex);
                                break;
                            case 'int':
                                item_.$next.cx_int('set_focus', _rowindex);
                                break;
                            case 'float':
                                item_.$next.cx_float('set_focus', _rowindex);
                                break;
                            case 'radio':
                                item_.$next.cx_radio('set_focus', _rowindex);
                                break;
                            case 'check':
                                item_.$next.cx_check('set_focus', _rowindex);
                                break;
                            case 'text':
                                item_.$next.cx_text('set_focus', _rowindex);
                                break;
                            case 'combo':
//                            console.error(item_.id, 'form.keydown', item_.$next, item_.next_type);
                                item_.$next.cx_combo('set_focus', _rowindex);
                                break;
                            case 'button':
                                item_.$next.cx_button('set_focus', _rowindex);
                                break;
                            case 'pop': // 여기에서는 팝업에서 처리하도록 keydown 처리를 하지 않음
//console.error(item_.type, item_.id, '건너갑시다 건너가', _rowindex);
//console.error(item_.$next);

                                item_.$next.cx_pop('set_focus', _rowindex);
//                                return false;
                                //                            console.error(222);
                                //item_.$next.cx_pop('set_focus', _rowindex);
                                break;
                            }
                        }
//                    } else {
//                        console.error($(evt_.currentTarget).data('rowindex'));
//                        $.each(item_.$next.$obj, function (idx_, item_) {
//
//                            console.log(idx_, item_, $(item_).data('rowindex'));
//                        });
////console.error(item_.$next);
//
//                    }

                    break;
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.evt_keydown ■■■';
            }
        },  // cx_form.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        reg_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_form.reg_focus_now');
                this.cfg.now_focus = item_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.reg_focus_now ■■■';
            }
        },  // cx_form.reg_focus_now
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_form.set_focus_now');
                if (this.cfg.now_focus)
                    this.__excute(this.cfg.now_focus, 'set_focus');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_focus_now ■■■';
            }
        },  // cx_form.set_focus
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.set_focus');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_form.set_focus -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                this.__excute(this.modi[id_], 'set_focus');
//                this.cfg.now_focus = this.modi[id_];
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_focus ■■■';
            }
        },  // cx_form.set_focus
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.set_hide');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_form.set_hide -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                this.__excute(this.modi[id_], 'set_hide');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_hide ■■■';
            }
        },  // cx_form.set_hide
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.set_show');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_form.set_show -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                this.__excute(this.modi[id_], 'set_show');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_show ■■■';
            }
        },  // cx_form.set_show
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_click: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.set_click');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_form.set_click -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                this.modi[id_].$obj.click();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_click ■■■';
            }
        },  // cx_form.set_click

        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(id_, value_) {
            try {
                if (this.options.debug) console.log('cx_form.set_value');
                if (this.modi[id_] == undefined) {
                    throw '■■■ error: cx_form.set_value -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                }
                this.__excute(this.modi[id_], 'set_value', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_value ■■■';
            }
        },  // cx_form.set_value
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.get_value');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_form.get_value -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                return this.__excute(this.modi[id_], 'get_value');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.get_value ■■■';
            }
        },  // cx_form.get_value

        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        __excute: function(item_, action_, param1_, param2_) {
            try {
                if (this.options.debug) console.log('cx_form.__excute, ', action_);
                if (this.options.cfg.multi == false) {
                    switch (item_.type) {
                    case 'label':
                        return item_.$obj.cx_label(action_, param1_, param2_);
                        break;
                    case 'hidden':
                        return item_.$obj.cx_hidden(action_, param1_, param2_);
                        break;
                    case 'date':
                        return item_.$obj.cx_date(action_, param1_, param2_);
                        break;
                    case 'int':
                        return item_.$obj.cx_int(action_, param1_, param2_);
                        break;
                    case 'float':
                        return item_.$obj.cx_float(action_, param1_, param2_);
                        break;
                    case 'radio':
                        return item_.$obj.cx_radio(action_, param1_, param2_);
                        break;
                    case 'check':
                        return item_.$obj.cx_check(action_, param1_, param2_);
                        break;
                    case 'text':
                        return item_.$obj.cx_text(action_, param1_, param2_);
                        break;
                    case 'combo':
                        return item_.$obj.cx_combo(action_, param1_, param2_);
                        break;
                    case 'button':
                        return item_.$obj.cx_button(action_, param1_, param2_);
                        break;
                    case 'pop':
                        return item_.$obj.cx_pop(action_, param1_, param2_);
                        break;
                    }
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.__excute ■■■';
            }
        },  // cx_form.__excute

        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_next: function() {
            try {
                if (this.options.debug) console.log('cx_form.set_next');
                var _self = this;
                if (_self.cfg.multi == false) {
                    $.each(_self.mod, function (idx_, item_) {
                        if (item_.next) {
                            if (item_.next.match(/^#/g)) {
                                // 다른폼 객체일때
                            } else {
                                if (_self.modi[item_.next] == undefined)
                                    throw '■■■ error: cx_form.set_next -> undefined item (id: '+item_.next+') ■■■';

                                item_.$next = _self.modi[item_.next].$obj;
                                item_.next_type = _self.modi[item_.next].type;

//                                if (_self.modi[item_.next].type == 'combo' && app_.cfg.theme == 'ui') {
//                                    item_.$next = _self.modi[item_.next].$ui;
//                                } else {
//                                    //item_.$next = $('#'+_self.cfg.pt_idx+item_.next);
//                                    item_.$next = _self.modi[item_.next].$obj;
//                                }

//console.error(item_.id, item_.next, item_.next_type, item_.$next);
//console.error(item_.id, item_.next, item_.$next);
                            }
                        }
                        // 각 콤포넌트에 next 설정을 반영
                        _self.__excute(item_, 'set_option', item_);
                    });
                } else {
                        console.error('cx_form.set_next 구현하세요',_self.mod);
                    $.each(_self.mod, function (idx_, item_) {
//                        console.error(item_.$obj[item_.$obj.length-1]);
////                        console.error(item_.$obj);
                        if (item_.next) {
//                            console.info(_self.modi[item_.next].type);
//                            item_.$next = _self.modi[item_.next].$obj[item_.$obj.length-1];
                            $(_self.modi[item_.next].$obj[item_.$obj.length-1]).data('rowindex', item_.$obj.length-1);
                            item_.$next = $(_self.modi[item_.next].$obj[item_.$obj.length-1]);
                            item_.next_type = _self.modi[item_.next].type;
                        }
                    });
                }

//$.each(this.modi, function (idx_, item_) {
//
//  console.log(idx_, item_.$obj.attr('id'));
//});
//console.error(this.modi);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_next ■■■';
            }
        },  // cx_form.set_next


        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        get_item: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.get_item');
                if (id_ == undefined || id_ == '')
                    return this.modi;
                else {
                    if (this.modi[this.cfg.pt_idx+id_] == undefined)
                        throw '■■■ error: cx_form.get_item -> undefined item '+id_+' ■■■';
                    return this.modi[this.cfg.pt_idx+id_];
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.get_item ■■■';
            }
        },  // cx_form.get_item
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        get_values: function() {
            try {
                if (this.options.debug) console.log('cx_form.get_values');
                var _self = this, _param = {};
                if (this.cfg.multi == false) {
                    $.each(_self.mod, function (idx_, item_) {
                        if (item_.type == 'button') return true;
                        _param[item_.id] = _self.__excute(_self.modi[item_.id], 'get_value');
                    });
                } else {

                }
                return _param;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.get_values ■■■';
            }
        },  // cx_form.get_value
        /*----------------------------------------------
        * @cx_form
        * @param  {json}
        * @returns  {void}
        ----------------------------------------------*/
        set_values: function(data_) {
            try {
                if (this.options.debug) console.log('cx_form.set_values');
                var _self = this;
                if (this.cfg.multi == false) {
                    if (data_.constructor != Array && data_.constructor != Object) {
                        console.info(data_);
                        throw '■■■ error: cx_form.set_values -> (unknown param, using {id:, value:} || [{id:, value:},{id:, value:}]) ■■■';
                    } else {
                        if (data_.constructor == Array) {
                            $.each(data_, function (idx_, row_) {
                                _self.__set_values(row_);
                            });
                        } else if (data_.constructor == Object) {
                            _self.__set_values(data_);
                        }
                    }
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_values ■■■';
            }
        },  // cx_form.set_values

        /*----------------------------------------------
        * @cx_form set data core
        * @param  {}
        ----------------------------------------------*/
        __set_values: function(row_) {
            try {
                if (this.options.debug) console.log('cx_form.__set_values');
                var _self = this;
                $.each(row_, function (key_, value_) {
                    if (_self.modi[key_] != undefined) {
                        _self.__excute(_self.modi[key_], 'set_value', value_);
                    }
                });
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_form.set_data core ■■■';
            }
        },  // cx_form.__set_values

        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_form.set_clear');
                var _self = this;
                if (this.cfg.multi == false) {
                    $.each(_self.modi, function (key_, value_) {
                        if (_self.modi[key_] != undefined) {
                            _self.__excute(_self.modi[key_], 'set_clear');
                        }
                    });
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.set_clear ■■■';
            }
        },  // cx_form.set_clear
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        popup_close: function(id_) {
            try {
                if (this.options.debug) console.log('cx_form.popup_close');
                var _self = this;
                if (_self.modi[id_] == undefined) {
                    throw '■■■ error: cx_pop.popup_close -> undefined item '+this.element.attr('id')+'.'+id_+' ■■■';
                }
//console.error(_self.modi[id_]);
                _self.modi[id_].$obj.cx_pop('popup_close');
//                _self.evt_keydown(null, _self.modi[_self.modi[id_].next]);
//console.error(_self.modi[id_]);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.popup_close ■■■';
            }
        },  // cx_form.popup_close

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_form._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form._create ■■■';
            }
        },  // cx_form._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_form._init');
                if (this.element.closest('table, div').length < 1) {
//                    console.error(this.element.closest('table'));
//                    throw '■■■ error: undefined html object ('+this.element.attr('id')+') ■■■';
                }

                this.clear();
                var _self = this, _evt = {'click':true, 'keydown':true};
                this.options.cfg = app_.init_cfg(this.options.cfg); // cfg 통일
                this.cfg = $.extend(this.cfg, this.options.cfg);
                this.mod = $.extend(this.mod, this.options.mod);

                if (this.cfg.mytab < 0) // 탭이 없으면 -1
                    this.cfg.pt_idx = this.cfg.p;
                else
                    this.cfg.pt_idx = this.cfg.p + '' + this.cfg.mytab;

                if (this.cfg.multi == false) {
                    $.each(_self.mod, function (idx_, item_) {
                        item_ = app_.init_item(item_, 'cx_form._init'); // item 통일
                        item_.$obj = $('#'+_self.cfg.pt_idx+item_.id);
                        _evt = {'click':true, 'keydown':true};

                        switch (item_.type) {
                        case 'label':
                            item_.$obj.cx_label(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'hidden':
                            _evt = {'click':false, 'keydown':false};
                            item_.$obj.cx_hidden(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'date':
                            item_.$obj.cx_date(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'int':
                            item_.$obj.cx_int(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'float':
                            item_.$obj.cx_float(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'text':
                            item_.$obj.cx_text(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'pop':
                            item_.ptype = 'form';
                            item_.$obj.cx_pop(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'radio':
                            item_.$obj.cx_radio(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'check':
                            item_.$obj.cx_check(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'combo':
                            //_evt = {'click':false, 'keydown':false};
                            item_.$obj.cx_combo(_self.cfg, item_, {'parent':_self});
                            if (app_.cfg.theme == 'ui') {
                                item_.$ui = $('#'+_self.cfg.pt_idx+''+item_.id+'-button');
                            }
                            break;
                        case 'button':
                            item_.$obj.cx_button(_self.cfg, item_, {'parent':_self});
                            break;
                        }

//                        if (item_.focus)    // 현재의 포커싱 객체로 등록
//                            _self.cfg.now_focus = item_;


//                        if (app_.cfg.theme == 'ui') {
//                            item = app_.__init_item(item, 'w', '100%');
//                            $self.selectmenu({width : item.w});
//                            item.$ui = $('#'+item.pt_idx+''+item_.id+'-button');
//                            //console.error(item.id, item.$ui, $self.siblings('span'));
//                            item.$ui.on('keydown', {'item':item}, $self.evt_keydown);
//                            $self.$ui = item.$ui;
//                        } else {
//                            $self.on('keydown', {'item':item}, $self.evt_keydown);
//                        }
                        if (_evt.click) {
                            item_.$obj.click(function(evt_) {
                                _self.evt_click(evt_, item_);
                                return false;
                            });
                        }
//                        if (_evt.keydown) {
//                            item_.$obj.keydown(function(evt_) {
//                                _self.evt_keydown(evt_, item_);
//                                return true;
//                            });
//                        }

                        if (item_.type == 'combo' && app_.cfg.theme == 'ui') {
                            if (_evt.keydown) {
//                                console.error(item_.$ui);
                                item_.$ui.keydown(function(evt_) {
                                    _self.evt_keydown(evt_, item_);
                                    return true;
                                });
                            }
                        } else {
                            if (_evt.keydown) {
                                item_.$obj.keydown(function(evt_) {
                                    _self.evt_keydown(evt_, item_);
                                    return true;
                                });
                            }
                        }

                        if (_self.modi[item_.id] != undefined)
                            throw '■■■ error: ????????? ■■■';
                        _self.modi[item_.id] = item_;
                    });
                    _self.set_next();   // next 아이템 설정
                    //// 팝업만 따로 설정? next 때문에..
                    //$.each(_self.mod, function (idx_, item_) {
                    //    if (item_.type == 'pop') {
                    //        item_.$obj.cx_pop(_self.cfg, item_, {'parent':_self});
                    //    }
                    //});


//console.error(_self.element.attr('id'), _self.modi);

                } else {
                    $.each(this.mod, function (idx_, item_) {
                        item_ = app_.init_item(item_, 'cx_form._init');
                        item_.multi = true;
                        switch (item_.type) {
                        case 'label':
                            item_.$obj = $('td[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_label(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'hidden':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_hidden(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'date':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_date(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'int':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_int(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'float':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_float(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'radio':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_radio(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'check':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_check(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'text':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_text(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'combo':  // app_.cfg.theme == 'ui'
                            item_.$obj = $('select[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_combo(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'button':
                            item_.$obj = $('button[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            item_.$obj.cx_button(_self.cfg, item_, {'parent':_self});
                            break;
                        case 'pop':
                            item_.$obj = $('input[name="'+_self.cfg.pt_idx+item_.id+'"]');
                            //item_.$obj.cx_pop(_self.cfg, item_, {'parent':_self});
                            break;
                        }
                        //console.error(item_.$obj);
                        ////console.error(item_.id);
                        if (_self.modi[item_.id] != undefined)
                            throw '■■■ error: ????????? ■■■';

                        _self.modi[item_.id] = item_;

                        item_.$obj.click(function(evt_) {
                            _self.evt_click(evt_, item_);
                            return false;
                        });
                        item_.$obj.keydown(function(evt_) {
                            _self.evt_keydown(evt_, item_);
                            return true;
                        });

                    });
                    //console.info(_self.modi);
                    _self.set_next();   // next 아이템 설정

                    //// 팝업만 따로 설정? next 때문에..
                    //$.each(_self.mod, function (idx_, item_) {
                    //    if (item_.type == 'pop') {
                    //        item_.$obj.cx_pop(_self.cfg, item_, {'parent':_self});
                    //    }
                    //});



                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form._init ■■■';
            }
        },  // cx_form._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_form.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.destroy ■■■';
            }
        },  // cx_form.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_form.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.cfg ■■■';
            }
        },  // cx_form.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_form.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.cfg ■■■';
            }
        },  // cx_form.cfg
        /*----------------------------------------------
        * @cx_form
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_form.clear');
                this.cfg = {
                  version: '0.0.0.1'
                , now_focus: null
                },
                this.mod = {},
                this.modi = {};
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_form.clear ■■■';
            }
        },  // cx_form.clear

    });
        })(cxApp);

