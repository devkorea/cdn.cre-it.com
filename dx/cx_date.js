        (function(app_) {
    app_.widget('ui.cx_date', {
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
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_date.evt_click');
                var _self = this;
                this._trigger('evt_click', 0, evt_);
                this.element.select();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.evt_click ■■■';
            }
        },  // cx_date.evt_click
        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_date.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.evt_keydown ■■■';
            }
        },  // cx_date.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_date.set_focus');
                if (this.options.multi == false) {
                    this.element.select().focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.select().focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_focus ■■■';
            }
        },  // cx_date.set_focus
        /*----------------------------------------------
        * @cx_date
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
        * @cx_date
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
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_date.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_css ■■■';
            }
        },  // cx_date.set_css

        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_date.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_align ■■■';
            }
        },  // cx_date.set_align

        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_date.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_color ■■■';
            }
        },  // cx_date.set_color

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
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_date.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_value ■■■';
            }
        },  // cx_date.set_value

        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_date.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.get_value ■■■';
            }
        },  // cx_date.get_value

        /*----------------------------------------------
        * @cx_date
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_date.set_clear');
                this.element.val(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.set_clear ■■■';
            }
        },  // cx_date.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_date._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date._create ■■■';
            }
        },  // cx_date._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_date._init');
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
                if (this.options.mask)
                    this.element.mask(this.options.mask, {reverse: true, placeholder:this.options.mask.replace(/[0|#|?|*]/g, '_')});

                var _self = this;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date._init ■■■';
            }
        },  // cx_date._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_date.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.destroy ■■■';
            }
        },  // cx_date.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_date.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.cfg ■■■';
            }
        },  // cx_date.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_date.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_date.cfg ■■■';
            }
        },  // cx_date.cfg
    });
        })(cxApp);

