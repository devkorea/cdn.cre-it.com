        (function(app_) {
    app_.widget('ui.cx_text', {
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
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_text.evt_click');
                var _self = this;
                this._trigger('evt_click', 0, evt_);
                this.element.select();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.evt_click ■■■';
            }
        },  // cx_text.evt_click
        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_text.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.evt_keydown ■■■';
            }
        },  // cx_text.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_text.set_focus');
                if (this.options.multi == false) {
                    this.element.select().focus();
                } else {
                    var _obj = $(this.options.$obj[rowindex_]);
                    _obj.select().focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_focus ■■■';
            }
        },  // cx_text.set_focus
        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_text.set_hide');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_hide ■■■';
            }
        },  // cx_text.set_hide
        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_text.set_show');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_show ■■■';
            }
        },  // cx_text.set_show

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_text.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_css ■■■';
            }
        },  // cx_text.set_css

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_text.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_align ■■■';
            }
        },  // cx_text.set_align

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_text.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_color ■■■';
            }
        },  // cx_text.set_color

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_text.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_value ■■■';
            }
        },  // cx_text.set_value

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_text.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.get_value ■■■';
            }
        },  // cx_text.get_value

        /*----------------------------------------------
        * @cx_text
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_text.set_clear');
                this.element.val(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.set_clear ■■■';
            }
        },  // cx_text.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_text._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text._create ■■■';
            }
        },  // cx_text._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_text._init');
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
                throw '■■■ error: cx_text._init ■■■';
            }
        },  // cx_text._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_text.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.destroy ■■■';
            }
        },  // cx_text.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_text.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.cfg ■■■';
            }
        },  // cx_text.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_text.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_text.cfg ■■■';
            }
        },  // cx_text.cfg
    });
        })(cxApp);

