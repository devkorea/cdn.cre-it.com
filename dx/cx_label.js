        (function(app_) {
    app_.widget('ui.cx_label', {
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
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_label.evt_click');
                var _self = this;
                this._trigger('evt_click', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.evt_click ■■■';
            }
        },  // cx_label.evt_click
        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_label.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.evt_keydown ■■■';
            }
        },  // cx_label.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_label.set_focus');
                if (this.options.multi == false) {
                    this.element.focus();
                } else {
                    var _obj = this.options.$obj[rowindex_];
                    _obj.focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_focus ■■■';
            }
        },  // cx_label.set_focus
        /*----------------------------------------------
        * @cx_label
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
        * @cx_label
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
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_label.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_css ■■■';
            }
        },  // cx_label.set_css

        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_label.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_align ■■■';
            }
        },  // cx_label.set_align

        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_label.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_color ■■■';
            }
        },  // cx_label.set_color

        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_label.set_value');
                this.element.text($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_value ■■■';
            }
        },  // cx_label.set_value

        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_label.get_value');
                this.set_value(this.element.text());
                return this.element.text();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.get_value ■■■';
            }
        },  // cx_label.get_value
        /*----------------------------------------------
        * @cx_label
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_label.set_clear');
                this.element.text(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.set_clear ■■■';
            }
        },  // cx_label.set_clear


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_label._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label._create ■■■';
            }
        },  // cx_label._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_label._init');
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
                throw '■■■ error: cx_label._init ■■■';
            }
        },  // cx_label._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_label.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.destroy ■■■';
            }
        },  // cx_label.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_label.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.cfg ■■■';
            }
        },  // cx_label.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_label.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_label.cfg ■■■';
            }
        },  // cx_label.cfg
    });
        })(cxApp);

