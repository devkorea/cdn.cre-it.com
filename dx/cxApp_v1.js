        /*----------------------------------------------
        * @desc
        * @dependency   : jquery
                          jquery-ui.tab
                          jquery-ui.selectmenu
                          jquery-ui.datepicker
                          jquery-ui.dialog

        mask: https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html


- 2018-04-21 모든 메서드 try cache 처리할 것
- Grid Editing
- 모든 처리 async 처리할 것
        ----------------------------------------------*/
        ;var cxApp = window.minQuery || window.jQuery;
        (function(app_) {
        'use strict';
        app_ = app_ || {};
        app_.version = '0.0.0.1';
        app_.lastdate = '2018-04-16 오후 8:05';
        app_.loop = null;
        app_.$tip = null;
        app_.cfg = {
              a         : null
            , w         : 0    // 프로그램 높이
            , h         : 0    // 프로그램 높이
            , h_limit   : 750                   // 더 이상 줄어들수 없는 최소높이
            , debug     : false                 // 디버그 모드
            , theme     : null                  // 테마
            , $wrap_body: null                  // 프로그램 영역
            , $popup    : null                  // 팝업 객체(복사용)
            , tip_time  : 1000                  // 툴팁 생존 시간
        };


    /*----------------------------------------------
    * @app tooltip
    * @returns  {void}
    ----------------------------------------------*/
    app_.set_resize = function() {
        try {
            if (app_.cfg.debug) console.log('cxApp.set_resize');
            app_.cfg.w = $(window).width() - 45;
            app_.cfg.h = $(window).height();
            $(window).resize(function() {
                app_.cfg.w = $(window).width() - 45;
                app_.cfg.h = $(window).height();
                if (app_.cfg.h < app_.cfg.h_limit)  // 필요이상으로 줄어들면 처리하지 않음
                    return;
                app_.cfg.$wrap_body.css('height', app_.cfg.h - 90);    // 이곳에서 잘못하면 스크롤이 생김
            });
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.set_resize ■■■';
        }
    } // end func.cxApp -> set_resize

    /*----------------------------------------------
    * @app tooltip
    * @returns  {void}
    ----------------------------------------------*/
    app_.show_tip = function(evt_, msg_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.tip_show');
            if (app_.$tip.css('display') != 'none')
                return;
            var _off = {};
            if (evt_[0] == undefined) {
                _off = $(evt_.currentTarget).offset();
                if (msg_ == undefined || msg_ == '')
                    msg_ = $(evt_.currentTarget).attr('title');
            } else {
                _off = evt_.offset();
                if (msg_ == undefined || msg_ == '')
                    msg_ = evt_.attr('title');
            }
            app_.$tip.css({top: (_off.top-40)+'px', 'left':(_off.left)+'px'}).html(msg_).show('blind', function(){
                setTimeout(function() {
                    app_.$tip.hide('blind');
                }, 1000);
            });
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.tip_show ■■■';
        }
    } // end func.cxApp -> tip_show

    /*----------------------------------------------
    * @app initialize
    * @returns  {void}
    ----------------------------------------------*/
    app_.init = function() {
        try {
            if (app_.cfg.debug) console.log('cxApp.init');
            app_.set_resize();
            app_.$tip = $('#tooltip');

            //$(document).tooltip({ // app_.$tip 으로 변경함(엔터때 사용하기 어려우므로)
            //      tooltipClass: 'tooltip'
            //    , track: true
            //    , show:{duration: 100,effect:'blind'}
            //    , position: {my:'center bottom-10', at: 'center top' }
            //    , open: function(evt_, ui_) {
            //        setTimeout(function () {
            //            $(ui_.tooltip).hide('blind');
            //        }, 2000);
            //    }
            //});

            $.fn.rowspan = function(colIdx, isStats) {
                return this.each(function(){
                    var that;
                    $('tr', this).each(function(row) {
                        $('td',this).eq(colIdx).filter(':visible').each(function(col) {
                            if ($(this).html() == $(that).html()
                                && (!isStats
                                        || isStats && $(this).prev().html() == $(that).prev().html()
                                        )
                                ) {
                                rowspan = $(that).prop('rowspan') || 1;
                                rowspan = Number(rowspan)+1;
                                $(that).prop('rowspan', rowspan);
                                // do your action for the colspan cell here
                                //$(this).hide();

                                $(this).remove();
                                // do your action for the old cell here

                            } else {
                                that = this;
                            }

                            // set the that if not already set
                            that = (that == null) ? this : that;
                        });
                    });
                });
            };
            $.fn.colspan = function(rowIdx) {
                return this.each(function() {
                    var that;
                    $('tr', this).filter(':eq('+rowIdx+')').each(function(row) {
                    $(this).find('td').filter(':visible').each(function(col) {
                        if ($(this).html() == $(that).html()) {
                            colspan = $(that).prop('colSpan');
                            if (colspan == undefined) {
                                $(that).prop('colSpan', 1);
                                colspan = $(that).prop('colSpan');
                            }
                            colspan = Number(colspan)+1;
                            $(that).prop('colSpan', colspan);
                            $(this).hide(); // .remove();
                        } else {
                            that = this;
                        }
                        that = (that == null) ? this : that; // set the that if not already set
                      });
                     });
                });
            };

            if (x1_exe) { // ########### EXE 에서만 처리
                document.body.addEventListener('contextmenu', function(evt_) {
                    evt_.stopPropagation();    // 이벤트 버블 중지
                    evt_.preventDefault();     // 기본 이벤트 취소
                    return false;
                });
                document.body.addEventListener('keydown', function(evt_) {
                    if (!evt_.ctrlKey && evt_.keyCode == 116) {
                        evt_.stopPropagation();    // 이벤트 버블 중지
                        evt_.preventDefault();     // 기본 이벤트 취소
                        return false;
                    }
                });
            }

            // alertBox 가 활성화되어 있다면 alertBox 에 항상 포커싱 처리(
            $(window).on('focus, click', function(){
                if (alertBox.isOpen == true) {
                    setTimeout(function() {
                        alertBox.msgbtn.firstChild.focus();
                    }, 10);
                }
            });

            app_.cfg.theme = x1_theme;
            app_.cfg.$wrap_body = $('#wrap_body');
            app_.cfg.$popup = $('#cx_popup');
            app_.cfg.$iframe = $('#cx_frame');
            app_.cxUtil = new app_.cx_util();
            app_.cxValidator = new app_.cx_validator();
            app_.cxFormat = new app_.cx_format();
            app_.cxRandom = new app_.cx_random();

            var html_p = ''
                    + '    <table class="grid" style="width: 100%;table-layout: fixed;" id="cx_popupthead">        '
                    + '    <colgroup></colgroup>                                                                   '
                    + '    <caption>                                                                               '
                    + '        <label>검색어</label><input type="text" class="w_100" id="cx_popupstxt" value="" /> '
                    + '        <button id="cx_popupbtn_search" class="btn btn_normal btn_green">조&nbsp;회</button>'
                    + '    </caption>                                                                              '
                    + '    <thead></thead>                                                                         '
                    + '    </table>                                                                                '
                    + '    <div style="overflow-y: scroll;min-height: 90%;height: 90%;">                           '
                    + '        <table class="grid" style="width: 100%;table-layout: fixed" id="cx_popuptbody">     '
                    + '        <colgroup></colgroup>                                                               '
                    + '                                                                                            '
                    + '        <tbody></tbody>                                                                     '
                    + '        </table>                                                                            '
                    + '    </div>                                                                                  ';


            app_.cfg.$popup.append(html_p);  // 팝업 HTML 을 로드(아주 중요함)
            app_.$$ = $('#cx_alert').cx_alert({});

            // Dialog Title 에 아이콘 추가
            $.widget('ui.dialog', $.extend({}, $.ui.dialog.prototype, {
                _title: function(title) {
                    if (!this.options.title ) {
                        title.html('<i class="fas fa-arrow-alt-circle-right"></i>');
                    } else {
                        title.html('<i class="fas fa-arrow-alt-circle-right"></i> ' + this.options.title);
                    }
                }
            }));

        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.init ■■■';
        }
    } // end func.cxApp -> init

    /*----------------------------------------------
    * @app form submit
    * @returns  {array}
    ----------------------------------------------*/
    app_.submit = function(param_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.submit');
            app_.chk_param('act', param_);
            var result;
            $.ajax({
                url: param_.act,
                type: 'POST',
                dataType: 'json',
                contentType:'application/x-www-form-urlencoded; charset=utf-8',
                async: false,
                cache: false,
                data: param_.data,
                success: function(data, textStatus) {
                    result = data;
                },
                error: function(request, status, error) {
                    console.log(request.responseText);
                    console.log(status);
                    throw '■■■ error (cxApp.submit) ■■■';
                }
            });
            if (param_.debug != undefined && param_.debug == true) {
                console.log(param_);
                console.error(result);
                throw '■■■ debug mode ■■■';
            } else {
                if (result == undefined) {
                    console.log(param_);
                    console.error(result);
                    throw '■■■ 결과값 오류입니다 ■■■';
                }
                if (result.result == false) {
                    if (result.msg)
                        alertBox.show('알림', result.msg);
                    else
                        alertBox.show('알림', '조회된 데이터가 없거나 처리되지 않았습니다(No message)');
                }
            }
            return result;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.submit ■■■';
        }
    } // end func.cxApp -> submit

    /*----------------------------------------------
    * @app form async
    * @returns  {array}
    ----------------------------------------------*/
    app_.async = function(param_, callback_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.async');
            app_.chk_param('callback', callback_);
            app_.chk_param('act', param_);
            app_.chk_param('now_tab', param_);
            $.ajax({
                url: param_.act,
                type: 'POST',
                dataType: 'json',
                contentType:'application/x-www-form-urlencoded; charset=utf-8',
                async: true,
                cache: false,
                data: param_.data,
                success: function(result, textStatus) {
                    if (param_.debug != undefined && param_.debug == true) {
                        console.log(param_);
                        console.error(result);
                        throw '■■■ debug mode ■■■';
                    } else {
                        if (result == undefined) {
                            console.log(param_);
                            console.error(result);
                            throw '■■■ 결과값 오류입니다 ■■■';
                        }
                        result.now_tab = param_.now_tab
                        callback_(result);
                    }
                },
                error: function(request, status, error) {
                    console.log(request.responseText);
                    console.log(status);
                    throw '■■■ error (cxApp.async) ■■■';
                }
            });
        } catch(e) {
            console.info(e);
            throw '■■■ error : cxApp.async ■■■';
        }
    } // end func.cxApp -> async

    /*----------------------------------------------
    * @app upload form upload
            반드시 form 태그에 onsubmit="return false" 사용금지
            반드시 btn_up 이벤트에서 파일이 있는지 체크할 것
    * @returns  {array}
    ----------------------------------------------*/
    app_.upload = function(param_, callback_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.upload');
            app_.chk_param('callback', callback_);
            app_.chk_param('act', param_);
            app_.chk_param('now_tab', param_);
            var _res = false;
            var _$ifrm = $('<iframe id="cx_frame" name="cx_frame" style="width:100vw;height:10vh;display:none" src=""></iframe>');
            if (param_.debug == true) _$ifrm.show();
            param_.frm.append(_$ifrm);
            param_.frm.prop('target', 'cx_frame');
            param_.frm.prop('action', param_.act);
            param_.frm.submit( function() {
                _$ifrm.on('load', function() {
                    _res = JSON.parse(_$ifrm.contents().find('body').html());
                    _res.now_tab = param_.now_tab;
                    if (_res == false || _res.result === false) {
                        alertBox.show('알림', _res.msg, function() {
                            callback_({now_tab:param_.now_tab, result:false});
                        });
                    } else {
                        callback_(_res);
                    }
                    _$ifrm.remove();
                    param_.frm.prop('target', '');
                    param_.frm.prop('action', '');
                    return true;
                });
                return true;
            });
            return true;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.upload ■■■';
        }
    } // end func.cxApp -> upload

    /*----------------------------------------------
    * @app param checking
    * @returns  {bool | throw}
    ----------------------------------------------*/
    app_.chk_param = function(type_, param_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.chk_param');
            switch(type_) {
            case 'callback':
                if (param_ == undefined || typeof param_ != 'function') {
                    throw '■■■ error (undefined callback or callback is not function) ■■■';
                }
                break;

            case 'act':
                if (param_ == undefined || param_.act == undefined || typeof param_.act != 'string') {
                    throw "■■■ error (undefined param['act'] or param['act'] is not string) ■■■";
                }
                break;

            case 'now_tab':
                if (param_ == undefined || param_.now_tab == undefined || typeof param_.now_tab != 'number') {
                    throw "■■■ error (undefined param['now_tab'] or param['now_tab'] is not number) ■■■";
                }
                break;
            }
            return true;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.chk_param ■■■';
        }
    } // end func.cxApp -> chk_param

    /*----------------------------------------------
    * @app 모듈을 담을 변수를 생성 (참조로 전달됨)
    * @returns  {void}
    ----------------------------------------------*/
    app_.var_mod = function (m_, len_, mod_, $mod_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.var_mod');
            if (len_ == 0) {
                mod_['m'+m_] = {
                    mDiv: null,dDiv: null,sDiv:null,
                    mSch: null,dSch: null,sSch:null,
                    mFrm: null,dFrm: null,sFrm:null,
                    mGrd: null,dGrd: null,sGrd:null,
                    mPag: null,dPag: null,sPag:null,
                    mDivC:null,dDivC:null,sDivC:null, // config
                    mSchC:null,dSchC:null,sSchC:null,
                    mFrmC:null,dFrmC:null,sFrmC:null,
                    mGrdC:null,dGrdC:null,sGrdC:null,
                    mPagC:null,dPagC:null,sPagC:null,
                }
                $mod_['m'+m_] = {
                    mDiv: null,dDiv: null,sDiv:null,
                    mSch: null,dSch: null,sSch:null,
                    mFrm: null,dFrm: null,sFrm:null,
                    mGrd: null,dGrd: null,sGrd:null,
                    mPag: null,dPag: null,sPag:null,
                }
            } else {
                for(var i=0; i<=len_; i++) {
                    mod_['m'+m_+i] = {
                        mDiv: null,dDiv: null,sDiv:null,
                        mSch: null,dSch: null,sSch:null,
                        mFrm: null,dFrm: null,sFrm:null,
                        mGrd: null,dGrd: null,sGrd:null,
                        mPag: null,dPag: null,sPag:null,
                        mDivC:null,dDivC:null,sDivC:null, // config
                        mSchC:null,dSchC:null,sSchC:null,
                        mFrmC:null,dFrmC:null,sFrmC:null,
                        mGrdC:null,dGrdC:null,sGrdC:null,
                        mPagC:null,dPagC:null,sPagC:null,
                    }
                    $mod_['m'+m_+i] = {
                        mDiv: null,dDiv: null,sDiv:null,
                        mSch: null,dSch: null,sSch:null,
                        mFrm: null,dFrm: null,sFrm:null,
                        mGrd: null,dGrd: null,sGrd:null,
                        mPag: null,dPag: null,sPag:null,
                    }
                }
            }
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.var_mod  ■■■';
        }
    } // end func.cxApp -> var_mod

    /*----------------------------------------------
    * @app 제로필
    * @returns  {string}
    ----------------------------------------------*/
    app_.zerofill = function (num_, w_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.zerofill');
            w_ -= num_.toString().length;
            if (w_ > 0) {
                return new Array(w_ + (/\./.test(num_) ? 2 : 1)).join('0') + num_;
            }
            return num_ + '';
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.zerofill ■■■';
        }
    } // end func.cxApp -> zerofill

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리
    * @returns  {json}
    ----------------------------------------------*/
    app_.__init_item = function (item_, key_, default_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.__init_item');
            if (item_[key_] == undefined)
                item_[key_] = default_;
            else {
                if (!item_[key_])
                    item_[key_] = default_;
            }
            // number 도 마스크를 사용중이므로 기본값을 사용안 함
            return item_;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.__init_item -> invalid item param('+key_+') ■■■';
        }
    } // end func.cxApp -> __init_item

    /*----------------------------------------------
    * @app 주어진 prefix 를 제거한 param 을 반환
    * @returns  {json}
    ----------------------------------------------*/
    app_.change_param = function(prefix_, param_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.change_param');
            var _reg = new RegExp('^'+prefix_, '');
            var _param = {};
            $.each(param_, function (key_, data_) {
                if (_param[key_.replace(_reg, '')] != undefined && _param[key_.replace(_reg, '')])
                    return true;    // 값이 있으면 통과
                _param[key_.replace(_reg, '')] = data_;
            });
            return _param;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.change_param ■■■';
        }
    } // end func.cxApp -> change_param

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리 (form, edit grid 일때 사용)
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_item = function (item_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.init_item');
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined || item_.pt_idx == undefined)
                throw '■■■ error: cxApp.init_item -> unknown item property (type, id, text, pt_idx) ■■■';
            // 공통 속성
            item_ = app_.__init_item(item_, 'align', '');
            item_ = app_.__init_item(item_, 'color', '');
            item_ = app_.__init_item(item_, 'format', '');
            item_ = app_.__init_item(item_, 'next', '');
            item_ = app_.__init_item(item_, '$next', '');
            item_ = app_.__init_item(item_, 'mask', '');
            item_ = app_.__init_item(item_, 'ptype', 'form');
            item_ = app_.__init_item(item_, 'value', '');
            item_ = app_.__init_item(item_, 'check', '');   // 값 검수가 필요할때 처리할 사용자 함수



            // boolean 속성
            item_ = app_.__init_item(item_, 'edit', false);
            item_ = app_.__init_item(item_, 'focus', false);
            item_ = app_.__init_item(item_, 'key', false);
            item_ = app_.__init_item(item_, 'need', false);     // required 로 변경할 것
            item_ = app_.__init_item(item_, 'multi', false);   // 혹시나 해서 생성함(아직 미사용:2018-04-24)
            item_ = app_.__init_item(item_, 'required', false);
            item_ = app_.__init_item(item_, 'rowend', false);
            item_ = app_.__init_item(item_, 'rowstart', false);
            item_ = app_.__init_item(item_, 'disabled', false);
            item_ = app_.__init_item(item_, 'readonly', false);
            item_ = app_.__init_item(item_, 'is_disabled', false);  // 값이 있으면 disabled 처리됨

            if (item_.type == 'label')
                return item_;

            // 공통 이벤트
            item_ = app_.__init_item(item_, 'click', '');

            switch (item_.type) {
            case 'number':
            case 'int':
            case 'integer':
                item_ = app_.__init_item(item_, 'mask', '#,##0');
                item_ = app_.__init_item(item_, 'min', 0);
                item_ = app_.__init_item(item_, 'max', 0);
                break;
            case 'float':
            case 'double':
                item_ = app_.__init_item(item_, 'min', 0);
                item_ = app_.__init_item(item_, 'max', 0);
                item_ = app_.__init_item(item_, 'dec', 1);  // 기본 소숫점 자릿수
                var mask = '#,##0.'; for(var i=0; i<item_.dec; i++) { mask += '0'; }
                item_ = app_.__init_item(item_, 'mask', mask);
                break;
            }

            // 팝업속성인뎅..
            item_ = app_.__init_item(item_, 'w', 0);
            return item_;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.init_item -> invalid item ■■■';
        }
    } // end func.cxApp -> init_item

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리 (데이타 그리드 일때 사용)
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_grid = function (item_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.init_grid');
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined || item_.pt_idx == undefined)
                throw '■■■ error: cxApp.init_grid -> unknown item property (type, id, text, pt_idx) ■■■';
            // 공통 속성
            item_ = app_.__init_item(item_, 'align', '');
            item_ = app_.__init_item(item_, 'hidden', '');
            // 팝업속성인뎅..
            item_ = app_.__init_item(item_, 'w', 0);
            return item_;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.init_grid -> invalid item ■■■';
        }
    } // end func.cxApp -> init_grid

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 생성
    * @returns  {json}
    ----------------------------------------------*/
    app_.create_item = function ($obj_, ptype_, pt_idx_, item_, $parent_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.create_item');
            switch (item_.type) {
            case 'div':
            case 'span':
            case 'label':
                return $obj_.cx_label($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'hidden':
            case 'text':
                return $obj_.cx_text($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'date':
                return $obj_.cx_date($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'number':
            case 'int':
            case 'integer':
                return $obj_.cx_int($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'float':
            case 'double':
                return $obj_.cx_float($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'radio':
                return $obj_.cx_radio($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'check':
            case 'checkbox':
                return $obj_.cx_check($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'select':  // app_.cfg.theme == 'ui'
            case 'combo':   // app_.cfg.theme == 'ui'
                return $obj_.cx_combo($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'button':
                return $obj_.cx_button($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'pop':
                return $obj_.cx_pop($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            }
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.create_item ■■■';
        }
    } // end func.cxApp -> create_item

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - common form (label, text, int, float, date, check, radio, button 공통임 - combo, pop 는 별도)
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_comm = {
        init: function (item_, $parent_, caller_) {
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_comm initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_comm.init');
                    item_ = app_.init_item(item_, 'cx_comm.init');   // 하나의 {} 만 처리됨
                    item = item_;
                    item.$obj = $('#'+item.pt_idx+item.id); // 소속모듈에서 사용하기 위해

                    if (item.mask) {
                        $self.mask(item.mask, {reverse: true, placeholder:item.mask.replace(/[0|#|?|*]/g, '_')});
                        $self.attr('placeholder', item.mask.replace(/[0|#|?|*]/g, '_'));
                    }
                    if (item.align) {
                        $self.addClass(item.align);
                    }
                    if (item.readonly)
                        $self.prop('readonly', true);
                    if (item.disabled)
                        $self.prop('disabled', true);
                    if (item.focus)
                        $self.set_focus('cx_comm.init');
                    $self.prop('placeholder', item.text);

                    $self.on('click', {item:$self}, this.evt_click);
                    $self.on('keydown', {item:$self}, this.evt_keydown);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.init ■■■';
                }
            } // end func.cx_comm -> init

            /*----------------------------------------------
            * @cx_comm keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('cx_comm.evt_keydown');
                    if (item.ptype != 'form')
                        $self.set_data(evt_.currentTarget.value);       // 이것도 개 이상함(2018-05-01)
                    switch (evt_.keyCode) {
                    case 13:
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        var _data = {'stxt':''};
                        if (item.ptype == 'form') {
                            _data.stxt = $self.get_data();
                            if (item.required) {
                                if (!_data.stxt) {
                                    app_.show_tip($self, '필수항목 입니다 ('+item.text+')');
                                    return;
                                }
                            }
                            if (_data.stxt) {
                                if (typeof $self.validate == 'function') {
                                    if (!$self.validate('cx_comm.evt_keydown')) {
                                        app_.show_tip($self, '유효한 값이 아닙니다 ('+item.text+')');
                                        return;
                                    }
                                }
                            }
                            if (typeof item.check == 'function') {
                                _data = item.check(evt_, item, _data);
                                if (_data == undefined || _data == false)   // 사용자가 취소하면 더 이상 진행안함
                                    return false;
                            }

                            if (item.$next)
                                item.$next.set_focus('cx_comm.evt_keydown');
                        } else {
                            _data.stxt = $self.get_data();
                            if (item.required) {
                                if (!_data.stxt) {
                                    app_.show_tip($(evt_.currentTarget), '필수항목 입니다 ('+item.text+')');
                                    return;
                                }
                            }
                            if (typeof item.check == 'function') {
                                _data['rowindex_edit'] = $(evt_.currentTarget).closest('tr')[0].rowindex;
                                _data = item.check(evt_, item, _data);
                                if (_data == undefined || _data == false)   // 사용자가 취소하면 더 이상 진행안함
                                    return false;
                            }

                            $parent.next_focus(evt_, item);
                        }
                        break;
                    case 38:
                    case 40:
                        if (item.ptype == 'grid') {
                            evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                            $parent.set_edit_keydown(evt_, item);
                        }
                        break;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.evt_keydown ■■■';
                }
            } // end event.cx_comm -> evt_keydown

            /*----------------------------------------------
            * @cx_comm click
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_click = function(evt_) {
                try {
                    if (item.debug) console.log('cx_comm.evt_click');
                    $self.set_focus('cx_comm.evt_click');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.evt_click ■■■';
                }
            } // end event.cx_comm -> evt_click

            /*----------------------------------------------
            * @cx_comm set_show
            * @returns  {void)
            ----------------------------------------------*/
            this.set_show = function(caller_) {
                try {
                    if (item.debug) console.log('cx_comm.set_show');
                    $self.css('visibility', 'visible');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.set_show ■■■';
                }
            } // end event.cx_comm -> set_show

            /*----------------------------------------------
            * @cx_comm set_hide
            * @returns  {void)
            ----------------------------------------------*/
            this.set_hide = function(caller_) {
                try {
                    if (item.debug) console.log('cx_comm.set_hide');
                    $self.css('visibility', 'hidden');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.set_hide ■■■';
                }
            } // end event.cx_comm -> set_show

            /*----------------------------------------------
            * @cx_comm set_focus
            * @returns  {void)
            ----------------------------------------------*/
            this.set_focus = function(caller_, $edit_) {
                try {
                    if (item.debug) console.log('cx_comm.set_focus');
                    if (item.type == 'hidden') {
                        //console.error('hidden not focus..');
                        return;
                    }
                    if (item.$obj.prop('readonly') || item.$obj.prop('disabled')) {
                        //console.error('readonly or disabled');
                        return;
                    }
                    setTimeout(function() {
                        if ($edit_ == undefined) {   // 일반 폼일때
                            item.$obj.select().focus();
                            $parent_.set_closure_focus(item.id);    // 탭 클릭시 처리할 포커스 클로저
                        } else {                    // edit Row 에 소속된 폼 객체일때
                            $edit_.select().focus();
                            $parent_.set_closure_focus($edit_);    // 탭 클릭시 처리할 포커스 클로저
                        }
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.set_focus ■■■';
                }
            } // end event.cx_comm -> set_focus


            /*----------------------------------------------
            * @cx_comm set_cfg
            * @returns  {void)
            ----------------------------------------------*/
            this.set_cfg = function(param_) {
                try {
                    if (item.debug) console.log('cx_comm.set_cfg');
                    item = $.extend(item, param_);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_comm.set_cfg ■■■';
                }
            } // end event.cx_comm -> set_cfg

            this.init();
            $self.item = item;

            return item;    // this 를 반환하면 clone 객체에서 item 속성이 사라짐
        } // end method.cx_comm ->  init
    }; app_.fn.cx_comm = function (method) { return __cx_comm.init.apply(this, arguments); } // end of cx_comm

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - label
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_label = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_label initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_label.init');
                    item = app_.init_item(item_, 'cx_label.init');   // 하나의 {} 만 처리됨
                    if (item.ptype == 'form') {
                        item.$obj = $('#'+item.pt_idx+item.id);         // 소속모듈에서 사용하기 위해
                        if (item.align) {
                            if ($self.closest('td').length > 0)
                                $self.closest('td').addClass(item.align);
                        }
                        if (item.color) {
                            if ($self.closest('td').length > 0)
                                $self.closest('td').css('color', item.color);
                        }
                    } else {
                        var _tag = item.type;
                        if (_tag == 'label')
                            _tag = 'td';
                        item.$obj = $(_tag+'[name="'+item.pt_idx+item.id+'"]');
                    }
                    //console.info(item, item.$obj[0]);
                    //item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_label.init ■■■';
                }
            } // end func.cx_label -> init

            /*----------------------------------------------
            * @cx_label set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_label.set_data');
                    if (value_ == undefined)
                        $self.text(item.value);
                    else
                        $self.text($.trim(value_));
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_label.set_data ■■■';
                }
            } // end event.cx_label -> set_data
            /*----------------------------------------------
            * @cx_label get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_label.get_data');
                    $self.text($.trim($self.text()));
                    return $self.text();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_label.get_data ■■■';
                }
            } // end event.cx_label -> get_data

            this.init();
            $self.item = item;

            return this;
        } // end method.cx_label ->  init
    }; app_.fn.cx_label = function (method) { return __cx_label.init.apply(this, arguments); } // end of cx_label

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - hidden, text
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_text = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_text initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_text.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_text.init ■■■';
                }
            } // end func.cx_text -> init

            /*----------------------------------------------
            * @cx_text set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_text.set_data');
                    if (value_ == undefined || value_ === '')   // 이곳에서는 0 값도 제대로 저장되어야 함
                        $self.val(item.value);
                    else {
                        $self.val($.trim(value_));
                    }

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_)
                            $self.prop('disabled', false);
                        else
                            $self.prop('disabled', true);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_text.set_data ■■■';
                }
            } // end event.cx_text -> set_data
            /*----------------------------------------------
            * @cx_text get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_text.get_data');
                    $self.val($.trim($self.val()));
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_text.get_data ■■■';
                }
            } // end event.cx_text -> get_data

            this.init();
            $self.item = item;

            return this;
        } // end method.cx_text ->  init
    }; app_.fn.cx_text = function (method) { return __cx_text.init.apply(this, arguments); } // end of cx_text

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - int, integer, number
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_int = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_int initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_int.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_int.ini ■■■';
                }
            } // end func.cx_int -> init

            /*----------------------------------------------
            * @cx_int set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_int.set_data');
                    if (value_ == undefined || !value_)
                        $self.val(item.value);
                    else
                        $self.val(value_);

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_)
                            $self.prop('disabled', false);
                        else
                            $self.prop('disabled', true);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error:  ■■■';
                }
            } // end event.cx_int -> set_data
            /*----------------------------------------------
            * @cx_int get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_int.get_data');
                    $self.val($.trim($self.val()));
                    if ($self.val() == '')
                        return item.value;
                    if (!$self.validate())
                        return 0;
                    return parseInt($self.val().replace(/[,]/g, ''), 10);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_int.get_data ■■■';
                }
            } // end event.cx_int -> get_data

            /*----------------------------------------------
            * @cx_int validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('cx_int.validate');
                    //$self.val($.trim($self.val()));
                    return true;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_int.validate ■■■';
                }
            } // end event.cx_int -> validate

            this.init();
            $self.item = item;
            return this;
        } // end method.cx_int ->  init
    }; app_.fn.cx_int = function (method) { return __cx_int.init.apply(this, arguments); } // end of cx_int

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - float, double
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_float = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_float initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_float.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_float.init ■■■';
                }
            } // end func.cx_float -> init

            /*----------------------------------------------
            * @cx_float set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_float.set_data');
                    if (value_ == undefined || !value_)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_)
                            $self.prop('disabled', false);
                        else
                            $self.prop('disabled', true);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_float.set_data ■■■';
                }
            } // end event.cx_float -> set_data
            /*----------------------------------------------
            * @cx_float get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_float.get_data');
                    $self.val($.trim($self.val()));
                    if ($self.val() == '')
                        return item.value;
                    if (!$self.validate())
                        return 0;
                    return parseFloat($self.val());
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_float.get_data ■■■';
                }
            } // end event.cx_float -> get_data

            /*----------------------------------------------
            * @cx_float validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('cx_float.validate');
                    //$self.val($.trim($self.val()));

                    return true;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_float.validate ■■■';
                }
            } // end event.cx_float -> validate

            this.init();
            $self.item = item;
            return this;
        } // end method.cx_float ->  init
    }; app_.fn.cx_float = function (method) { return __cx_float.init.apply(this, arguments); } // end of cx_float

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - date
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_date = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_date initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_date.init');
                    item_ = app_.__init_item(item_, 'mask', '0000-00-00');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.datepicker({
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'yy-mm-dd',
                        showButtonPanel: true,
                        yearRange: "c-99:c+99",
                    });
                    $self.on('blur', $self.evt_blur);
                    $self.on('click', function(evt_) {
                        $self.datepicker('show');
                    });

                    $self.set_data();
                    $self.off('focus').datepicker('hide');
                    //$self.select();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_date.init ■■■';
                }
            } // end func.cx_date -> init

            /*----------------------------------------------
            * @cx_date set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_date.set_data');
                    if (value_ == undefined || !value_)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_)
                            $self.prop('disabled', false);
                        else
                            $self.prop('disabled', true);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_date.set_data ■■■';
                }
            } // end event.cx_date -> set_data
            /*----------------------------------------------
            * @cx_date get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_date.get_data');
                    if (!$self.validate())
                        return '';
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_date.get_data ■■■';
                }
            } // end event.cx_date -> get_data

            /*----------------------------------------------
            * @cx_date validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('cx_date.validate');
                    $self.val($.trim($self.val()));
                    var _date = $self.val();
                    if (_date.length != item.mask.length)
                        return false;
                    _date = (_date + '').replace(/-/g,'');
                    if (isNaN(_date))
                        return false;

                    var year = Number(_date.substring(0, 4));
                    var month = Number(_date.substring(4, 6));
                    var day = Number(_date.substring(6, 8));
                    var dd = day / 0;
                    if (month < 1 || month > 12)
                        return false;

                    var maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    var maxDay = maxDaysInMonth[month-1];

                    // 윤년 체크
                    if (month == 2 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0))
                        maxDay = 29;

                    if (day <= 0 || day > maxDay)
                        return false;
                    return true;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_date.validate ■■■';
                }
            } // end event.cx_date -> validate

            /*----------------------------------------------
            * @cx_date blur
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_blur = function(evt_) {
                try {
                    if (item.debug) console.log('cx_date.evt_blur');
                    $(this).off('focus').datepicker('hide');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_date.evt_blur ■■■';
                }
            } // end event.cx_date -> evt_blur



            this.init();
            $self.item = item;
            return this;
        } // end method.cx_date ->  init
    }; app_.fn.cx_date = function (method) { return __cx_date.init.apply(this, arguments); } // end of cx_date

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - radio
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_radio = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_radio initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_radio.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    item = app_.__init_item(item, 'checked', false);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_radio.init ■■■';
                }
            } // end func.cx_radio -> init

            /*----------------------------------------------
            * @cx_radio set_data (넘어온값과 value 가 동일하면 체크함)
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_radio.set_data');
                    if (value_ == undefined || !value_)
                        $self.prop('checked', item.checked);
                    else {
                        if ($self.val() == value_)  // 넘어온 값이 같으면
                            $self.prop('checked', true);
                    }

                    //if (item.is_disabled) {
                    //    if (value_ == undefined || !value_)
                    //        $self.prop('disabled', false);
                    //    else
                    //        $self.prop('disabled', true);
                    //}
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_radio.set_data ■■■';
                }
            } // end event.cx_radio -> set_data
            /*----------------------------------------------
            * @cx_radio get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_radio.get_data');
                    if (!$self.prop('checked'))
                        return false;
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_radio.get_data ■■■';
                }
            } // end event.cx_radio -> get_data

            this.init();
            $self.item = item;
            return this;
        } // end method.cx_radio ->  init
    }; app_.fn.cx_radio = function (method) { return __cx_radio.init.apply(this, arguments); } // end of cx_radio

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - checkbox
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_check = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_check initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_check.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    item = app_.__init_item(item, 'checked', false);
                    //$self.set_data();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_check.init ■■■';
                }
            } // end func.cx_check -> init

            /*----------------------------------------------
            * @cx_check set_data    (넘어온값과 value 가 동일하면 체크함)
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_check.set_data');
                    if (value_ == undefined || !value_)
                        $self.prop('checked', item.checked);
                    else {
                        if ($self.val() == value_)  // 넘어온 값이 같으면
                            $self.prop('checked', true);
                    }

                    //if (item.is_disabled) {
                    //    if (value_ == undefined || !value_)
                    //        $self.prop('disabled', false);
                    //    else
                    //        $self.prop('disabled', true);
                    //}
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_check.set_data ■■■';
                }
            } // end event.cx_check -> evt_keydown
            /*----------------------------------------------
            * @cx_check get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_check.get_data');
                    if (!$self.prop('checked'))
                        return false;
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_check.get_data ■■■';
                }
            } // end event.cx_check -> get_data

            this.init();
            $self.item = item;
            return this;
        } // end method.cx_check ->  init
    }; app_.fn.cx_check = function (method) { return __cx_check.init.apply(this, arguments); } // end of cx_check

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - button
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_button = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_button initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_button.init');
                    item = $self.cx_comm(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.on('click', {}, item.click);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_button.init ■■■';
                }
            } // end func.cx_button -> init

            this.init();
            $self.item = item;
            return this;
        } // end method.cx_button ->  init
    }; app_.fn.cx_button = function (method) { return __cx_button.init.apply(this, arguments); } // end of cx_button

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - combobox, select
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_combo = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;

            /*----------------------------------------------
            * @cx_combo initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_combo.init');
                    if ($self.prop('width'))    // 지정 넓이 속성이 있으면 해당 크기로 설정
                        item_.w = $self.prop('width');
                    item = app_.init_item(item_, 'cx_combo.init');
                    item.$obj = $('#'+item.pt_idx+item.id); // 소속모듈에서 사용하기 위해
                    if (app_.cfg.theme == 'ui') {


                        item = app_.__init_item(item, 'w', '100%');
                        $self.selectmenu({width : item.w});
                        item.$ui = $('#'+item.pt_idx+''+item_.id+'-button');
                        //console.error(item.id, item.$ui, $self.siblings('span'));
                        item.$ui.on('keydown', {'item':item}, $self.evt_keydown);
                        $self.$ui = item.$ui;
                    } else {
                        $self.on('keydown', {'item':item}, $self.evt_keydown);
                    }
                    $self.set_data();
                    if (item.focus) {
                        $self.set_focus('cx_combo.init');
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.init ■■■';
                }
            } // end func.cx_combo -> init

            /*----------------------------------------------
            * @cx_combo set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_combo.set_data');
                    if (value_ == undefined || !value_) {
                        if (item.value)
                            $self.val(item.value);
                        else
                            $self.children('option:eq(0)').prop('selected', 'selected');
                    } else {
                        $self.val(value_);
                    }

                    if (app_.cfg.theme == 'ui') {
                        $self.selectmenu('refresh');
                    }

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_) {
                            if (app_.cfg.theme == 'ui')
                                $self.selectmenu('enable');
                            else
                                $self.prop('disabled', false);
                        } else {
                            if (app_.cfg.theme == 'ui')
                                $self.selectmenu('disable');
                            else
                                $self.prop('disabled', true);
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.set_data ■■■';
                }
            } // end event.cx_combo -> set_data
            /*----------------------------------------------
            * @cx_combo get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_combo.get_data');
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.get_data ■■■';
                }
            } // end event.cx_combo -> get_data

            /*----------------------------------------------
            * @cx_combo keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('cx_combo.evt_keydown');
                    if (evt_.keyCode == 13) {
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        //console.error(item.$next);
                        if (item.ptype == 'form') {
                            if (item.required) {
                                if ($self.val() == '') {
                                    if (app_.cfg.theme == 'ui') {
                                        app_.show_tip(item.$ui, '필수항목 입니다 ('+item.text+')');
                                    } else {
                                        app_.show_tip($self, '필수항목 입니다 ('+item.text+')');
                                    }
                                    return;
                                }
                            }
                            if (item.$next) {
                                item.$next.set_focus('cx_combo.evt_keydown');

                            }
                        } else {
                            var _data = $self.get_data();
                            if (item.required) {
                                if (!_data) {
                                    app_.show_tip($(evt_.currentTarget), '필수항목 입니다 ('+item.text+')');
                                    return;
                                }
                            }
                            $parent.next_focus(evt_, item);
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.evt_keydown ■■■';
                }
            } // end event.cx_combo -> evt_keydown

            /*----------------------------------------------
            * @cx_combo click
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_click = function(evt_) {
                try {
                    if (item.debug) console.log('cx_combo.evt_click');
                    $parent_.set_closure_focus(item.id);    // 탭 클릭시 처리할 포커스 클로저
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.evt_click ■■■';
                }
            } // end event.cx_combo -> evt_click

            /*----------------------------------------------
            * @cx_combo set_focus
            * @returns  {void)
            ----------------------------------------------*/
            this.set_focus = function(caller_, $edit_) {
                try {
                    if (item.debug) console.log('cx_combo.set_focus');
                    if (item.$obj.prop('readonly') || item.$obj.prop('disabled')) {
                        //console.error('readonly or disabled');
                        return;
                    }
                    setTimeout(function() {
                        if ($edit_ == undefined) {   // 일반 폼일때
                            if (app_.cfg.theme == 'ui') {
                                item.$ui.focus();
                            } else {
                                item.$obj.focus();
                            }
                            $parent_.set_closure_focus(item.id);    // 탭 클릭시 처리할 포커스 클로저
                        } else {                    // edit Row 에 소속된 폼 객체일때
                            if (app_.cfg.theme == 'ui') {
                            //console.info($edit_.item.$ui);
                            console.error('여기 점검하세요  2018-04-29');
                            console.error($edit_.siblings('span'), $edit_.next());
                            //                                $edit_.focus();


                            } else {
                                $edit_.focus();
                            }
                            $parent_.set_closure_focus($edit_);    // 탭 클릭시 처리할 포커스 클로저
                        }

                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.set_focus ■■■';
                }
            } // end event.cx_combo -> set_focus

            /*----------------------------------------------
            * @cx_combo set_cfg
            * @returns  {void)
            ----------------------------------------------*/
            this.set_cfg = function(param_) {
                try {
                    if (item.debug) console.log('cx_combo.set_cfg');
                    item = $.extend(item, param_);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_combo.set_cfg ■■■';
                }
            } // end event.cx_combo -> set_cfg

            this.init();
            $self.item = item;
            $self.on('keydown', {item:$self}, this.evt_keydown);
            if (app_.cfg.theme == 'ui')
                item.$ui.on('click', {item:$self}, this.evt_click);
            else
                $self.on('click', {item:$self}, this.evt_click);
            return this;
        } // end method.cx_combo ->  init
    }; app_.fn.cx_combo = function (method) { return __cx_combo.init.apply(this, arguments); } // end of cx_combo

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - pop
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_pop = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;
            var $popup = {};

            var cfg = {};
            /*----------------------------------------------
            * @cx_pop initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item_.popup == undefined || item_.popup.constructor != Object)
                        throw '■■■ error: '+item_.id+' is undefined popup property (cx_pop.init)  ■■■';
                    item_.popup = app_.__init_item(item_.popup, 'debug', false);
                    item_.debug = item_.popup.debug;
                    if (item_.debug) console.log('cx_pop.init');
                    item_ = app_.init_item(item_, 'cx_pop.init');   // 하나의 {} 만 처리됨
                    item = item_;
                    item.$obj = $('#'+item.pt_idx+item.id); // 소속모듈에서 사용하기 위해
                    if (item.mask) {
                        $self.mask(item.mask, {reverse: true, placeholder:item.mask.replace(/[0|#|?|*]/g, '_')});
                    }
                    if (item.align) {
                        $self.addClass(item.align);
                    }
                    if (item.readonly)
                        $self.prop('readonly', true);
                    if (item.disabled)
                        $self.prop('disabled', true);
                    $self.prop('placeholder', item.text)

                    // 팝업을 위한 기본설정 처리
                    item.popup = app_.__init_item(item.popup, 'h', 400);
                    item.popup = app_.__init_item(item.popup, 'title', 'Unknown POP');
                    item.popup = app_.__init_item(item.popup, 'before_open', null);
                    item.popup = app_.__init_item(item.popup, 'before_draw', null);
                    item.popup = app_.__init_item(item.popup, 'before_close', null);
                    item.popup = app_.__init_item(item.popup, 'row_click', null);
                    item.popup = app_.__init_item(item.popup, 'row_enter', null);
                    item.popup = app_.__init_item(item.popup, 'row_dblclick', null);
                    cfg = {
                          w             : 0      // 팝업을 그리면서 재계산됨
                        , h             : item.popup.h
                        , research      : item.popup.research
                        , required      : item.required       // 검색어가 없으면 검색 안함(item 속성을 따름)
                        , 'title'       : item.popup.title
                        , 'act'         : item.popup.act
                        , 'before_open' : item.popup.event.before_open
                        , 'before_draw' : item.popup.event.before_draw
                        , 'before_close': item.popup.event.before_close
                        , 'row_click'   : item.popup.event.row_click
                        , 'row_enter'   : item.popup.event.row_enter
                        , 'row_dblclick': item.popup.event.row_dblclick
                        , 'id'          : 'pop_'+item.pt_idx+item.id
                        , 'value'       : item.value
                        , edit          : false
                        , sch           : 1
                        , irows         : 0
                        , p             : ''
                        , pt_idx        : item.pt_idx
                        , now_tab       : item.popup.mytab
                        , mytab         : item.popup.mytab
                        , next          : item.next
                    }
                    $popup = $('<span id="pop_'+cfg.id+'" />').cx_popup(cfg, item.popup.grid);
                    setTimeout(function() {
                      $popup.$next = item.$next;
                    }, 100);
                    $parent_.$popup[item.id] = $popup;   // 모듈에서 핸들링하기 위해 할당

                    $self.on('keydown', {item:$self}, this.evt_keydown);
                    $self.on('click', {item:$self}, this.evt_click);
                    $self.set_data();

                    //console.error(item);

                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.init ■■■';
                }
            } // end func.cx_pop -> init

            /*----------------------------------------------
            * @cx_pop set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('cx_pop.set_data');
                    if (value_ == undefined || value_ === '')   // 이곳에서는 0 값도 제대로 저장되어야 함
                        $self.val(item.value);
                    else {
                        $self.val($.trim(value_));
                    }

                    if (item.is_disabled) {
                        if (value_ == undefined || !value_)
                            $self.prop('disabled', false);
                        else
                            $self.prop('disabled', true);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.set_data ■■■';
                }
            } // end event.cx_pop -> set_data
            /*----------------------------------------------
            * @cx_pop get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('cx_pop.get_data');
                    $self.val($.trim($self.val()));
                    return $self.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.get_data ■■■';
                }
            } // end event.cx_pop -> get_data

            /*----------------------------------------------
            * @cx_pop keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('cx_pop.evt_keydown');
                    $self.set_data(evt_.currentTarget.value);   // 계속 기본값으로 설정된 값이 반영되므로(여기 점검해 볼것- 이상해..)
                    switch (evt_.keyCode) {
                    case 13:
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        $self.set_data(evt_.currentTarget.value);   // 계속 기본값으로 설정된 값이 반영되므로(여기 점검해 볼것- 이상해..)
                        var _data = {'stxt':''};
                        _data.stxt = $self.get_data();
                        //console.error(_data.stxt);
                        if (item.required) {
                            if (!_data.stxt) {
                                app_.show_tip($(evt_.currentTarget), '검색어는 필수입니다 ('+item.text+')');
                                return;
                            }
                        }
                        if (_data.stxt) {
                            if (typeof $self.validate == 'function') {
                                if (!$self.validate('cx_comm.evt_keydown')) {
                                    app_.show_tip($self, '유효한 값이 아닙니다 ('+item.text+')');
                                    return;
                                }
                            }
                        }
                        if (item.ptype == 'grid') { // Edit Grid 팝업이라면 rowindex 를 반환
                            // 팝업에서 rowindex 와 구분하기 위해 rowindex_edit 으로 처리함 (SQL 쿼리에서 반환함)
                            _data['rowindex_edit'] = $(evt_.currentTarget).closest('tr')[0].rowindex;
                        }
                        $popup.$evt = $(evt_.currentTarget);    // 검색된 데이터가 없으면 툴팁을 오픈할 객체
                        $popup.popup_open(_data);   // 팝업 오픈
                        //console.error('cx_pop.evt_keydown 처리할것', item.ptype);
                        return true;
                        break;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.evt_keydown ■■■';
                }
            } // end event.cx_pop -> evt_keydown

            /*----------------------------------------------
            * @cx_pop click
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_click = function(evt_) {
                try {
                    if (item.debug) console.log('cx_pop.evt_click');
                    $self.set_focus('cx_pop.evt_click');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.evt_click ■■■';
                }
            } // end event.cx_pop -> evt_click

            /*----------------------------------------------
            * @cx_pop set_show
            * @returns  {void)
            ----------------------------------------------*/
            this.set_show = function(caller_) {
                try {
                    if (item.debug) console.log('cx_pop.set_show');
                    $self.css('visibility', 'visible');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.set_show ■■■';
                }
            } // end event.cx_pop -> set_show

            /*----------------------------------------------
            * @cx_pop set_hide
            * @returns  {void)
            ----------------------------------------------*/
            this.set_hide = function(caller_) {
                try {
                    if (item.debug) console.log('cx_pop.set_hide');
                    $self.css('visibility', 'hidden');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.set_hide ■■■';
                }
            } // end event.cx_pop -> set_show

            /*----------------------------------------------
            * @cx_pop set_focus
            * @returns  {void)
            ----------------------------------------------*/
            this.set_focus = function(caller_, $edit_) {
                try {
                    if (item.debug) console.log('cx_pop.set_focus');
                    if (item.type == 'hidden') {
                        console.error('hidden not focus..');
                        return;
                    }
                    if (item.$obj.prop('readonly') || item.$obj.prop('disabled')) {
                        //console.error('readonly or disabled');
                        return;
                    }
                    setTimeout(function() {
                        if ($edit_ == undefined) {   // 일반 폼일때
                            item.$obj.select().focus();
                            $parent_.set_closure_focus(item.id);    // 탭 클릭시 처리할 포커스 클로저
                        } else {                    // edit Row 에 소속된 폼 객체일때
                            $edit_.select().focus();
                            $parent_.set_closure_focus($edit_);    // 탭 클릭시 처리할 포커스 클로저
                        }
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.set_focus ■■■';
                }
            } // end event.cx_pop -> set_focus

            /*----------------------------------------------
            * @cx_pop set_cfg
            * @returns  {void)
            ----------------------------------------------*/
            this.set_cfg = function(param_) {
                try {
                    if (item.debug) console.log('cx_pop.set_cfg');
                    item = $.extend(item, param_);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pop.set_cfg ■■■';
                }
            } // end event.cx_pop -> set_cfg
            this.init();

            $self.item = item;
            return this;
        } // end method.cx_pop ->  init
    }; app_.fn.cx_pop = function (method) { return __cx_pop.init.apply(this, arguments); } // end of cx_pop

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - 일반 Grid 용 row (tagName: tr)
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_row = {    // 팝업 Grid 의 경우 때문에 cfg 가 필요함
        init: function (cfg_, mod_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $popup = {};
            var $self = this, item = {}, $parent = $parent_;
            //var act = {clicks:0, times: 250, timer:null};
            var cfg = {};     // Grid cfg 에 설정된 환경설정 값

            /*----------------------------------------------
            * @cx_row initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('cx_row.init');
                    $.each(mod_, function (idx_, item_) {
                        item_ = app_.init_item(item_, 'cx_row.init');   // 하나의 {} 만 처리됨
                    });

                    $self.mod = {};
                    $self.mod = mod_;
                    if (cfg_ == undefined) return;  // 팝업이 아니면 통과

                    // 팝업을 위한 기본설정 처리
                    cfg_ = app_.__init_item(cfg_, 'h', 400);
                    cfg_ = app_.__init_item(cfg_, 'title', 'Unknown POP Row');
                    cfg_ = app_.__init_item(cfg_, 'before_open', null);
                    cfg_ = app_.__init_item(cfg_, 'before_draw', null);
                    cfg_ = app_.__init_item(cfg_, 'before_close', null);
                    cfg_ = app_.__init_item(cfg_, 'row_click', null);
                    cfg_ = app_.__init_item(cfg_, 'row_enter', null);
                    cfg_ = app_.__init_item(cfg_, 'row_dblclick', null);

                    cfg = {
                          w             : 0      // 팝업을 그리면서 재계산됨
                        , h             : cfg_.h
                        , research      : cfg_.research
                        , required      : false
                        , 'title'       : cfg_.title
                        , 'act'         : cfg_.act
                        , 'before_open' : cfg_.event.before_open
                        , 'before_draw' : cfg_.event.before_draw
                        , 'before_close': cfg_.event.before_close
                        , 'row_click'   : cfg_.event.row_click
                        , 'row_enter'   : cfg_.event.row_enter
                        , 'row_dblclick': cfg_.event.row_dblclick
                        , 'id'          : 'poprow_'+$parent_.attr('id')
                        , 'value'       : ''
                        , edit          : false
                        , sch           : 1
                        , irows         : 0
                        , p             : ''
                        , pt_idx        : cfg_.pt_idx
                        , now_tab       : cfg_.mytab
                        , mytab         : cfg_.mytab
                    }
                    $popup = $('<span id="pop_'+cfg.id+'" />').cx_popup(cfg, cfg_.grid);
                    $parent_.$popup[$parent_.attr('id')] = $popup;   // 모듈에서 핸들링하기 위해 할당

                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_row.init ■■■';
                }
            } // end func.cx_row -> init

            /*----------------------------------------------
            * @cx_row set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(rowidx_, data_, caller_) {
                try {
                    if (item.debug) console.log('cx_row.set_data');
                    var _tr = $self.clone(true);
                    _tr.prop('tabindex', rowidx_);
                    $.each($self.mod, function (idx_, item_) {
                        if (data_[item_.id] == undefined) {
                            _tr.append($(item_.template.replace(/❦❦/, '')));
                        } else {
                            if (item_.format) {
                                data_[item_.id] = app_.cxFormat.format(item_.format, data_[item_.id]);
                            }
                            _tr.append($(item_.template.replace(/❦❦/, app_.cxUtil.replace_html('E', data_[item_.id]))));
                        }
                    });
                    return _tr;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_row.set_data ■■■';
                }
            } // end event.cx_row -> set_data

            this.init();
            return this;
        } // end method.cx_row ->  init
    }; app_.fn.cx_row = function (method) { return __cx_row.init.apply(this, arguments); } // end of cx_row

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Alert
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_alert = {
        init: function (cfg_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, evt = {};
            var $alert = {};
            var $confirm = {};
            var mod = {};
            var cfg = {
                  icon      : {err:'error.gif',info:'information.gif',ques:'question.gif',warn:'warning.gif'}
            }

            var html_a = ''
                    + '    <div style="overflow: hidden;min-height: 90%;height: 90%;">              '
                    + '        <table class="" style="width: 100%;table-layout: fixed">             '
                    + '        <colgroup>                                                           '
                    + '        <col style="width: 50px" />                                          '
                    + '        <col style="" />                                                     '
                    + '        </colgroup>                                                          '
                    + '        <tbody>                                                              '
                    + '        <tr>                                                                 '
                    + '        <td style="text-align: center;"><img src="" id="cx_alerticon" /></td>'
                    + '        <td style="text-align: left;" id="cx_alertmsg"></td>                 '
                    + '        </tbody>                                                             '
                    + '        </table>                                                             '
                    + '    </div>                                                                   ';

            /*----------------------------------------------
            * @cx_alert initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {

                if ($self.html()) {
                    console.error('이미 생성됨');
                    return;
                }

                $self.append(cfg.html_a);

                $alert = $self.clone(true);
                $confirm = $self.clone(true);
                $alert.find('#cx_alerticon').prop('src', 'http://cdn.cre-it.com/dx/img/alert/'+cfg.icon.info);
                $alert.dialog({
                            title: '알림',
                            resizable: false,
                            autoOpen : false,
                            width: 300,
                            height: 300,
                            modal: true,
                            buttons: { '확인': function(evt_) {
                                // 닫기전 사용자 함수가 수행됨
                                $(this).dialog('close');
                            }}
                            });

                $confirm.dialog({
                            title: '알림',
                            resizable: false,
                            autoOpen : false,
                            width: 300,
                            height: 300,
                            modal: true,
                            });

            } // end func.cx_alert -> init

            /*----------------------------------------------
            * @cx_alert alert
            * @returns  {void)
            ----------------------------------------------*/
            evt.alert = function(msg_, func_) {
                if (func_ != undefined && typeof func_ == 'function')
                    $alert.on('dialogclose', func_);
                $alert.find('#cx_alertmsg').html(msg_);
                $alert.dialog('open');
            } // end func.cx_alert -> alert

            /*----------------------------------------------
            * @cx_alert confirm
            * @returns  {void)
            ----------------------------------------------*/
            evt.confirm = function(msg_, funcY_, funcN_, icon_) {
                if (icon_ == undefined || icon_ == '') icon_ = 'ques';
                $confirm.find('#cx_alerticon').prop('src','http://cdn.cre-it.com/dx/img/alert/'+cfg.icon[icon_]);
                $confirm.find('#cx_alertmsg').html(msg_);

                $confirm.dialog('option', 'buttons', [
                                {
                                    id: 'yes',
                                    text: '확인',
                                    click: funcY_
                                },
                                {
                                    id: 'no',
                                    text: '취소',
                                    click: funcN_
                                }
                ]);
                $confirm.dialog('open');
            } // end func.cx_alert -> confirm

            evt.init();
            this.alert = evt.alert;
            this.confirm = evt.confirm;

            return this;
        } // end method.cx_alert -> init
    }; app_.fn.cx_alert = function (method) { return __cx_alert.init.apply(this, arguments); } // end of cx_alert

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Board
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    //var __cx_board = {
        //    init: function (cfg_, mod_) {
        //        this.version = '0.0.0.1';
        //        this.mod = {};
        //        var $self = this, evt = {};
        //        var mod = {};
        //        var cfg = {
        //              m     : ''        // p + m
        //            , myfocus   : null  // 나의 현재 포커스 객체(item_)
        //            , mytab     : -1    // 나의 탭 인덱스
        //            , now_tab   : -1    // 현재 active 된 탭 인덱스
        //            , timer     : 100   // 포커스 처리할 타이머
        //        }
        //        cfg = $.extend(cfg, cfg_);
        //        /*----------------------------------------------
        //        * @cx_form initialize
        //        * @returns  {void)
        //        ----------------------------------------------*/
        //        evt.init = function() {
        //            try {
        //                if (cfg.debug) console.log('cx_board.init');
        //
        //            } catch(e) {
        //                console.info(e);
        //                throw '■■■ error: cx_board.init ■■■';
        //            }
        //        } // end func.cx_board -> init
        //
        //
        //        return this;
        //    } // end method.cx_board -> init
        //}; app_.fn.cx_board = function (method) { return __cx_board.init.apply(this, arguments); } // end of cx_board

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Form
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_form = {
        init: function (cfg_, mod_, $popup_) {
            this.version = '0.0.0.2';
            this.mod = {};
            this.mod2 = {};
            var $self = this, evt = {};
            $self.$tab = {};
            $self.$popup = {};
            var mod = {};
            var cfg = {
                  pt_idx    : null  // m + tab index
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
                , timer     : 100   // 포커스 처리할 타이머
                , required  : true  // 폼 전송시 폼객체의 required 검사를 할지 여부(false 면 값이 없어도 전송됨)
            }
            if (cfg_.p == undefined) {
                throw '■■■ error: cx_form -> undefined cfg.p ■■■';
            }
            cfg = $.extend(cfg, cfg_);
            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.pt_idx = cfg.p;
            else
                cfg.pt_idx = cfg.p + '' + cfg.mytab;

            /*----------------------------------------------
            * @cx_form initialize
                mask: https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_form.init');
                    mod = $.extend(mod, mod_);

                    $.each(mod, function (idx_, item_) {
                        item_.pt_idx = cfg.pt_idx;  // 강제로 할당
                        item_.ptype = 'form';       // 강제로 할당

                        if (item_.type == 'label') {
                            item_ = app_.init_grid(item_, 'cx_form.init');   // 하나의 {} 만 처리됨
                        } else {
                            item_ = app_.init_item(item_, 'cx_form.init');   // 하나의 {} 만 처리됨
                        }
                        item_.$obj = app_.create_item($('#'+cfg.pt_idx+''+item_.id), 'form', cfg.pt_idx, item_, $self, 'cx_form.init');

                        //if (item_.type == 'button') {
                        //    item_.$obj.on('click', {item:item_}, evt.__btn_click);
                        //}

                        $self.mod2[item_.id] = item_;
                    });
                    evt.__set_next(); // next 객체 찾기
                    evt.set_reset();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.init ■■■';
                }
            } // end func.cx_form -> init

            /*----------------------------------------------
            * @cx_form reset
            * @param    {json}      item_
            ----------------------------------------------*/
            evt.set_reset = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_reset');
                    $.each($self.mod2, function (key_, item_) {
                        if (item_.type != 'button' && item_.type != 'check' && item_.type != 'radio') {
                            $self.mod2[key_].$obj.set_data('');
                            if (item_.focus) {
                                $self.mod2[key_].$obj.set_focus('cx_form.set_reset');
                            }
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_reset ■■■';
                }
            } // end func.cx_form -> set_reset

            /*----------------------------------------------
            * @cx_form get data
                _param = $frm.get_data();
                _param = $frm.get_data('aaa');
                _param = $frm.get_data(['aaa', 'bbb']);
            * @param    {json}      'id', ['id', 'id'] 로 요청
            ----------------------------------------------*/
            evt.get_data = function(param_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.get_data');
                    var _param = {};
                    if (param_ == undefined || param_ == '') {  // 전체를 반환
                        $.each(mod, function (idx_, item_) {
                            if (item_.type == 'button') return true;
                            if (typeof item_.$obj.get_data == 'function') {
                                _param[item_.id] = item_.$obj.get_data('cx_form.get_data');
                                //console.error(item_.id, item_.required, _param[item_.id]);
                                if (cfg.required == true && item_.required && !_param[item_.id]) {
                                    if (item_.type == 'hidden') {
                                        app_.show_tip($self, '필수값이 누락되어 있으므로 요청을 처리할 수 없습니다<br />요청처리에 필요한 값을 찾아 입력해 주세요('+item_.id+')');
                                    } else {
                                        console.error(item_.type, item_.id, '필수값영~');
                                        item_.$obj.set_focus('cx_form.get_data');
                                        setTimeout(function() {
                                            var e = jQuery.Event('keydown', {keyCode: 13});
                                            item_.$obj.trigger(e);
                                        }, 0);
                                    }
                                    _param = false;
                                    return false;
                                }
                            } else {
                                console.info(item_.$obj);
                                throw '■■■ error: cx_form.get_data -> undefined function $obj.get_data ■■■';
                            }
                        });
                    } else {
                        if (param_.constructor == String)
                            param_ = [param_];
                        if (param_.constructor == Array) {
                            $.each(param_, function (idx_, key_) {
                                if ($self.mod2[key_] != undefined) {
                                    if (typeof $self.mod2[key_].$obj.get_data == 'function') {
                                        _param[key_] = $self.mod2[key_].$obj.get_data('cx_form.get_data');
                                        if ($self.mod2[key_].required && !_param[key_]) {
                                            $self.mod2[key_].$obj.set_focus('cx_form.get_data');
                                            setTimeout(function() {
                                                var e = jQuery.Event('keydown', {keyCode: 13});
                                                $self.mod2[key_].$obj.trigger(e);
                                            }, 0);
                                            return false;
                                        }
                                    }
                                }
                            });
                        } else {
                            console.info(e);
                            throw '■■■ error: cx_form.get_date -> ($frm.get_data() | $frm.get_data(id) | $frm.get_data([id1,id2]) ) ■■■';
                        }
                    }
                    return _param;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.get_data ■■■';
                }
            } // end func.cx_form -> get_data

            /*----------------------------------------------
            * @cx_form set data
                $frm.set_data({key:value});
                $frm.set_data([{key:value},{key:value}, {key:value}]);
            * @param  {json}
            ----------------------------------------------*/
            evt.set_data = function(param_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_data');
                    if (param_.constructor != Array && param_.constructor != Object) {
                        console.info(e);
                        throw '■■■ error: cx_form.set_data -> (unknown param, using {id:, value:} || [{id:, value:},{id:, value:}]) ■■■';
                    } else {
                        if (param_.constructor == Array) {
                            $.each(param_, function (idx_, row_) {
                                evt.__set_data(row_);
                            });
                        } else if (param_.constructor == Object) {
                            evt.__set_data(param_);
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_data -> (may be param is undefined) ■■■';
                }
            } // end func.cx_form -> set_data

            /*----------------------------------------------
            * @cx_form show component
            * @param    {json}      item_
            ----------------------------------------------*/
            evt.set_show = function(id_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_show');
                    if ($self.mod2[id_] != undefined) {
                        $self.mod2[id_].$obj.set_show('cx_form.set_show');
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_show ■■■';
                }
            } // end func.cx_form -> set_show

            /*----------------------------------------------
            * @cx_form hide component
            * @param    {json}      item_
            ----------------------------------------------*/
            evt.set_hide = function(id_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_hide');
                    if ($self.mod2[id_] != undefined) {
                        $self.mod2[id_].$obj.set_hide('cx_form.set_hide');
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_hide ■■■';
                }
            } // end func.cx_form -> set_hide

            /*----------------------------------------------
            * @cx_form cfg change
            * @param    {string}    id
            * @param    {json}      attribute
            ----------------------------------------------*/
            evt.set_cfg = function(id_, param_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_cfg');
                    if ($self.mod2[id_] != undefined) {
                        $self.mod2[id_].$obj.set_cfg(param_);
                        $.each(mod, function (idx_, item_) { // 이 처리를 하지 않으면 mod 는 변경이 안됨
                            if (id_ == item_.id) {
                                item_ = $.extend(item_, param_);
                            }
                        });
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_cfg ■■■';
                }
            } // end func.cx_form -> set_cfg

            /*----------------------------------------------
            * @cx_form set_click
            * @param    {string}    id
            ----------------------------------------------*/
            evt.set_click = function(id_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_click');
                    if ($self.mod2[id_] != undefined) {
                        $self.mod2[id_].$obj.click();
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_click ■■■';
                }
            } // end func.cx_form -> set_click

            /*----------------------------------------------
            * @cx_form set_next 객체를 설정함
            ----------------------------------------------*/
            evt.__set_next = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.__set_next');
                    $.each(mod, function (idx_, item_) {
                        if (item_.next) {
                            $.each(mod, function (idx2_, item2_) {
                                if (item_.next == item2_.id) {
                                    item_.$obj.item.$next = item2_.$obj;
                                }
                            });
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.__set_next  ■■■';
                }
            } // end func.cx_form -> __set_next

            /*----------------------------------------------
            * @cx_form set data core
            * @param  {}
            ----------------------------------------------*/
            evt.__set_data = function(row_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_form.__set_data');
                    $.each(row_, function (key_, data_) {
                        if ($self.mod2[key_] != undefined) {
                            $self.mod2[key_].$obj.set_data(data_);
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_data core ■■■';
                }
            } // end func.cx_form -> __set_data

            /*----------------------------------------------
            * @cx_form set_closure_focus
            ----------------------------------------------*/
            this.set_closure_focus = function(id_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_closure_focus');
                    if (cfg.mytab < 0)
                        return;
                    $self.$tab.$cfocus[cfg.mytab] = function() {
                        var $s = $self,
                            key_ = id_;
                        return function() {
                            //console.error('clouser 발생');
                            setTimeout(function() {
                                $s.mod2[key_].$obj.set_focus('cx_form.set_closure_focus');
                            }, 0);
                        }
                    };
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_closure_focus ■■■';
                }
            } // end func.cx_form -> set_closure_focus

            /*----------------------------------------------
            * @cx_form set_focus
            ----------------------------------------------*/
            this.set_focus = function(id_) {
                try {
                    if (cfg.debug) console.log('cx_form.set_focus');
                    $.each(mod, function (idx_, item_) {
                        if (item_.id == id_) {
                            item_.$obj.set_focus('cx_form.set_focus');
                            return false;
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_form.set_focus ■■■';
                }
            } // end func.cx_form -> set_focus

            evt.init();
            // 외부 interface
            this.mod = mod;
            this.cfg = cfg;

            this.set_reset  = evt.set_reset;
            this.get_data   = evt.get_data;
            this.set_data   = evt.set_data;
            this.set_show   = evt.set_show;
            this.set_hide   = evt.set_hide;
            this.set_cfg    = evt.set_cfg;
            this.set_click  = evt.set_click;
//            this.set_closure_focus  = evt.set_closure_focus;
//            this.set_focus  = evt.set_focus;

            return this;
        } // end method.cx_form -> init
    }; app_.fn.cx_form = function (method) { return __cx_form.init.apply(this, arguments); } // end of cx_form

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Grid
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_grid = {
        init: function (cfg_, mod_, $popup_) {
            this.version = '0.0.0.2';
            this.mod = {};
            this.mod2 = {};
            var $self = this, evt = {};
            $self.$tab = {};
            $self.$popup = {};
            var $tr = {};
            var mod = {};
            var cfg = {
                  id        : null
                , addrow    : false // 최초 행 추가 여부
                , addgrid   : false // Label Grid 로 행이 추가되는 Grid
                , is_popup  : false // 팝업 그리드 여부
                , pt_idx    : null  // m + tab index
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
                , column_count : -1 // 현재 Grid 컬럼 수
                , row_count : -1    // 데이터를 읽어온 Row 수
                , row_index : -1    // 현재 클릭한 row index
                , keyword   : '❦❦'  // 데이터를 바인딩할 위치
                , timer     : null  // 클릭을 처리할 타이머
                , times     : 250   // 클릭, 더블클릭을 구분할 시간
                , clicks    : 0     // click, dblclick 을 구분할 구분자
                , event     : {}    // 사용자 이벤트 함수
                , edit      : false // 에디팅 여부
                , $ttr : {}         // editing template (TR)
                , $tobj  : {}       // editing template component (...)
                , $eobj  : []       // binding component (...)
                , rowstart  : ''    // edit 할때 포커스 처리 및 row 추가
                , rowend  : ''      // edit 할때 포커스 처리 및 row 추가
                , rowdata   : []    // Grid row 를 그릴때 현재 Row 데이터를 할당해 둠
            }
            if (cfg_.p == undefined) {
                throw '■■■ error: cx_grid -> undefined cfg.p ■■■';
            }
            cfg = $.extend(cfg, cfg_);
            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.pt_idx = cfg.p;
            else
                cfg.pt_idx = cfg.p + '' + cfg.mytab;

            /*----------------------------------------------
            * @cx_grid initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_grid.init');

                    if ($self[0] == undefined)
                        throw '■■■ error: undefined grid elements (cx_grid.init) ■■■';

                    if ($self.prop('id') == undefined)
                        cfg.id = cfg_.popid;
                    else
                        cfg.id = $self.prop('id');
                    mod = $.extend(mod, mod_);
                    if (cfg.popup != undefined) {
                        cfg.popup.pt_idx = cfg.pt_idx;
                    }

                    var _attr = '', _style = '';
                    cfg.column_count = 0;
                    $.each(mod, function (idx_, item_) {
                        item_.pt_idx = cfg.pt_idx;  // 강제로 할당
                        item_.ptype = 'grid';       // 강제로 할당(부모타입)
                        cfg.column_count++;
                        if (item_.rowstart != undefined && item_.rowstart)
                            cfg.rowstart = item_.id;
                        if (item_.rowend != undefined && item_.rowend)
                            cfg.rowend = item_.id;

                        if (cfg.edit == false) {
                            _attr = '';
                            _style = '';
                            item_ = app_.init_grid(item_, 'cx_grid.init');   // 하나의 {} 만 처리됨
                            if (item_.type == 'hidden') {
                                if (item_.align) _attr += ' class="'+item_.align+'"';
                                item_.template = '<td style="display: none">'+cfg.keyword+'</td>';
                            } else if (item_.type == 'button') {
                                item_.template = '<td><button name="'+cfg.pt_idx+'row_'+item_.id+'" class="btn btn_normal btn_red" tabindex="'+cfg.keyword+'">'+item_.text+'</button></td>';
                            } else {
                                if (item_.align) _attr += ' class="'+item_.align+'"';
                                if (item_.color) _style += ' style="color:'+item_.color+'"';
                                item_.template = '<td'+_attr+_style+'>'+cfg.keyword+'</td>';
                            }
                        } else {
                            item_ = app_.init_item(item_, 'cx_grid.init');   // 하나의 {} 만 처리됨
                            mod[idx_] = item_;
                        }
                        $self.mod2[item_.id] = item_;     // id 로 빠른 접근을 처리하기 위해서 보관
                    });

                    if (cfg.edit == true || cfg.addgrid == true) { // 모든 아이템을 정리한 후 처리해야 함
                        $.each($self.children('tr'), function (idx_, item_) {
                            if (item_.className == 'template') {
                                cfg.$ttr = $(item_).removeClass('template').clone(true);        // template class 제거하면서 template row 용으로 복사
                                $.each(mod, function (idx_, item_) {
                                    // 각기의 아이템들도 template item 용으로 복사
                                    cfg.$tobj[item_.id] = {};
                                    switch (item_.type) {
                                    case 'select':
                                    case 'combo':
                                        cfg.$tobj[item_.id].$obj = app_.create_item($(cfg.$ttr[0]).find('select[name="'+cfg.pt_idx+item_.id+'"]'), 'grid', cfg.pt_idx, item_, $self, 'cx_grid.init');
                                        break;
                                    case 'span':
                                    case 'div':
                                    case 'label':
                                        cfg.$tobj[item_.id].$obj = app_.create_item($(cfg.$ttr[0]).find('td[name="'+cfg.pt_idx+item_.id+'"]'), 'grid', cfg.pt_idx, item_, $self, 'cx_grid.init');
                                        break;
                                    default:
                                        cfg.$tobj[item_.id].$obj = app_.create_item($(cfg.$ttr[0]).find('input[name="'+cfg.pt_idx+item_.id+'"]'), 'grid', cfg.pt_idx, item_, $self, 'cx_grid.init');
                                        break;
                                    }
                                    cfg.$tobj[item_.id].item = item_;   // 모듈에서 사용
                                });
                                return false;
                            }
                        });
                        //console.info(cfg.$tobj);
                    } else {
                        cfg.$ttr = $('<tr>').cx_row(cfg.popup, mod, $self, 'cx_grid.init'); // cfg.popup 변수는 popup Grid 처리를 위해 넘김
                    }
                    evt.set_resize('cx_grid.init');
                    $(window).resize(function() {
                        evt.set_resize('cx_grid.window.resize');
                    });
                    //evt.set_reset(cfg.addrow, 'cx_grid.init');    // row 초기화 (add row 여부), 모듈 조건에 따라 addrow 처리를 해야 하므로
                    evt.set_reset(false, 'cx_grid.init');    // row 초기화 (add row 여부)
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.init ■■■';
                }
            } // end func.cx_grid -> init

            /*----------------------------------------------
            * @cx_grid draw row add (edit Row)
            ----------------------------------------------*/
            evt.__addrow = function(idx1_, data_) {
                try {
                    if (cfg.debug) console.log('cx_grid.__addrow');
                    if (cfg.addgrid == true || cfg.edit == true) {
                        var _tr = null, _tag = null;;
                        cfg.$eobj[idx1_] = [];
                        _tr = cfg.$ttr.clone(true);     // 치환할 row 를 먼저 복사
                        $.each(cfg.$tobj, function (key_, item_) {
                            //console.error(key_);
                            _tag = item_.$obj.item.type;
                            //console.error(cfg.$tobj[key_].$obj);
                            // 실제의 객체이므로 항상 확인할 것
                            cfg.$eobj[idx1_][key_] = {};
                            cfg.$eobj[idx1_][key_].$obj = cfg.$tobj[key_].$obj.clone(true);  // 각기의 객체 복사

                            // 이벤트는 상속이 안되므로 아래와 같은 방법으로 강제 상속할 것
                            if (_tag != 'hidden' && _tag != 'label') {
                                cfg.$eobj[idx1_][key_].$obj.set_focus = cfg.$tobj[key_].$obj.set_focus.bind(this);
                            }
                            cfg.$eobj[idx1_][key_].item = cfg.$tobj[key_].item;
                            cfg.$eobj[idx1_][key_].$obj.set_data = cfg.$tobj[key_].$obj.set_data.bind(this);
                            cfg.$eobj[idx1_][key_].$obj.get_data = cfg.$tobj[key_].$obj.get_data.bind(this);
                            //console.error(key_, cfg.$tobj[key_].$obj[0]);     // 태그확인
                            //console.error(key_, cfg.$eobj[idx1_][key_].$obj[0]);   // 복사한 태그확인
                            if (data_ == undefined || data_ == null || data_ == '') {
                                cfg.$eobj[idx1_][key_].$obj.val(item_.$obj.item.value).prop('rowindex', idx1_);
                            } else {
                                switch (item_.$obj.item.type) {
                                case 'label':
                                    if (item_.$obj.item.format != undefined && item_.$obj.item.format)
                                        cfg.$eobj[idx1_][key_].$obj.text(app_.cxFormat.format(item_.$obj.item.format, data_[key_])).prop('rowindex', idx1_);
                                    else
                                        cfg.$eobj[idx1_][key_].$obj.text(data_[key_]).prop('rowindex', idx1_);
                                    break;
                                case 'combo':
                                case 'select':
                                    console.error('cx_grid.__addrow 콤보일때 구현하세요 (2018-05-01)');
                                    break;
                                case 'check':
                                case 'radio':
                                    if (data_[key_].toUpperCase() == 'Y')
                                        cfg.$eobj[idx1_][key_].$obj.prop('checked', true).prop('rowindex', idx1_);
                                    else
                                        cfg.$eobj[idx1_][key_].$obj.prop('checked', false).prop('rowindex', idx1_);
                                    break;
                                case 'pop':
                                case 'int':
                                case 'integer':
                                case 'number':
                                case 'float':
                                case 'text':
                                    cfg.$eobj[idx1_][key_].$obj.val(data_[key_]).prop('rowindex', idx1_);
                                    break;
                                }
                            }

                            cfg.$eobj[idx1_][key_].$obj.data('rowindex', idx1_)
                            switch(item_.$obj.item.type) {
                            case 'label':
                                _tag = 'td';

                                break;
                            case 'pop':
                                _tag = 'input';
                                break;
                            case 'combo':
                                _tag = 'select';
                                break;
                            case 'check':
                            case 'radio':
                            case 'int':
                            case 'integer':
                            case 'number':
                            case 'float':
                            case 'text':
                                _tag = 'input';
                                break;
                            }
                            // 이곳에서 실제 객체가 바인드되는데 함수등 cx_comm 에서 처리한게 어떤건 되고 어떤건 안되고..하넴 -.-;
                            _tr.find(_tag+'[name="'+cfg.pt_idx+key_+'"]').replaceWith(cfg.$eobj[idx1_][key_].$obj);  // 치환

                            switch(item_.$obj.item.type) {
                            case 'label':
                                _tag = 'td';

                                break;
                            case 'pop':
                                _tag = 'input';
                                break;
                            case 'combo':
                                _tag = 'select';
                                break;
                            case 'check':
                            case 'radio':
                            case 'int':
                            case 'integer':
                            case 'number':
                            case 'float':
                            case 'text':
                                _tag = 'input';
                                //if (item_.$obj.item.mask) {
                                    //console.info(key_, cfg.$tobj[key_].item.id, item_.$obj.item.mask, cfg.$eobj[idx1_][key_].$obj[0]);
                                    //cfg.$eobj[idx1_][key_].$obj.prop('placeholder', cfg.$tobj[key_].item.mask.replace(/[0|#|?|*]/g, '_'));
                                    //cfg.$eobj[idx1_][key_].$obj.prop('placeholder', '??????????');
                                    //cfg.$eobj[idx1_][key_].$obj.mask(cfg.$tobj[key_].item.mask, {reverse: true, placeholder:cfg.$tobj[key_].item.mask.replace(/[0|#|?|*]/g, '_')});
                                //}

                                break;
                            }
                        });
                        _tr.prop('rowindex', idx1_);    // row 에도 tabindex 적용
                        $tr.push(_tr);                  // tr 전역에 저장
                        cfg.row_count++;
                    } else {
                        console.info('여기를 쓸일이 있을라나?');
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.__addrow ■■■';
                }
            } // end func.cx_grid -> __addrow

            /*----------------------------------------------
            * @cx_grid draw row add (edit Row)
            ----------------------------------------------*/
            evt.set_addrow = function(idx1_, data_, focus_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_addrow');
                    if (cfg.edit == true) {
                        evt.__addrow(idx1_, data_);
                        $self.append($tr);
                        if (focus_) {
                            evt.set_focus(cfg.$eobj[cfg.row_count-1][cfg.rowstart].$obj);
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_addrow ■■■';
                }
            } // end func.cx_grid -> set_addrow

            /*----------------------------------------------
            * @cx_grid cx_grid.set_resize
            ----------------------------------------------*/
            evt.set_resize = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_resize');
                    if (cfg.is_popup == true) return false;     // 팝업이면 처리하지 않음
                    setTimeout(function() {
                        // 넓이와 높이를 지정하는 경우 처리해야 함(2018-04-270
                        var sch = 0;
                        if (x1_exe) {
                            sch = ((cfg.sch - 1) * 32) + 110;    // 60 은 바닥에서 떨어뜨릴 기본 높이(검색박스 높이를 고려)
                        } else
                            sch = ((cfg.sch - 1) * 32) + 60;    // 60 은 바닥에서 떨어뜨릴 기본 높이(검색박스 높이를 고려)
                        $self.closest('div').css('height', (app_.cfg.h - $self.offset().top - sch) + 'px');
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_resize ■■■';
                }
            } // end func.cx_grid -> set_resize

            /*----------------------------------------------
            * @cx_grid cx_grid.loading
            ----------------------------------------------*/
            evt.set_loading = function() {
                try {
                    if (cfg.debug) console.log('cx_grid.set_loading');
                    $self.children().remove();
                    $self.append('<tr class="hover_clear"><td class="center" colspan="'+cfg.column_count+'" style=""><img src="//cdn.cre-it.com/dx/img/loading/ajax-loader.gif" /></td></tr>');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_loading ■■■';
                }
            } // end func.cx_grid -> set_loading

            /*----------------------------------------------
            * @cx_grid set_reset alias
            ----------------------------------------------*/
            evt.set_reset = function(add_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_reset');
                    // 전역변수 초기화
                    $tr = [], this.$tr = [],
                    cfg.rowdata = [],
                    cfg.row_index = -1, cfg.row_count = 0, cfg.myfocus = null, cfg.$eobj = [];
                    cfg.$ttr.$row = [];         // 빈집 만들기

                    $self.children().remove();
                    if (cfg.addgrid == false && cfg.edit == false) {
                        $self.append('<tr class="hover_clear"><td class="center" colspan="'+cfg.column_count+'" style="">No Data..</td></tr>');
                        //setTimeout(function() { // 빈 Row 높이 설정 (2018-04-29 처리안함)
                        //    //$self.children('tr.hover_clear').css('height', ($(window).height() - $self.offset().top - 80) + 'px');
                        //}, 0);
                    } else {    // 기본 row 하나를 추가해 줌
                        if (add_ == true) {
                            evt.__addrow(0, null);
                            $self.append($tr);
                            //this.$tr = $tr;     // 팝업에서 사용됨
                            evt.set_focus(cfg.$eobj[cfg.row_count-1][cfg.rowstart].$obj);
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_reset ■■■';
                }
            } // end event.cx_grid -> set_reset

            /*----------------------------------------------
            * @cx_grid cx_grid.get_row_edit
                        주어진 index 에 해당하는 edit row 객체를 반환
            ----------------------------------------------*/
            evt.get_row_edit = function(rowindex_edit_) {
                try {
                    if (cfg.debug) console.log('cx_grid.get_row_edit');
                    return cfg.$eobj[rowindex_edit_];
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.get_row_edit ■■■';
                }
            } // end func.cx_grid -> get_row_edit

            /*----------------------------------------------
            * @cx_grid set_closure_focus
            ----------------------------------------------*/
            evt.set_closure_focus = function($obj_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_closure_focus');
                    if ($self.$tab.$cfocus == undefined) {      // 미 생성시 잠시후 다시 시도
                        setTimeout(function() {
                            evt.set_closure_focus($obj_);
                        }, 100);
                    } else {
                        if (cfg.edit == false) {
                            $self.$tab.$cfocus[cfg.mytab] = function() {
                                var $s = $self,
                                    a = evt,
                                    t = $obj_;
                                return function() {
                                    //console.error('clouser 발생');
                                    setTimeout(function() {
                                        a.set_focus(t, '');
                                    }, 0);
                                }
                            };
                        } else {
                            $self.$tab.$cfocus[cfg.mytab] = function() {
                                var t = $obj_;
                                return function() {
                                    console.error('clouser 발생');
                                    setTimeout(function() {
                                        t.set_focus('', t);
                                    }, 0);
                                }
                            };

                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_closure_focus ■■■';
                }
            } // end func.cx_grid -> set_closure_focus

            /*----------------------------------------------
            * @cx_grid set_focus (edit Row)
            ----------------------------------------------*/
            evt.set_focus = function($eobj_, evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_focus');
                    if (cfg.addgrid == true || cfg.edit == true) {
                        if (typeof $eobj_ == 'string') {
                            console.error('탭 클릭시 현재탭 포커싱 처리하시요');
                            console.info($eobj_, evt_);
                        } else {
                            $eobj_.set_focus('cx_grid.set_focus', $eobj_);
                            //if (cfg.is_popup == false) {    // 탭클릭시 포커스를 처리할 클로저 생성
                            //    evt.set_closure_focus($eobj_);  // 다음 탭을 위해 등록
                            //}
                        }
                        //$eobj_.select().focus();
                    } else {
                        var _create = false;
                        $.each($tr, function (idx_, row_) {
                            if ($eobj_[0] == row_[0]) {
                                cfg.row_index = idx_;   // 현재 선택된 rowindex
                                $tr[idx_].addClass('cx_active').focus();

                                if (cfg.is_popup == false && _create == false) {     // 탭클릭시 포커스를 처리할 클로저 생성
                                    _create = true;
                                    evt.set_closure_focus($tr[idx_]);
                                }
                            } else {
                                $tr[idx_].removeClass('cx_active').blur();
                            }
                        });
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_focus  ■■■';
                }
            } // end event.cx_grid -> set_focus

            /*----------------------------------------------
            * @cx_grid clear
            ----------------------------------------------*/
            evt.next_focus = function(evt_, obj_) {
                try {
                    if (cfg.debug) console.log('cx_grid.next_focus');
                    var _break = true;
                    $.each(mod, function (idx_, item_) {
                        if (obj_.id == item_.id) {
                            var _rowindex = $(evt_.currentTarget).data('rowindex');
                            if (_rowindex == undefined) {
                                console.info($(evt_.currentTarget));
                                throw '■■■ error: cx_grid.next_focus (undefined rowindex) ■■■';
                            }
                            if (_rowindex + 1 < cfg.row_count) {            // 중간행
                                if (cfg.rowend == item_.id) {  // 마지막 컬럼
                                    if (item_.next)
                                        evt.set_focus(cfg.$eobj[_rowindex+1][cfg.rowstart].$obj, evt_);    // 다음행의 첫행으로 이동
                                } else {
                                    if (item_.next) {
                                        evt.set_focus(cfg.$eobj[_rowindex][item_.next].$obj, evt_);
                                    }
                                }
                            } else if (_rowindex + 1 == cfg.row_count) {    // 마지막 행
                                if (cfg.rowend == item_.id) {  // 마지막 컬럼
                                    evt.__addrow(_rowindex+1, null);     // 행 추가
                                    $self.append($tr);
                                    //this.$tr = $tr;     // 팝업에서 사용됨
                                    if (item_.next) {
                                        evt.set_focus(cfg.$eobj[_rowindex+1][item_.next].$obj, evt_);
                                    } else {
                                        throw '■■■ error: cfg 에서 next 를 첫행으로 지정하세요 ■■■';
                                    }
                                } else {
                                    if (item_.next) {
                                        evt.set_focus(cfg.$eobj[_rowindex][item_.next].$obj, evt_);
                                    }
                                }
                            }
                            return false;
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.next_focus  ■■■';
                }
            } // end event.cx_grid -> next_focus

            /*----------------------------------------------
            * @cx_grid 방향키 (좌우는 지원안함 - 내용 텍스트사이를 이동해야 하므로)
            ----------------------------------------------*/
            evt.set_edit_keydown = function(evt_, obj_) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_edit_keydown');
                    switch(evt_.keyCode) {
                    case 38:    // ▲
                        var _rowindex = $(evt_.currentTarget).data('rowindex');
                        if (_rowindex > 0) {
                            --_rowindex;
                            if (cfg.edit == true) {
                                evt.set_focus(cfg.$eobj[_rowindex][obj_.id].$obj, evt_);
                            } else {
                                console.info('여기 구현요망');
                            }
                        }
                        break;
                    case 40:    // ▼
                        var _rowindex = $(evt_.currentTarget).data('rowindex');
                            if (_rowindex > -1 && _rowindex + 1 < cfg.row_count) {
                                ++_rowindex;
                                if (cfg.edit == true) {
                                    evt.set_focus(cfg.$eobj[_rowindex][obj_.id].$obj, evt_);
                                } else {
                                    console.info('여기 구현요망');
                                }
                            }
                        break;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_edit_keydown  ■■■';
                }
            } // end event.cx_grid -> set_edit_keydown


            /*----------------------------------------------
            * @cx_grid draw row(lavel Grid)
            ----------------------------------------------*/
            evt.__draw_label = function(data_) {
                try {
                    if (cfg.debug) console.log('cx_grid.__draw_label');
                    $self.children().remove();  // 빈집 만들기
                    $.each(data_, function (idx1_, row_) {
                        ++cfg.row_count;
                        row_['rowindex'] = idx1_;   // 모듈에서 사용됨
                        $tr.push(cfg.$ttr.set_data(idx1_, row_, 'cx_grid.__draw_label')); // 하나의 row 를 반환받음
                    });
                    cfg.rowdata = data_;    // 이곳에서 rowindex 가 생성되므로
                    $self.append($tr);
                    evt.set_label_event();
                    evt.set_focus($tr[0], '');
                    cfg.row_index = 0;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.__draw_label ■■■';
                }
            } // end event.cx_grid -> __draw_label

            /*----------------------------------------------
            * @cx_grid draw row (edit Row)
            ----------------------------------------------*/
            evt.__draw_edit_row = function(data_) {
                try {
                    if (cfg.debug) console.log('cx_grid.__draw_edit_row');
                    $self.children().remove();  // 빈집 만들기
                    $.each(data_, function (idx1_, row_) {
                        row_['rowindex'] = idx1_;   // 모듈에서 사용됨
                        evt.__addrow(idx1_, row_);
                        if (idx1_+1 == data_.length) {  // 마지막에 행추가
                            if (cfg.edit == true)
                                evt.__addrow(idx1_+1, null);
                        }
                    });
                    cfg.rowdata = data_;    // 이곳에서 rowindex 가 생성되므로
                    $self.append($tr);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.__draw_edit_row ■■■';
                }
            } // end event.cx_grid -> __draw_edit_row

            /*----------------------------------------------
            * @cx_grid draw row (edit Grid)
            ----------------------------------------------*/
            evt.__draw_edit_grid = function(data_, edit_index) {
                try {
                    if (cfg.debug) console.log('cx_grid.__draw_edit_grid');
                    if (edit_index == '') {
                        $.each(data_, function (idx1_, row_) {
                            row_['rowindex'] = idx1_;   // 모듈에서 사용됨
                            evt.__addrow(idx1_, row_);
                            if (idx1_+1 == data_.length) {  // 마지막에 행추가
                                if (cfg.edit == true)
                                    evt.__addrow(idx1_+1, null);
                            }
                        });
                        cfg.rowdata.push(data_[0]);    // 이곳에서 rowindex 가 생성되므로
                        //console.info(cfg.rowdata);
                        $self.append($tr);
                        evt.set_label_event();
                    } else {
                        edit_index = parseInt(edit_index, 10);
                        cfg.rowdata[edit_index] = data_[0];
                        //$self.children('tr').removeClass('cx_edit');
                        $.each($self.children('tr'), function (idx_, tr_) {
                            if (edit_index != idx_) return true;
                            $.each(mod, function (idx_, item_) {
                                if ($(tr_).find('td[name="'+cfg.pt_idx+item_.id+'"]').length > 0) {
                                    if (item_.format != undefined && item_.format)
                                        $(tr_).find('td[name="'+cfg.pt_idx+item_.id+'"]').text(app_.cxFormat.format(item_.format, data_[0][item_.id]));
                                    else
                                        $(tr_).find('td[name="'+cfg.pt_idx+item_.id+'"]').text(data_[0][item_.id]);
                                }
                            });
                            $(tr_).removeClass('cx_edit');  // 편집을 마침 표시
                        });
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.__draw_edit_grid ■■■';
                }
            } // end event.cx_grid -> __draw_edit_grid

            /*----------------------------------------------
            * @cx_grid draw row (edit grid)
            ----------------------------------------------*/
            evt.set_draw = function(data_, is_clear) {
                try {
                    if (cfg.debug) console.log('cx_grid.set_draw');
                    if (data_.length == 0) return false;
                    if (is_clear == undefined || is_clear == true)  // 그냥 binding 하거나 요청이 있으면 지움
                        evt.set_reset(false, 'cx_grid.set_draw');
                    if (cfg.edit == true) {
                        evt.__draw_edit_row(data_);
                    } else if (cfg.addgrid == true) {
                        console.error('여기 호출은 최초만 되나?');
                        evt.__draw_edit_grid(data_);    // 여기 호출은 안될것임, __draw_edit_grid 을 외부에서 직접호출함
                    } else {
                        evt.__draw_label(data_);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_draw ■■■';
                }
            } // end func.cx_grid -> set_draw

            /*----------------------------------------------
            * @cx_grid row merge
            ----------------------------------------------*/
            evt.row_merge = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_merge');
                    $.each(mod, function (idx_, item_) {
                        if (item_.merge && item_.merge == true)
                            $self.rowspan(0);
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_merge ■■■';
                }
            } // end func.cx_grid -> row_merge

            /*----------------------------------------------
            * @cx_grid row event bind (only lavel grid)
            ----------------------------------------------*/
            evt.set_label_event = function() {
                try {
                    if (cfg.debug) console.log('cx_grid.set_label_event');
                    var _$tmp = $self.find('tr');
                    _$tmp.on('click', evt.row_click);
                    _$tmp.on('dblclick', evt.row_dblclick);
                    _$tmp.on('keydown', evt.row_keydown);
                    $.each(mod, function (idx_, item_) {    // button event binding
                        if (item_.type == 'button') {
                            if (item_.click != undefined && typeof item_.click == 'function') {
                                _$tmp.find('td > button[name="'+cfg.pt_idx+'row_'+item_.id+'"]').on('click', {'item':item_}, item_.click);
                            }
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.set_label_event ■■■';
                }
            } // end event.cx_grid -> set_label_event

            /*----------------------------------------------
            * @cx_grid cx_grid.selected row data
            ----------------------------------------------*/
            evt.get_data = function(rowindex_, caller_) {
                try {
                    if (cfg.debug) console.log('cx_grid.get_data');
                    if (cfg.edit == false) {
                        if (rowindex_ != undefined) {
                            if (rowindex_ == 'all') {
                                return cfg.rowdata;
                            } else if (rowindex_ < 0) {
                                throw '■■■ error: undefined rowindex, valide rowindex is big more zero ■■■';
                            }
                        } else {
                            rowindex_ = cfg.row_index;
                        }

                        if (cfg.rowdata[rowindex_] == undefined) {
                            app_.show_tip($self, 'Grid 에 저장할 데이터가 없습니다');
                            return false;
                            //console.info(cfg.rowdata);
                            //console.error('cx_grid.get_data 값이 없는 이유를 찾을것(2018-05-03)');
                        } else {
                            return cfg.rowdata[rowindex_];
                        }
                    } else {
                        if (cfg.row_count < 1)
                            return false;
                        var _param = [], _flag = true;
                        $.each(cfg.$eobj, function (idx_, obj_) {
                            if (_flag == false) // 필수값 등등.. 문제가 있으므로 중지
                                return false;
                            _param[idx_] = {};
                            $.each(mod, function (key_, item_) {
                                switch(item_.type) {
                                    case 'button': return true; break;
                                    case 'checkbox':
                                    case 'check':
                                    case 'radio':
                                        if (obj_[item_.id].$obj.prop('checked'))
                                            _param[idx_][item_.id] = obj_[item_.id].$obj.val();
                                        else
                                            _param[idx_][item_.id] = '';
                                        break;
                                    case 'div':
                                    case 'span':
                                    case 'label':
                                        _param[idx_][item_.id] = $.trim(obj_[item_.id].$obj.text());
                                        break;
                                    default:
                                        _param[idx_][item_.id] = $.trim(obj_[item_.id].$obj.val());
                                        break;
                                }
                                if (item_.required) {
                                    if (cfg.row_count <= 1) {

                                    } else if (idx_ < (cfg.row_count-1)) {   // 마지막 row 는 검사안함
                                        if (!_param[idx_][item_.id]) {
                                            app_.show_tip(obj_[item_.id].$obj, '필수 입니다('+item_.id+')');
                                            obj_[item_.id].$obj.focus();
                                            _flag = false;
                                            _param = false;
                                            return false;
                                        }
                                    }
                                }
                              //console.log(key_, item_, obj_[item_.id]);
                              /**/
                            });
                        });
                        if (_flag == false) // 필수값 등등.. 문제가 있음
                            return false;
                        else
                            return _param;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.get_data ■■■';
                }
            } // end func.cx_grid -> get_data

            /*----------------------------------------------
            * @cx_grid row event row_click (only lavel grid)
            ----------------------------------------------*/
            evt.row_click = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_click');
                    evt_.stopPropagation();    // 이벤트 버블 중지
                    evt_.preventDefault();     // 기본 이벤트 취소
                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지

                    //console.info('row_click', evt_.currentTarget.tabIndex);
                    if (cfg.addgrid == false)
                        evt.set_focus($tr[evt_.currentTarget.tabIndex], evt_);
                    cfg.clicks++;  //count clicks
                    if(cfg.clicks == 1) {  // 클릭됨(오직 row_click 만 호출함)
                        $self.addClass('cx_active');
                        evt_.stopImmediatePropagation();        // 현재 이벤트 버블 중지
                        cfg.timer = setTimeout(function() {
                            cfg.clicks = 0;                     // 타이머 안에서 초기화
                            if (typeof cfg.row_click == 'function') {
                                if (cfg.addgrid = true) {
                                    $self.children('tr').removeClass('cx_edit');    // addGrid=true 라면 편집중인 데이터 표시를 모두 초기화함(
                                    $(evt_.currentTarget).addClass('cx_edit');
                                }
                                cfg.row_click(evt_, cfg.rowdata[evt_.currentTarget.tabIndex]);
                            }
                        }, cfg.times);
                    } else {        // 더블클릭됨
                        clearTimeout(cfg.timer);
                        cfg.clicks = 0;
                        cfg.timer = null;
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        if (typeof cfg.row_dblclick == 'function') {
                            var _param = cfg.row_dblclick(evt_, cfg.rowdata[evt_.currentTarget.tabIndex]);
                            evt.row_popup_open(_param);     // 팝업 Grid 가 있다면 처리
                        }
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_click ■■■';
                }
            } // end event.cx_grid -> row_click

            /*----------------------------------------------
            * @cx_grid row event row_dblclick (only lavel grid)
            ----------------------------------------------*/
            evt.row_dblclick = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_dblclick');
                    cfg.clicks = 0; // 초기화
                    evt_.preventDefault();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_dblclick ■■■';
                }
            } // end event.cx_grid -> row_dblclick

            /*----------------------------------------------
            * @cx_grid row event row_enter (only lavel grid)
            ----------------------------------------------*/
            evt.row_enter = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_enter');
                    if (typeof cfg.row_enter == 'function') {
                        var _param = cfg.row_enter(evt_, cfg.rowdata[evt_.currentTarget.tabIndex]);
                        evt.row_popup_open(_param);     // 팝업 Grid 가 있다면 처리
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_enter ■■■';
                }
            } // end event.cx_grid -> row_enter

            /*----------------------------------------------
            * @cx_grid row event keydown (only lavel grid)
            ----------------------------------------------*/
            evt.row_keydown = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_keydown');
                    switch (evt_.keyCode) {
                    case 13:
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        evt.row_enter(evt_);
                        break;
                    case 38:    // ▲
                    case 40:    // ▼
                        //console.error($self.get(0).scrollHeight, $self.get(0).scrollTop, $self.get(0).clientHeight, $self.get(0).clientHeight / $tr.length);
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        var _idx = -1;
                        $.each($tr, function (idx_, row_) {
                            if (evt_.currentTarget == row_[0]) {
                                if (evt_.keyCode == 38) {
                                    if (idx_ > 0) {
                                        _idx = idx_-1;
                                        return false;
                                    }
                                } else {
                                    if (idx_ < $tr.length - 1) {
                                        _idx = idx_+1;
                                        return false;
                                    }
                                }
                            }
                        });
                        if (_idx > -1) { // 방향키 스크롤 위치
                            $self.closest('div').scrollTop(0);
                            evt.set_focus($tr[_idx], evt_);
                        }
                        break;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_keydown ■■■';
                }
            } // end event.cx_grid -> row_keydown

            /*----------------------------------------------
            * @cx_grid row event btn_click (only lavel grid)
            ----------------------------------------------*/
            evt.btn_click = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_grid.btn_click');
                    evt_.stopPropagation();    // 이벤트 버블 중지
                    evt_.preventDefault();     // 기본 이벤트 취소
                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                    if (typeof evt_.data.item.click == 'function')
                        evt_.data.item.click(evt_, cfg.rowdata[$(this).closest('tr').prop('tabindex')]);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.btn_click ■■■';
                }
            } // end event.cx_grid -> btn_click

            /*----------------------------------------------
            * @cx_grid row open popup (Edit Grid 팝업은 cx_comm 에서 처리됨)
            ----------------------------------------------*/
            evt.row_popup_open = function(param_) {
                try {
                    if (cfg.debug) console.log('cx_grid.row_popup_open');
                    // 호출 이벤트에서 반환받은 값이 있거나 false 가 아닐때 처리됨
                    if (cfg.popup != undefined && param_ != undefined && param_ !== false) {
                        $self.$popup[cfg.id].popup_search(param_);
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_grid.row_popup_open ■■■';
                }
            } // end event.cx_grid -> row_popup_open

            this.set_grid2 = function(a,b,c) {      // 클로저 테스트
                //$s : $self,
                //   e : evt,
                //       console.error(a,b,c);
                    return function() {
                        console.info(a,b,c);
                    }
            }
            this.set_grid3 = function(func_) {
                func_($self);
                //$s : $self,
                //   e : evt,
                //       console.error(a,b,c);
                //   return function() {
                //       console.info(a,b,c);
                //   }
            }

            // 외부 interface
            evt.init();
            this.mod = mod;
            this.cfg = cfg;
            this.$tr = $tr; // 팝업에서 사용됨
            this.set_reset          = evt.set_reset;
            this.set_addrow          = evt.set_addrow;
            this.set_loading        = evt.set_loading;
            this.set_draw           = evt.set_draw;
            this.set_edit_keydown   = evt.set_edit_keydown;
            this.get_data           = evt.get_data;
            this.set_add_row       = evt.__draw_edit_grid;

            $self.set_closure_focus = evt.set_closure_focus;    // edit Row 를 위한 적용
            $self.next_focus        = evt.next_focus;           // edit Row 를 위한 적용
            $self.get_row_edit        = evt.get_row_edit;       // edit Row 의 row 소속 에디터 하나를 반환

            return this;
        } // end method.cx_grid ->  init
    }; app_.fn.cx_grid = function (method) { return __cx_grid.init.apply(this, arguments); } // end of cx_grid

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Pager
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_pager = {
        init: function (cfg_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, evt = {};
            var cfg = {
                  pt_idx    : null      // m + tab index
                , myfocus   : null      // 나의 현재 포커스 객체(item_)
                , mytab     : -1        // 나의 탭 인덱스
                , now_tab   : -1        // 현재 active 된 탭 인덱스
            }
            var mod = {
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
            }
            cfg = $.extend(cfg, cfg_);
            cfg.id = $self.prop('id');
            mod.row_height = cfg.row_height;

            /*----------------------------------------------
            * @cx_pager initialize
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug) console.log('cx_pager.init');

                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cxApp.tip_show ■■■';
                }
                if (cfg.debug == undefined) cfg.debug = false;
                if (cfg.debug) console.log('cx_pager.init');
            } // end func.cx_pager -> init

            /*----------------------------------------------
            * @cx_pager 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            evt.reg_event = function() {
                try {
                    if (cfg.debug) console.log('cx_pager.reg_event');
                    var row_click = jQuery.Event('row_click', { target: this});
                    $self.on('click', function(evt_) {
                        $self.trigger(row_click);
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        return false;
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.reg_event ■■■';
                }
            } // end func.cx_pager -> reg_event

            /*----------------------------------------------
            * @cx_pager 옵션값 설정
            ----------------------------------------------*/
            evt.set_page = function (param_) {
                try {
                    if (cfg.debug) console.log('cx_pager.set_page');
                    param_.value = parseInt(param_.value, 10);
                    mod[param_.id] = param_.value;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.set_page ■■■';
                }
            } // end func.cx_pager -> set_page

            /*----------------------------------------------
            * @cx_pager 옵션값 반환
            ----------------------------------------------*/
            evt.get_page = function (param_) {
                try {
                    if (cfg.debug) console.log('cx_pager.get_page');
                    return mod[param_];
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.get_page ■■■';
                }
            } // end func.cx_pager -> get_page

            /*----------------------------------------------
            * @cx_pager 페이지 그리기
            ----------------------------------------------*/
            evt.draw_page = function(param_) {
                try {
                    if (cfg.debug) console.log('cx_pager.draw_page');
                    if (param_ === undefined)
                        return;
                    param_ = parseInt(param_, 10);
                    evt.set_page({id:'total_rows', value:param_});
                    evt.calc_page();        // 전체 페이지를 계산

                    var html_ = '', i = 0;
                    if (mod.page > mod.row_width) {
                        html_ += '<a class="pagebox" name="'+cfg.id+'page_link" href="#" cx-page="1"><span style="font-size:11px;letter-spacing:-1px">◀◀</span></a>&nbsp;';
                    }
                    if (mod.page_prev > 0) {
                        html_ += '<a class="pagebox" name="'+cfg.id+'page_link" href="#" cx-page="'+ mod.page_prev +'"><span style="font-size:11px">◀</span></a>&nbsp;';
                    }

                    for (i=mod.page_start; i<=mod.page_end; i++) {
                        if (i == mod.page) {
                    //html_ += '<a class="pagebox selected" href="#">'+ i +'</a>&nbsp;';
                            html_ += '<a class="pagebox selected" name="'+cfg.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                        } else {
                            html_ += '<a class="pagebox" name="'+cfg.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                        }
                    }
                    if (mod.page < mod.page_next && mod.page_next <= mod.page_total) {
                        html_ += '<a class="pagebox" name="'+cfg.id+'page_link" href="#" cx-page="'+ mod.page_next +'"><span style="font-size:11px">▶</span></a>&nbsp;';
                    }

                    if (mod.page_total > mod.page_next) {
                        html_ += '<a class="pagebox" name="'+cfg.id+'page_link" href="#" cx-page="'+ mod.page_total +'"><span style="font-size:11px;letter-spacing:-2px">▶▶</span></a>';
                    }
                    $self.html(html_);
                    evt.bind_page();  // 이벤트 바인딩
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.draw_page ■■■';
                }
            } // end func.cx_pager -> draw_page

            /*----------------------------------------------
            * @cx_pager 페이지에 관계된 값을 계산
            ----------------------------------------------*/
            evt.calc_page = function() {
                try {
                    if (cfg.debug) console.log('cx_pager.calc_page');
                    mod.page_total = parseInt((mod.total_rows / mod.row_height), 10) + (mod.total_rows % mod.row_height > 0 ? 1 : 0);
                    mod.page_start = ((parseInt((mod.page / mod.row_width), 10) + (mod.page % mod.row_width > 0 ? 1 : 0)) * mod.row_width - (mod.row_width - 1));
                    mod.page_end = ((parseInt((mod.page / mod.row_width), 10) + (mod.page % mod.row_width > 0 ? 1 : 0)) * mod.row_width);

                    // 마지막 페이지
                    if (mod.page_end > mod.page_total) {
                        mod.page_end = mod.page_total;
                    }
                    // 이전 페이지
                    if (mod.page_start > mod.row_width)
                        mod.page_prev = mod.page_start - 1;
                    else
                        mod.page_prev = 0;

                    // 다음 페이지
                    if (mod.page_end < mod.page_total)
                        mod.page_next = mod.page_end + 1;
                    else
                        mod.page_next = mod.page_total;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.calc_page ■■■';
                }
            } // end func.cx_pager -> calc_page

            /*----------------------------------------------
            * @cx_pager reset 폼
            ----------------------------------------------*/
            evt.reload_page = function() {
                try {
                    if (cfg.debug) console.log('cx_pager.reload_page');
                    var page_ = _cfg.page + '';
                    var $page = this;
                    $.each($page.$link, function (idx_, item_) {
                        if (page_ === item_.innerText) {
                            $page.$link[idx_].click();
                            return false;
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.reload_page ■■■';
                }
            } // end func.cx_pager -> reload_page

            /*----------------------------------------------
            * @cx_pager 페이지 제거
            ----------------------------------------------*/
            evt.set_reset = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_pager.set_reset');
                    $self.children().remove();
                    return;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.set_reset ■■■';
                }
            } // end func.cx_pager -> clear_page

            /*----------------------------------------------
            * @cx_pager 이벤트 바인딩
            ----------------------------------------------*/
            evt.bind_page = function() {
                try {
                    if (cfg.debug) console.log('cx_pager.bind_page');
                    this.$link = $('a[name="'+cfg.id+'page_link"]');
                    this.$link.on('click', {'cfg':cfg}, function(paramEvt_) {
                        evt.set_page({id:'page', value:$(paramEvt_.currentTarget).prop('cx-page')});  // 현재 페이지 설정
                        cfg.click(paramEvt_);     // 호출측 callback 수행
                        evt.draw_page();     // 페이지 그리기
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_pager.bind_page ■■■';
                }
            } // end func.cx_pager -> bind_page
            evt.init();


            // 외부 interface
            this.mod = mod;
            this.cfg = cfg;

            this.get_data = evt.get_page;
            this.set_data = evt.set_page;
            this.set_draw = evt.draw_page;
            this.set_reset = evt.set_reset;

            return this;
        } // end method.cx_pager -> init
    }; app_.fn.cx_pager = function (method) { return __cx_pager.init.apply(this, arguments); } // end of cx_pager

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Popup
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_popup = {
        init: function (cfg_, mod_, $next_) {
            this.version = '0.0.0.1';
            var $self = this, evt = {};
            var $popup = {}, $child = {}, pop = {};
            var item = {};          // Form, Grid 에서의 팝업 객체
            var mod = {};
            var cfg = {
                  is_popup     : true   // cx_grid 에서 탭쪽에 던져주는 항목을 모두 금지함
                , prefix     : 'cx_popup'      // p + m
                , column_count : -1 // 현재 Grid 컬럼 수    (Grid 를 그릴때 필요함)
                //, row_count : -1    // 데이터를 읽어온 Row 수
                //, rowdata   : {}    // Grid row 를 그릴때 현재 Row 데이터를 할당해 둠
                //, popid     : null  // 팝업검색에서 popup_ 를 붙여 param['act'] 로 사용됨(차후 Grid 에서 name 으로 여러개 할때는?? 2018-04-16)
            }
            cfg = $.extend(cfg, cfg_);
            $self.$evt = {};    // 팝업을 호출한 객체
            $self.$next = null; // 팝업을 호출한 객체의 다음 포커스 객체

            /*----------------------------------------------
            * @cx_popup initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_popup.init');
                    mod = mod_;

                    // ########## 객체 설정
                    $popup = app_.cfg.$popup.clone(true);     // 팝업객체
                    $child.$table1 = $popup.find('#'+cfg.prefix+'thead');
                    $child.$table2 = $popup.find('#'+cfg.prefix+'tbody');
                    $child.$tbody = $child.$table2.find('tbody');
                    $child.$stxt = $popup.find('#'+cfg.prefix+'stxt');
                    $child.$btn = $popup.find('#'+cfg.prefix+'btn_search');
                    $child.$grid = $child.$tbody.cx_grid(cfg, mod);

                    if (cfg.research != undefined && cfg.research == false) {  // 재검색 하지 않음 팝업이면 검색관련(text, button) 감추기
                        $popup.find('caption').hide();
                    } else {
                        item =  {type:'text', id:cfg.prefix+'stxt', text:'검색어', value:cfg.value}
                        $child.$pop = app_.create_item($child.$stxt, 'form', cfg.pt_idx, item, $popup, 'cx_popup.init');
                    }

                    evt.set_grid();     // Grid 의 colgroup, th 등 그리기
                    $child.$btn.on('click', evt.btn_click);
                    $child.$stxt.on('keydown', evt.evt_keydown);    // 엔터치면 버튼클릭으로 대신 처리

                    // ######## 팝업 생성
                    $popup.dialog({
                                title: cfg.title,
                                resizable: false,
                                autoOpen : false,
                                show : 'blind',
                                //hide : 'blind',
                                width: cfg.w,
                                height: cfg.h,
                                modal: true,
                                buttons: { '닫기': function() {
                                        if (typeof cfg.before_close == 'function') {     // 사용자 함수가 있으면 호출
                                            var _res = cfg.before_close();
                                            if (_res == undefined || _res == false) {
                                                return false;
                                            }
                                        }
                                        $(this).dialog('close');
                                        evt.set_reset('cx_popup.btn_close');
                                    }}
                                });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.init ■■■';
                }
            } // end func.cx_popup -> init

            /*----------------------------------------------
            * @cx_popup set grid
            ----------------------------------------------*/
            evt.set_grid = function() {
                try {
                    if (cfg.debug) console.log('cx_popup.set_grid');
                    cfg.w = 0;  // 정확한 넓이를 재 계산하기 위해 재 설정
                    var _colgroup1 = '';
                    var _colgroup2 = '';
                    var _thead = '<tr>';
                    cfg.column_count = Object.keys(mod).length;
                    $.each(mod, function (idx_, item_) {
                        if (item_.w == 0) {
                            cfg.w += 200;
                            _colgroup1 += ' <col style="" />';
                        } else {
                            if (cfg.column_count > (idx_+1)) {
                                cfg.w += item_.w;
                                _colgroup1 += ' <col style="width: '+item_.w+'px" />';
                            } else {
                                cfg.w += item_.w + 17;
                                _colgroup2 = _colgroup1;
                                _colgroup2 += ' <col style="width: '+item_.w+'px" />';
                                _colgroup1 += ' <col style="width: '+(item_.w + 17)+'px" />';
                            }
                        }
                        _thead += '<th>'+item_.text+'</th>';
                    });
                    _thead += '</tr>';

                    $child.$table1.find('colgroup').append(_colgroup1);
                    $child.$table1.find('thead').append(_thead);
                    $child.$table2.find('colgroup').append(_colgroup2);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.set_grid ■■■';
                }
            } // end func.cx_popup -> set_grid

            /*----------------------------------------------
            * @cx_popup check value
            ----------------------------------------------*/
            evt.check_value = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_popup.check_value');
                    //var e = jQuery.Event('keydown', {keyCode: 13});
                    //$child.$pop.trigger(e);
                    //return $child.$pop.get_data('cx_popup.check_value');
                    return $child.$stxt.val();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.check_value ■■■';
                }
            } // end func.cx_popup -> check_value

            /*----------------------------------------------
            * @cx_popup btn_click
            ----------------------------------------------*/
            evt.btn_click = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_popup.btn_click');

                    var _param = {};
                    _param['stxt'] = $.trim($child.$stxt.val());
                    _param['act'] = cfg.id;
                    evt.btn_search(_param);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.btn_click ■■■';
                }
            } // end func.cx_popup -> btn_click

            /*----------------------------------------------
            * @cx_popup btn_search
            ----------------------------------------------*/
            evt.btn_search = function(data_) {
                try {
                    if (cfg.debug) console.log('cx_popup.btn_search');
                    var _param = data_;
                    _param['stxt'] = evt.check_value('cx_popup.eve_keydown');
                    if (_param['stxt'] == '')
                    return false;
                    _param['act'] = cfg.id;
                    if (typeof cfg.before_open == 'function') {     // 사용자 함수가 있으면 호출
                        _param = cfg.before_open(_param);
                        if (_param == undefined || _param === false)
                            return false;
                    }
                    evt.popup_search(_param);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.btn_search ■■■';
                }
            } // end func.cx_popup -> btn_search

            /*----------------------------------------------
            * @cx_popup evt_keydown
            ----------------------------------------------*/
            evt.evt_keydown = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_popup.evt_keydown');
                    if (evt_.keyCode == 13) {   // 무조건 검색버튼을 클릭한다
                        $child.$btn.click();
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.evt_keydown ■■■';
                }
            } // end func.cx_popup -> evt_keydown

            /*----------------------------------------------
            * @cx_popup popup search
            ----------------------------------------------*/
            evt.popup_search = function(param_) {
                try {
                    if (cfg.debug) console.log('cx_popup.popup_search');
                    cxApp.async({act:cfg.act, data:param_, now_tab:cfg.now_tab, debug:false}, evt.callback_search);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.popup_search ■■■';
                }
            } // end func.cx_popup -> popup_search

            /*----------------------------------------------
            * @cx_popup callback search
            ----------------------------------------------*/
            evt.callback_search = function(res_) {
                try {
                    if
                        (cfg.debug) console.log('cx_popup.callback_search');
                    if (typeof cfg.before_draw == 'function') {     // 사용자 함수가 있으면 호출
                        res_ = cfg.before_draw(res_);
                        if (res_ == undefined || res_ === false) {
                            return false;
                        }
                    }
                    if (res_ != false && res_.result == true) {    // 사용자 함수를 호출해 주므로 1건이라도 그려줌
                        if ($popup.dialog('isOpen') == false) {
                            $popup.dialog('open');
                        }
                        $child.$grid.set_draw(res_.data);   // row data binding
                    } else {
                        if ($popup.dialog('isOpen') == true)
                            $child.$grid.set_reset(false, 'cx_popup.callback_search');
                        if ($self.$evt[0] !== undefined) {
                            app_.show_tip($self.$evt, res_.form.stxt + ' 단어로 검색된 정보가 없습니다');
                            $self.$evt.select().focus();    // 객체만 넘어오므로 set_focus 함수를 사용할 수 없음
                        }
                        return false;
                    }
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.callback_search ■■■';
                }
            } // end func.cx_popup -> callback_search

            /*----------------------------------------------
            * @cx_popup open popup (외부에서 호출)
            ----------------------------------------------*/
            evt.popup_open = function(data_) {
                try {
                    if (cfg.debug) console.log('cx_popup.popup_open');
                    $child.$stxt.val(data_.stxt);
                    evt.btn_search(data_);
                    //$child.$btn.click();    // cx_popup.btn_search (json type param 때문에 이벤트 발생으로 처리안함: 2018-04-30)
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.popup_open ■■■';
                }
            } // end func.cx_popup -> popup_open

            /*----------------------------------------------
            * @cx_popup close popup (외부에서 호출)
            ----------------------------------------------*/
            evt.popup_close = function() {
                try {
                    if (cfg.debug) console.log('cx_popup.popup_close');
                    if (typeof cfg.before_close == 'function') {     // 사용자 함수가 있으면 호출
                        var _res = cfg.before_close();
                        if (_res == undefined || _res == false) {
                            return false;
                        }
                    }
                    $popup.dialog('close');
                    evt.set_reset('cx_popup.btn_close');
                    setTimeout(function() {
                        if ($self.$next != undefined && $self.$next)
                            $self.$next.set_focus('cx_popup.popup_close');
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.popup_close ■■■';
                }
            } // end func.cx_popup -> popup_close

            /*----------------------------------------------
            * @cx_popup clear
            ----------------------------------------------*/
            evt.set_reset = function(caller_) {
                try {
                    if (cfg.debug) console.log('cx_popup.set_reset');
                    $child.$stxt.val('');       // 닫을때 초기화
                    //$child.$grid.set_reset();
                    $child.$grid.set_reset(false, 'cx_popup.callback_search');
                    //pop.$tbody.children().remove();
                    //pop.$tbody.append('<tr><td class="center" colspan="'+cfg.column_count+'" style="height: 30vh">No Data..</td></tr>');
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_popup.set_reset ■■■';
                }
            } // end func.cx_popup -> set_reset


            evt.init();
            // 외부 interface
            this.cfg = cfg;

            this.popup_open = evt.popup_open;
            this.popup_close = evt.popup_close;
            this.popup_search = evt.popup_search;
            return this;
        } // end method.cx_popup -> init
    }; app_.fn.cx_popup = function (method) { return __cx_popup.init.apply(this, arguments); } // end of cx_popup


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Splitter
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_split = {
        init: function (cfg_) {
            this.version = '0.0.0.1';
            var $self = this, evt = {};
            var $child = [];
            $self.$tab = {};
            var cfg = {
                  now_tab: -1
                , unit: 'px'
                , child_count: 0
            }
            cfg = $.extend(cfg, cfg_);
            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.pt_idx = cfg.p;
            else
                cfg.pt_idx = cfg.p + '' + cfg.mytab;

            /*----------------------------------------------
            * @cx_split initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_split.init');

                    cfg.type = evt.set_direction(cfg.type);
                    cfg.child_count = Object.keys(cfg.child).length;
                    setTimeout(function() {     // 실제 offset 사용을 위해
                        cfg.offset = $self.offset();
                        evt.set_child($child, app_.cfg, cfg.child, cfg.offset);
                        evt.set_parent();
                        evt.split();
                        evt.set_resize();
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.init ■■■';
                }
            } // end func.cx_split -> init

            /*----------------------------------------------
            * @cx_split set_resize
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_resize = function() {
                try {
                    if (cfg.debug) console.log('cx_split.set_resize');
                    $(window).resize(function() {
                        console.error('split resize 를 구현하세요');
                        //if (item_.type == 'v') {
                        //
                        //}
                        //$child_[idx_]

                    });
                    //app_.cfg.w = $(window).width();
                    //app_.cfg.h = $(window).height();
                    if (app_.cfg.h < app_.cfg.h_limit) // 필요이상으로 줄어들면 처리하지 않음
                        return;
                    //app_.cfg.$wrap_body.css('height', app_.cfg.h - 90);    // 이곳에서 잘못하면 스크롤이 생김
                    //$tab.css('height', app_.cfg.h - 200);       // 이곳이 tab 높이임

                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_resize ■■■';
                }
            } // end func.cx_split -> set_resize

            /*----------------------------------------------
            * @cx_split set_data (width, height)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_data = function(set_, value_) {
                try {
                    if (cfg.debug) console.log('cx_split.set_data');
                    if (set_ == undefined || set_ == 0)
                        return value_ + cfg.unit;
                    if ((set_+'').match(/[%|vw|vh]/g)) {   // vw, vh, %
                        return set_;
                    }
                    return set_+'px';
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_data ■■■';
                }
            } // end func.cx_split -> set_data

            /*----------------------------------------------
            * @cx_split set_direction (v, h)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_direction = function(type_) {
                try {
                    if (cfg.debug) console.log('cx_split.set_direction');
                    return type_.toLowerCase();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_direction ■■■';
                }
            } // end func.cx_split -> set_direction

            /*----------------------------------------------
            * @cx_split set_unit
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_unit = function(unit_) {
                try {
                    if (cfg.debug) console.log('cx_split.set_unit');
                    if (unit_ == undefined || unit_ == '')
                        return 'px';
                    return unit_;
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_unit ■■■';
                }
            } // end func.cx_split -> set_unit

            /*----------------------------------------------
            * @cx_split set_child
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_child = function($child_, cfg_, child_, offset_) {
                try {
                    if (cfg.debug) console.log('cx_split.set_child');
                    var child_count = Object.keys(child_).length;
                    var w = 0, h = 0;
                    $.each(child_, function (idx_, item_) {
                        $child_[idx_] = $('#'+cfg.pt_idx+item_.id);
                        item_.type = evt.set_direction(item_.type); // 방향설정
                        item_.unit = evt.set_unit(item_.unit);      // 단위설정

                        if (item_.type == 'v') {
                            if (idx_ < (child_count-1)) {   // 중간은 항상 넓이가 있어야 함
                                item_.w = evt.set_data(item_.w, 300);
                                item_.h = evt.set_data(item_.h, cfg_.h - offset_.top);
                                w += parseInt(item_.w, 10);     // 마지막 사이즈를 위해 누적
                                h += parseInt(item_.h, 10);     // 전체 높이를 적용
                                $child_[idx_].css({'float':'left', width:item_.w, height:item_.h}).addClass('split');
                            } else {
                                item_.w = evt.set_data(item_.w, cfg_.w - offset_.left - 300);   // 지정 크기가 없으면 나머지를 적용
                                item_.h = evt.set_data(item_.h, cfg_.h - offset_.top);          // 전체 높이를 적용
                                //$child_[idx_].css('float', 'right');
                                $child_[idx_].css({'float':'right', width:item_.w, height:item_.h}).addClass('split');
                            }
                        } else {
                            console.error('수평분할 일때를 구현할 것');
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_child ■■■';
                }
            } // end func.cx_split -> set_child

            /*----------------------------------------------
            * @cx_split set_parent (width, height)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_parent = function() {
                try {
                    if (cfg.debug) console.log('cx_split.set_parent');
                    cfg.w = evt.set_data(cfg.w, app_.cfg.w - cfg.offset.left);  // 지정 크기가 없으면 나머지를 적용
                    cfg.h = evt.set_data(cfg.h, app_.cfg.h - cfg.offset.top);   // 지정 크기가 없으면 나머지를 적용
                    $self.css({width: cfg.w, height: cfg.h});
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.set_parent ■■■';
                }
            } // end func.cx_split -> set_parent

            /*----------------------------------------------
            * @cx_split initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.split = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_split.split');
                    $child[0].resizable({
                //        autoHide: true,
                //        handles: 'e',
                        resize: function(e, ui) {
                            var parent = ui.element.parent();
                            var remainingSpace = parent.width() - ui.element.outerWidth(),
                                divTwo = ui.element.next(),
                                divTwoWidth = (remainingSpace - (divTwo.outerWidth() - divTwo.width()))/parent.width()*100+"%";
                                divTwo.width(divTwoWidth);
                        },
                        stop: function(e, ui) {
                            var parent = ui.element.parent();
                            ui.element.css(
                            {
                                width: ui.element.width()/parent.width()*100+"%",
                            });
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_split.split ■■■';
                }
            } // end func.cx_split -> split
            evt.init();

            // 외부 접근 허용
            this.cfg = cfg;
            return this;
        } // end method.cx_split -> init
    }; app_.fn.cx_split = function (method) { return __cx_split.init.apply(this, arguments); } // end of cx_split

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Tab
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_tab = {
        init: function (cfg_, $mod_) {
            this.version = '0.0.0.1';
            var $self = this, evt = {};
            var $btn = {}, $tab = {};
            var cfg = {
                  now_tab: -1
                , bbb: -1
            }
            cfg = $.extend(cfg, cfg_);


            /*----------------------------------------------
            * @cx_tab initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('cx_tab.init');
                    if ($self.$cfocus == undefined) { // 탭 클릭시 처리할 포커스 클로저 객체
                        $.each($mod_, function (idx_, item_) {
                            if (item_ != null && $mod_.$tab != undefined) {
                                $mod_.$tab.$cfocus = [];
                            }
                        });
                        $self.$cfocus = [];
                    }

                    $btn = $self.children().find('a');                  // 탭 버튼
                    if (app_.cfg.theme == 'boot')
                        $tab = $self.children().find('div.tab-pane');   // 탭 컨텐츠
                    else if (app_.cfg.theme == 'ui')
                        $tab = $self.find('div.tab-pane');              // 탭 컨텐츠

                    evt.set_event();    // 이벤트 등록
                    evt.set_resize();
                    evt.set_noti();  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.init ■■■';
                }
            } // end func.cx_tab -> init

            /*----------------------------------------------
            * @cx_tab 사용자 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_event = function() {
                try {
                    if (cfg.debug) console.log('cx_tab.set_event');
                    //$self.on('click', evt.click_body); // 의도적인 div 클릭이므로 다른 처리를 할 것 없음
                    var tab_click = jQuery.Event('tab_click', { target: this});
                    $.each($btn, function (idx_, item_) {
                        $(item_).on('click', function(evt_) {
                            $(this).trigger(tab_click);
                            //evt_.stopPropagation();
                            //evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                            return false;
                        });
                        $(item_).on('tab_click', evt.tab_click);
                    });

                    $(window).resize(function() {
                        evt.set_resize();
                    });
                    $self.show().tabs({active:cfg.now_tab, show:{effect:'blind', duration: 500}});  // 효과
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.set_event ■■■';
                }
            } // end func.cx_tab -> set_event
            ///*----------------------------------------------
            //* @cx_tab tab click_body 時 현재 위치의 객체에 포커싱
            //        의도적인 div 클릭이므로 다른 처리를 할 것 없음
            //* @returns  {void)
            //----------------------------------------------*/
            //evt.click_body = function(evt_) {
            //    try {
            //        if (cfg.debug) console.log('cx_tab.click_body');
            //        $($tab[cfg.now_tab]).focus();
            //        evt.set_noti_active(true);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
            //    } catch(e) {
            //        console.info(e);
            //        throw '■■■ error: cx_tab.click_body ■■■';
            //    }
            //} // end event.cx_tab -> click_body

            /*----------------------------------------------
            * @cx_tab tab btn click,
            * @returns  {void)
            ----------------------------------------------*/
            evt.tab_click = function(evt_) {
                try {
                    if (cfg.debug) console.log('cx_tab.tab_click');
                    $.each($btn, function (idx_, item_) {
                        if (evt_.currentTarget == item_) {
                            $($btn[idx_]).blur();
                            $($tab[idx_]).focus();
                            cfg.now_tab = idx_;


                            evt.set_noti_active(true);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독

                            //_evt.$mode.val('tab'+m_+(idx_ + 1));
                            //_mod[0] = idx_ + 1;       // 현재 active 된 탭 인덱스
                            //_evt.__focus(_mod[idx_+1].focus.item);
                            return false;
                        }
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.tab_click ■■■';
                }
            } // end event.cx_tab -> tab_click

            /*----------------------------------------------
            * @cx_tab 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
            * @param    {bool)  false 면 처리하지 않음 (처음 탭 로드時 search, form, grid 등에서 처리하므로 필요없음)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_noti = function(load_) {
                try {
                    if (cfg.debug) console.log('cx_tab.set_noti');
                    $.each($mod_, function (key1_, item1_) {        // m100, m101, m012...
                        $.each(item1_, function (key2_, item2_) {   // mfrm, mgrd, mpag, dfrm, dgrd, dpag...
                            if (item2_ == null) return true;        // 생성된 모듈이 아니면 통과
                            item2_.$tab = $self;                    // 포커스 객체를 등록해 줄 탭을 연결
                            item2_.cfg.now_tab = cfg.now_tab;
                        });
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.set_noti ■■■';
                }
            } // end func.cx_tab -> set_noti

            /*----------------------------------------------
            * @cx_tab 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
            * @param    {bool)  false 면 처리하지 않음 (처음 탭 로드時 search, form, grid 등에서 처리하므로 필요없음)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_noti_active = function(load_) {
                try {
                    if (cfg.debug) console.log('cx_tab.set_noti_active');
                    if (load_ == false) return;                             // 처음 탭 로드時 search, form, grid 등에서 처리하므로 필요없음
                    $.each($mod_, function (key1_, item1_) {                // m100, m101, m012...
                        $.each(item1_, function (key2_, item2_) {           // mfrm, mgrd, mpag, dfrm, dgrd, dpag...
                            if (item2_ == null) return true;                // 생성된 모듈이 아니면 통과
                            item2_.cfg.now_tab = cfg.now_tab;               // 현재 active tab index 를 모든 구독자에게 할당
                            if (item2_.cfg.mytab == item2_.cfg.now_tab) {   // 나의 탭과 현재 active 탭이 같으면 포커스 처리

                                if ($self.$cfocus[item2_.cfg.mytab] != undefined) {
                                    if (typeof $self.$cfocus[item2_.cfg.mytab] == 'function') {
                                        var f_closure = $self.$cfocus[item2_.cfg.mytab]();
                                        f_closure();    // 해당탭에 포커싱 처리
                                    }
                                }
                            }
                        });
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.set_noti_active ■■■';
                }
            } // end func.cx_tab -> set_noti_active

            /*----------------------------------------------
            * @cx_tab tab tab move
            * @returns  {void)
            ----------------------------------------------*/
            evt.tab_move = function(param_) {
                try {
                    if (cfg.debug) console.log('cx_tab.tab_move');
                    $btn[param_].click();
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.tab_move ■■■';
                }
            } // end event.cx_tab -> tab_click

            /*----------------------------------------------
            * @cx_tab tab > item set focus
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_focus = function(paramItem_, caller) {
                try {
                    if (cfg.debug) console.log('cx_tab.set_focus');
                    if (paramItem_ == undefined || paramItem_.type == undefined) {
                        console.error('dx_tab._evt.__focus ', 'undefined focus item ', paramItem_);
                        return;
                    }
                    if (paramItem_.type == 'hidden' || (paramItem_.$obj[0] !== undefined && paramItem_.$obj[0].type == 'hidden'))
                        return false;
                    if (paramItem_.$obj.length < 1)
                        return false;

                    var t = setTimeout(function() {
                        if (paramItem_.type == 'select') {
                            if (app_.cfg.theme == 'ui') {
                                paramItem_.$ui.focus();
                            } else {
                                paramItem_.$obj.focus();
                            }
                        } else {
                            paramItem_.$obj.focus();
                            if (paramItem_.type == 'button')    // 버튼이면 이벤트를 발생시킴
                                paramItem_.$obj.click();
                        }
                        clearTimeout(t);
                    }, 0);
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.set_focus ■■■';
                }
            } // end event.cx_tab -> set_focus

            /*----------------------------------------------
            * @cx_tab tab resize (750px 이하로 줄어들면 처리안 함)
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_resize = function() {
                try {
                    if (cfg.debug) console.log('cx_tab.set_resize');
                    //app_.cfg.h = $(window).height();
                    if (app_.cfg.h < 750) // 필요이상으로 줄어들면 처리하지 않음
                        return;
                    //app_.cfg.$wrap_body.css('height', app_.cfg.h - 90);    // 이곳에서 잘못하면 스크롤이 생김
                    $tab.css('height', app_.cfg.h - 200);       // 이곳이 tab 높이임
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_tab.set_resize ■■■';
                }
            } // end event.cx_tab -> set_resize

            evt.init();

            // 외부 접근 허용
            this.cfg = cfg;
            this.tab_move   = evt.tab_move;
            return this;
        } // end method.cx_tab -> init
    }; app_.fn.cx_tab = function (method) { return __cx_tab.init.apply(this, arguments); } // end of cx_tab

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Table Tree
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    $.widget("ui.tree", {

//    var __cx_tree = {
//        init: function (cfg_, $mod_) {
		_init: function() {
            this.version = '0.0.0.1';
            var widget = this, evt = {};
            var $btn = {}, $tab = {};
            this.options = {
                  now_tab: -1
                , with_root: false
                , expand_char: '+'
                , collapse_char: '-'
                , collapse_after_init: true
                , add_expand_all: true
                , add_collapse_all: true
                , expand_all_text: 'Expand All'
                , collapse_all_text: 'Collapse All'

                , expand_link_class : 'ui-tree-expand'
                , collapse_link_class : 'ui-tree-collapse'
                , common_link_class : 'ui-tree-handler'
                , expand_all_link_class : 'ui-tree-expand-all'
                , collapse_all_link_class : 'ui-tree-collapse-all'
                , draggable_over_class : 'ui-tree-draggable-over'


            }
//            cfg = $.extend(cfg, cfg_);

			widget._set_with_root_option();

			if(widget.options.collapse_after_init) {
				// Hide all branches
				$('ul', widget.element).hide();
				// Show first (root) branch
				widget._parent().children('ul').show();
			}

			// Create links - tree handlers for collapsing/expanding branches
			widget._build_tree_handlers();

//console.error(widget.element);
			if(widget.options.add_collapse_all) { widget._add_collapse_all_link(widget.element); }
			if(widget.options.add_expand_all) { widget._add_expand_all_link(widget.element); }
			if(widget.options.handle_for_dragging) { widget._init_drag_n_drop(); }
		},


		expand: function(branch, method) {
			method = method || 'instant'
			branch = branch.jquery ? branch : $(branch, this.element);

			// Expand branch
			this._expand(branch, method);
			// Set handler to collapse
			var a = branch.siblings('div').children('.' + expand_link_class);
			this._set_link_to_collapse(a);


			this._trigger('expand', 0, branch)
console.error(this._trigger);
            },


		collapse: function(branch, method) {
			method = method || 'instant'
			branch = branch.jquery ? branch : $(branch, this.element);

			// Collapse branch
			this._collapse(branch, method);

			// Set handler to expand
			var a = branch.siblings('div').children('.' + collapse_link_class);
			this._set_link_to_expand(a);

			this._trigger('collapse', 0, branch)
		},


		update: function() {
			this._build_tree_handlers();
		},


		is_collapsed: function(branch) {
            //console.error(this, branch, this.element, $(branch, this.element));
			branch = branch.jquery ? branch : $(branch, this.element);
			return branch.is(':hidden');
		},


		_add_collapse_all_link: function() {
			var widget = this;
//console.error(widget.options);
			var a_collapse_all = $('<a class="' + widget.options.collapse_all_link_class + '" href="#">' + widget.options.collapse_all_text + '</a>');
			this.element.before(a_collapse_all);
			a_collapse_all.click(function() {
				$('ul', widget.element).hide();
				// If tree is without root, top-level branches should be shown
				if(!widget.options.with_root) { widget.element.children('ul').show(); };
				// Rebuild handlers - set them to expand
				widget.update();
				widget._trigger('collapse_all', 0, widget.element);
				return false;
			});
		},


		_add_expand_all_link: function() {
			var widget = this;
			var a_expand_all = $('<a class="' + widget.options.expand_all_link_class + '" href="#">' + widget.options.expand_all_text + '</a>');
			this.element.before(a_expand_all);
			a_expand_all.click(function() {
				$('ul', widget.element).show();
				// Rebuild handlers - set them to collapse
				widget.update();
				widget._trigger('expand_all', 0, widget.element);
				return false;
			});
		},


		_set_link_to_collapse: function(a) {
			a.removeClass(widget.options.expand_link_class)
			a.addClass(widget.options.collapse_link_class);
			//a.html(this.options.collapse_char);
			a.html($.ui.tree.options.collapse_char);
            console.error(1);
		},


		_set_link_to_expand: function(a) {
			a.removeClass(widget.options.collapse_link_class)
			a.addClass(widget.options.expand_link_class);
			//a.html(this.options.expand_char);
			a.html($.ui.tree.options.expand_char);
            console.error(2);
		},


		_expand: function(branch, method) {
			if(method == 'instant') {
				branch.show();
			} else if(method == 'slide') {
				branch.slideDown();
			}
		},


		_collapse: function(branch, method) {
			if(method == 'instant') {
				branch.hide();
			} else if(method == 'slide') {
				branch.slideUp();
			}
		},


		_init_drag_n_drop: function() {
			var widget = this;

			// Add draggable widget
			var draggable_options = {};
			draggable_options.handle = widget.options.handle_for_dragging + ':first';
			draggable_options.cursor = 'move';

			// For Opera, 'revert' option should not be used (because it works wrong in Opera),
			// instead of this, draggable object should be returned to its place if it
			// is not dropped on other branch (returned by setting attrbibute style='position:relative')
			if($.browser.opera) {
				draggable_options.stop = function(event, ui) {
					ui.helper.attr('style', 'position: relative');
				}
			} else {
				draggable_options.revert = 'invalid';
			}
			$('li', widget.element).draggable(draggable_options);

			// Add droppable widget
			$(widget.options.handle_for_dragging, widget.element).droppable({
				over: function() {
					$(this).addClass(draggable_over_class);
				},
				tolerance: 'pointer',
				out: function() {
					$(this).removeClass(draggable_over_class);
				},
				drop: function(event, ui) {
					$(this).removeClass(draggable_over_class);
					var li = $(this).closest('li');

					// For tree with root, if parent li is not found, then droppable object is root.
					if(li.length == 0) { li = widget.element; };

					var ul = li.children('ul');
					// If subbranch of droppable doesn't exist, create it.
					if(ul.length == 0) { ul = $('<ul></ul>'); li.append(ul); };
					ui.draggable.appendTo(ul);
					ui.draggable.attr('style', 'position: relative');

					widget.update();
					widget._trigger('drop', 0, {draggable: ui.draggable, droppable: li});
				}
			});
		},


		_parent: function() {
			var parent;
			if(this.options.with_root) {
				parent = this.element.parent();
			} else {
				parent = this.element;
			}
			return parent;
		},

		_set_with_root_option: function() {
			// Tree will be with root if it has 'div' before branches. This 'div'
			// will be root.
			if(this.element.children('div').length > 0) {
				this.options.with_root = true
			} else {
				this.options.with_root = false
			}
		},


		_build_tree_handlers: function() {
			var widget = this;
			var self = this.element;
console.error(self);
			$('ul', self).each(function() {
				var ul = $(this);
				var div = ul.siblings('div');
console.error(div);
				if(ul.children('li').length == 0) {
					// Remove handlers from branch if the branch doesn't have subbranches
					div.children('a.' + widget.options.common_link_class).remove();
				} else {
					var required_link_class = widget.is_collapsed(ul) ? expand_link_class : collapse_link_class;
					var a = div.children('a.' + required_link_class);
					// If expanded branch doesn't have collapse handler or collapsed branch doesn't
					// have expand handler, create them.
					if(a.length == 0) {
						// but before this we should destroy any wrong handlers, if they are presented
						div.children('a.' + widget.options.common_link_class).remove();
						var character;
						if (widget.is_collapsed(ul)) {
							//character = widget.options.expand_char;
							character = widget.options.expand_char;
						} else {
							//character = widget.options.collapse_char;
							character = widget.options.collapse_char;
						}
console.error(character);
						a = $('<a href="#" class="' + required_link_class + ' ' + widget.options.common_link_class + '">' + character + '</a>');
						div.prepend(a);

						a.click(function() {
							widget.is_collapsed(ul) ? widget.expand(ul) : widget.collapse(ul);
							return false;
						});
					}
				}
			});
		}

            // 외부 접근 허용
//            this.cfg = cfg;
//            return this;
//        } // end method.cx_tree -> init
    });
//    }; app_.fn.cx_tree = function (method) { return __cx_tree.init.apply(this, arguments); } // end of cx_tree

    app_.fn.cx_tree = $.ui.tree;

//console.error($.ui.tree);

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Formatter
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_format = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_formattor 포멧처리
        * @returns  {string}
        ----------------------------------------------*/
        this.format = function(format_, data_, len_) {
            try {
                if (this.debug) console.log('cx_format.format');
                if (data_ == undefined || !data_) return data_;
                switch (format_) {
                    case 'yyyy-mm-dd':
                        if (data_.length == 19) {
                            data_ = data_.substring(0, 10);
                            data_ = data_.substr(0, 4)+'-'+data_.substr(5, 2)+'-'+data_.substr(8, 2);
                        } else if (data_.length == 8)
                            data_ = data_.substr(0, 4)+'-'+data_.substr(4, 2)+'-'+data_.substr(6, 2);
                        else if (data_.length == 10)
                            data_ = data_.substr(0, 4)+'-'+data_.substr(5, 2)+'-'+data_.substr(8, 2);
                        break;
                    case 'yyyy.mm.dd':
                        if (data_.length == 19) {
                            data_ = data_.substring(0, 10);
                            data_ = data_.substr(0, 4)+'.'+data_.substr(5, 2)+'.'+data_.substr(8, 2);
                        } else if (data_.length == 8)
                            data_ = data_.substr(0, 4)+'.'+data_.substr(4, 2)+'.'+data_.substr(6, 2);
                        else if (data_.length == 10)
                            data_ = data_.substr(0, 4)+'.'+data_.substr(5, 2)+'.'+data_.substr(8, 2);
                        break;
                    case '#,##0':
                    case 'comma':
                        data_ = (data_+'').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
                        break;
                    case 'zerofill':
                        if (len_ == undefined || typeof len_ != 'number')
                            throw '■■■ error: length param is undefined ■■■';
                        len_ -= data_.toString().length;
                        if (len_ > 0) {
                            data_ = new Array(len_ + (/\./.test(data_) ? 2 : 1)).join('0') + data_;
                        }
                        break;
                    case 'int':
                        data_ = (data_+'').replace(/[,]/g, '');
                        break;

                }
                return data_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_format.format ■■■';
            }
        } // end.method.cx_format -> format

    } // end of cx_format

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Random
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_random = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_random 한글을 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_kor = function(len_) {
            try {
                if (this.debug) console.log('cx_random.get_kor');
                var res = '';
                for (var i=0; i<len_; i++) {
                    res += String.fromCharCode( 44031 + Math.ceil(11172 * Math.random()));
                }
                return res;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_random.get_kor ■■■';
            }
        } // end.method.cx_random -> get_kor

        this.get_ymd = function(sep_) {
            try {
                if (this.debug) console.log('cx_random.get_ymd');
                if (sep_ == undefined) sep_ = '-';
                var d = new Date();
                return (d.getFullYear())
                        +sep_+ ((''+(d.getMonth()+1)).length == 1 ? '0'+(d.getMonth()+1) : (d.getMonth())+1)
                        +sep_+ ((''+d.getDay()).length == 1 ? '0'+d.getDay() : d.getDay());
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_random.get_ymd ■■■';
            }
        } // end.method.cx_random -> get_ymd

        this.get_his = function(sep_) {
            try {
                if (this.debug) console.log('cx_random.get_his');
                if (sep_ == undefined) sep_ = ':';
                var d = new Date();
                return ((''+d.getHours()).length == 1 ? '0'+d.getHours() : d.getHours())
                        +sep_+ ((''+d.getMinutes()).length == 1 ? '0'+d.getMinutes() : d.getMinutes())
                        +sep_+ ((''+d.getSeconds()).length == 1 ? '0'+d.getSeconds() : d.getSeconds());
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_random.get_his ■■■';
            }
        } // end.method.cx_random -> get_his

    } // end of cx_random

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Utility
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_util = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_util 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_browser = function() {
            try {
                if (this.debug) console.log('cx_util.get_browser');
                var agt = navigator.userAgent.toLowerCase ();   // UserAgent를 이용해서 IE인지를 체크합니다.
                if (agt.indexOf ('msie') != -1 || agt.indexOf('trident') != - 1) {  // IE7엔 브라우저 엔진명인 Trident가 없고 IE11엔 MSIE란 문자열이 없으므로 두 가지 경우를 다 체크합니다.
                    var version = 11 ;
                    agt = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agt);
                    if (agt) {
                        version = parseInt(agt[1]);
                    }
                    return 'ie' + version;
                } else {
                    if (agt.indexOf('chrome') != -1) return 'chrome';
                    if (agt.indexOf('opera') != -1) return 'opera';
                    if (agt.indexOf('staroffice') != -1) return 'star office';
                    if (agt.indexOf('webtv') != -1) return 'webtv';
                    if (agt.indexOf('beonex') != -1) return 'beonex';
                    if (agt.indexOf('chimera') != -1) return 'chimera';
                    if (agt.indexOf('netpositive') != -1) return 'netpositive';
                    if (agt.indexOf('phoenix') != -1) return 'phoenix';
                    if (agt.indexOf('firefox') != -1) return 'firefox';
                    if (agt.indexOf('safari') != -1) return 'safari';
                    if (agt.indexOf('skipstone') != -1) return 'skipstone';
                    if (agt.indexOf('msie') != -1) return 'internet explorer';
                    if (agt.indexOf('netscape') != -1) return 'netscape';
                    if (agt.indexOf('mozilla/5.0') != -1) return 'mozilla';
                }
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_util.get_browser ■■■';
            }
        } // end.method.cx_util -> get_browser

        ///*----------------------------------------------
        //* @cx_util 콤마찍기
        //* @param    {string}
        //* @returns  {string}
        //----------------------------------------------*/
        //this.add_comma = function(str_) {
        //    try {
        //        if (this.debug) console.log('cx_util.add_comma');
        //        return str_.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        //    } catch(e) {
        //        console.info(e);
        //        throw '■■■ error: cx_util.add_comma ■■■';
        //    }
        //} // end.method.cx_util -> add_comma

        /*----------------------------------------------
        * @cx_util HTML Entity 를 원래로 치환
        * @param    {string} E: edit, V:view
        * @param    {string}
        * @returns  {string}
        ----------------------------------------------*/
        this.replace_html = function(mode_, str_) {
            try {
                if (this.debug) console.log('cx_util.replace_html');
                if (!str_) return '';
                if (typeof str_ != 'string') return str_;
                if (mode_ == 'E') {
                    str_ = str_.replace(/&lt;/g,  '<');
                    str_ = str_.replace(/&gt;/g,  '>');
                    str_ = str_.replace(/&#92;/g, '"');
                    str_ = str_.replace(/&quot;/g, '"');
                    str_ = str_.replace(/&#039;/g, "'");
                    str_ = str_.replace(/<br \/>/g, '\n');
                    str_ = str_.replace(/<br>/g, '\n');
                    str_ = str_.replace(/<br\/>/g, '\n');
                    str_ = str_.replace(/&amp;/g,  '&');
                } else {
                    str_ = str_.replace(/</g,  '&lt;');
                    str_ = str_.replace(/>/g,  '&gt;');
                    str_ = str_.replace(/\"/g, '&quot;');
                    str_ = str_.replace(/\'/g, '&#39;');
                    str_ = str_.replace(/\n/g, '<br />');
                }
                return str_;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_util.replace_html ■■■';
            }
        } // end.method.cx_util -> replace_html
    } // end of cx_util

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Validation
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_validator = function () {
        this.version = '0.0.0.1';
        this.debug = false;

        /*----------------------------------------------
        * @cx_validator check number
        ----------------------------------------------*/
        this.is_num = function() {
            try {
                if (this.debug) console.log('cx_validator.is_num');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_num ■■■';
            }
        } // end.method.cx_validator -> is_num

        /*----------------------------------------------
        * @cx_validator check id
        ----------------------------------------------*/
        this.is_id = function() {
            try {
                if (this.debug) console.log('cx_validator.is_id');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_id ■■■';
            }
        } // end.method.cx_validator -> is_id

        /*----------------------------------------------
        * @cx_validator check password
        ----------------------------------------------*/
        this.is_pwd = function() {
            try {
                if (this.debug) console.log('cx_validator.is_pwd');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_pwd ■■■';
            }
        } // end.method.cx_validator -> is_pwd

        /*----------------------------------------------
        * @cx_validator check email
        ----------------------------------------------*/
        this.is_email = function() {
            try {
                if (this.debug) console.log('cx_validator.is_email');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_email ■■■';
            }
        } // end.method.cx_validator -> is_email

        /*----------------------------------------------
        * @cx_validator check biz no
        ----------------------------------------------*/
        this.is_bizno = function() {
            try {
                if (this.debug) console.log('cx_validator.is_bizno');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_bizno ■■■';
            }
        } // end.method.cx_validator -> is_bizno

        /*----------------------------------------------
        * @cx_validator check reg no
        ----------------------------------------------*/
        this.is_regno = function() {
            try {
                if (this.debug) console.log('cx_validator.is_regno');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validator.is_regno ■■■';
            }
        } // end.method.cx_validator -> is_regno

        /*----------------------------------------------
        * @cx_validator 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.is_auth = function(arr_) {
            try {
                //if (this.debug) console.log('cx_validator.is_auth');
                var res = true, reg = '';
                $.each(arr_, function (idx_, item_) {
                    reg = new RegExp(item_+'$', '');
                    if (location.hostname.match(reg) != null) { res = false;return false; }
                    else if (document.domain.match(reg) != null) { res = false;return false; }
                    else if (window.location.hostname.match(reg) != null) { res = false;return false; }
                });
                if (res) {
                    alert('유효하지 않은 라이센스입니다');
                    throw '■■■ error ■■■';
                    //alertBox.show('알림', '유효하지 않은 라이센스입니다', function(){
                    //    try{
                    //        window.open('about:blank','_parent').parent.close();
                    //    } catch (e){
                    //        window.history.back();
                    //        top.document.location.href='http://dsit.in';
                    //    }
                    //});
                    //try{
                    //    window.open('about:blank','_parent').parent.close();
                    //} catch (e){
                    //    window.history.back();
                    //    top.document.location.href='http://dsit.in';
                    //}
                }
            } catch(e) {
                console.info(e);
                //throw '■■■ error: cx_validator.is_auth ■■■';
            }
        } // end.method.cx_validator -> is_auth
        this.is_auth(['dsitec.com','msos.kr','dsit.in']);

    } // end of cx_validator

        })(cxApp);

$(function() {
    'use strict';
    cxApp.init();


//    var cxRandom = new cxApp.cx_random();
//    var $$ = $('#cx_alert').cx_alert({});
//    var cxUtil = new cxApp.cx_util();
//    var cxValidator = new cxApp.cx_validator();

//    $$.alert('b', function() { console.log('good');});
//    $$.confirm('b<br /><span style="color:#f00">aaaaaa</span>', function() { console.log('YYYYY'); $(this).dialog('close')}, function() { console.log('NNN??');$(this).dialog('close')});

});
