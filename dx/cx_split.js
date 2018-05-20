        (function(app_) {
    app_.widget('ui.cx_split', {
        options: {
              degug: false

        },
        cfg: {
              version: '0.0.0.1'

        },
        $child: {},

        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_split: function(unit_) {
            try {
                if (this.options.debug) console.log('cx_split.set_split');
                var _self = this;
                this.$child[0].resizable({
                    resize: function(e, ui) {
                        var parent = ui.element.parent();
                        var remainingSpace = parent.width() - ui.element.outerWidth(),
                            divTwo = ui.element.next(),
                            divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width()))/parent.width()*100+"%";
                            divTwo.width(divTwoWidth);
                    },
                    stop: function(e, ui) {
                        var parent = ui.element.parent();
                        ui.element.css({
                            width: ui.element.width()/parent.width()*100+"%",
                        });
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_split ■■■';
            }
        },  // cx_split.set_split

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_resize: function() {
            try {
                if (this.options.debug) console.log('cx_split.set_resize');
                $(window).resize(function() {
                    console.error('split resize 를 구현하세요');
                });
                //app_.cfg.w = $(window).width();
                //app_.cfg.h = $(window).height();
                if (app_.cfg.h < app_.cfg.h_limit) // 필요이상으로 줄어들면 처리하지 않음
                    return;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_resize ■■■';
            }
        },  // cx_split.set_resize




        //==============================================================================================
        // method set
        //==============================================================================================

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_split.set_show');
                this.element.css('visibility', 'visible');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_show ■■■';
            }
        },  // cx_split.set_show

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_split.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_css ■■■';
            }
        },  // cx_split.set_css

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_split.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_color ■■■';
            }
        },  // cx_split.set_color

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(set_, value_) {
            try {
                if (this.options.debug) console.log('cx_split.set_value');
                if (set_ == undefined || set_ == 0)
                    return value_ + this.cfg.unit;
                if ((set_+'').match(/[%|vw|vh]/g)) {   // vw, vh, %
                    return set_;
                }
                return set_+'px';
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_value ■■■';
            }
        },  // cx_split.set_value

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_direction: function(type_) {
            try {
                if (this.options.debug) console.log('cx_split.set_direction');
                return type_.toLowerCase();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_direction ■■■';
            }
        },  // cx_split.set_direction

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_unit: function(unit_) {
            try {
                if (this.options.debug) console.log('cx_split.set_unit');
                if (unit_ == undefined || unit_ == '')
                    return 'px';
                return unit_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_unit ■■■';
            }
        },  // cx_split.set_unit

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_child: function($child_, cfg_, child_, offset_) {
            try {
                if (this.options.debug) console.log('cx_split.set_child');
                var _self = this;
                var child_count = Object.keys(child_).length;
                var w = 0, h = 0;
                $.each(child_, function (idx_, item_) {
//console.error(_self.cfg.pt_idx+item_.id);
                    $child_[idx_] = $('#'+item_.id+_self.cfg.pt_idx);
                    item_.type = _self.set_direction(item_.type); // 방향설정
                    item_.unit = _self.set_unit(item_.unit);      // 단위설정

                    if (item_.type == 'v') {
                        if (idx_ < (child_count-1)) {   // 중간은 항상 넓이가 있어야 함
                            item_.w = _self.set_value(item_.w, 300);
                            item_.h = _self.set_value(item_.h, cfg_.h - offset_.top);
                            w += parseInt(item_.w, 10);     // 마지막 사이즈를 위해 누적
                            h += parseInt(item_.h, 10);     // 전체 높이를 적용
                            $child_[idx_].css({'float':'left', width:item_.w, height:item_.h}).addClass('split');
                        } else {
                            item_.w = _self.set_value(item_.w, cfg_.w - offset_.left - 300);   // 지정 크기가 없으면 나머지를 적용
                            item_.h = _self.set_value(item_.h, cfg_.h - offset_.top);          // 전체 높이를 적용
                            //$child_[idx_].css('float', 'right');
                            $child_[idx_].css({'float':'right', width:item_.w, height:item_.h}).addClass('split');
                        }
                    } else {
                        console.error('수평분할 일때를 구현할 것');
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_child ■■■';
            }
        },  // cx_split.set_child

        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        set_parent: function(unit_) {
            try {
                if (this.options.debug) console.log('cx_split.set_parent');
                this.cfg.w = this.set_value(this.cfg.w, app_.cfg.w - this.cfg.offset.left);  // 지정 크기가 없으면 나머지를 적용
                this.cfg.h = this.set_value(this.cfg.h, app_.cfg.h - this.cfg.offset.top);   // 지정 크기가 없으면 나머지를 적용
                this.element.css({width: this.cfg.w, height: this.cfg.h});
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_parent ■■■';
            }
        },  // cx_split.set_parent


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_split._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split._create ■■■';
            }
        },  // cx_split._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_split._init');
                this.clear();
                var _self = this;
                this.cfg = $.extend(this.cfg, this.options);
                if (this.cfg.mytab < 0) // 탭이 없으면 -1
                    this.cfg.pt_idx = this.cfg.p;
                else
                    this.cfg.pt_idx = this.cfg.p + '' + this.cfg.mytab;


                this.cfg.type = this.set_direction(this.cfg.type);
                this.cfg.child_count = Object.keys(this.cfg.child).length;
                setTimeout(function() {     // 실제 offset 사용을 위해
                    _self.cfg.offset = _self.element.offset();
                    _self.set_child(_self.$child, app_.cfg, _self.cfg.child, _self.cfg.offset);
                    _self.set_parent();
                    _self.set_split();
                    _self.set_resize();
                }, 0);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split._init ■■■';
            }
        },  // cx_split._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_split.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.destroy ■■■';
            }
        },  // cx_split.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_split.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.cfg ■■■';
            }
        },  // cx_split.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_split.set_option');
                this.options = $.extend(this.options, param_);
                this.cfg = this.options.cfg;    // 다시 적용
                this.$mod = this.options.$mod;  // 다시 적용
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.set_option ■■■';
            }
        },  // cx_split.set_option
        /*----------------------------------------------
        * @cx_tab
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_split.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , now_tab: -1
                    , unit: 'px'
                    , child_count: 0
                },
                this.$mod = {};
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_split.clear ■■■';
            }
        },  // cx_split.clear

    });
        })(cxApp);
