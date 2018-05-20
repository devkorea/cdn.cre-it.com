        (function(app_) {
    app_.widget('ui.cx_page', {
        options: {
              debug: false

        },
        cfg: {
              version: '0.0.0.1'
            , pt_idx    : null      // m + tab index
            , myfocus   : null      // 나의 현재 포커스 객체(item_)
            , mytab     : -1        // 나의 탭 인덱스
            , now_tab   : -1        // 현재 active 된 탭 인덱스
        },
        mod: {
              row_height  : 10      // 한 페이지 리스트 갯수
            , row_width   : 10      // 페이징 박스에서 페이지 표시 갯수
            , total_rows  : 0       // 전체 데이터의 레코드 수
            , page        : 1       // 현재 페이지 번호
            , page_prev   : 0       // 이전 페이지 번호 -- 신규
            , page_next   : 0       // 다음 페이지 번호
            , page_total  : 0       // 전체 페이지 수
            , page_start  : 0       // 질의에 사용될 데이터 번호
            , page_end    : 10      // 질의에 사용될 데이터 번호 (row_height 대신에 사용함)
            , block       : 0       // 현재 블록 번호
            , block_total : 0       // 전체 블록 번호
            , block_prev  : 0       // 이전 블록 번호
            , block_next  : 0       // 다음 블록 번호 -- 신규
            , block_now   : 0       // 현재 블록 번호 -- 신규
            , $link       : null    // a link
            , module      : null    // 객체 모듈명(반드시 객체 생성時 부여할 것)
            , click       : null    // 콜백(반드시 객체 생성時 부여할 것)
        },

        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        btn_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_page.btn_click');
                var _self = this;
                this._trigger('btn_click', 0, evt_);
                $.each(_self.options.$btn, function (idx_, item_) {
                    if (evt_.currentTarget == item_) {
                        _self.cfg.now_tab = idx_;
                        setTimeout(function() {
                            $(_self.options.$tab[idx_]).focus();

                            $.each(_self.$mod, function (idx_, mod_) {
                                $.each(mod_, function (key_, item_) {
                                    if (item_ == null) return true;
                                    if (key_.indexOf('Sch') != -1 || key_.indexOf('Frm') != -1) {

                                        item_.cx_form('set_focus_now');
//console.log(item_, key_.indexOf('Sch'));
                                    } else {

                                    }

                                });
                            });
                        }, 0);
//                        cfg.now_tab = idx_;
//                        evt.set_noti_active(true);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
                        return false;
                    }
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.btn_click ■■■';
            }
        },  // cx_page.btn_click
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_page.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.evt_keydown ■■■';
            }
        },  // cx_page.evt_keydown

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function() {
            try {
                if (this.options.debug) console.log('cx_page.set_focus');
                this.element.focus();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_focus ■■■';
            }
        },  // cx_page.set_focus
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_page.set_hide');
                this.element.css('visibility', 'hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_hide ■■■';
            }
        },  // cx_page.set_hide
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_page.set_show');
                this.element.css('visibility', 'visible');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_show ■■■';
            }
        },  // cx_page.set_show

        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_page.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_css ■■■';
            }
        },  // cx_page.set_css

        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_page.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_align ■■■';
            }
        },  // cx_page.set_align

        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_page.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_color ■■■';
            }
        },  // cx_page.set_color

        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(param_) {
            try {
                if (this.options.debug) console.log('cx_page.set_value');
                param_.value = parseInt(param_.value, 10);
                this.mod[param_.id] = param_.value;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_value ■■■';
            }
        },  // cx_page.set_value

        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function(id_) {
            try {
                if (this.options.debug) console.log('cx_page.get_value');
                return this.mod[id_];
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.get_value ■■■';
            }
        },  // cx_page.get_value

        /*----------------------------------------------
        * @cx_pager 페이지 그리기
        ----------------------------------------------*/
        draw_page: function(param_) {
            try {
                if (this.options.debug) console.log('cx_page.draw_page');
                if (param_ === undefined)
                    return;
                param_ = parseInt(param_, 10);
                this.set_value({id:'total_rows', value:param_});
                this.calc_page();        // 전체 페이지를 계산

                var html_ = '', i = 0;
                if (this.mod.page > this.mod.row_width) {
                    html_ += '<a class="pagebox" name="'+this.cfg.id+'page_link" href="#" cx-page="1"><span style="font-size:11px;letter-spacing:-1px">◀◀</span></a>&nbsp;';
                }
                if (this.mod.page_prev > 0) {
                    html_ += '<a class="pagebox" name="'+this.cfg.id+'page_link" href="#" cx-page="'+ this.mod.page_prev +'"><span style="font-size:11px">◀</span></a>&nbsp;';
                }

                for (i=this.mod.page_start; i<=this.mod.page_end; i++) {
                    if (i == this.mod.page) {
                //html_ += '<a class="pagebox selected" href="#">'+ i +'</a>&nbsp;';
                        html_ += '<a class="pagebox selected" name="'+this.cfg.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    } else {
                        html_ += '<a class="pagebox" name="'+this.cfg.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    }
                }
                if (this.mod.page < this.mod.page_next && this.mod.page_next <= this.mod.page_total) {
                    html_ += '<a class="pagebox" name="'+this.cfg.id+'page_link" href="#" cx-page="'+ this.mod.page_next +'"><span style="font-size:11px">▶</span></a>&nbsp;';
                }

                if (this.mod.page_total > this.mod.page_next) {
                    html_ += '<a class="pagebox" name="'+this.cfg.id+'page_link" href="#" cx-page="'+ this.mod.page_total +'"><span style="font-size:11px;letter-spacing:-2px">▶▶</span></a>';
                }
                this.element.html(html_);
                this.bind_event();  // 이벤트 바인딩
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_page.draw_page ■■■';
            }
        },  // cx_page.draw_page

        /*----------------------------------------------
        * @cx_pager 페이지 제거
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_page.set_clear');
                this.element.children().remove();
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_page.set_clear ■■■';
            }
        },  // cx_page.set_clear


        /*----------------------------------------------
        * @cx_pager 페이지에 관계된 값을 계산
        ----------------------------------------------*/
        calc_page: function() {
            try {
                if (this.options.debug) console.log('cx_page.calc_page');
                this.mod.page_total = parseInt((this.mod.total_rows / this.mod.row_height), 10) + (this.mod.total_rows % this.mod.row_height > 0 ? 1 : 0);
                this.mod.page_start = ((parseInt((this.mod.page / this.mod.row_width), 10) + (this.mod.page % this.mod.row_width > 0 ? 1 : 0)) * this.mod.row_width - (this.mod.row_width - 1));
                this.mod.page_end = ((parseInt((this.mod.page / this.mod.row_width), 10) + (this.mod.page % this.mod.row_width > 0 ? 1 : 0)) * this.mod.row_width);

                // 마지막 페이지
                if (this.mod.page_end > this.mod.page_total) {
                    this.mod.page_end = this.mod.page_total;
                }
                // 이전 페이지
                if (this.mod.page_start > this.mod.row_width)
                    this.mod.page_prev = this.mod.page_start - 1;
                else
                    this.mod.page_prev = 0;

                // 다음 페이지
                if (this.mod.page_end < this.mod.page_total)
                    this.mod.page_next = this.mod.page_end + 1;
                else
                    this.mod.page_next = this.mod.page_total;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_page.calc_page ■■■';
            }
        },  // cx_page.calc_page

        /*----------------------------------------------
        * @cx_pager 이벤트 바인딩
        ----------------------------------------------*/
        bind_event: function() {
            try {
                if (this.options.debug) console.log('cx_page.bind_event');
                var _self = this;
                this.$link = $('a[name="'+_self.cfg.id+'page_link"]');
                this.$link.on('click', {'cfg':_self.cfg}, function(evt_) {
                    _self.set_value({id:'page', value:$(evt_.currentTarget).prop('cx-page')});  // 현재 페이지 설정
                    _self.cfg.click(evt_);     // 호출측 callback 수행
                    _self.draw_page();     // 페이지 그리기
                });
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_page.bind_event ■■■';
            }
        },  // cx_page.bind_event

        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_page._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page._create ■■■';
            }
        },  // cx_page._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_page._init');
                this.clear();
                var _self = this;

                this.cfg = $.extend(this.cfg, this.options.cfg);
                this.cfg.id = this.element.prop('id');
                this.mod.row_height = this.cfg.row_height;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page._init ■■■';
            }
        },  // cx_page._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_page.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.destroy ■■■';
            }
        },  // cx_page.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_page.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.cfg ■■■';
            }
        },  // cx_page.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_page.set_option');
                this.options = $.extend(this.options, param_);
                this.cfg = this.options.cfg;    // 다시 적용
                this.$mod = this.options.$mod;  // 다시 적용
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.set_option ■■■';
            }
        },  // cx_page.set_option
        /*----------------------------------------------
        * @cx_page
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_page.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , pt_idx    : null      // m + tab index
                    , myfocus   : null      // 나의 현재 포커스 객체(item_)
                    , mytab     : -1        // 나의 탭 인덱스
                    , now_tab   : -1        // 현재 active 된 탭 인덱스
                },
                this.mod = {
                      row_height  : 10      // 한 페이지 리스트 갯수
                    , row_width   : 10      // 페이징 박스에서 페이지 표시 갯수
                    , total_rows  : 0       // 전체 데이터의 레코드 수
                    , page        : 1       // 현재 페이지 번호
                    , page_prev   : 0       // 이전 페이지 번호 -- 신규
                    , page_next   : 0       // 다음 페이지 번호
                    , page_total  : 0       // 전체 페이지 수
                    , page_start  : 0       // 질의에 사용될 데이터 번호
                    , page_end    : 10      // 질의에 사용될 데이터 번호 (row_height 대신에 사용함)
                    , block       : 0       // 현재 블록 번호
                    , block_total : 0       // 전체 블록 번호
                    , block_prev  : 0       // 이전 블록 번호
                    , block_next  : 0       // 다음 블록 번호 -- 신규
                    , block_now   : 0       // 현재 블록 번호 -- 신규
                    , $link       : null    // a link
                    , module      : null    // 객체 모듈명(반드시 객체 생성時 부여할 것)
                    , click       : null    // 콜백(반드시 객체 생성時 부여할 것)
                };
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_page.clear ■■■';
            }
        },  // cx_page.clear

    });
        })(cxApp);

