        (function(app_) {
    app_.widget('ui.cx_pop', {
        options: {
              degug: false
            , popup: null
            , $popup: null

        },
        cfg: {
              version: '0.0.0.1'
        },
        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_pop.evt_click');
                var _self = this;
//                this._trigger('evt_click', 0, evt_);
                this.element.select();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.evt_click ■■■';
            }
        },  // cx_pop.evt_click
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_pop.evt_keydown');
//                this._trigger('evt_keydown', 0, evt_);
                var _self = this;
                switch(evt_.keyCode) {
                case 13:
                    var _data = {'stxt':''};
                    _data.stxt = _self.get_value();
                    if (_self.options.required) {
                        if (!_data.stxt) {
//                            evt_.stopPropagation();    // 이벤트 버블 중지
//                            evt_.preventDefault();     // 기본 이벤트 취소
                            app_.show_tip(_self.element, '검색어는 필수입니다 ('+_self.options.text+')');
                            return false;
                        }
                    }
//console.error('????');
                    // 데이터가 있을때 포커스 처리는 cx_popup 에서 처리
                    _data['rowindex_edit'] = $(evt_.currentTarget).closest('tr')[0].rowIndex;
                    _self.$popup.cx_popup('open', _data);   // 팝업 오픈
                    //return false;
                    break;
                }
                //return true;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.evt_keydown ■■■';
            }
        },  // cx_pop.evt_keydown

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        popup_close: function(id_) {
            try {
                if (this.options.debug) console.log('cx_pop.popup_close');
                var _self = this;
                _self.$popup.cx_popup('close');   // 팝업 닫기
//                if (typeof _self.options.$next == 'object') {   // 다음 포커스가 있으면 다음으로 포커싱
////                    _self.options.parent.element.cx_form('set_focus', _self.options.next);
//                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.popup_close ■■■';
            }
        },  // cx_pop.popup_close



        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function() {
            try {
                if (this.options.debug) console.log('cx_pop.set_focus');
                if (this.options.multi == false) {
                    this.element.select().focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.select().focus();
                }
//                if (this.options.ptype == 'form')
//                    this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
//                else
//                    this.options.parent.element.cx_row('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_focus ■■■';
            }
        },  // cx_pop.set_focus
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_pop.set_hide');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_hide ■■■';
            }
        },  // cx_pop.set_hide
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_pop.set_show');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_show ■■■';
            }
        },  // cx_pop.set_show

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_pop.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_css ■■■';
            }
        },  // cx_pop.set_css

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_pop.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_align ■■■';
            }
        },  // cx_pop.set_align

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_pop.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_color ■■■';
            }
        },  // cx_pop.set_color

        /*----------------------------------------------
        * @cx_int
        * @returns  {void}
        ----------------------------------------------*/
        set_readonly: function(readonly_) {
            try {
                if (this.options.debug) console.log('cx_label.set_readonly');
                this.element.prop('readonly', readonly_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_readonly ■■■';
            }
        },  // cx_label.set_readonly

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_pop.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_value ■■■';
            }
        },  // cx_pop.set_value

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_pop.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.get_value ■■■';
            }
        },  // cx_pop.get_value

        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_pop.set_clear');
                this.element.val(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.set_clear ■■■';
            }
        },  // cx_pop.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_pop._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop._create ■■■';
            }
        },  // cx_pop._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_pop._init');
                if (this.options.popup == undefined)
                    throw '■■■ error: cx_pop.init -> popup property undefined ('+this.options.id+') ■■■';
                this.clear();
                var _self = this;
                // 팝업용 옵션을 정리

                this.options.popup = app_.__init_item(this.options.popup, 'h', 400);
                this.options.popup = app_.__init_item(this.options.popup, 'title', 'Unknown POP');
                this.options.popup = app_.__init_item(this.options.popup, 'before_open', null);
                this.options.popup = app_.__init_item(this.options.popup, 'before_draw', null);
                this.options.popup = app_.__init_item(this.options.popup, 'before_close', null);
                this.options.popup = app_.__init_item(this.options.popup, 'row_click', null);
                this.options.popup = app_.__init_item(this.options.popup, 'row_enter', null);
                this.options.popup = app_.__init_item(this.options.popup, 'row_dblclick', null);
                var _popup = {
                      w             : 0      // 팝업을 그리면서 재계산됨
                    , h             : this.options.popup.h
                    , research      : this.options.popup.research
                    , required      : this.options.required       // 검색어가 없으면 검색 안함(item 속성을 따름)
                    , 'title'       : this.options.popup.title
                    , 'act'         : this.options.popup.act
                    , 'before_open' : this.options.popup.event.before_open
                    , 'before_draw' : this.options.popup.event.before_draw
                    , 'before_close': this.options.popup.event.before_close
                    , 'row_click'   : this.options.popup.event.row_click
                    , 'row_enter'   : this.options.popup.event.row_enter
                    , 'row_dblclick': this.options.popup.event.row_dblclick
                    , 'popup_bind'  : this.options.popup.event.row_dblclick
                    , 'id'          : 'pop_'+this.options.pt_idx+this.options.id
                    , 'value'       : this.options.value
                    , edit          : false
                    , sch           : 1
                    , irows         : 0
                    , p             : this.options.p
                    , pt_idx        : this.options.pt_idx
                    , now_tab       : this.options.popup.mytab
                    , mytab         : this.options.popup.mytab
                    , next          : this.options.next
                    , ptype         : this.options.ptype
                    , $caller       : this.element      // 호출객체
                    , caller_type   : this.options.type // 호출객체
//                    , $next         : this.options.$next      // 호출객체
//                    , next_type     : this.options.next_type      // 호출객체
                };
//console.error(this.options);
//console.error(this.options.$next, this.options.next_type, this.options);
//                this.options.popup.grid
                if (this.options.readonly)
                    this.set_readonly(this.options.readonly);
                if (this.options.align)
                    this.set_align(this.options.align);
                if (this.options.color)
                    this.set_color(this.options.color);
                if (this.options.value)
                    this.set_value(this.options.value);
                if (this.options.focus)
                    this.set_focus();

                // 뒤에서 만들어 지므로 timeout 을 해야 next 를 찾을 수 있음(그래도 안찾아짐 -.-);
//                setTimeout(function() {
                    _self.$popup = $('<span id="pop_'+_popup.pt_idx+_self.options.id+'" />').cx_popup({'cfg':_popup, 'mod':_self.options.popup.grid});
//                }, 1000);

                delete this.options.popup;
                this.element.keydown(function(evt_) {
                    _self.evt_keydown(evt_);
                    return true;
                });

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop._init ■■■';
            }
        },  // cx_pop._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_pop.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.destroy ■■■';
            }
        },  // cx_pop.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_pop.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.cfg ■■■';
            }
        },  // cx_pop.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_pop.cfg');
                this.options = $.extend(this.options, param_);
                this.$popup.cx_popup('set_cfg', param_);

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.cfg ■■■';
            }
        },  // cx_pop.cfg
        /*----------------------------------------------
        * @cx_pop
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_pop.clear');
                this.cfg = {
                  version: '0.0.0.1'
                },
                this.popup = null;
                this.$popup = null;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_pop.clear ■■■';
            }
        },  // cx_pop.clear



    });
        })(cxApp);

