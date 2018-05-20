

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
            , theme     : 'ui'                  // 테마
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

            if (x1_theme == undefined || !x1_theme)
                throw '■■■ error: cxApp.ready -> x1_theme is not defined ■■■';
            if ($('#wrap_body').length < 1)
                throw '■■■ error: cxApp.ready -> #wrap_body is not defined ■■■';
        //    if ($('#cx_frame').length < 1)
        //        throw '■■■ error: cxApp.ready -> #cx_frame is not defined ■■■';
            if ($('#tooltip').length < 1)
                throw '■■■ error: cxApp.ready -> #tooltip is not defined ■■■';
            if ($('#cx_popup').length < 1)
                throw '■■■ error: cxApp.ready -> #cx_popup is not defined ■■■';

            var html_p = ''
                    + ' <table class="grid" style="width: 100%;table-layout: fixed;" id="cx_popupthead">        '
                    + ' <colgroup></colgroup>                                                                   '
                    + ' <caption>                                                                               '
                    + '     <label>검색어</label><input type="text" class="w_100" id="cx_popupstxt" value="" /> '
                    + '     <button id="cx_popupbtn_search" class="btn btn_normal btn_green">조&nbsp;회</button>'
                    + ' </caption>                                                                              '
                    + ' <thead></thead>                                                                         '
                    + ' </table>                                                                                '
//                    + ' <div style="overflow-y: scroll;min-height: 90%;height: 90%;">                           '
                    + ' <div style="overflow-y: scroll;">                           '
                    + '     <table class="grid" style="width: 100%;table-layout: fixed" id="cx_popuptbody">     '
                    + '     <colgroup></colgroup>                                                               '
                    + '                                                                                         '
                    + '     <tbody></tbody>                                                                     '
                    + '     </table>                                                                            '
                    + ' </div>                                                                                  ';
            app_.cfg.theme = x1_theme;
            app_.cfg.exe = x1_exe;
            app_.$tip = $('#tooltip');
            app_.cfg.$wrap_body = $('#wrap_body');
            app_.cfg.$popup = $('#cx_popup');
            app_.cfg.$popup.append(html_p);  // 팝업 HTML 을 로드(아주 중요함)

            //app_.$tip = $('#tooltip');

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

//            app_.cfg.theme = x1_theme;
//            app_.cfg.$wrap_body = $('#wrap_body');
//            app_.cfg.$popup = $('#cx_popup');
//            app_.cfg.$iframe = $('#cx_frame');
            app_.cxUtil = new app_.cx_util();
            app_.cxValidate = new app_.cx_validate();
            app_.cxFormat = new app_.cx_format();
            app_.cxRandom = new app_.cx_random();



