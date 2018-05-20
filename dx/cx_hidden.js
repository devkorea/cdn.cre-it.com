        (function(app_) {
    app_.widget('ui.cx_hidden', {
        options: {
              degug: false

        },
        cfg: {
              version: '0.0.0.1'

        },
        //==============================================================================================
        // event trigger
        //==============================================================================================











        //==============================================================================================
        // method
        //==============================================================================================
        /*----------------------------------------------
        * @cx_hidden
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_hidden.set_value');
                this.element.val($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.set_value ■■■';
            }
        },  // cx_hidden.set_value

        /*----------------------------------------------
        * @cx_hidden
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_hidden.get_value');
                this.set_value(this.element.val());
                return this.element.val();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.get_value ■■■';
            }
        },  // cx_hidden.get_value
        /*----------------------------------------------
        * @cx_hidden
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_hidden.set_clear');
                this.element.val(this.options.value);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.set_clear ■■■';
            }
        },  // cx_hidden.set_clear

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_hidden._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden._create ■■■';
            }
        },  // cx_hidden._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_hidden._init');
                if (this.options.value)
                    this.set_value(this.options.value);
                var _self = this;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden._init ■■■';
            }
        },  // cx_hidden._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_hidden.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.destroy ■■■';
            }
        },  // cx_hidden.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_hidden.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.cfg ■■■';
            }
        },  // cx_hidden.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_hidden.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_hidden.cfg ■■■';
            }
        },  // cx_hidden.cfg
    });
        })(cxApp);

