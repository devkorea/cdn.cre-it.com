        (function(app_) {
    app_.widget('ui.cx_float', {
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
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_float.evt_click');
                var _self = this;
                this._trigger('evt_click', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.evt_click ■■■';
            }
        },  // cx_float.evt_click

        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_float.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.evt_keydown ■■■';
            }
        },  // cx_float.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_float.set_focus');
                if (this.options.multi == false) {
                    this.element.select().focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.select().focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_focus ■■■';
            }
        },  // cx_float.set_focus
        /*----------------------------------------------
        * @cx_float
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
        * @cx_float
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
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_float.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_css ■■■';
            }
        },  // cx_float.set_css

        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_float.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_align ■■■';
            }
        },  // cx_float.set_align

        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_float.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_color ■■■';
            }
        },  // cx_float.set_color

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
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_float.set_value');
                this.element.val($.trim((value_+'').replace(/[^0-9\,]/g, '')));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_value ■■■';
            }
        },  // cx_float.set_value

        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_float.get_value');
                this.set_value(this.element.val());
                if (!this.element.val())
                    return 0.0;
                else
                    return parseFloat(this.element.val().replace(/[,]/g, ''));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.get_value ■■■';
            }
        },  // cx_float.get_value
        /*----------------------------------------------
        * @cx_float
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_float.set_clear');
                this.element.val(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.set_clear ■■■';
            }
        },  // cx_float.set_clear


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_float._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float._create ■■■';
            }
        },  // cx_float._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_float._init');
                var _self = this;
                this.set_align('right');
                if (this.options.readonly)
                    this.set_readonly(this.options.readonly);
                if (this.options.color)
                    this.set_color(this.options.color);
                if (this.options.value)
                    this.set_value(this.options.value);
                if (this.options.focus)
                    this.set_focus();
                if (this.options.mask)
                    this.element.mask(this.options.mask, {reverse: true, placeholder:this.options.mask.replace(/[0|#|?|*]/g, '_')});


            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float._init ■■■';
            }
        },  // cx_float._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_float.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.destroy ■■■';
            }
        },  // cx_float.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_float.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.cfg ■■■';
            }
        },  // cx_float.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_float.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_float.cfg ■■■';
            }
        },  // cx_float.cfg
    });
        })(cxApp);