//            var html_p = ''
//                    + '    <table class="grid" style="width: 100%;table-layout: fixed;" id="cx_popupthead">        '
//                    + '    <colgroup></colgroup>                                                                   '
//                    + '    <caption>                                                                               '
//                    + '        <label>검색어</label><input type="text" class="w_100" id="cx_popupstxt" value="" /> '
//                    + '        <button id="cx_popupbtn_search" class="btn btn_normal btn_green">조&nbsp;회</button>'
//                    + '    </caption>                                                                              '
//                    + '    <thead></thead>                                                                         '
//                    + '    </table>                                                                                '
//                    + '    <div style="overflow-y: scroll;min-height: 90%;height: 90%;">                           '
//                    + '        <table class="grid" style="width: 100%;table-layout: fixed" id="cx_popuptbody">     '
//                    + '        <colgroup></colgroup>                                                               '
//                    + '                                                                                            '
//                    + '        <tbody></tbody>                                                                     '
//                    + '        </table>                                                                            '
//                    + '    </div>                                                                                  ';
//
//
//            app_.cfg.$popup.append(html_p);  // 팝업 HTML 을 로드(아주 중요함)
//            app_.$$ = $('#cx_alert').cx_alert({});

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
            var _res;
            $.ajax({
                url: param_.act,
                type: 'POST',
                dataType: 'json',
                contentType:'application/x-www-form-urlencoded; charset=utf-8',
                async: false,
                cache: false,
                data: param_.data,
                success: function(data_, textStatus) {
                    _res = data_;
                },
                error: function(request, status, error) {
                    console.log(request.responseText);
                    console.log(status);
                    throw '■■■ error (cxApp.submit) ■■■';
                }
            });
            if (param_.debug != undefined && param_.debug == true) {
                console.log(param_);
                console.error(_res);
                throw '■■■ debug mode ■■■';
            } else {
                if (_res == undefined) {
                    console.log(param_);
                    console.error(_res);
                    throw '■■■ 결과값 오류입니다 ■■■';
                }
                if (_res.result == false) {
                    if (_res.msg) {
                        if (param_.$caller != undefined) {
                            app_.show_tip(param_.$caller, _res.msg);
                        } else
                            alertBox.show('알림', _res.msg);
                    } else
                        alertBox.show('알림', '조회된 데이터가 없거나 처리되지 않았습니다(No message)');
                }
            }
            return _res;
        } catch(e) {
            console.info(e.message);
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
            if (len_ == undefined)
                throw '■■■ error: app.var_mode -> undefined tab length ■■■';
            if (len_ == 0) {
                mod_['m'+m_] = {
                    mDiv: null,dDiv: null,sDiv:null,
                    mSch: null,dSch: null,sSch:null,
                    mFrm: null,dFrm: null,sFrm:null,
                    mGrd: null,dGrd: null,sGrd:null,
                    mTre: null,dTre: null,sTre:null,
                    mPag: null,dPag: null,sPag:null,
                    mDivC:null,dDivC:null,sDivC:null, // config
                    mSchC:null,dSchC:null,sSchC:null,
                    mFrmC:null,dFrmC:null,sFrmC:null,
                    mGrdC:null,dGrdC:null,sGrdC:null,
                    mTreC:null,dTreC:null,sTreC:null,
                    mPagC:null,dPagC:null,sPagC:null,
                }
                $mod_['m'+m_] = {
                    mDiv: null,dDiv: null,sDiv:null,
                    mSch: null,dSch: null,sSch:null,
                    mFrm: null,dFrm: null,sFrm:null,
                    mGrd: null,dGrd: null,sGrd:null,
                    mTre: null,dTre: null,sTre:null,
                    mPag: null,dPag: null,sPag:null,
                }
            } else {
                for(var i=0; i<=len_; i++) {
                    mod_['m'+m_+i] = {
                        mDiv: null,dDiv: null,sDiv:null,
                        mSch: null,dSch: null,sSch:null,
                        mFrm: null,dFrm: null,sFrm:null,
                        mGrd: null,dGrd: null,sGrd:null,
                        mTre: null,dTre: null,sTre:null,
                        mPag: null,dPag: null,sPag:null,
                        mDivC:null,dDivC:null,sDivC:null, // config
                        mSchC:null,dSchC:null,sSchC:null,
                        mFrmC:null,dFrmC:null,sFrmC:null,
                        mGrdC:null,dGrdC:null,sGrdC:null,
                        mTreC:null,dTreC:null,sTreC:null,
                        mPagC:null,dPagC:null,sPagC:null,
                    }
                    $mod_['m'+m_+i] = {
                        mDiv: null,dDiv: null,sDiv:null,
                        mSch: null,dSch: null,sSch:null,
                        mFrm: null,dFrm: null,sFrm:null,
                        mGrd: null,dGrd: null,sGrd:null,
                        mTre: null,dTre: null,sTre:null,
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
    * @app 하나의 cfg 를 동일하게 정리
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_cfg = function (cfg_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.init_cfg');
            if (cfg_.p == undefined || cfg_.p === '')
                throw '■■■ error: cxApp.init_cfg -> unknown cfg property or value (p) ■■■';
            if (cfg_.act == undefined || cfg_.act == '')
                throw '■■■ error: cxApp.init_cfg -> unknown cfg property or value (act) ■■■';
            if (cfg_.now_tab == undefined || cfg_.now_tab === '')
                throw '■■■ error: cxApp.init_cfg -> unknown cfg property or value (now_tab) ■■■';
            if (cfg_.mytab == undefined || cfg_.mytab === '')
                throw '■■■ error: cxApp.init_cfg -> unknown cfg property or value (mytab) ■■■';
            if (cfg_.irows == undefined || cfg_.irows === '')
                throw '■■■ error: cxApp.init_cfg -> unknown cfg property or value (irows) ■■■';
            // 공통 속성
            cfg_ = app_.__init_item(cfg_, 'edit', false);
            cfg_ = app_.__init_item(cfg_, 'multi', false);

            cfg_ = app_.__init_item(cfg_, 'edit_grid', false);
            cfg_ = app_.__init_item(cfg_, 'edit_row', false);
            cfg_ = app_.__init_item(cfg_, 'addrow', false);
            cfg_ = app_.__init_item(cfg_, 'grid_type', '');

            if (cfg_.edit_row)
                cfg_.grid_type = 'edit_row';


            return cfg_;
        } catch(e) {
            console.info(e);
            throw '■■■ error: cxApp.init_cfg -> invalid cfg ■■■';
        }
    } // end func.cxApp -> init_item

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리 (form, edit grid 일때 사용)
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_item = function (item_, caller_) {
        try {
            if (app_.cfg.debug) console.log('cxApp.init_item');
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined)
                throw '■■■ error: cxApp.init_item -> unknown item property (type, id, text) ■■■';
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
            item_ = app_.__init_item(item_, 'rowstart', '');
            item_ = app_.__init_item(item_, 'rowend', '');

            // event
            item_ = app_.__init_item(item_, 'check_value', '');   // 값 검수가 필요할때 처리할 사용자 함수
            item_ = app_.__init_item(item_, 'click', '');




            // boolean 속성
            item_ = app_.__init_item(item_, 'checked', false);
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


            switch (item_.type) {   // 타입을 정리
            case 'span':
            case 'div':
            case 'td':
                item_.type = 'label';
                break;
            case 'number':
            case 'integer':
                item_.type = 'int';
                break;
            case 'double':
                item_.type = 'float';
                break;
            case 'checkbox':
                item_.type = 'check';
                break;
            case 'select':  // app_.cfg.theme == 'ui'
                item_.type = 'combo';
                break;
            }
//            if (item_.type == 'label')
//                return item_;


            // 공통 이벤트
            item_ = app_.__init_item(item_, 'click', '');

            switch (item_.type) {
            case 'int':
                item_ = app_.__init_item(item_, 'mask', '#,##0');
                item_ = app_.__init_item(item_, 'min', 0);
                item_ = app_.__init_item(item_, 'max', 0);
                break;
            case 'float':
                item_ = app_.__init_item(item_, 'min', 0);
                item_ = app_.__init_item(item_, 'max', 0);
                item_ = app_.__init_item(item_, 'dec', 1);  // 기본 소숫점 자릿수
                var mask = '#,##0.'; for(var i=0; i<item_.dec; i++) { mask += '0'; }
                item_ = app_.__init_item(item_, 'mask', mask);
                break;
            }

            // 팝업속성인뎅..
//            item_ = app_.__init_item(item_, 'w', 0);
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
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined)
                throw '■■■ error: cxApp.init_grid -> unknown item property (type, id, text) ■■■';
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


        })(cxApp);

$(function() {
    'use strict';
//    if (x1_theme == undefined || !x1_theme)
//        throw '■■■ error: cxApp.ready -> x1_theme is not defined ■■■';
//    if ($('#wrap_body').length < 1)
//        throw '■■■ error: cxApp.ready -> #wrap_body is not defined ■■■';
////    if ($('#cx_frame').length < 1)
////        throw '■■■ error: cxApp.ready -> #cx_frame is not defined ■■■';
//    if ($('#tooltip').length < 1)
//        throw '■■■ error: cxApp.ready -> #tooltip is not defined ■■■';
//    if ($('#cx_popup').length < 1)
//        throw '■■■ error: cxApp.ready -> #cx_popup is not defined ■■■';
//
//    var html_p = ''
//            + ' <table class="grid" style="width: 100%;table-layout: fixed;" id="cx_popupthead">        '
//            + ' <colgroup></colgroup>                                                                   '
//            + ' <caption>                                                                               '
//            + '     <label>검색어</label><input type="text" class="w_100" id="cx_popupstxt" value="" /> '
//            + '     <button id="cx_popupbtn_search" class="btn btn_normal btn_green">조&nbsp;회</button>'
//            + ' </caption>                                                                              '
//            + ' <thead></thead>                                                                         '
//            + ' </table>                                                                                '
//            + ' <div style="overflow-y: scroll;min-height: 90%;height: 90%;">                           '
//            + '     <table class="grid" style="width: 100%;table-layout: fixed" id="cx_popuptbody">     '
//            + '     <colgroup></colgroup>                                                               '
//            + '                                                                                         '
//            + '     <tbody></tbody>                                                                     '
//            + '     </table>                                                                            '
//            + ' </div>                                                                                  ';
//    cxApp.cfg.theme = x1_theme;
//    cxApp.$tip = $('#tooltip');
//    cxApp.cfg.$wrap_body = $('#wrap_body');
//    cxApp.cfg.$popup = $('#cx_popup');
//    cxApp.cfg.$popup.append(html_p);  // 팝업 HTML 을 로드(아주 중요함)
    cxApp.init();
});
