        (function(app_) {
    app_.widget('ui.cx_tab', {
        options: {
              degug: false

        },
        cfg: {
              version: '0.0.0.1'

        },
        $mod: {},

        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        btn_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_tab.btn_click');
                var _self = this;
                this._trigger('btn_click', 0, evt_);
                $.each(_self.options.$btn, function (idx_, item_) {
                    if (evt_.currentTarget == item_) {
                        _self.cfg.now_tab = idx_;
//                        setTimeout(function() {
//                            $(_self.options.$tab[idx_]).focus();
//
//                            $.each(_self.$mod, function (idx_, mod_) {
//                                $.each(mod_, function (key_, item_) {
//                                    if (item_ == null) return true;
//                                    if (key_.indexOf('Sch') != -1 || key_.indexOf('Frm') != -1) {
//
//                                        item_.cx_form('set_focus_now');
////console.log(item_, key_.indexOf('Sch'));
//                                    } else {
//
//                                    }
//
//                                });
//                            });
//                        }, 0);
////                        cfg.now_tab = idx_;
////                        evt.set_noti_active(true);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
//                        return false;
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.btn_click ■■■';
            }
        },  // cx_tab.btn_click
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_tab.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.evt_keydown ■■■';
            }
        },  // cx_tab.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function() {
            try {
                if (this.options.debug) console.log('cx_tab.set_focus');
                this.element.focus();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_focus ■■■';
            }
        },  // cx_tab.set_focus
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_tab.set_hide');
                this.element.css('visibility', 'hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_hide ■■■';
            }
        },  // cx_tab.set_hide
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_tab.set_show');
                this.element.css('visibility', 'visible');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_show ■■■';
            }
        },  // cx_tab.set_show

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_css ■■■';
            }
        },  // cx_tab.set_css

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_align ■■■';
            }
        },  // cx_tab.set_align

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_color ■■■';
            }
        },  // cx_tab.set_color

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_value');
                this.element.text($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_value ■■■';
            }
        },  // cx_tab.set_value

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_tab.get_value');
                this.set_value(this.element.text());
                return this.element.text();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.get_value ■■■';
            }
        },  // cx_tab.get_value

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        get_now_tab: function() {
            try {
                if (this.options.debug) console.log('cx_tab.get_now_tab');
                return this.cfg.now_tab;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.get_now_tab ■■■';
            }
        },  // cx_tab.get_now_tab


        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_move: function(idx_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_move');
                this.options.$btn[idx_].click();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_move ■■■';
            }
        },  // cx_tab.set_move


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_tab._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab._create ■■■';
            }
        },  // cx_tab._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_tab._init');
                this.clear();
                var _self = this;
                this.options.cfg.mytab = -9;    // 존재하지 않는 설정 반영
                this.options.cfg = app_.init_cfg(this.options.cfg); // cfg 통일
                this.cfg = this.options.cfg;
                this.$mod = this.options.$mod;

                this.options.$btn = this.element.children().find('a');                  // 탭 버튼
                if (app_.cfg.theme == 'boot')
                    this.options.$tab = this.element.children().find('div.tab-pane');   // 탭 컨텐츠
                else if (app_.cfg.theme == 'ui')
                    this.options.$tab = this.element.find('div.tab-pane');              // 탭 컨텐츠

                this.options.$btn.click(function(evt_) {
                    _self.btn_click(evt_);
                    return false;
                });

                //this.element.show().tabs({active:this.cfg.now_tab, show:{effect:'blind', duration: 0}});  // 효과
                this.element.show().tabs({active:this.cfg.now_tab});  // 효과
                setTimeout(function() {
//                    $(_self.options.$btn[_self.cfg.now_tab]).click();
                }, 0);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab._init ■■■';
            }
        },  // cx_tab._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_tab.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.destroy ■■■';
            }
        },  // cx_tab.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_tab.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.cfg ■■■';
            }
        },  // cx_tab.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_tab.set_option');
                this.options = $.extend(this.options, param_);
                this.cfg = this.options.cfg;    // 다시 적용
                this.$mod = this.options.$mod;  // 다시 적용
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.set_option ■■■';
            }
        },  // cx_tab.set_option
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_tab.clear');
                this.cfg = {
                  version: '0.0.0.1'
                },
                this.$mod = {};
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_tab.clear ■■■';
            }
        },  // cx_tab.clear

    });
        })(cxApp);
