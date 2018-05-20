        (function(app_) {
    app_.widget('ui.cx_button', {
        options: {
              degug: false

        },
        cfg: {
              version: '0.0.0.1'

        },
        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_button.evt_click');
                var _self = this;
      //          this._trigger('evt_click', 0, evt_);
//                this.element.focus();
                 _self.options.click(evt_, _self.options);

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.evt_click ■■■';
            }
        },  // cx_button.evt_click
        ///*----------------------------------------------
        //* @cx_button
        //* @returns  {void}
        //----------------------------------------------*/
        //evt_keydown: function(evt_, item_) {
        //    try {
        //        if (this.options.debug) console.log('cx_button.evt_keydown');
//      //          this._trigger('evt_keydown', 0, evt_);
        //    } catch(e) {
        //        console.error(e);
        //        throw '■■■ error: cx_button.evt_keydown ■■■';
        //    }
        //},  // cx_button.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_button.set_focus');
                if (this.options.multi == false) {
                    this.element.focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.set_focus ■■■';
            }
        },  // cx_button.set_focus
        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_label.set_hide');
                this.element.css('visibility', 'hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_hide ■■■';
            }
        },  // cx_label.set_hide
        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_label.set_show');
                this.element.css('visibility', 'visible');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_show ■■■';
            }
        },  // cx_label.set_show

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
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_button.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.set_value ■■■';
            }
        },  // cx_button.set_value

        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_button.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.get_value ■■■';
            }
        },  // cx_button.get_value

        /*----------------------------------------------
        * @cx_button
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_button.set_clear');
                // cx_form 에서 호출하도록 빈함수가 존재해야 함
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.set_clear ■■■';
            }
        },  // cx_button.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_button._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button._create ■■■';
            }
        },  // cx_button._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_button._init');
                var _self = this;
                if (this.options.readonly)
                    this.set_readonly(this.options.readonly);

                if (this.options.focus)
                    this.set_focus();
//                this.element.click(function(evt_) {
//                    _self.options.click(evt_, _self.options);
//                    return false;
//                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button._init ■■■';
            }
        },  // cx_button._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_button.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.destroy ■■■';
            }
        },  // cx_button.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_button.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.cfg ■■■';
            }
        },  // cx_button.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_button.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_button.cfg ■■■';
            }
        },  // cx_button.cfg
    });
        })(cxApp);

