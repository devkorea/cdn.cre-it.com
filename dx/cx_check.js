        (function(app_) {
    app_.widget('ui.cx_check', {
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
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_check.evt_click');
                var _self = this;
                this._trigger('evt_click', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.evt_click ■■■';
            }
        },  // cx_check.evt_click
        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_check.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.evt_keydown ■■■';
            }
        },  // cx_check.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_check.set_focus');
                if (this.options.multi == false) {
                    this.element.focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_focus ■■■';
            }
        },  // cx_check.set_focus
        /*----------------------------------------------
        * @cx_check
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
        * @cx_check
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
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_check.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_css ■■■';
            }
        },  // cx_check.set_css

        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_check.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_align ■■■';
            }
        },  // cx_check.set_align

        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_check.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_color ■■■';
            }
        },  // cx_check.set_color

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
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_check.set_value');
                value_ = $.trim(value_);
                if (this.element.val() == value_)
                    this.element.prop('checked', true);
                else
                    this.element.prop('checked', false);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_value ■■■';
            }
        },  // cx_check.set_value

        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_check.get_value');
                if (this.element.prop('checked') == true)
                    return this.element.val();
                else
                    return false;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.get_value ■■■';
            }
        },  // cx_check.get_value
        /*----------------------------------------------
        * @cx_check
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_check.set_clear');
                if (this.options.value)
                    this.element.prop(checked, true);
                else
                    this.element.prop(checked, false);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.set_clear ■■■';
            }
        },  // cx_check.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_check._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check._create ■■■';
            }
        },  // cx_check._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_check._init');
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

                var _self = this;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check._init ■■■';
            }
        },  // cx_check._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_check.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.destroy ■■■';
            }
        },  // cx_check.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_check.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.cfg ■■■';
            }
        },  // cx_check.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_check.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_check.cfg ■■■';
            }
        },  // cx_check.cfg
    });
        })(cxApp);

