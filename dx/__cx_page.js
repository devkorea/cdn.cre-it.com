

/*******************************************************************************************************
1. Plugin       : Page
2. Plugin Desc  :
3. Create Date  : 2018-03-23
4. Create User  : koreaERP@gmail.com
5. Dependency   :
6. Execute Test :
*******************************************************************************************************/
;(function ($) {
    'use strict';
    var methods = {
        init: function (prefix_, cfg_, debug_) {
            var _act = {}, _evt = {}, _self = null, m = prefix_, _cfg = {}, _debug = false;
            var version = '0.0.0.1';

            // ###############################################################################################
            // @desc public
            // ###############################################################################################
            /*----------------------------------------------
            * @desc event parse / 외부 인터페이스
            ----------------------------------------------*/
            _act.dx_page = function(evt_, cfgParam_) {
                switch (evt_) {
                    case 'new':
                    case 'reset':
                    case 'clear':_act.clear_page(); break;
//                    case 'reload': _act.clear_page(); break;
                    case 'get': return _act.get_page(cfgParam_); break;
                    case 'set': _act.set_page(cfgParam_); break;
                    case 'draw': _act.draw_page(cfgParam_); break;
                }
            } // end func



            // ###############################################################################################
            // @desc private
            // ###############################################################################################
            /*----------------------------------------------
            * @desc initialize
            ----------------------------------------------*/
            _act.init = function() {
                if (_debug) console.log('method.initialize');
                _cfg = {
                    row_height      : 10,   // 한 페이지 리스트 갯수
                    row_width       : 10,   // 페이징 박스에서 페이지 표시 갯수
                    total_rows      : 0,    // 전체 데이터의 레코드 수
                    page            : 1,    // 현재 페이지 번호
                    page_prev       : 0,    // 이전 페이지 번호 -- 신규
                    page_next       : 0,    // 다음 페이지 번호
                    page_total      : 0,    // 전체 페이지 수
                    page_start      : 0,    // 질의에 사용될 데이터 번호
                    page_end        : 10,   // 질의에 사용될 데이터 번호 (row_height 대신에 사용함)
                    block           : 0,    // 현재 블록 번호
                    block_total     : 0,    // 전체 블록 번호
                    block_prev      : 0,    // 이전 블록 번호
                    block_next      : 0,    // 다음 블록 번호 -- 신규
                    block_now       : 0,    // 현재 블록 번호 -- 신규

                    $link           : null, // a link
                    module          : 'mpage'+m,   // 객체 모듈명(반드시 객체 생성時 부여할 것)
                    click           : ''    // 콜백(반드시 객체 생성時 부여할 것)
                },
                _cfg = $.extend(_cfg, cfg_[0]);
            } // end func


            /*----------------------------------------------
            * @desc 옵션값 설정
            ----------------------------------------------*/
            _act.set_page = function (param_) {
                if (_debug) console.log('method.set_page');
                param_.value = parseInt(param_.value, 10);
                _cfg[param_.id] = param_.value;
            } // end func

            /*----------------------------------------------
            * @desc 옵션값 반환
            ----------------------------------------------*/
            _act.get_page = function (param_) {
                if (_debug) console.log('method.get_page');
                return _cfg[param_];
            } // end func

            /*----------------------------------------------
            * @desc 페이지 그리기
            ----------------------------------------------*/
            _act.draw_page = function(param_) {
                if (_debug) console.log('method.draw_page');
                if (param_ === undefined)
                    return;
                param_ = parseInt(param_, 10);
                _act.set_page({id:'total_rows', value:param_});
                _act.calc_page();        // 전체 페이지를 계산

                var html_ = '', i = 0;
                if (_cfg.page > _cfg.row_width) {
                    html_ += '<a class="pagebox" name="'+_cfg.module+'page_link" href="#" dx-page="1"><span style="font-size:11px;letter-spacing:-1px">◀◀</span></a>&nbsp;';
                }
                if (_cfg.page_prev > 0) {
                    html_ += '<a class="pagebox" name="'+_cfg.module+'page_link" href="#" dx-page="'+ _cfg.page_prev +'"><span style="font-size:11px">◀</span></a>&nbsp;';
                }

                for (i=_cfg.page_start; i<=_cfg.page_end; i++) {
                    if (i == _cfg.page) {
//                        html_ += '<a class="pagebox selected" href="#">'+ i +'</a>&nbsp;';
                        html_ += '<a class="pagebox selected" name="'+_cfg.module+'page_link" href="#" dx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    } else {
                        html_ += '<a class="pagebox" name="'+_cfg.module+'page_link" href="#" dx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    }
                }
                if (_cfg.page < _cfg.page_next && _cfg.page_next <= _cfg.page_total) {
                    html_ += '<a class="pagebox" name="'+_cfg.module+'page_link" href="#" dx-page="'+ _cfg.page_next +'"><span style="font-size:11px">▶</span></a>&nbsp;';
                }

                if (_cfg.page_total > _cfg.page_next) {
                    html_ += '<a class="pagebox" name="'+_cfg.module+'page_link" href="#" dx-page="'+ _cfg.page_total +'"><span style="font-size:11px;letter-spacing:-2px">▶▶</span></a>';
                }
                _self.html(html_);
                _evt.bind_page();  // 이벤트 바인딩
            } // end func

            /*----------------------------------------------
            * @desc 페이지 제거
            ----------------------------------------------*/
            _act.clear_page = function() {
                if (_debug) console.log('method.clear_page');
                _self.children().remove();
                return;
            } // end func

            /*----------------------------------------------
            * @desc 페이지에 관계된 값을 계산
            ----------------------------------------------*/
            _act.calc_page = function() {
                if (_debug) console.log('method.calc_page');
                _cfg.page_total = parseInt((_cfg.total_rows / _cfg.row_height), 10) + (_cfg.total_rows%_cfg.row_height > 0 ? 1 : 0);
                _cfg.page_start = ((parseInt((_cfg.page / _cfg.row_width), 10) + (_cfg.page % _cfg.row_width > 0 ? 1 : 0)) * _cfg.row_width - (_cfg.row_width - 1));
                _cfg.page_end = ((parseInt((_cfg.page / _cfg.row_width), 10) + (_cfg.page % _cfg.row_width > 0 ? 1 : 0)) * _cfg.row_width);

                // 마지막 페이지
                if (_cfg.page_end > _cfg.page_total) {
                    _cfg.page_end = _cfg.page_total;
                }
                // 이전 페이지
                if (_cfg.page_start > _cfg.row_width)
                    _cfg.page_prev = _cfg.page_start - 1;
                else
                    _cfg.page_prev = 0;

                // 다음 페이지
                if (_cfg.page_end < _cfg.page_total)
                    _cfg.page_next = _cfg.page_end + 1;
                else
                    _cfg.page_next = _cfg.page_total;

            } // end func


            /*----------------------------------------------
            * @desc reset 폼
            ----------------------------------------------*/
            _act.reload_page = function() {
                if (_debug) console.log('method.reset_page');
                var page_ = _cfg.page + '';
                var $page = this;
                $.each($page.$link, function (idx_, item_) {
                    if (page_ === item_.innerText) {
                        $page.$link[idx_].click();
                        return false;
                    }
                });
            } // end func


            // ###############################################################################################
            // @desc event
            // ###############################################################################################
            /*----------------------------------------------
            * @desc 이벤트 바인딩
            ----------------------------------------------*/
            _evt.bind_page = function() {
                if (_debug) console.log('event.bind_page');
                this.$link = $('a[name="'+_cfg.module+'page_link"]');
                this.$link.on('click', {item:this}, function(paramEvt_) {
                    _act.set_page({id:'page', value:$(paramEvt_.currentTarget).attr('dx-page')});  // 현재 페이지 설정
//                    _cfg.click(paramEvt_, paramEvt_.data.item);     // 호출측 callback 수행
                    _cfg.click(paramEvt_, {'m':m});     // 호출측 callback 수행
                    _act.draw_page();     // 페이지 그리기
                });
            } // end func

            // ###############################################################################################
            // @desc initialize
            // ###############################################################################################
            if (debug_ === true) _debug = true;
            _self = this;

            _act.init();
            this.dx_page = _act.dx_page
            return this;
        } // end func
    }
    $.fn.dx_page = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);
// $('<span></span>').module_11_1(mod_);

