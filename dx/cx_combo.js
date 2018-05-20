        (function(app_) {
    app_.widget('ui.cx_combo', {
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
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_combo.evt_click');
                var _self = this;
                //this._trigger('evt_click', 0, evt_);
//                this.element.select();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.evt_click ■■■';
            }
        },  // cx_combo.evt_click
        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_combo.evt_keydown');
                //this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.evt_keydown ■■■';
            }
        },  // cx_combo.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_combo.set_focus');
                if (this.options.multi == false) {
                    if (app_.cfg.theme == 'ui') {
                        this.options.$ui.focus();
                    } else {
                        this.element.focus();
                    }

//                    console.error(this.options.$ui);
                } else {
                    var _obj = '';
                    if (app_.cfg.theme == 'ui')
                        _obj = this.options.$ui[rowindex_];
                    else
                        _obj = this.options.$obj[rowindex_];
                    _obj.focus();
                }
                this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_focus ■■■';
            }
        },  // cx_combo.set_focus
        /*----------------------------------------------
        * @cx_combo
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
        * @cx_combo
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
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_combo.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_css ■■■';
            }
        },  // cx_combo.set_css

        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_combo.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_align ■■■';
            }
        },  // cx_combo.set_align

        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_combo.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_color ■■■';
            }
        },  // cx_combo.set_color

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
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_combo.set_value');
                this.element.val($.trim(value_));
                if (app_.cfg.theme == 'ui') {
                    this.element.selectmenu('refresh');
                }

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_value ■■■';
            }
        },  // cx_combo.set_value

        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_combo.get_value');
                this.set_value(this.element.val());
//console.error(this.element.attr('id'), this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.get_value ■■■';
            }
        },  // cx_combo.get_value

        /*----------------------------------------------
        * @cx_combo
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_combo.set_clear');
                if (this.options.value)
                    this.element.val(this.options.value);
                else
                    this.element.children('option:eq(0)').prop('selected', 'selected');

                if (app_.cfg.theme == 'ui') {
                    this.element.selectmenu('refresh');
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.set_clear ■■■';
            }
        },  // cx_combo.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_combo._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo._create ■■■';
            }
        },  // cx_combo._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_combo._init');
                var _self = this;
                if (app_.cfg.theme == 'ui') {
                    this.options = app_.__init_item(this.options, 'w', '100%');
                    this.element.selectmenu({width : this.options.w});
                    this.options.$ui = $('#'+this.options.pt_idx+''+this.options.id+'-button');
//                    //console.error(item.id, item.$ui, $self.siblings('span'));
//                    item.$ui.on('keydown', {'item':item}, $self.evt_keydown);
//                    $self.$ui = item.$ui;
                    this.options.$ui.keydown(function(evt_) {
                        _self.evt_keydown(evt_);
                        return true;
                    });
                } else {
                    this.element.$ui.keydown(function(evt_) {
                        _self.evt_keydown(evt_);
                        return true;
                    });
                }
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

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo._init ■■■';
            }
        },  // cx_combo._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_combo.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.destroy ■■■';
            }
        },  // cx_combo.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_combo.cfg');
                this.options = $.extend(this.options, param_);
//                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.cfg ■■■';
            }
        },  // cx_combo.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_combo.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_combo.cfg ■■■';
            }
        },  // cx_combo.cfg
    });
        })(cxApp);

