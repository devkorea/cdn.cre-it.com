        (function(app_) {
    app_.widget('ui.cx_popup', {
        options: {
              degug: false

        },
        cfg: {},
        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_popup.evt_click');
                var _self = this;

//console.error(2222);
//                this._trigger('evt_click', 0, evt_);
                this.element.select();

                var _param = {};
                _param['stxt'] = $.trim(this.$child.$stxt.val());
                _param['act'] = this.cfg.id;
                this.set_search(_param);

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.evt_click ■■■';
            }
        },  // cx_popup.evt_click
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_popup.evt_keydown');
                if (evt_.keyCode == 13) {
//console.error('popup.evt_keydown');

                    var _data = {stxt:''};
                    _data.stxt = evt_.currentTarget.value;
                    this.open(_data);

                }
//                console.error(evt_.currentTarget.value);
//                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.evt_keydown ■■■';
            }
        },  // cx_popup.evt_keydown


        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_search: function(data_) {
            try {
                if (this.options.debug) console.log('cx_popup.set_search');
                var _self = this;
                var _param = data_;
                _param['stxt'] = _self.check_value();
                if (_param['stxt'] == '') {
                    return false;
                }
                //_param['act'] = _self.cfg.id;
                _param['act'] = this.element.attr('id');    // 이상하게 cfg.id 가 다른걸로 변경되어 있음
                if (typeof _self.cfg.before_open == 'function') {     // 사용자 함수가 있으면 호출
                    _param = _self.cfg.before_open(_param);
                    if (_param == undefined || _param === false)
                        return false;
                }
//console.error(_self.cfg.id, this.element.attr('id'),_param);
                this.popup_search(_param);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_search ■■■';
            }
        },  // cx_popup.set_search
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        popup_search: function(param_) {
            try {
                if (this.options.debug) console.log('cx_popup.popup_search');
                var _self = this;
                // callback 함수에서 this 는 window 객체임
                //app_.async({'act':this.cfg.act, data:param_, now_tab:this.cfg.now_tab, debug:false}, _self.callback_search);
                var _res = app_.submit({'act':this.cfg.act, data:param_, now_tab:this.cfg.now_tab, debug:false, $caller:this.cfg.$caller});
                this.callback_search(_res);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.popup_search ■■■';
            }
        },  // cx_popup.popup_search
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        callback_search: function(res_) {
            try {
                if (this.options.debug) console.log('cx_popup.callback_search');
                if (typeof this.cfg.before_draw == 'function') {     // 사용자 함수가 있으면 호출
                    res_ = this.cfg.before_draw(res_);
                    if (res_ == undefined || res_ === false) {
                        return false;
                    }
                }

                if (res_ != false && res_.result == true) {
                    if (res_.cnt == 1) {
                        if (typeof this.cfg.row_enter != 'function') {  // 1건에 대한 처리
                            throw '■■■ error: cx_popup.search -> undefined function row_enter ■■■';
                        }
                        this.cfg.row_enter(null, res_.data[0]);
                        this.next_focus(this.cfg.next_type, this.cfg.$next);
                    } else {
                        if (this.$popup.dialog('isOpen') == false) {
                            this.$popup.dialog('open');
                        }
                        this.$child.$grid.cx_grid('draw_grid', res_.data);  // row data binding
                    }
                } else {
                    if (this.$popup.dialog('isOpen') == true)
                        this.$child.$grid.cx_grid('set_clear', true);

                    this.next_focus(this.cfg.caller_type, this.cfg.$caller);
//console.error(this.cfg.$caller);
//                    this.cfg.$caller.select().focus();
//                    if (this.$self.$evt[0] !== undefined) {
//                        app_.show_tip($self.$evt, res_.form.stxt + ' 단어로 검색된 정보가 없습니다');
                        //this.$self.$evt.select().focus();    // 객체만 넘어오므로 set_focus 함수를 사용할 수 없음
//                    }
//console.error(this);
                    return false;
                }
/**/
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.callback_search ■■■';
            }
        },  // cx_popup.callback_search

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function() {
            try {
                if (this.options.debug) console.log('cx_popup.set_focus');
                this.element.select().focus();
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_focus ■■■';
            }
        },  // cx_popup.set_focus
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_popup.set_hide');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_hide ■■■';
            }
        },  // cx_popup.set_hide
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_popup.set_show');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_show ■■■';
            }
        },  // cx_popup.set_show

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_popup.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_css ■■■';
            }
        },  // cx_popup.set_css

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_popup.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_align ■■■';
            }
        },  // cx_popup.set_align

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_popup.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_color ■■■';
            }
        },  // cx_popup.set_color

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_popup.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.set_value ■■■';
            }
        },  // cx_popup.set_value

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_popup.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.get_value ■■■';
            }
        },  // cx_popup.get_value

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        check_value: function() {
            try {
                if (this.options.debug) console.log('cx_popup.check_value');
                return this.$child.$stxt.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.check_value ■■■';
            }
        },  // cx_popup.check_value

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        set_grid : function() {
            try {
                if (this.options.debug) console.log('cx_popup.get_value');
                var _self = this;
                this.cfg.w = 0;  // 정확한 넓이를 재 계산하기 위해 재 설정
                var _colgroup1 = '';
                var _colgroup2 = '';
                var _thead = '<tr>';
                this.cfg.column_count = Object.keys(this.mod).length;
                $.each(_self.mod, function (idx_, item_) {
                    if (item_.w == 0) {
                        _self.cfg.w += 200;
                        _colgroup1 += ' <col style="" />';
                    } else {
                        if (_self.cfg.column_count > (idx_+1)) {
                            _self.cfg.w += item_.w;
                            _colgroup1 += ' <col style="width: '+item_.w+'px" />';
                        } else {
                            _self.cfg.w += item_.w + 17;
                            _colgroup2 = _colgroup1;
                            _colgroup2 += ' <col style="width: '+item_.w+'px" />';
                            _colgroup1 += ' <col style="width: '+(item_.w + 17)+'px" />';
                        }
                    }
                    _thead += '<th>'+item_.text+'</th>';
                });
                _thead += '</tr>';
                _self.$child.$table1.find('colgroup').append(_colgroup1);
                _self.$child.$table1.find('thead').append(_thead);
                _self.$child.$table2.find('colgroup').append(_colgroup2);
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_popup.set_grid ■■■';
            }
        },  // cx_popup.set_grid

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        next_focus: function(type_, $obj_) {
            try {
                if (this.options.debug) console.log('cx_popup.next_focus');
                if (type_) {
                    switch (type_) {
                    case 'label':
                        $obj_.cx_label('set_focus');
                        break;
                    case 'date':
                        $obj_.cx_date('set_focus');
                        break;
                    case 'int':
                        $obj_.cx_int('set_focus');
                        break;
                    case 'float':
                        $obj_.cx_float('set_focus');
                        break;
                    case 'radio':
                        $obj_.cx_radio('set_focus');
                        break;
                    case 'check':
                        $obj_.cx_check('set_focus');
                        break;
                    case 'text':
                        $obj_.cx_text('set_focus');
                        break;
                    case 'combo':
                        $obj_.cx_combo('set_focus');
                        break;
                    case 'button':
                        $obj_.cx_button('set_focus');
                        break;
                    case 'pop':
                        $obj_.cx_pop('set_focus');
                        break;
                    }
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.next_focus ■■■';
            }
        },  // cx_popup.next_focus

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        open: function(data_) {
            try {
                if (this.options.debug) console.log('cx_popup.open');
                this.$child.$stxt.val(data_.stxt);
//console.error(this);
                this.set_search(data_);

//                console.error('cx_popup.open', txt_);
//                this.set_value(this.element.val());
//                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.open ■■■';
            }
        },  // cx_popup.open

        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        close: function(data_) {
            try {
                if (this.options.debug) console.log('cx_popup.close');
                if (this.$popup.dialog('isOpen') == true)
                    this.$popup.dialog('close');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.close ■■■';
            }
        },  // cx_popup.close

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_popup._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup._create ■■■';
            }
        },  // cx_popup._create



        _init: function() {
            try {
                if (this.options.debug) console.log('cx_popup._init');
                this.clear();
                var _self = this;
//                this.options.cfg = app_.init_cfg(this.options.cfg); // cfg 통일
                this.cfg = $.extend(true, this.cfg, this.options.cfg);
//console.error(this.cfg);
//console.error(this.options.cfg.next_type);

                this.mod = $.extend(this.mod, this.options.mod);
                this.$child = {};
                this.$popup = app_.cfg.$popup.clone(true);     // 팝업객체
                this.$child.$table1 = this.$popup.find('#'+this.cfg.prefix+'thead');
                this.$child.$table2 = this.$popup.find('#'+this.cfg.prefix+'tbody');
                this.$child.$tbody = this.$child.$table2.find('tbody');
                this.$child.$stxt = this.$popup.find('#'+this.cfg.prefix+'stxt');
                this.$child.$btn = this.$popup.find('#'+this.cfg.prefix+'btn_search');
//                this.$child.$grid = this.$child.$tbody.cx_grid(this.cfg, this.mod);
                this.$child.$tbody.closest('div').css('height', this.cfg.h + 'px');
                this.cfg.is_popup = true;
                this.$child.$grid = this.$child.$tbody.cx_grid({debug:this.options.debug, 'mod':this.mod, 'cfg':this.cfg});
                if (this.cfg.research != undefined && this.cfg.research == false) {  // 재검색 하지 않음 팝업이면 검색관련(text, button) 감추기
                    this.cfg.h += 50;   // 감춰진 높이를 반영함
                    this.$popup.find('caption').hide();
                } else {
                    var _item =  {type:'text', id:this.cfg.prefix+'stxt', text:'검색어', value:this.cfg.value}
                    this.$child.$stxt.cx_text(this.cfg, _item, {'parent':_self});

//                    this.$child.$pop = app_.create_item(this.$child.$stxt, 'form', this.cfg.pt_idx, item, this.$popup, 'cx_popup.init');
                }



                this.set_grid();     // Grid 의 colgroup, th 등 그리기
                this.$child.$btn.click(function(evt_) {
                    _self.evt_click(evt_);
                    return false;
                });
                this.$child.$stxt.keydown(function(evt_) {
                    _self.evt_keydown(evt_);
                    return true;
                });
                this.$child.$stxt.click(function(evt_) {
                    _self.$child.$stxt.select().focus();
                    return true;
                });
                // ######## 팝업 생성
                this.$popup.dialog({
                            title: _self.cfg.title,
                            resizable: false,
                            autoOpen : false,
                            show : 'blind',
                            //hide : 'blind',
                            width: _self.cfg.w,
                            height: _self.cfg.h + 160,
                            modal: true,
                            buttons: { '닫기': function() {
                                    if (typeof _self.cfg.before_close == 'function') {     // 사용자 함수가 있으면 호출
                                        var _res = _self.cfg.before_close();
                                        if (_res == undefined || _res == false) {
                                            return false;
                                        }
                                    }
                                    $(this).dialog('close');
                                    //_self.set_reset('cx_popup.btn_close');
                                }}
                            });
//                if (this.options.align)
//                    this.set_align(this.options.align);
//                if (this.options.color)
//                    this.set_color(this.options.color);
//                if (this.options.value)
//                    this.set_value(this.options.value);
//                if (this.options.focus)
//                    this.set_focus();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup._init ■■■';
            }
        },  // cx_popup._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_popup.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.destroy ■■■';
            }
        },  // cx_popup.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_popup.cfg');
                this.cfg = $.extend(this.cfg, param_);
//console.error(this.cfg);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.cfg ■■■';
            }
        },  // cx_popup.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_popup.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.cfg ■■■';
            }
        },  // cx_popup.cfg
        /*----------------------------------------------
        * @cx_popup
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_popup.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , is_popup     : true   // cx_grid 에서 탭쪽에 던져주는 항목을 모두 금지함
                    , prefix     : 'cx_popup'      // p + m
                    , column_count : -1 // 현재 Grid 컬럼 수    (Grid 를 그릴때 필요함)
                    , next_type: null
                },
                this.$child = null,
                this.$popup = null;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_popup.clear ■■■';
            }
        },  // cx_popup.clear
    });
        })(cxApp);

