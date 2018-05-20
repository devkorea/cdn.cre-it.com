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
        app_.cfg = {
              a         : null
            , h         : $(window).height()    // 프로그램 높이
            , debug     : false                 // 디버그 모드
            , theme     : null                  // 테마
            , $wrap_body: null                  // 프로그램 영역
            , $popup    : null                  // 팝업 객체(복사용)
            , tip_time  : 500                   // 툴팁 생존 시간
        };


        /*----------------------------------------------
        * @app initialize
        * @returns  {void}
        ----------------------------------------------*/
        app_.init = function() {
            cxApp.cfg.theme = x1_theme;
            cxApp.cfg.$wrap_body = $('#wrap_body');
            cxApp.cfg.$popup = $('#cx_popup');
            cxApp.cfg.$iframe = $('#cx_frame');
            app_.cxUtil = new app_.cx_util();
            app_.cxValidator = new app_.cx_validator();

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


            cxApp.cfg.$popup.append(html_p);  // 팝업 HTML 을 로드(아주 중요함)
            app_.$$ = $('#cx_alert').cx_alert({});

            // table 더블클릭時 선택영역 지움
//            $('table').on('dblclick', function() {
//                document.getSelection().removeAllRanges();
//            });

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

        } // end func.cxApp -> init


    /*----------------------------------------------
    * @app form submit
    * @returns  {array}
    ----------------------------------------------*/
    app_.submit = function(param_) {
        if (app_.cfg.debug) console.log('app_.submit');
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
            }
        });
        if (param_.debug != undefined && param_.debug == true) {
            console.log(param_);
            console.error(result);
            throw '======== debug mode ========';
        } else {
            if (result == undefined) {
                console.log(param_);
                console.error(result);
                throw '======== 결과값 오류입니다 ========';
            }
            if (result.result == false) {
                if (result.msg)
                    alertBox.show('알림', result.msg);
                else
                    alertBox.show('알림', '조회된 데이터가 없거나 처리되지 않았습니다(No message)');
            }
        }
        return result;
    } // end func.cxApp -> submit

    /*----------------------------------------------
    * @app form async
    * @returns  {array}
    ----------------------------------------------*/
    app_.async = function(param_, callback_) {
        try {
            if (app_.cfg.debug) console.log('app_.async');
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
                        throw '======== debug mode ========';
                    } else {
                        if (result == undefined) {
                            console.log(param_);
                            console.error(result);
                            throw '======== 결과값 오류입니다 ========';
                        }
                        result.now_tab = param_.now_tab
                        callback_(result);
                    }
                },
                error: function(request, status, error) {
                    console.log(request);
                    console.log(status);
                    console.error(error);
                    throw '======== error (cxApp.async.submit) ========';
                }
            });
        } catch(e) {
            throw '======== error : cxApp.async ========';
        }
    } // end func.cxApp -> async

    /*----------------------------------------------
    * @app upload form upload
            반드시 form 태그에 onsubmit="return false" 사용금지
            module 함수에 alertBox 사용금지(업로드 안됨)
    * @returns  {array}
    ----------------------------------------------*/
    app_.upload = function(param_, callback_) {
        if (app_.cfg.debug) console.log('app_.upload');
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
            });
        });
        return _res;
    } // end func.cxApp -> upload


    /*----------------------------------------------
    * @app param checking
    * @returns  {bool | throw}
    ----------------------------------------------*/
    app_.chk_param = function(type_, param_) {
        if (app_.cfg.debug) console.log('app_.chk_param');
        switch(type_) {
        case 'callback':
            if (param_ == undefined || typeof param_ != 'function') {
                throw '======== error (undefined callback or callback is not function) ========';
            }
            break;

        case 'act':
            if (param_ == undefined || param_.act == undefined || typeof param_.act != 'string') {
                throw "======== error (undefined param['act'] or param['act'] is not string) ========";
            }
            break;

        case 'now_tab':
            if (param_ == undefined || param_.now_tab == undefined || typeof param_.now_tab != 'number') {
                throw "======== error (undefined param['now_tab'] or param['now_tab'] is not number) ========";
            }
            break;
        }
        return true;
    } // end func.cxApp -> chk_param


    /*----------------------------------------------
    * @app 모듈을 담을 변수를 생성 (참조로 전달됨)
    * @returns  {void}
    ----------------------------------------------*/
    app_.var_mod = function (m_, len_, mod_, $mod_) {
        if (app_.cfg.debug) console.log('app_.var_mod');
        if (len_ == 0) {
            mod_['m'+m_] = {
                msch:{},dsch:{},ssch:{},
                mfrm:{},dfrm:{},sfrm:{},
                mgrd:{},dgrd:{},sgrd:{},
                mpag:{},dpag:{},spag:{},
            }
            $mod_['m'+m_] = {
                msch:null,dsch:null,ssch:null,
                mfrm:null,dfrm:null,sfrm:null,
                mgrd:null,dgrd:null,sgrd:null,
                mpag:null,dpag:null,spag:null,
            }
        } else {
            for(var i=0; i<=len_; i++) {
                mod_['m'+m_+i] = {
                    msch:{},dsch:{},ssch:{},
                    mfrm:{},dfrm:{},sfrm:{},
                    mgrd:{},dgrd:{},sgrd:{},
                    mpag:{},dpag:{},spag:{},
                }
                $mod_['m'+m_+i] = {
                    msch:null,dsch:null,ssch:null,
                    mfrm:null,dfrm:null,sfrm:null,
                    mgrd:null,dgrd:null,sgrd:null,
                    mpag:null,dpag:null,spag:null,
                }
            }
        }
    } // end func.cxApp -> var_mod


    /*----------------------------------------------
    * @app 제로필
    * @returns  {string}
    ----------------------------------------------*/
    app_.zero_fill = function (num_, w_) {
        w_ -= num_.toString().length;
        if (w_ > 0) {
            return new Array(w_ + (/\./.test(num_) ? 2 : 1)).join('0') + num_;
        }
        return num_ + '';
    } // end func.cxApp -> zero_fill

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 생성
    * @returns  {json}
    ----------------------------------------------*/
    app_.show_tip = function ($obj_, opt_) {
        try {
            if (opt_.text == undefined || opt_.text == 0)
                throw '======== error: unknown text, cxApp.show_tip  ========';
            if (opt_.w == undefined || opt_.w == 0) opt_.w = 200;
            if (opt_.h == undefined || opt_.h == 0) opt_.h = 20;
            $obj_.tooltipsy({
                            css: {
                                'padding': '10px 5px',
                                'width': opt_.w+'px',
                                'height': opt_.h+'px',
                                'text-align': 'center',
                                'line-height': '20px',
                                'color': '#303030',
                                'background-color': '#f00',
                                'color':'#fff',
                                'border': '1px solid #f00',
                                'border-radius': '5px'
                            },
                            delay: 0,
                            content: opt_.text
                        });
        } catch(e) {
            throw '======== error: create_tooltip ========';
        }
    } // end func.cxApp -> create_tooltip

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리
    * @returns  {json}
    ----------------------------------------------*/
    app_.__init_item = function (item_, key_, default_) {
        try {
            if (item_[key_] == undefined)
                item_[key_] = default_;
            else {
                if (!item_[key_])
                    item_[key_] = default_;
            }
            // number 도 마스크를 사용중이므로 기본값을 사용안 함
            return item_;
        } catch(e) {
            throw '======== error: invalid item param('+key_+') ========';
        }
    } // end func.cxApp -> __init_item


    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리 (form, edit grid 일때 사용)
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_item = function (item_, caller_) {
        try {
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined || item_.pt_idx == undefined)
                throw '======== error.init_item: unknown item property (type, id, text, pt_idx) ========';
            // 공통 속성
            item_ = app_.__init_item(item_, 'align', '');
            item_ = app_.__init_item(item_, 'next', '');
            item_ = app_.__init_item(item_, '$next', '-.-');
            item_ = app_.__init_item(item_, 'mask', '');
            item_ = app_.__init_item(item_, 'ptype', 'form');
            item_ = app_.__init_item(item_, 'value', '');

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
            console.error(item_);
            throw '======== error (invalid item) ========';
        }
    } // end func.cxApp -> init_item

    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 정리 (데이타 그리드 일때 사용)
    * @returns  {json}
    ----------------------------------------------*/
    app_.init_grid = function (item_, caller_) {
        try {
            if (item_.type == undefined || item_.id == undefined || item_.text == undefined || item_.pt_idx == undefined)
                throw '======== error.init_grid: unknown item property (type, id, text, pt_idx) ========';
            // 공통 속성
            item_ = app_.__init_item(item_, 'align', '');
            item_ = app_.__init_item(item_, 'hidden', '');
            // 팝업속성인뎅..
            item_ = app_.__init_item(item_, 'w', 0);
            return item_;
        } catch(e) {
            throw '======== error (invalid item) ========';
        }
    } // end func.cxApp -> init_grid


    /*----------------------------------------------
    * @app 하나의 item 를 동일하게 생성
    * @returns  {json}
    ----------------------------------------------*/
    app_.create_item = function ($obj_, ptype_, pt_idx_, item_, $parent_, caller_) {
        try {
            switch (item_.type) {
            case 'label':
                return $obj_.cx_label($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
            case 'hidden':
            case 'text':
                return $obj_.cx_text($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'date':
                return $obj_.cx_date($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'number':
            case 'int':
            case 'integer':
                return $obj_.cx_int($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'float':
            case 'double':
                return $obj_.cx_float($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'radio':
                return $obj_.cx_radio($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'checkbox':
                return $obj_.cx_check($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'select':  // app_.cfg.theme == 'ui'
            case 'combo':   // app_.cfg.theme == 'ui'
//console.info(22);
                return $obj_.cx_combo($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'button':
                return $obj_.cx_button($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            case 'popup':
                return $obj_.cx_pop($.extend({ptype:ptype_, pt_idx:pt_idx_}, item_), $parent_, caller_);
//                break;
            }
        } catch(e) {
            throw '======== error: cxApp.create_item ========';
        }
    } // end func.cxApp -> create_item

    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - common form
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_comf = {
        init: function (item_, $parent_, caller_) {
            var $self = this, item = {}, $parent = $parent_;
            var act = {};
            /*----------------------------------------------
            * @cx_comf initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item_ = app_.init_item(item_, 'cx_comf.init');   // 하나의 {} 만 처리됨
                    item = item_;

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
                    if (item.focus)
                        $self.set_focus('cx_comf.init');

                } catch(e) {
                    throw '======== error: cx_comf.init ========';
                }
            } // end func.cx_comf -> init

            /*----------------------------------------------
            * @cx_comf keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('event.evt_keydown');
                    switch (evt_.keyCode) {
                    case 13:
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        if (item.ptype == 'form') {
//                            $self.val($.trim($self.val()));
                            var _data = $self.get_data();
                            if (item.required) {
                                if (!_data) {
                                    app_.show_tip($self, {text:'필수항목 입니다 ('+item.text+')'});
                                    $self.data('tooltipsy').show();
                                    setTimeout(function() {
                                        $self.data('tooltipsy').destroy();
                                    }, app_.cfg.tip_time);
                                    return;
                                }
                            }
                            if (_data) {
                                if (typeof $self.validate == 'function') {
                                    if (!$self.validate('cx_comf.evt_keydown')) {
                                        app_.show_tip($self, {text:'유효한 값이 아닙니다 ('+item.text+')'});
                                        $self.data('tooltipsy').show();
                                        setTimeout(function() {
                                            $self.data('tooltipsy').destroy();
                                        }, app_.cfg.tip_time);
                                        return;
                                    }
                                }
                            }

                            if (item.$next)
                                item.$next.set_focus('cx_comf.evt_keydown');
                        } else {
                            $parent.next_focus(evt_, item);
                        }
                        break;
                    case 38:
                    case 40:
                        if (item.ptype == 'grid') {
                            evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                            $parent.grid_keydown(evt_, item);
                        }
                        break;
                    }
                } catch(e) {
                    console.error(e);
                    throw '======== error: cx_comf.evt_keydown ========';
                }
            } // end event.cx_comf -> evt_keydown

            /*----------------------------------------------
            * @cx_comf click
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_click = function(evt_) {
                try {
                    if (item.debug) console.log('event.evt_click');
                    $(this).select();
                } catch(e) {
                    throw '======== error: cx_comf.evt_click ========';
                }
            } // end event.cx_comf -> evt_click

            /*----------------------------------------------
            * @cx_comf set_focus
            * @returns  {void)
            ----------------------------------------------*/
            this.set_focus = function(caller_) {
                try {
                    if (item.debug) console.log('event.set_focus');
                    if (item.type == 'hidden') {
                        console.error('hidden not focus..');
                        return;
                    }
                    if ($self.prop('readonly') || $self.prop('disabled')) {
                        console.error('readonly or disabled');
                        return;
                    }
                    setTimeout(function() {
                        $self.select().focus();
                    }, 0);
                } catch(e) {
                    throw '======== error: cx_comf.set_focus ========';
                }
            } // end event.cx_comf -> set_focus
            this.init();
            $self.item = item;
            $self.on('keydown', {item:$self}, this.evt_keydown);
            $self.on('click', {item:$self}, this.evt_click);

            return item;    // this 를 반환하면 clone 객체에서 item 속성이 사라짐
        } // end method.cx_comf ->  init
    }; app_.fn.cx_comf = function (method) { return __cx_comf.init.apply(this, arguments); } // end of cx_comf


    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    // Component - label
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    var __cx_label = {
        init: function (item_, $parent_, caller_) {
            this.version = '0.0.0.1';
            var $self = this, item = {}, $parent = $parent_;
            var act = {};
            /*----------------------------------------------
            * @cx_label initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_label.init ========';
                }
            } // end func.cx_label -> init

            /*----------------------------------------------
            * @cx_label set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.text(item.value);
                    else
                        $self.text($.trim(value_));
                } catch(e) {
                    throw '======== error: cx_label.set_data ========';
                }
            } // end event.cx_label -> set_data
            /*----------------------------------------------
            * @cx_label get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    $self.text($.trim($self.text()));
                    return $self.text();
                } catch(e) {
                    throw '======== error: cx_label.get_data ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_text initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {

                } catch(e) {
                    throw '======== error: cx_text.init ========';
                }
                if (item.debug == undefined) item.debug = false;
                if (item.debug) console.log('method.init');
                item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                $self.set_data();
            } // end func.cx_text -> init

            /*----------------------------------------------
            * @cx_text set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));
                } catch(e) {
                    throw '======== error: cx_text.set_data ========';
                }
            } // end event.cx_text -> set_data
            /*----------------------------------------------
            * @cx_text get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    $self.text($.trim($self.text()));
                    return $self.text();
                } catch(e) {
                    throw '======== error: cx_text.get_data ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_int initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_int.ini ========';
                }
            } // end func.cx_int -> init

            /*----------------------------------------------
            * @cx_int set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.val(item.value);
                    else
                        $self.val(value_);
                } catch(e) {
                    throw '======== error:  ========';
                }
            } // end event.cx_int -> set_data
            /*----------------------------------------------
            * @cx_int get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    if (!$self.validate())
                        return 0;
                    return parseInt($self.val(), 10);
                } catch(e) {
                    throw '======== error: cx_int.get_data ========';
                }
            } // end event.cx_int -> get_data

            /*----------------------------------------------
            * @cx_int validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('method.validate');
                    $self.val($.trim($self.val()));
                    return true;
                } catch(e) {
                    throw '======== error: cx_int.validate ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_float initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_float.init ========';
                }
            } // end func.cx_float -> init

            /*----------------------------------------------
            * @cx_float set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));
                } catch(e) {
                    throw '======== error: cx_float.set_data ========';
                }
            } // end event.cx_float -> set_data
            /*----------------------------------------------
            * @cx_float get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    if (!$self.validate())
                        return 0.0;
                    return parseFloat($self.val());
                } catch(e) {
                    throw '======== error: cx_float.get_data ========';
                }
            } // end event.cx_float -> get_data

            /*----------------------------------------------
            * @cx_float validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('method.validate');
                    $self.val($.trim($self.val()));

                    return true;
                } catch(e) {
                    throw '======== error: cx_float.validate ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_date initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item_ = app_.__init_item(item_, 'mask', '0000-00-00');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.datepicker({
                        changeMonth: true,
                        changeYear: true,
                        dateFormat: 'yy-mm-dd',
                        showButtonPanel: true,
                        yearRange: "c-99:c+99",
                    });
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_date.init ========';
                }
            } // end func.cx_date -> init

            /*----------------------------------------------
            * @cx_date set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));
                } catch(e) {
                    throw '======== error: cx_date.set_data ========';
                }
            } // end event.cx_date -> set_data
            /*----------------------------------------------
            * @cx_date get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    if (!$self.validate())
                        return '';
                    return $self.val();
                } catch(e) {
                    throw '======== error: cx_date.get_data ========';
                }
            } // end event.cx_date -> get_data

            /*----------------------------------------------
            * @cx_date validate
            * @returns  {void)
            ----------------------------------------------*/
            this.validate = function(caller_) {
                try {
                    if (item.debug) console.log('method.validate');
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
                    throw '======== error: cx_date.validate ========';
                }
            } // end event.cx_date -> validate

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
            var act = {};
            /*----------------------------------------------
            * @cx_radio initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    item = app_.__init_item(item, 'checked', false);
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_radio.init ========';
                }
            } // end func.cx_radio -> init

            /*----------------------------------------------
            * @cx_radio set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.prop('checked', item.checked);
                    else {
                        if ($self.val() == value_)  // 넘어온 값이 같으면
                            $self.prop('checked', true);
                    }
                } catch(e) {
                    throw '======== error: cx_radio.set_data ========';
                }
            } // end event.cx_radio -> set_data
            /*----------------------------------------------
            * @cx_radio get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    if (!$self.prop('checked'))
                        return false;
                    return $self.val();
                } catch(e) {
                    throw '======== error: cx_radio.get_data ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_check initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    item = app_.__init_item(item, 'checked', false);
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_check.init ========';
                }
                $self.set_data();
            } // end func.cx_check -> init

            /*----------------------------------------------
            * @cx_check set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.prop('checked', item.checked);
                    else {
                        if ($self.val() == value_)  // 넘어온 값이 같으면
                            $self.prop('checked', true);
                    }
                } catch(e) {
                    throw '======== error: cx_check.set_data ========';
                }
            } // end event.cx_check -> evt_keydown
            /*----------------------------------------------
            * @cx_check get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    if (!$self.prop('checked'))
                        return false;
                    return $self.val();
                } catch(e) {
                    throw '======== error: cx_check.get_data ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_button initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = $self.cx_comf(item_, $parent_, caller_);    // 공통 콤포넌트 호출
                    $self.on('click', {}, item.click);
                } catch(e) {
                    throw '======== error: cx_button.init ========';
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
            var act = {};
            /*----------------------------------------------
            * @cx_combo initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = app_.init_item(item_, 'cx_combo.init');
                    if (app_.cfg.theme == 'ui') {
                        item = app_.__init_item(item, 'w', '100%');
                        $self.selectmenu({width : item.w});
                        item.$ui = $('#'+item.pt_idx+''+item_.id+'-button');
                        item.$ui.on('keydown', {'item':item}, $self.evt_keydown);
                    } else {
                        $self.on('keydown', {'item':item}, $self.evt_keydown);
                    }
                    $self.set_data();
                    if (item.focus) {
                        $self.set_focus('cx_comf.init');
                    }
                } catch(e) {
                    throw '======== error: cx_combo.init ========';
                }
            } // end func.cx_combo -> init

            /*----------------------------------------------
            * @cx_combo set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined) {
                        if (item.value)
                            $self.val(item.value);
                        else
                            $self.children('option:eq(0)').prop('selected', 'selected');
                    } else
                        $self.val(value_);
                    if (app_.cfg.theme == 'ui')
                        $self.selectmenu('refresh');
                } catch(e) {
                    throw '======== error: cx_combo.set_data ========';
                }
            } // end event.cx_combo -> set_data
            /*----------------------------------------------
            * @cx_combo get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
                    return $self.val();
                } catch(e) {
                    throw '======== error: cx_combo.get_data ========';
                }
            } // end event.cx_combo -> get_data

            /*----------------------------------------------
            * @cx_combo keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('event.evt_keydown');
                    if (evt_.keyCode == 13) {
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        if (item.ptype == 'form') {
                            if (item.required) {
                                if ($self.val() == '') {
                                    if (app_.cfg.theme == 'ui') {
                                        app_.show_tip(item.$ui, {text:'필수항목 입니다 ('+item.text+')'});
                                        item.$ui.data('tooltipsy').show();
                                        setTimeout(function() {
                                            item.$ui.data('tooltipsy').destroy();
                                        }, app_.cfg.tip_time);

                                    } else {
                                        app_.show_tip(item.$ui, {text:'필수항목 입니다 ('+item.text+')'});
                                        $self.data('tooltipsy').show();
                                        setTimeout(function() {
                                            $self.data('tooltipsy').destroy();
                                        }, app_.cfg.tip_time);
                                    }
                                    return;
                                }
                            }
                            if (item.$next)
                                item.$next.set_focus('cx_combo.evt_keydown');
                        } else {
                            $parent.next_focus(evt_, item);
                        }
                    }
                } catch(e) {
                    throw '======== error: cx_combo.evt_keydown ========';
                }
            } // end event.cx_combo -> evt_keydown

            /*----------------------------------------------
            * @cx_combo set_focus
            * @returns  {void)
            ----------------------------------------------*/
            this.set_focus = function(caller_) {
                try {
                    if (item.debug) console.log('event.set_focus');
                    if ($self.prop('readonly') || $self.prop('disabled')) {
                        console.error('readonly or disabled');
                        return;
                    }
                    setTimeout(function() {
                        if (app_.cfg.theme == 'ui') {
                            item.$ui.focus();
                        } else {
                            $self.focus();
                        }
                    }, 0);
                } catch(e) {
                    throw '======== error: cx_comf.set_focus ========';
                }
            } // end event.cx_combo -> set_focus

            this.init();
            $self.item = item;
            $self.on('keydown', {item:$self}, this.evt_keydown);
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
            var act = {};
            /*----------------------------------------------
            * @cx_pop initialize
            * @returns  {void)
            ----------------------------------------------*/
            this.init = function() {
                try {
                    if (item.debug == undefined) item.debug = false;
                    if (item.debug) console.log('method.init');
                    item = app_.init_item(item_, 'cx_pop.init');

                    if (item.mask) {
                        $self.mask(item.mask, {reverse: true, placeholder:item.mask.replace(/[0|#|?|*]/g, '_')});
                    }
                    if (item.align) {
                        $self.addClass(item.align);
                    }
                    if (item.next) {
                        if (item.ptype == 'form')
                            item.$next = $('#'+item.pt_idx+''+item.id);
                        else {
                            //console.error(item.id, ' -> ', item.next, ' Grid.next 는 생성될때는 알수 없음');
                        }
                    }
                    $self.set_data();
                } catch(e) {
                    throw '======== error: cx_pop.init ========';
                }
            } // end func.cx_pop -> init

            /*----------------------------------------------
            * @cx_pop set_data
            * @returns  {void)
            ----------------------------------------------*/
            this.set_data = function(value_) {
                try {
                    if (item.debug) console.log('method.set_data');
                    if (value_ == undefined)
                        $self.val(item.value);
                    else
                        $self.val($.trim(value_));
                } catch(e) {
                    throw '======== error: cx_pop.set_data ========';
                }
            } // end event.cx_pop -> set_data
            /*----------------------------------------------
            * @cx_pop get_data
            * @returns  {string}
            ----------------------------------------------*/
            this.get_data = function(caller_) {
                try {
                    if (item.debug) console.log('method.get_data');
//                    if (!$self.validate())
//                        return false;
                    return $self.val();
                } catch(e) {
                    throw '======== error: cx_pop.get_data ========';
                }
            } // end event.cx_pop -> get_data
            /*----------------------------------------------
            * @cx_pop keydown
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_keydown = function(evt_) {
                try {
                    if (item.debug) console.log('event.evt_keydown');
                    if (evt_.keyCode == 13) {
                        if (item.next)
                            item.$next.select().focus();
                        $parent.next_focus(evt_, item.id);
                    }
                    return true;
                } catch(e) {
                    throw '======== error: cx_pop.evt_keydown ========';
                }
            } // end event.cx_pop -> evt_keydown

            /*----------------------------------------------
            * @cx_pop click
            * @returns  {void)
            ----------------------------------------------*/
            this.evt_click = function(evt_) {
                try {
                    if (item.debug) console.log('event.evt_click');
                    $(this).select();
                    return true;
                } catch(e) {
                    throw '======== error: cx_pop.evt_click ========';
                }
            } // end event.cx_pop -> evt_click

            this.init();
            $self.item = item;
            $self.on('keydown', {item:$self}, this.evt_keydown);
            $self.on('click', {item:$self}, this.evt_click);
            return this;
        } // end method.cx_pop ->  init
    }; app_.fn.cx_pop = function (method) { return __cx_pop.init.apply(this, arguments); } // end of cx_pop



    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Alert
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_alert = {
        init: function (cfg_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, act = {}, evt = {};
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
            act.init = function() {

                if ($self.html()) {
                    console.error('이미 생성됨');
                    return;
                }

                $self.append(cfg.html_a);

                $alert = $self.clone(true);
                $confirm = $self.clone(true);
                $alert.find('#cx_alerticon').attr('src', 'http://cdn.cre-it.com/dx/img/alert/'+cfg.icon.info);
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
            act.alert = function(msg_, func_) {
                if (func_ != undefined && typeof func_ == 'function')
                    $alert.on('dialogclose', func_);
                $alert.find('#cx_alertmsg').html(msg_);
                $alert.dialog('open');
            } // end func.cx_alert -> alert

            /*----------------------------------------------
            * @cx_alert confirm
            * @returns  {void)
            ----------------------------------------------*/
            act.confirm = function(msg_, funcY_, funcN_, icon_) {
                if (icon_ == undefined || icon_ == '') icon_ = 'ques';
                $confirm.find('#cx_alerticon').attr('src','http://cdn.cre-it.com/dx/img/alert/'+cfg.icon[icon_]);
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

            act.init();
            this.alert = act.alert;
            this.confirm = act.confirm;

            return this;
        } // end method.cx_alert -> init
    }; app_.fn.cx_alert = function (method) { return __cx_alert.init.apply(this, arguments); } // end of cx_alert


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Board
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_board = {
        init: function (cfg_, mod_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, act = {}, evt = {};
            var mod = {};
            var cfg = {
                  m     : ''        // p + m
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
                , timer     : 100   // 포커스 처리할 타이머
            }
            cfg = $.extend(cfg, cfg_);
            /*----------------------------------------------
            * @cx_form initialize
            * @returns  {void)
            ----------------------------------------------*/
            act.init = function() {

            } // end func.cx_board -> init

            return this;
        } // end method.cx_board -> init
    }; app_.fn.cx_board = function (method) { return __cx_board.init.apply(this, arguments); } // end of cx_board


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Form
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_form = {
        init: function (cfg_, mod_, $popup_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, act = {}, evt = {};
            var $popup = {};
            var mod = {};
            var cfg = {
                  m     : ''        // p + m
                , pt_idx : null      // p + m
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
                , timer     : 100   // 포커스 처리할 타이머
            }
            cfg = $.extend(cfg, cfg_);
            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.m = cfg.p;
            else
                cfg.m = cfg.p + '' + cfg.mytab;

            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.pt_idx = cfg.p;
            else
                cfg.pt_idx = cfg.p + '' + cfg.mytab;


            /*----------------------------------------------
            * @cx_form initialize
                mask: https://igorescobar.github.io/jQuery-Mask-Plugin/docs.html
            * @returns  {void)
            ----------------------------------------------*/
            act.init = function() {
                try {
                    if (cfg.debug == undefined) cfg.debug = false;
                    if (cfg.debug) console.log('method.init');
                    mod = $.extend(mod, mod_);
                    $popup = $popup_;
                    $.each(mod, function (idx_, item_) {
                        item_.pt_idx = cfg.pt_idx;  // 강제로 할당
                        item_.ptype = 'form';       // 강제로 할당

                        if (item_.type == 'label') {
                            item_ = app_.init_grid(item_, 'cx_form.init');   // 하나의 {} 만 처리됨
                        } else {
                            item_ = app_.init_item(item_, 'cx_form.init');   // 하나의 {} 만 처리됨
                        }
                        item_.$obj = app_.create_item($('#'+cfg.pt_idx+''+item_.id), 'form', cfg.pt_idx, item_, $self, 'cx_form.init');
                    });
                    act.set_next(); // next 객체 찾기
    //                act.reset();   // 최초 초기화

                } catch(e) {
                    throw '======== error: cx_form.init ========';
                }

//                if ($self.attr('id') == undefined)
//                    cfg.id = cfg_.popid;
//                else
//                    cfg.id = $self.attr('id');
//                $box = $self.closest('div');
//                mod = $.extend(mod, mod_);
//
//
//                if (cfg.event.popup != undefined) {
//                    cfg.$popup = $('<span id="'+cfg.m+'_'+cfg.event.popup.id+'" />').cx_popup({popup:cfg.event.popup, act:cfg.act}, cfg.event);
//                    $popup[cfg.m+'_'+cfg.event.popup.id] = cfg.$popup;
//                }

//                var _attr = '';
//                cfg.column_count = 0;

/*
                $.each(mod, function (idx_, item_) {

                    if (item_.multi && item_.multi == true) {
                        if (item_.type == 'button') {
                            item_.$obj = $('a[name="'+cfg.m+item_.id+'"]');
                        } else if (item_.type == 'div') {
                            item_.$obj = $('div[name="'+cfg.m+item_.id+'"]');
                        } else {
                            item_.$obj = $('input[name="'+cfg.m+item_.id+'[]"]');
                        }
                    } else {
                        item_.$obj = $('#'+cfg.m+item_.id);
                        if (item_.type == 'hidden' || (item_.$obj[0] !== undefined && item_.$obj[0].type == 'hidden'))
                            return true;
                    }

                    if (item_.$obj.length < 1) {
                        //console.error(item_.id + ' 현재에 없음', item_.$obj);
                        return true;
                    }

                    // 이벤트 바인딩 (click)
                    //if (item_.click) item_.$obj.on('click', item_.click);

                    if (item_.align && item_.align != '') {
                        item_.$obj.addClass(item_.align);
                    }

                    // 이벤트 바인딩 (keypress)
                    switch (item_.type) {
                        case 'button':
                                //item_.$obj.on('keypress', {m:cfg.m, item:item_}, _evt.keypress_button);
                                item_.$obj.on('click', {m:cfg.m, item:item_}, evt.button_click);
                                return true;
                            break;

                        case 'select':
                            if (app_.cfg.theme == 'ui') {
                                if (item_.$obj.attr('width') == undefined || item_.$obj.attr('width') == '0')
                                    item_.$obj.attr('width', '100%');
                                item_.$obj.selectmenu({width : item_.$obj.attr('width')});
                                item_.$ui = $('#'+cfg.m+item_.id+'-button');
                                item_.$ui.on('keydown', {m:cfg.m, item:item_}, evt.select_keydown);
                                item_.$ui.on('click', function(){ cfg.myfocus = item_; });
                                item_.$obj.selectmenu('refresh');

                            } else {
                                item_.$obj.on('keydown', {m:cfg.m, item:item_}, evt.select_keydown);
                                item_.$obj.on('click', function(){ cfg.myfocus = item_; });
                                //item_.$obj.on('change', {m:cfg.m, item:item_}, _evt.change_select);
                                //item_.$obj.on('blur', {m:cfg.m, item:item_}, _evt.blur_select);
                            }
                            break;

                        case 'popup':
                            if (item_.popup == undefined || item_.popup.event == undefined) {
                                throw '======== error ('+cfg.m+item_.id+' is not popup) ========';
                            }
                            item_.$popup = item_.$obj.cx_popup($.extend({'event':item_.popup.event}, cfg), item_);
                            $popup[item_.id] = item_.$popup; // 팝업을 닫을때 모듈에서 사용

                            if (item_.mask && item_.mask != '') {
                                item_.$obj.prop('placeholder', item_.mask);
                            } else {
                                item_.$obj.prop('placeholder', item_.text);
                            }
                            item_.$obj.on('click', function(){ cfg.myfocus = item_; item_.$obj.select().focus(); });
                            item_.$obj.on('keydown', function(evt_){
                                cfg.myfocus = item_;
                                if (evt_.keyCode == 13) {
                                    if ($.trim(evt_.currentTarget.value) == '') {
                                        evt_.stopImmediatePropagation();
                                        evt_.stopPropagation();    // 이벤트 버블 중지
                                        alertBox.show('알림', '검색어를 입력하세요', function() {
                                            evt_.currentTarget.focus();
                                        });
                                        return false;
                                    }
                                    item_.$popup.open_popup(evt_.currentTarget.value);
                                }
                            });
                            break;

                        case 'number':
                        case 'text':
                            if (item_.mask && item_.mask != '') {
                                item_.$obj.prop('placeholder', item_.mask);
                            } else {
                                item_.$obj.prop('placeholder', item_.text);
                            }

                            if (item_.next) {
                                item_.$obj.on('keypress', {m:cfg.m, item:item_}, evt.text_keypress);
                            }
                            item_.$obj.on('click', function(){ cfg.myfocus = item_; item_.$obj.select().focus(); });
                            break;

                        case 'radio':
                        case 'checkbox':
                            if (item_.checked == undefined)
                                item_.checked = false;
                            break;

                        case 'date':
                            item_.$obj.prop('placeholder', '0000-00-00');
                            item_.$obj.datepicker({
                                changeMonth: true,
                                changeYear: true,
                                dateFormat: 'yy-mm-dd',
                                showButtonPanel: true,
                                yearRange: "c-99:c+99",
                            });
                            item_.$obj.mask('0000-00-00');
                            item_.$obj.on('click', function(){ cfg.myfocus = item_; item_.$obj.select().focus(); });
                            break;
                    }
                    if (item_.mask && item_.mask != '') {
                        item_.$obj.data('mask', item_.mask);
                        var mask = item_.mask.replace(/[0|#|?|*]/g, '_');
                        item_.$obj.mask(item_.mask, {reverse: true, placeholder:mask});
                    }
                });
                act.reset();   // 최초 초기화
                //act.reg_event();  // 이벤트 등록
*/
            } // end func.cx_form -> init

            /*----------------------------------------------
            * @cx_form set_next 객체를 설정함
            ----------------------------------------------*/
            act.set_next = function() {
                try {
                    if (cfg.debug) console.log('method.set_next');
                    $.each(mod, function (idx_, item_) {
                        if (item_.next) {
                            $.each(mod, function (idx2_, item2_) {
                                if (item_.next == item2_.id) {
                                    item_.$obj.item.$next = item2_.$obj;
                                    //item_.$next = item_.$obj.item.$next;
                                }
                            });
                        }
                    });
                } catch(e) {
                    throw '======== error: cx_form.set_next  ========';
                }
            } // end func.cx_form -> set_next





            /*----------------------------------------------
            * @cx_form reset 폼
            ----------------------------------------------*/
            act.reset = function() {
                if (cfg.debug) console.log('method.reset');
                $.each(mod, function (idx_, item_) {
                    if (item_.value && item_.value != '') {
                        if (item_.type == 'label')
                            item_.$obj.text(item_.value);
                        else if (item_.type == 'select') {
                            item_.$obj.val(item_.value);
                            if (app_.cfg.theme == 'ui')
                                item_.$obj.selectmenu('refresh');
                        } else {
                            item_.$obj.val(item_.value);
                        }
                    } else {
                        if (item_.type == 'label')
                            item_.$obj.text('');
                        else if (item_.type == 'int')
                            item_.$obj.val(0);
                        //else if (item_.type == 'number')
                        //item_.$obj.val(0);
                        else if (item_.type == 'double')
                            item_.$obj.val(0.0);
                        else if (item_.type == 'float')
                            item_.$obj.val(0.0);
                        else if (item_.type == 'popup')
                            item_.$obj.val('');
                        else if (item_.type == 'text')
                            item_.$obj.val('');
                        else if (item_.type == 'radio' || item_.type == 'checkbox') {
                            item_.$obj.prop('checked', item_.checked);
                        } else if (item_.type == 'select') {
                            item_.$obj.children('option:eq(0)').prop('selected', 'selected');
                            if (app_.cfg.theme == 'ui') {
                                item_.$obj.selectmenu('refresh');
                                if (item_.disabled != undefined && item_.disabled == true) item_.$obj.selectmenu('enable');
                                if (item_.readonly != undefined && item_.readonly === true) item_.$obj.selectmenu('disable');
                            }
                        } else
                            item_.$obj.val('');
                    }
                    if (item_.disabled != undefined && item_.disabled == true) item_.$obj.prop('disabled', false);
                    if (item_.readonly != undefined && item_.readonly === true) item_.$obj.prop('readonly', true);
                    if (item_.focus && item_.focus === true) {
                        cfg.myfocus = item_;    // 현재 포커싱할 객체를 지정 (최초 생성時에도 지정해줘야 함)
                        if (cfg.mytab == cfg.now_tab) {  // 현재 active tab 에 있는 모듈이면 포커싱
                            evt.set_focus(item_, 0, '_act.reset');
                        }
                    }
                });
            } // end func.cx_form -> reset
            /*----------------------------------------------
            * @cx_form corea get data
            * @param    {json}      item_
            ----------------------------------------------*/
            act.__get_data = function(item_) {
                if (cfg.debug) console.log('method.__get_data');
                var value = '';
                switch (item_.type) {
                case 'hidden':
                    if (item_.datatype != undefined && item_.datatype) {
                        switch (item_.datatype) {
                        case 'int':
                        case 'integer':
                        case 'number':
                            value = parseInt(item_.$obj.val(), 10);
                            if (isNaN(value)) value = 0;
                            break;
                        case 'float':
                        case 'double':
                            value = parseFloat(item_.$obj.val());
                            if (isNaN(value)) value = 0.0;
                            break;
                        default:
                            value = item_.$obj.val();
                            break;
                        }
                    } else {
                        value = item_.$obj.val();
                    }
                    break;
                case 'date':
                case 'select':
                case 'text':
                case 'textarea':
                    value = item_.$obj.val();
                    break;
                case 'popup':   // 이곳 수정할 것
                    value = item_.$obj.val();
                    break;
                case 'checkbox':
                case 'radio':
                    if (item_.$obj.prop('checked') == true)
                        value = item_.$obj.val();
                    else
                        value = '';
                    break;
                case 'int':
                case 'integer':
                case 'number':
                    value = parseInt(item_.$obj.val(), 10);
                    if (isNaN(value)) value = 0;
                    break;
                case 'double':
                case 'float':
                    value = parseFloat(item_.$obj.val());
                    if (isNaN(value)) value = 0.0;
                    break;
                }
                return value;
            } // end func.cx_form -> __get_data

            /*----------------------------------------------
            * @cx_form get data
            * @param    {json}      'id', ['id', 'id'] 로 요청
            ----------------------------------------------*/
            act.get_data = function(param_) {
                try {
                    if (cfg.debug) console.log('method.get_data');
                    var _param = {};
                    if (param_ == undefined || param_ == '') {  // 전체를 반환
                        $.each(mod, function (idx_, item_) {
                            if (typeof item_.$obj.get_data == 'function') {
                                _param[item_.id] = item_.$obj.get_data('cx_form.get_data');
                                if (item_.required && !_param[item_.id]) {
                                    item_.$obj.set_focus('cx_form.get_data');
                                    setTimeout(function() {
                                        var e = jQuery.Event('keydown', {keyCode: 13});
                                        item_.$obj.trigger(e);
                                    }, 0);
                                    return false;
                                }
                            }
                        });
                    } else {
                        if (param_.constructor == String)
                            param_ = [param_];
                        if (param_.constructor == Array) {
                            $.each(mod, function (idx_, item_) {
                                $.each(param_, function (idx2_, key_) {
                                    if (key_ == item_.id) {
                                        if (typeof item_.$obj.get_data == 'function') {
                                            _param[item_.id] = item_.$obj.get_data('cx_form.get_data');
                                            if (item_.required && !_param[item_.id]) {
                                                item_.$obj.set_focus('cx_form.get_data');
                                                setTimeout(function() {
                                                    var e = jQuery.Event('keydown', {keyCode: 13});
                                                    item_.$obj.trigger(e);
                                                }, 0);
                                                return false;
                                            }
                                        }
                                    }
                                });
                            });
                        } else {
                            throw '======== error: cx_form.get_date (parameter 오류: undefined | id | [id, id]) ========';
                        }
                    }
                } catch(e) {
                    throw '======== error: cx_form.get_data ========';
                }
                return _param;
//                var param = {};
//                if (param_ != undefined && param_) {    // 지정 아이템만 반환
//                    $.each(param_, function (idx_, id_) {
//                        $.each(mod, function (idx_, item_) {
//                            if (id_ == item_.id) {
//                                param[item_.id] = act.__get_data(item_);
//                                return false;
//                            }
//                        });
//                    });
//                } else {    // 전체 반환
//                    $.each(mod, function (idx_, item_) {
//                        param[item_.id] = act.__get_data(item_);
//                    });
//                }
//
//                if (Object.keys(param).length == 0) {
//                    alertBox.show('알림', '요청을 처리할 값이 하나도 없습니다');
//                    return false;
//                }
//                return param;
            } // end func.cx_form -> get_data

            /*----------------------------------------------
            * @cx_form 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            act.reg_event = function() {
                if (cfg.debug) console.log('method.reg_event');
                var row_click = jQuery.Event('row_click', { target: this});
                $self.on('click', function(evt_) {
                    $self.trigger(row_click);
                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                    return false;
                });
            } // end func.cx_form -> reg_event

            /*----------------------------------------------
            * @cx_form set data
            * @param  {json}    반드시 1건씩 호출해야 함
            ----------------------------------------------*/
            act.__set_data = function(param_) {
                if (cfg.debug) console.log('method.__set_data');
                var _item = {};
                $.each(param_, function (idx1_, item1_) {
                    $.each(mod, function (idx_, item_) {
                        if (idx1_ == 'id' && item1_ == item_.id) {
                            _item = item_;
                            return false;
                        }
                    });
                    if (Object.keys(_item).length > 0) {
                        switch (_item.type) {
                        case 'checkbox':
                        case 'radio':
                                _item.$obj.prop('checked', param_.value);
                            break;
                        case 'select':
                            if (app_.cfg.theme == 'ui') {
                                _item.$obj.val(param_.value);
                                _item.$obj.selectmenu('refresh');
                            } else
                                _item.$obj.val(param_.value);

                            break;
                        case 'label':
                                _item.$obj.text(app_.cxUtil.replace_html('E', param_.value));
                            break;
                        default:
                                _item.$obj.val(app_.cxUtil.replace_html('E', param_.value));
                            break;
                        }

                        if (_item.disabled != undefined && _item.disabled == true) {
                            act.set_disabled(_item); // 데이터 바인딩후 disable 처리
                        }
                        _item = {}; // 2중 루프이므로 처리후 초기화
                    }
                });
            } // end func.cx_form -> __set_data

            /*----------------------------------------------
            * @cx_form set data
            * @param  {json | array??}
            ----------------------------------------------*/
            act.set_data = function(param_) {
                if (param_ == undefined || param_ == '') {
                    throw '======== 알수없는 파라메타입니다(cx_form.set_data) ========';
                } else {
                    if (param_.constructor == Array) {
                        act.__set_data(param_);
                    } else if (param_.constructor == Object) {
                        if (param_.id == undefined && param_.value == undefined) {  // 데이터 1건 {id:xxx, value:yyy} 형태일때
                            $.each(mod, function (idx_, item_) {
                                if (param_[item_.id] != undefined) {
                                    act.__set_data({'id':item_.id, value:param_[item_.id]});
                                }
                            });
                        } else {    // DB 에서 가져온 데이터 형태 {컬럼명:값}
                            $.each(mod, function (idx_, item_) {
                                //if (param_.id != undefined) {
                                if (param_.id== item_.id) {
                                    act.__set_data({'id':item_.id, value:param_.value});
                                }
                            });
                        }
                    }
                }
            } // end func.cx_form -> set_data

            /*----------------------------------------------
            * @cx_form set data
            * @param  {json}    반드시 1건씩 호출해야 함
            ----------------------------------------------*/
            act.__set_disabled = function(param_) {
                if (cfg.debug) console.log('method.__set_disabled');
                var _item = {};
                $.each(param_, function (idx1_, item1_) {
                    $.each(mod, function (idx_, item_) {
                        if (idx1_ == 'id' && item1_ == item_.id && item_.disabled != undefined && item_.disabled == true) {
                            _item = item_;
                            return false;
                        }
                    });
                    if (Object.keys(_item).length > 0) {
                        switch (_item.type) {
                        case 'select':
                            if (app_.cfg.theme == 'ui') {
                                _item.$obj.selectmenu('disable');
                                //_item.$obj.selectmenu('refresh');
                            } else
                                _item.$obj.prop('disabled', _item.disabled);

                            break;
                        default:
                            _item.$obj.prop('disabled', _item.disabled);
                            break;
                        }
                        _item = {}; // 2중 루프이므로 처리후 초기화
                    }
                });
            } // end func.cx_form -> __set_disabled

            /*----------------------------------------------
            * @cx_form set data
            * @param  {json | array??}
            ----------------------------------------------*/
            act.set_disabled = function(param_) {
                if (cfg.debug) console.log('method.set_disabled');
                if (param_ == undefined || param_ == '') {
                    throw '======== 알수없는 파라메타입니다(cx_form.set_disabled) ========';
                } else {
                    if (param_.constructor == Array) {
                        act.__set_disabled(param_);
                    } else if (param_.constructor == Object) {
                        $.each(mod, function (idx_, item_) {
                            //if (param_.id != undefined) {
                            if (param_.id == item_.id) {
                                act.__set_disabled({'id':item_.id, value:param_.value});
                            }
                        });
                    }
                }
            } // end func.cx_form -> set_disabled

            /*----------------------------------------------
            * @cx_form show button
            * @param    {json}      item_
            ----------------------------------------------*/
            act.show_button = function(id_, flag_) {
                if (cfg.debug) console.log('method.show_button');
                if (flag_ == true)
                    flag_ = 'visible';
                else
                    flag_ = 'hidden';

                $.each(mod, function (idx_, item_) {
                    if (item_.type == 'button' && item_.id == id_) {
                        item_.$obj.css('visibility', flag_);
                        return false;
                    }
                });
            } // end func.cx_form -> show_button

            /*----------------------------------------------
            * @cx_form validation
                2018-04-13: 여기 수정 (진짜 validation 되도록)
            ----------------------------------------------*/
            act.validate = function(cfgParam_) {
                if (cfg.debug) console.log('method.validate');
                var result = true;
                $.each(mod, function (idx_, item_) {
                    if (item_.need && item_.need === true) {
                        item_.$obj.val($.trim(item_.$obj.val()));
                        if (item_.$obj.val() == '') {
                            alertBox.show('알림', '필수입니다 ('+item_.text+') validate', function() {
                                evt.set_focus(item_, 0, 'cx_form.validate');
                            });
                            result = false;
                            return false;
                        }
                    }
                });
                return result;
            } // end func.cx_form -> validate

            /*----------------------------------------------
            * @cx_form     주어진 아이디에 해당하는 객체를 강제로 클릭
            * @returns  {void)
            ----------------------------------------------*/
            evt.fire_click = function(id_) {
                if (cfg.debug) console.log('event.fire_click');
                $.each(mod, function (idx_, item_) {
                    if (id_ == item_.id) {
                        evt.set_focus(item_, 0, 'event.fire_click');
                        if (item_.type == 'select') {
                            if (app_.cfg.theme == 'ui') {
                                item_.$ui.click();
                            } else {
                                item_.$obj.click();
                            }
                        } else {
                            item_.$obj.click();
                        }
                    }
                });
            } // end event.cx_form -> fire_click

            /*----------------------------------------------
            * @cx_form
            * @returns  {void)
            ----------------------------------------------*/
            evt.button_click = function(evt_) {
                if (cfg.debug) console.log('event.button_click');
                cfg.myfocus = evt_.data.item;    // 현재 포커싱할 객체를 지정
                evt_.data.item.click(evt_);
            } // end event.cx_form -> button_click
            /*----------------------------------------------
            * @cx_form (search|form) > item set focus
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_focus = function(paramItem_, timer_, caller) {
                if (cfg.debug) console.log('event.set_focus');
                //console.log(caller);
                if (timer_ == undefined)
                    timer_ = cfg.timer;

                if (typeof paramItem_ == 'string') {
                    $.each(mod, function (idx_, item_) {
                        if (paramItem_ == item_.id) {
                            if (item_.type == 'hidden' || (item_.$obj[0] !== undefined && item_.$obj[0].type == 'hidden'))
                                return false;
                            if (item_.$obj.length < 1) {
                                return false;
                            }
                            setTimeout(function() {
                                //_tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_};    // 현재의 포커스 객체를 할당
                                cfg.myfocus = item_;    // 현재 포커싱할 객체를 지정
                                if (item_.type == 'select') {
                                    if (app_.cfg.theme == 'ui') {
                                        item_.$ui.focus();
                                    } else {
                                        item_.$obj.focus();
                                    }
                                } else {
                                    item_.$obj.select().focus();
                                    //if (item_.type == 'button')    // 버튼이면 이벤트를 발생시킴(탭 클릭시 버튼일때 계속 검색등이 클릭됨)
                                        //item_.$obj.click();
                                }
                            }, timer_);
                            return false;
                        }
                    });
                } else {
                    if (paramItem_.type == 'hidden' || paramItem_.$obj.length < 1 || (paramItem_.$obj[0] !== undefined && paramItem_.$obj[0].type == 'hidden')) {
                        return false;   // 로그인 UI 와 같은 환경에서 중지되면 안되므로
                        //throw '======== undefined Item ('+paramItem_.id+') ========';
                    }
                    var t = setTimeout(function() {
                    //_tab[midx_]['focus'] = {'idx':midx_, 'm':prefix_, 'item':paramItem_};    // 현재의 포커스 객체를 할당
                        cfg.myfocus = paramItem_;    // 현재 포커싱할 객체를 지정
                        if (paramItem_.type == 'select') {
                            if (app_.cfg.theme == 'ui') {
                                paramItem_.$ui.focus();
                            } else {
                                paramItem_.$obj.focus();
                            }
                        } else {
                            paramItem_.$obj.focus();
                            //if (paramItem_.type == 'button')    // 버튼이면 이벤트를 발생시킴(탭 클릭시 버튼일때 계속 검색등이 클릭됨)
                                //paramItem_.$obj.click();
                        }
                        clearTimeout(t);
                    }, timer_);
                }
            } // end event.cx_form -> set_focus

            /*----------------------------------------------
            * @cx_form (search|form) > item set next_focus
            * @returns  {void)
            ----------------------------------------------*/
            evt.next_focus = function(paramItem_, timer_, caller) {
                if (cfg.debug) console.log('event.next_focus');

                if (typeof paramItem_ == 'string') {
                    $.each(mod, function (idx_, item_) {
                        if (paramItem_ == item_.id) {
                            if (item_.next != undefined || !item_.next)
                                return false;

                            evt.next_focus(item_.next);
                            return false;
                        }
                    });
                } else {
                    throw '======== error (next_focus.item.id is not string ========';
                }
            } // end event.cx_form -> next_focus

            /*----------------------------------------------
            * @cx_form
            * @returns  {void)
            ----------------------------------------------*/
            evt.select_keydown = function(evt_) {
                if (cfg.debug) console.log('event.select_keydown');
                cfg.myfocus = evt_.data.item;    // 현재 포커싱할 객체를 지정
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        if (evt_.data.item.$obj.val() == '') {
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') select_keydown1', function(){ evt.set_focus(evt_.data.item, 0, '_evt.select_keydown1');});
                            return false;
                        }
                    }

                    if (evt_.data.item.next != undefined && evt_.data.item.next) {
                        evt_.stopImmediatePropagation();
                        evt_.stopPropagation();    // 이벤트 버블 중지
                        evt.set_focus(evt_.data.item.next, 0, '_evt.select_keydown2');
                    }
                }
            } // end event.cx_form -> select_keydown
            /*----------------------------------------------
            * @cx_form
            * @returns  {void)
            ----------------------------------------------*/
            evt.text_keypress = function(evt_) {
                if (cfg.debug) console.log('event.text_keypress');
                cfg.myfocus = evt_.data.item;    // 현재 포커싱할 객체를 지정
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        evt_.currentTarget.value = $.trim(evt_.currentTarget.value);
                        if (evt_.currentTarget.value == '') {
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') text_keypress1', function(){ evt.set_focus(evt_.data.item, 0, '_evt.text_keypress1');});
                            return false;
                        }
                    }
                    if (evt_.data.item.next != undefined && evt_.data.item.next) {
                        evt_.stopImmediatePropagation();
                        evt_.stopPropagation();    // 이벤트 버블 중지
                        evt.set_focus(evt_.data.item.next, 0, '_evt.text_keypress2');
                    }
                }
            } // end event.cx_form -> text_keypress

            act.init();
            // 외부 interface
            this.mod = mod;
            this.cfg = cfg;

            this.fire_click = evt.fire_click
            this.get_data = act.get_data;
            this.reset = act.reset;
            this.set_data = act.set_data;
            this.set_disabled = act.set_disabled;
            this.set_focus = evt.set_focus;
            this.next_focus = evt.next_focus;
            this.validate = act.validate;
            this.show_button = act.show_button;

            return this;
        } // end method.cx_form -> init
    }; app_.fn.cx_form = function (method) { return __cx_form.init.apply(this, arguments); } // end of cx_form


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Grid
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_grid = {
        init: function (cfg_, mod_, $popup_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, act = {}, evt = {};
            var $popup = {};
            var $box = {};
            var $tr = {};
            var $edit = {};
            var rowdata = {};          // Grid row 를 그릴때 현재 Row 데이터를 할당해 둠
            var mod = {};
            var cfg = {
                  id    : null
                , m     : null      // p + m
                , pt_idx : null      // p + m
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
                , column_count : -1 // 현재 Grid 컬럼 수
                , row_count : -1    // 데이터를 읽어온 Row 수
                , row_index : -1    // 현재 클릭한 row index
                , keyword   : '❦❦'  // 데이터를 바인딩할 위치
                , keyword2  : '❦•❦' // 데이터를 바인딩할 위치
                , keyword3  : '❦❦' // 데이터를 바인딩할 위치
                , timer     : 100   // 포커스 처리할 타이머
                , clicks    : 0     // click, dblclick 을 구분할 구분자
                , event     : {}    // 사용자 이벤트 함수
                , edit      : false // 에디팅 여부
                , $ttr : {}         // editing template (TR)
                , $tobj  : {}       // editing template component (...)
                , $eobj  : {}       // binding component (...)
                , rowstart  : ''    // edit 할때 포커스 처리 및 row 추가
                , rowend  : ''      // edit 할때 포커스 처리 및 row 추가
            }
            cfg = $.extend(cfg, cfg_);
            cfg.m = cfg.p + '' + cfg.mytab;
            $popup = $popup_;
            if (cfg.mytab == -1) // 탭이 없으면 -1
                cfg.pt_idx = cfg.p;
            else
                cfg.pt_idx = cfg.p + '' + cfg.mytab;

            /*----------------------------------------------
            * @cx_grid initialize
            * @returns  {void)
            ----------------------------------------------*/
            act.init = function() {
                if (cfg.debug == undefined) cfg.debug = false;
                if (cfg.debug) console.log('method.init');
                if ($self.attr('id') == undefined)
                    cfg.id = cfg_.popid;
                else
                    cfg.id = $self.attr('id');
                $box = $self.closest('div');
                mod = $.extend(mod, mod_);


                if (cfg.event.popup != undefined) {
                    cfg.$popup = $('<span id="'+cfg.m+'_'+cfg.event.popup.id+'" />').cx_popup({popup:cfg.event.popup, act:cfg.act}, cfg.event);
                    $popup[cfg.m+'_'+cfg.event.popup.id] = cfg.$popup;
                }

                var _attr = '';
                cfg.column_count = 0;
                $.each(mod, function (idx_, item_) {
                    item_.pt_idx = cfg.pt_idx;  // 강제로 할당
                    item_.ptype = 'grid';  // 강제로 할당
                    cfg.column_count++;
                    if (item_.rowstart != undefined && item_.rowstart)
                        cfg.rowstart = item_.id;
                    if (item_.rowend != undefined && item_.rowend)
                        cfg.rowend = item_.id;

                    if (item_.type == 'label') {
                        _attr = '';
                        item_ = app_.init_grid(item_, 'cx_grid.init');   // 하나의 {} 만 처리됨
                        if (item_.align) _attr += ' class="'+item_.align+'"';
                        item_.template = '<td'+_attr+'>'+cfg.keyword+'</td>';

                    } else {
                        item_ = app_.init_item(item_, 'cx_grid.init');   // 하나의 {} 만 처리됨
                        mod[idx_] = item_;
//                        return true;    // edit 일때는 더 이상 진행할 게 없음
                    }
                });

                if (cfg.edit == true) { // 모든 아이템을 정리한 후 처리해야 함
                    $.each($self.children('tr'), function (idx_, item_) {
                        if (item_.className == 'template') {
                            cfg.$ttr = $(item_).removeClass('template').clone(true);        // template class 제거하면서 template row 용으로 복사
                            $.each(mod, function (idx_, item_) {
                                // 각기의 아이템들도 template item 용으로 복사
                                cfg.$tobj[item_.id] = {};
                                cfg.$tobj[item_.id].$obj = app_.create_item($(cfg.$ttr[0]).find('input[name="'+cfg.m+item_.id+'"]'), 'grid', cfg.pt_idx, item_, $self, 'cx_grid.init');
                            });
                            return false;
                        }
                    });
                }
                act.clear(true);    // row 초기화


                    // data grid 일때 버튼이 있다면??? (2018-04-24)
//                        if (item_.type == 'button') {
//                            // cfg.keyword = tab_index, cfg.keyword+cfg.keyword = value 할당
//                            _edit = '<button name="'+_rowid+'" class="btn btn_normal btn_red" tabindex="'+cfg.keyword+'">'+item_.text+'</button>';
//                        }


                    //if (cfg.edit == false && item_.edit && item_.edit == true)
                    //    cfg.edit = true;
                    //if (item_.hidden && item_.hidden == true)
                    //    return true;
                    //cfg.column_count++;
                    //_rowid = cfg.m+'row_'+item_.id;
                    //_attr = '';
                    //if (item_.link && item_.link)
                    //    _edit = '<a href="'+item_.link+'" class="link">'+cfg.keyword+'</a>';
                    //else
                    //    _edit = cfg.keyword;
                    //
                    //if (item_.align) _attr += ' class="'+item_.align+'"';
                    //if (item_.edit && item_.edit == true) {
                    //    switch (item_.type) {
                    //        case 'hidden':
                    //            _edit = '<input type="hidden" class="" name="'+_rowid+'" value="'+cfg.keyword+'" placeholder="'+item_.text+'" />';
                    //            break;
                    //        case 'date':
                    //            _edit = '<input type="text" class="calendar" name="'+_rowid+'" value="'+cfg.keyword+'" placeholder="'+item_.text+'" />';
                    //            break;
                    //        case 'number':
                    //            _edit = '<input type="number" class="calendar" name="'+_rowid+'" value="'+cfg.keyword+'" placeholder="'+item_.text+'" />';
                    //            break;
                    //        case 'select':
                    //
                    //            break;
                    //        case 'popup':
                    //
                    //            break;
                    //        case 'text':
                    //            _edit = '<input type="text" class="calendar" name="'+_rowid+'" value="'+cfg.keyword+'" placeholder="'+item_.text+'" />';
                    //            break;
                    //        case 'textarea':
                    //            _edit = '<textarea class="" name="'+_rowid+'">'+cfg.keyword+'</textarea>';
                    //        case 'button':
                    //            _edit = '<button name="'+_rowid+'" class="btn btn_normal btn_red" tabindex="'+cfg.keyword+'">'+item_.text+'</button>';
                    //    }
                    //} else {
                    //    if (item_.type == 'button') {
                    //        // cfg.keyword = tab_index, cfg.keyword+cfg.keyword = value 할당
                    //        _edit = '<button name="'+_rowid+'" class="btn btn_normal btn_red" tabindex="'+cfg.keyword+'">'+item_.text+'</button>';
                    //    }
                    //
                    //}
                    //item_.template = '<td'+_attr+'>'+_edit+'</td>';
//                });
//
//                if (cfg.edit == true) { // 모든 아이템을 정리한 후 처리해야 함
//                    $.each($self.children('tr'), function (idx_, item_) {
//                        if (item_.className == 'template') {
//                            cfg.$ttr = $(item_).removeClass('template').clone(true);        // template class 제거하면서 template row 용으로 복사
//                            $.each(mod, function (idx_, item_) {
//                                // 각기의 아이템들도 template item 용으로 복사
//                                cfg.$tobj[item_.id] = {};
//                                cfg.$tobj[item_.id].$obj = app_.create_item($(cfg.$ttr[0]).find('input[name="'+cfg.m+item_.id+'"]'), 'grid', cfg.pt_idx, item_, $self, 'cx_grid.init');
//                            });
//                            return false;
//                        }
//                    });
//                }
//                act.clear(true);    // row 초기화
            } // end func.cx_grid -> init

            /*----------------------------------------------
            * @cx_grid clear
            ----------------------------------------------*/
            act.clear = function(add_) {
                try {
                    if (cfg.debug) console.log('method.loading');
                    cfg.myfocus = null;
                    $tr = [], this.$tr = [], cfg.$eobj = [],    // 전역 변수 초기화
                    cfg.row_index = -1, cfg.row_count = 0;  // 전역 변수 초기화(현재 선택된 rowindex 와 rowcount 초기화)
                    $self.children().remove();
                    if (cfg.edit == false) {
                        $self.append('<tr class="hover_clear"><td class="center" colspan="'+cfg.column_count+'" style="">No Data..</td></tr>');
                        setTimeout(function() { // 빈 Row 높이 설정
                            $self.children('tr.hover_clear').css('height', ($(window).height() - $self.offset().top - 80) + 'px');
                            //console.error($self.offset().top, $(window).height() - $self.offset().top);
                        }, 0);
                    } else {    // 기본 row 하나를 추가해 줌
                        if (add_ == true) {
                            act.add_row(0, null);
                            $self.append($tr);
                            this.$tr = $tr;     // 팝업에서 사용됨
                            evt.set_focus(cfg.$eobj[cfg.row_count-1][cfg.rowstart]);
                        }
                    }
                } catch(e) {
                    throw '======== error: cx_grid.clear ========';
                }
            } // end func.cx_grid -> loading  height: 50vh;

            /*----------------------------------------------
            * @cx_grid cx_grid.loading
            ----------------------------------------------*/
            act.loading = function() {
                if (cfg.debug) console.log('method.loading');
                rowdata = {};   // 현재 row data 를 초기화
                $self.children().remove();
                $self.append('<tr class="hover_clear"><td class="center" colspan="'+cfg.column_count+'" style="height: 50vh"><img src="//cdn.cre-it.com/dx/img/loading/ajax-loader.gif" /></td></tr>');
            } // end func.cx_grid -> loading

            /*----------------------------------------------
            * @cx_grid set_focus
            ----------------------------------------------*/
            evt.set_focus = function($eobj_) {
                try {
                    if (cfg.debug) console.log('event.set_focus');
                    $eobj_.select().focus();
                } catch(e) {
                    throw '======== error: cx_grid.set_focus  ========';
                }
            } // end event.cx_grid -> set_focus

            /*----------------------------------------------
            * @cx_grid clear
            ----------------------------------------------*/
            evt.next_focus = function(evt_, obj_) {
                try {
                    if (cfg.debug) console.log('event.next_focus');
                    var _break = true;
                    $.each(mod, function (idx_, item_) {
                        if (obj_.id == item_.id) {
                            var _rowindex = $(evt_.currentTarget).data('rowindex');
                            if (_rowindex + 1 < cfg.row_count) {            // 중간행
                                if (cfg.rowend == item_.id) {  // 마지막 컬럼
                                    if (item_.next)
                                        evt.set_focus(cfg.$eobj[_rowindex+1][cfg.rowstart]);    // 다음행의 첫행으로 이동
                                } else {
                                    if (item_.next)
                                        evt.set_focus(cfg.$eobj[_rowindex][item_.next]);
                                }
                            } else if (_rowindex + 1 == cfg.row_count) {    // 마지막 행
                                if (cfg.rowend == item_.id) {  // 마지막 컬럼
                                    act.add_row(_rowindex+1, null);     // 행 추가
                                    $self.append($tr);
                                    this.$tr = $tr;     // 팝업에서 사용됨
                                    if (item_.next)
                                        evt.set_focus(cfg.$eobj[_rowindex+1][item_.next]);
                                } else {
                                    if (item_.next)
                                        evt.set_focus(cfg.$eobj[_rowindex][item_.next]);
                                }
                            }
                            return false;
                        }
                    });
                } catch(e) {
                    throw '======== error: cx_grid.next_focus  ========';
                }
            } // end event.cx_grid -> next_focus

            /*----------------------------------------------
            * @cx_grid 방향키 (좌우는 지원안함 - 내용 텍스트사이를 이동해야 하므로)
            ----------------------------------------------*/
            evt.grid_keydown = function(evt_, obj_) {
                try {
                    if (cfg.debug) console.log('event.grid_keydown');
                    switch(evt_.keyCode) {
                    case 38:    // ▲
                        var _rowindex = $(evt_.currentTarget).data('rowindex');
                            if (_rowindex > 0) {
                                --_rowindex;
                                evt.set_focus(cfg.$eobj[_rowindex][obj_.id]);
                            }
                        break;
                    case 40:    // ▼
                        var _rowindex = $(evt_.currentTarget).data('rowindex');
                            if (_rowindex > -1 && _rowindex + 1 < cfg.row_count) {
                                ++_rowindex;
                                evt.set_focus(cfg.$eobj[_rowindex][obj_.id]);
                            }
                        break;
                    }

                } catch(e) {
                    throw '======== error: cx_grid.grid_keydown  ========';
                }
            } // end event.cx_grid -> grid_keydown

            /*----------------------------------------------
            * @cx_grid draw row
            ----------------------------------------------*/
            act.draw_row = function(data_) {
                if (cfg.debug) console.log('method.draw_row');
                var btn_evt = {};

                setTimeout(function() {
                    cfg.myfocus = null;
                    $tr = [], this.$tr = [],    // 전역 변수 초기화
                    cfg.row_index = -1, cfg.row_count = 0;  // 전역 변수 초기화

                    var html = '',  tmp = '', key = '';
                    $.each(data_, function (idx1_, row_) {
                        key = '';
                        tmp = '';
                        ++cfg.row_count;
                        $.each(mod, function (idx2_, item_) {
                            if (item_.hidden && item_.hidden == true)
                                return true;

                            //row_[item_.id] = $global['phpjs'].html_entity_decode(row_[item_.id]);
                            if (item_.key && item_.key === true) {
                                key += ' data-'+item_.id+'="'+row_[item_.id]+'"';
                            }

                            if (item_.type == 'seq') {  // sequency calc
                                tmp += item_.template.replace(/❦❦/, row_['iseq']);
                            } else if (item_.type == 'button') {    // 버튼일때는 이벤트를 할당함 (html 을 만들때 해야 함)
                                tmp += item_.template.replace(/❦❦/, idx1_);
                                //tmp += item_.template.replace(/❦❦/, key);

                                btn_evt[item_.id] = item_.click; // 아래는 클로저 발생
                                //btn_evt[item_.id] = {'item':item_, 'click':item_.click, 'tabindex':function aaa (idx1_) { return function () { return idx1_; } }};
                                //btn_evt[item_.id] = {'item':item_, 'click':item_.click, 'tabindex':idx1_ };
                            } else {
                                tmp += item_.template.replace(/❦❦/, row_[item_.id]);
                            }
                        });

                        if (tmp)
                            html += '<tr'+key+' tabindex="'+idx1_+'">'+tmp+'</tr>';
                    });
                    if (!html) {
                        act.clear();
                        return;
                    }

                    rowdata = data_;    // 현재 row data 를 할당해 둠
                    $self.html(html);
                    evt.bind_event();   // 이곳에서 $tr 이 할당됨에 유의
                    this.$tr = $tr;     // 팝업에서 사용됨

                    if (Object.keys(btn_evt).length > 0) {      // 버튼이라면 이벤트를 할당함
                        var _rowid = cfg.m+'row_';
                        $.each(btn_evt, function (key_, func_) {
                            $self.children().find('button[name="'+_rowid+key_+'"]').on('click', func_);
                        });
                    }

                    setTimeout(function() { // 잠시간의 타이머로 확실하게 포커싱 처리
                        $($tr[0]).select().focus()
                        $tr[0].click();
                        cfg.clicks = 0;     // 클릭수 초기화
                        act.row_merge();    // row merge
                    }, 0);
                }, 500);
            } // end func.cx_grid -> draw_row




            /*----------------------------------------------
            * @cx_grid draw row add (edit grid)
            ----------------------------------------------*/
            act.add_row = function(idx1_, data_) {
                try {
                    if (cfg.debug) console.log('method.add_row');
                    var _tr = null;
                    cfg.$eobj[idx1_] = [];
                    _tr = cfg.$ttr.clone(true);     // 치환할 row 를 먼저 복사
                    $.each(cfg.$tobj, function (key_, item_) {
                        cfg.$eobj[idx1_][key_] = cfg.$tobj[key_].$obj.clone(true);  // 각기의 객체 복사
                        if (data_ == undefined || data_ == null || data_ == '') {
                            cfg.$eobj[idx1_][key_].val(item_.$obj.item.value).data('rowindex', idx1_);
                        } else
                            cfg.$eobj[idx1_][key_].val(data_[key_]).data('rowindex', idx1_);
                        _tr.find('input[name="'+cfg.pt_idx+key_+'"]').replaceWith(cfg.$eobj[idx1_][key_]);  // 치환
                    });
                    _tr.attr('tabindex', idx1_);    // row 에도 tabindex 적용
                    $tr.push(_tr);                  // tr 전역에 저장
                    cfg.row_count++;
                } catch(e) {
                    throw '======== error: cx_grid.add_row ========';
                }
            } // end func.cx_grid -> add_row


            /*----------------------------------------------
            * @cx_grid draw row (edit grid)
            ----------------------------------------------*/
            act.draw_edit = function(data_) {
                try {
                    if (cfg.debug) console.log('method.draw_row');
                    cfg.myfocus = null;
                    $tr = [], this.$tr = [], cfg.$eobj = [],    // 전역 변수 초기화
                    cfg.row_index = -1, cfg.row_count = 0;  // 전역 변수 초기화(현재 선택된 rowindex 와 rowcount 초기화)
                    act.clear(false);

                    var _tr = '';
                    rowdata = data_;    // 현재 row data 를 할당해 둠
                    $.each(data_, function (idx1_, row_) {
                        act.add_row(idx1_, row_);
                        if (idx1_+1 == data_.length) {  // 마지막에 행추가
                            act.add_row(idx1_+1, null);
                        }
                    });
                    $self.append($tr);
                    this.$tr = $tr;     // 팝업에서 사용됨
                    evt.set_focus(cfg.$eobj[cfg.row_count-1][cfg.rowstart]);
                } catch(e) {
                    throw '======== error:  ========';
                }
            } // end func.cx_grid -> draw_row





            /*----------------------------------------------
            * @cx_grid row event bind
            ----------------------------------------------*/
            evt.bind_event = function() {
                if (cfg.debug) console.log('event.bind_event');
                cfg.clicks = 0; // 클릭수 초기화
                if (Object.keys($tr).length == 0) {
                    $tr = $self.children('tr');
                }
                $tr.on('keydown', function(evt_) {
                    // 38▲ 40▼ 37◀ 39▶
                    switch(evt_.keyCode) {
                    case 13:
                        switch (evt_.currentTarget.nodeName.toLowerCase()) {
                        case 'tr':
                            cfg.myfocus = $(evt_.currentTarget);
                            if (typeof cfg.event.row_enter == 'function') {
                                var _param = act.get_key_data(evt_);
                                _param = cfg.event.row_enter(evt_, _param);
                                // 호출 이벤트에서 반환받은값이 _param.popup_open = true 일때만 처리함
                                if (cfg.event.popup != undefined && _param.popup_open != undefined && _param.popup_open == true) {
                                    cfg.$popup.open_grid(_param);
                                }
                                return true;
                            }

                            if (typeof cfg.event.row_enter == 'function') {
                                //evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                                cfg.event.row_enter(evt_, act.get_key_data(evt_));
                                //cfg.event.row_enter(cfg.myfocus, act.get_key_data(evt_));
                                return true;
                            }
                            break;
                        }
                        break;
                    case 38:    // ▲
                    case 40:    // ▼
                        evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                        $.each($tr, function (idx_, row_) {
                            if ($(row_).hasClass('cx_active') === true) {
                                if (evt_.keyCode == 38) {       // 첫번째 행인지 검사
                                    if (idx_ == 0) {
                                        return false;
                                    } else {
                                        $($tr[idx_-1]).select().focus();
                                        cfg.clicks = 0;     // 강제 클릭이벤트를 발생시키므로 착각하지 않도록 초기화함
                                        $tr[idx_-1].click();
                                        cfg.clicks = 0;     // 강제 클릭이벤트를 발생시키므로 착각하지 않도록 초기화함
                                        cfg.myfocus = $($tr[idx_-1]);
                                        cfg.row_index = idx_-1;
                                        //$box.scrollTop(cfg.myfocus[0].offsetTop);
                                        return false;
                                    }
                                } else if (evt_.keyCode == 40) {    // 마지막 행인지 검사
                                    if ($tr.length - 1 == idx_) {
                                        return false;
                                    } else {
                                        //evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                                        $($tr[idx_+1]).select().focus();
                                        cfg.clicks = 0;     // 강제 클릭이벤트를 발생시키므로 착각하지 않도록 초기화함
                                        $tr[idx_+1].click();
                                        cfg.clicks = 0;     // 강제 클릭이벤트를 발생시키므로 착각하지 않도록 초기화함
                                        cfg.myfocus = $($tr[idx_+1]);
                                        cfg.row_index = idx_+1;
                                        //$self.closest('div').scroll( function(evt_) { evt_.stopImmediatePropagation(); });
                                        return false;
                                    }
                                }
                            }
                        });
                        break;
                    }
                });

                $box.scroll( function(evt_) {   // 방향키 스크롤 처리
                    if (cfg.myfocus == null)
                        return true;
                    else
                        $box.scrollTop(cfg.myfocus[0].offsetTop);
                    //var _$box = $(this);
                    //console.info(elem[0].scrollHeight, elem.scrollTop(), parseInt(elem.outerHeight(), 10), cfg.myfocus[0].offsetTop);
                    /**
                    scrollHeight    : 1401
                    outerHeight     : 259
                    **/
                });

                var timer = null;
                $tr.on('click', function(evt_) {
                    //document.getSelection().removeAllRanges();
                    cfg.row_index = evt_.currentTarget.tabIndex;
                    cfg.clicks++;  //count clicks
                    if(cfg.clicks === 1) {  // 클릭됨(오직 row_click 만 호출함)
                        $tr.removeClass('cx_active');
                        $(evt_.currentTarget).addClass('cx_active');
                        if (typeof cfg.event.row_click != 'function') {
                            timer = setTimeout(function() {
                                cfg.clicks = 0; // 타이머 안에서 초기화
                            }, 250);
                            return;
                       }
                        timer = setTimeout(function() {
                            cfg.clicks = 0; // 타이머 안에서 초기화
                            evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                            cfg.event.row_click(evt_, act.get_key_data(evt_))
                            //cfg.event.row_click(cfg.myfocus, act.get_key_data(evt_))
                        }, 250);
                    } else {        // 더블클릭됨
                        $tr.removeClass('cx_active');
                        $(evt_.currentTarget).addClass('cx_active');
                        clearTimeout(timer);
                        cfg.clicks = 0;
                        timer = null;

                        if (cfg.edit == true) {
                            evt.show_edit(evt_);
                        } else {
                            if (typeof cfg.event.row_dblclick == 'function') {
                                evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지

                                var _param = act.get_key_data(evt_);
                                _param = cfg.event.row_dblclick(evt_, _param);
                                // 호출 이벤트에서 반환받은값이 _param.popup_open = true 일때만 처리함
                                if (cfg.event.popup != undefined && _param.popup_open != undefined && _param.popup_open == true) {
                                    cfg.$popup.open_grid(_param);
                                }
                                return false;
                            }
                        }
                    }
                })
                .on('dblclick', function(evt_){
                    cfg.clicks = 0; // 더블클릭 안에서 초기화
                    evt_.preventDefault();
                });
            } // end event.cx_grid -> bind_event

            /*----------------------------------------------
            * @cx_grid row merge
            ----------------------------------------------*/
            act.row_merge = function(evt_) {
                if (cfg.debug) console.log('method.row_merge');
                $.each(mod, function (idx_, item_) {
                    if (item_.merge && item_.merge == true)
                        $self.rowspan(0);
                });
            } // end func.cx_grid -> row_merge





            /*----------------------------------------------
            * @cx_grid get key row data
            ----------------------------------------------*/
            act.get_key_data = function(evt_) {
                if (cfg.debug) console.log('method.get_key_data');
                return rowdata[evt_.currentTarget.tabIndex];
            } // end func.cx_grid -> get_key_data

            /*----------------------------------------------
            * @cx_grid get row (주어진 인덱스에 해당하는 row 정보를 반환)
            * @param    {integer}
            * @return   {json}
            ----------------------------------------------*/
            act.__get_row = function(idx_) {
                if (cfg.debug) console.log('method.__get_row');
                if (Object.keys(rowdata).length == 0) {
                    return false;
                }
                if ($tr.length == 0) {
                    return false;
                }
                return {'rowindex':idx_, data:rowdata[idx_], $row:$($tr[idx_])};
            } // end func.cx_grid -> __get_row

            /*----------------------------------------------
            * @cx_grid get row (주어진 값에 해당하는 row 가 존재하는지 여부)
            * @param    {json}
            * @return   {boolean | json}
            ----------------------------------------------*/
            act.get_has_row = function(param_) {
                if (cfg.debug) console.log('method.get_has_row');
                if (Object.keys(rowdata).length == 0) {
                    return false;
                }
                var _param = false;
                var _chk = 0, _len = Object.keys(param_).length;
                $.each(rowdata, function (idx_, row_) { // 데이터 row 1개씩 돌면서

                    _chk = 0;
                    $.each(param_, function (key_, data_) { // 넘어온 param 전체를 비교
                        if (row_[key_] == data_) {
                            ++_chk;
                        }
                    });
                    if (_len == _chk)  {    // 데이터 row 비교가 성공적으로 완료되었다면
                        _param = act.__get_row(idx_);
                        return false;
                    }
                });
                return _param;
            } // end func.cx_grid -> get_has_row

            /*----------------------------------------------
            * @cx_grid get selected row (현재 선택된 row 정보를 반환)
            * @return   {boolean | json}
            ----------------------------------------------*/
            act.get_selected_row = function() {
                if (cfg.debug) console.log('method.get_selected_row');
                var _param = {'rowindex':-1, data:null, $row:null};
                $.each($tr, function (idx_, item_) {
                    if ($(item_).hasClass('cx_active') == true) {
                        _param = act.__get_row(idx_);
                        return false;
                    }
                });
                if (_param.rowindex < 0)
                    return false;
                else
                    return _param;
            } // end func.cx_grid -> get_selected_row

            /*----------------------------------------------
            * @cx_grid 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            act.reg_event = function() {
                if (cfg.debug) console.log('method.reg_event');
                var row_click = jQuery.Event('row_click', { target: this});
                $self.on('click', function(evt_) {
                    $self.trigger(row_click);
                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                    return false;
                });
            } // end func.cx_grid -> reg_event

            /*----------------------------------------------
            * @cx_grid 현재의 row_count 를 반환
            * @returns  {void)
            ----------------------------------------------*/
            act.get_row_count = function() {
                if (cfg.debug) console.log('method.get_row_count');
                return cfg.row_count;
            } // end func.cx_grid -> get_row_count


            /*----------------------------------------------
            * @cx_grid show button
            * @param    {json}      item_
            ----------------------------------------------*/
            act.show_button = function(id_) {
                if (cfg.debug) console.log('method.show_button');
                $.each(mod, function (idx_, item_) {
                    if (item_.type == 'button' && item_.id == id_) {
                        item_.$obj.css('visibility', 'visible');
                        return false;
                    }
                });
            } // end func.cx_grid -> show_button

            /*----------------------------------------------
            * @cx_grid row edit
            ----------------------------------------------*/
            evt.show_edit = function(evt_) {
                if (cfg.debug) console.log('event.show_edit');
                $edit = $(evt_.currentTarget).clone(true);

                //console.error(cfg.row_index, $edit);
            } // end func.cx_grid -> show_edit




            act.init();

            // 외부 interface
            this.mod = mod;
            this.cfg = cfg;
            this.$tr = $tr; // 팝업에서 사용됨
            this.clear = act.clear;
            this.loading = act.loading;
            this.draw = act.draw_row;
            this.draw_edit = act.draw_edit;
            this.get_has_row = act.get_has_row;
            this.get_data = act.get_key_data;
            this.get_row_count = act.get_row_count;
            this.get_selected_row = act.get_selected_row;
            this.show_button = act.show_button;
            this.next_focus = evt.next_focus;
            this.grid_keydown = evt.grid_keydown;

            return this;
        } // end method.cx_grid ->  init
    }; app_.fn.cx_grid = function (method) { return __cx_grid.init.apply(this, arguments); } // end of cx_grid


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Pager
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_pager = {
        init: function (cfg_, mod_) {
            this.version = '0.0.0.1';
            this.mod = {};
            var $self = this, act = {}, evt = {};
            var cfg = {
                  m     : null      // p + m
                , myfocus   : null  // 나의 현재 포커스 객체(item_)
                , mytab     : -1    // 나의 탭 인덱스
                , now_tab   : -1    // 현재 active 된 탭 인덱스
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
            cfg.m = cfg.p + '' + cfg.mytab;
            cfg.id = $self.attr('id');

            /*----------------------------------------------
            * @cx_pager initialize
            ----------------------------------------------*/
            act.init = function() {
                if (cfg.debug == undefined) cfg.debug = false;
                if (cfg.debug) console.log('method.init');
                mod = $.extend(mod, mod_);
            } // end func.cx_pager -> init

            /*----------------------------------------------
            * @cx_pager 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            act.reg_event = function() {
                var row_click = jQuery.Event('row_click', { target: this});
                $self.on('click', function(evt_) {
                    $self.trigger(row_click);
                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                    return false;
                });
            } // end func.cx_pager -> reg_event

            /*----------------------------------------------
            * @cx_pager 옵션값 설정
            ----------------------------------------------*/
            act.set_page = function (param_) {
                if (cfg.debug) console.log('method.set_page');
                param_.value = parseInt(param_.value, 10);
                mod[param_.id] = param_.value;
            } // end func.cx_pager -> set_page

            /*----------------------------------------------
            * @cx_pager 옵션값 반환
            ----------------------------------------------*/
            act.get_page = function (param_) {
                if (cfg.debug) console.log('method.get_page');
                return mod[param_];
            } // end func.cx_pager -> get_page

            /*----------------------------------------------
            * @cx_pager 페이지 그리기
            ----------------------------------------------*/
            act.draw_page = function(param_) {
                if (cfg.debug) console.log('method.draw_page');
                if (param_ === undefined)
                    return;
                param_ = parseInt(param_, 10);
                act.set_page({id:'total_rows', value:param_});
                act.calc_page();        // 전체 페이지를 계산

                var html_ = '', i = 0;
                if (mod.page > mod.row_width) {
                    html_ += '<a class="pagebox" name="'+mod.id+'page_link" href="#" cx-page="1"><span style="font-size:11px;letter-spacing:-1px">◀◀</span></a>&nbsp;';
                }
                if (mod.page_prev > 0) {
                    html_ += '<a class="pagebox" name="'+mod.id+'page_link" href="#" cx-page="'+ mod.page_prev +'"><span style="font-size:11px">◀</span></a>&nbsp;';
                }

                for (i=mod.page_start; i<=mod.page_end; i++) {
                    if (i == mod.page) {
                //html_ += '<a class="pagebox selected" href="#">'+ i +'</a>&nbsp;';
                        html_ += '<a class="pagebox selected" name="'+mod.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    } else {
                        html_ += '<a class="pagebox" name="'+mod.id+'page_link" href="#" cx-page="'+ i +'">'+ i +'</a>&nbsp;';
                    }
                }
                if (mod.page < mod.page_next && mod.page_next <= mod.page_total) {
                    html_ += '<a class="pagebox" name="'+mod.id+'page_link" href="#" cx-page="'+ mod.page_next +'"><span style="font-size:11px">▶</span></a>&nbsp;';
                }

                if (mod.page_total > mod.page_next) {
                    html_ += '<a class="pagebox" name="'+mod.id+'page_link" href="#" cx-page="'+ mod.page_total +'"><span style="font-size:11px;letter-spacing:-2px">▶▶</span></a>';
                }
                $self.html(html_);
                evt.bind_page();  // 이벤트 바인딩
            } // end func.cx_pager -> draw_page

            /*----------------------------------------------
            * @cx_pager 페이지에 관계된 값을 계산
            ----------------------------------------------*/
            act.calc_page = function() {
                if (cfg.debug) console.log('method.calc_page');
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
            } // end func.cx_pager -> calc_page

            /*----------------------------------------------
            * @cx_pager reset 폼
            ----------------------------------------------*/
            act.reload_page = function() {
                if (cfg.debug) console.log('method.reset_page');
                var page_ = _cfg.page + '';
                var $page = this;
                $.each($page.$link, function (idx_, item_) {
                    if (page_ === item_.innerText) {
                        $page.$link[idx_].click();
                        return false;
                    }
                });
            } // end func.cx_pager -> reload_page

            /*----------------------------------------------
            * @cx_pager 페이지 제거
            ----------------------------------------------*/
            act.clear_page = function() {
                if (cfg.debug) console.log('method.clear_page');
                $self.children().remove();
                return;
            } // end func.cx_pager -> clear_page

            /*----------------------------------------------
            * @cx_pager 이벤트 바인딩
            ----------------------------------------------*/
            evt.bind_page = function() {
                if (cfg.debug) console.log('event.bind_page');
                this.$link = $('a[name="'+mod.id+'page_link"]');
                this.$link.on('click', {'cfg':cfg}, function(paramEvt_) {
                    act.set_page({id:'page', value:$(paramEvt_.currentTarget).attr('cx-page')});  // 현재 페이지 설정
                    mod.click(paramEvt_);     // 호출측 callback 수행
                    act.draw_page();     // 페이지 그리기
                });
            } // end func.cx_pager -> bind_page
            act.init();


            // 외부 interface
            this.mod = mod;
            this.cfg = cfg;

            this.get = act.get_page;
            this.set = act.set_page;
            this.draw = act.draw_page;
            this.clear = act.clear_page;

            return this;
        } // end method.cx_pager -> init
    }; app_.fn.cx_pager = function (method) { return __cx_pager.init.apply(this, arguments); } // end of cx_pager

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Popup
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_popup = {
        init: function (cfg_, item_) {
            this.version = '0.0.0.1';
            var $self = this, act = {}, evt = {};
            var rowdata = {};          // Grid row 를 그릴때 현재 Row 데이터를 할당해 둠
            var $pop = {}, pop = {};
            var item = {};          // Form, Grid 에서의 팝업 객체
            var mod = {};
            var cfg = {
                  id     : 'cx_popup'      // p + m
                , column_count : -1 // 현재 Grid 컬럼 수
                , row_count : -1    // 데이터를 읽어온 Row 수
                , popid     : null  // 팝업검색에서 popup_ 를 붙여 param['act'] 로 사용됨(차후 Grid 에서 name 으로 여러개 할때는?? 2018-04-16)
            }
            cfg = $.extend(cfg, cfg_);



            /*----------------------------------------------
            * @cx_popup initialize
            * @returns  {void)
            ----------------------------------------------*/
            act.init = function() {
                if (cfg.debug == undefined) cfg.debug = false;
                if (cfg.debug) console.log('method.init');
                if (item_.popup.h == undefined) item_.popup.h = 500;
                item = item_;

                // cfg_ 는 팝업에서 사용할 구조와 다르므로 정리해 줌
                cfg.title = item.popup.title;
                cfg.h = item.popup.h;
                cfg.click = item.popup.event.click;
                cfg.bind = item.popup.bind;
                cfg.popid = 'popup_'+$self.attr('id');
                mod = item.popup.grid;

                // ########## 객체 설정
                $pop = app_.cfg.$popup.clone(true);     // 팝업객체
                pop.$table1 = $pop.find('#'+cfg.id+'thead');
                pop.$table2 = $pop.find('#'+cfg.id+'tbody');
                pop.$tbody = pop.$table2.find('tbody');
                pop.$stxt = $pop.find('#'+cfg.id+'stxt');
                pop.$btn = $pop.find('#'+cfg.id+'btn_search');
                pop.$grid = pop.$tbody.cx_grid(cfg, mod);
                if (item_.type != 'popup') {    // form 팝업이 아닌 경우(2018-04-20, 나중엔 폼팝업에서도 필요할 듯)
                    if (cfg_.popup.research != undefined && cfg_.popup.research == false) {  // 재검색 하지 않음 팝업이면 검색관련(text, button) 감추기
                        $pop.find('caption').hide();
                    }
                }

                // ########## Grid 설정
                cfg.w = 0;    //
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

                pop.$table1.find('colgroup').append(_colgroup1);
                pop.$table1.find('thead').append(_thead);
                pop.$table2.find('colgroup').append(_colgroup2);

                // ######## 이벤트 처리
                pop.$btn.on('click', function(evt_) {
                    evt.search_form(act.get_param_form());
                });
                pop.$stxt.on('keydown', function(evt_) {    // 엔터치면 버튼클릭으로 대신 처리
                    if (evt_.keyCode == 13) {
                        if ($.trim(evt_.currentTarget.value) == '') {
                            return;
                        }
                        evt.search_form(act.get_param_form());

                    }
                });

                // ######## 팝업 생성
                $pop.dialog({
                            title: cfg.title,
                            resizable: false,
                            autoOpen : false,
                            show : 'blind',
                            hide : 'blind',
                            width: cfg.w,
                            height: cfg.h,
                            modal: true,
                            buttons: { '닫기': function() {
                                $(this).dialog('close');
                                pop.$stxt.val('');  // 닫을때 초기화
                                act.clear();
                            }}
                            });
            } // end func.cx_popup -> init

            /*----------------------------------------------
            * @cx_popup clear
            ----------------------------------------------*/
            act.get_param_form = function() {
                if (cfg.debug) console.log('event.get_param_form');
                act.clear();    // 무조건 제거
                if ($.trim(pop.$stxt.val()) == '') {
                    alertBox.show('알림', '검색어를 입력하세요', function() { item.$obj.focus(); });
                    return false;
                }
                var _param = {};
                _param['stxt'] = $.trim(pop.$stxt.val());
                if (_param == undefined || _param == false)
                    return;
                _param = cfg.click(pop.$stxt, _param);
                if (_param == undefined || _param == false)
                    return;
                _param['act'] = cfg.popid;
                return _param;
            } // end func.cx_popup -> get_param_form

            /*----------------------------------------------
            * @cx_popup clear
            ----------------------------------------------*/
            act.clear = function() {
                if (cfg.debug) console.log('method.clear');
                pop.$tbody.children().remove();
                pop.$tbody.append('<tr><td class="center" colspan="'+cfg.column_count+'" style="height: 30vh">No Data..</td></tr>');
            } // end func.cx_popup -> clear

            /*----------------------------------------------
            * @cx_popup loading
            ----------------------------------------------*/
            act.loading = function() {
                if (cfg.debug) console.log('method.loading');
                rowdata = {};   // 현재 row data 를 초기화
                pop.$tbody.children().remove();
                pop.$tbody.append('<tr><td class="center" colspan="'+cfg.column_count+'" style="height: 50vh"><img src="//cdn.cre-it.com/dx/img/loading/ajax-loader.gif" /></td></tr>');
            } // end func.cx_popup -> loading

            /*----------------------------------------------
            * @cx_popup close_popup
            ----------------------------------------------*/
            evt.close_popup = function(txt_) {
                if (cfg.debug) console.log('event.close_popup');
                $pop.dialog('close');
            } // end event.cx_popup -> close_popup

            /*----------------------------------------------
            * @cx_popup open_popup (Form 팝업)
            ----------------------------------------------*/
            evt.open_popup = function(txt_) {
                if (cfg.debug) console.log('event.open_popup');
                if (!$.trim(txt_)) {
                    alertBox.show('알림', '검색어를 입력하세요', function() {

                    });
                    return;
                }
                pop.$stxt.val(txt_);
                evt.search_form(act.get_param_form());
            } // end event.cx_popup -> open_popup

            /*----------------------------------------------
            * @cx_popup open (Grid 에 연결된 팝업)
            ----------------------------------------------*/
            evt.open_grid = function(param_) {
                if (cfg.debug) console.log('event.open_grid');
                param_['act'] = cfg.popid;
                evt.search_grid(param_);
            } // end event.cx_popup -> open_grid

            /*----------------------------------------------
            * @cx_popup open (외부에서 직접호출)
            ----------------------------------------------*/
            evt.open = function(data_) {
                if (cfg.debug) console.log('event.open');
                pop.$grid.draw(data_);   // row data binding
                if ($pop.dialog('isOpen') == false) {
                    $pop.dialog('open');
                }
            } // end event.cx_popup -> open

            /*----------------------------------------------
            * @cx_popup is_open (외부에서 직접호출)
            ----------------------------------------------*/
            evt.is_open = function() {
                if (cfg.debug) console.log('event.is_open');
                return $pop.dialog('isOpen');
            } // end event.cx_popup -> is_open


            /*----------------------------------------------
            * @cx_popup open (Grid 에 연결된 팝업)
            ----------------------------------------------*/
            evt.search_grid = function(param_) {
                if (cfg.debug) console.log('event.search_grid');
                var res = false;
                res = cxApp.submit({act:cfg.act, data:param_, debug:false});
                if (res != false) {
                    if (res != false && res.result === true) {
                        if (res.data.length > 0) {
                                // 팝업을 오픈하고 Grid 를 그림
                                pop.$grid.draw(res.data);   // row data binding
                                if ($pop.dialog('isOpen') == false) {
                                    $pop.dialog('open');
                                }
                        }
                    } else {

                    }
                }

            } // end event.cx_popup -> search_grid

            /*----------------------------------------------
            * @cx_popup search
            ----------------------------------------------*/
            evt.callback_search = function(res_) {
                if (cfg.debug) console.log('event.callback_search');
                if (res_ != false) {
                    if (res_.result == true) {
                        if (res_.data.length == 1) {
                            if (typeof cfg.event.row_enter == 'function') {
                                cfg.event.row_enter(false, res_.data[0]);    // 값이 1건이면 사용자 처리를 위해 바로 호출시켜줌
                            }
                        } else {
                            // 팝업을 오픈하고 Grid 를 그림
                            pop.$grid.draw(res_.data);   // row data binding
                            if ($pop.dialog('isOpen') == false) {
                                $pop.dialog('open');
                            }
                        }
                    } else {
                        alertBox.show('알림', res_.msg, function(){
                            if (typeof cfg.event.row_enter == 'function') {
                                res_['act'] = res_.form['act'];     // 사용자측에서 분기할 값을 할당함
                                res_['stxt'] = res_.form['stxt'];   //
                                cfg.event.row_enter(false, res_);   // 값이 없더라도 사용자 처리를 위해 호출시켜줌
                            }
                        });
                    }
                } else {
                    throw '======== error (popup.search) ========';
                }

            } // end event.cx_popup -> callback_search
            /*----------------------------------------------
            * @cx_popup search
            ----------------------------------------------*/
            evt.search_form = function(param_) {
                if (cfg.debug) console.log('event.search_form');
                if (param_ == false)
                    return false;
                cxApp.async({act:cfg.act, data:param_, now_tab:cfg.now_tab, debug:false}, evt.callback_search);
            } // end event.cx_popup -> search_form

            act.init();
            // 외부 interface
            this.cfg = cfg;

            this.open = evt.open;
            this.is_open = evt.is_open;
            this.open_popup = evt.open_popup;
            this.open_grid = evt.open_grid;
            this.close = evt.close_popup;
            return this;
        } // end method.cx_popup -> init
    }; app_.fn.cx_popup = function (method) { return __cx_popup.init.apply(this, arguments); } // end of cx_popup


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Tab
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    var __cx_tab = {
        init: function (cfg_, $mod_) {
            this.version = '0.0.0.1';
            var $self = this, act = {}, evt = {};
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
            act.init = function() {
                if (cfg.debug == undefined) cfg.debug = false;
                if (cfg.debug) console.log('method.init');

                $btn = $self.children().find('a');                  // 탭 버튼
                if (app_.cfg.theme == 'boot')
                    $tab = $self.children().find('div.tab-pane');   // 탭 컨텐츠
                else if (app_.cfg.theme == 'ui')
                    $tab = $self.find('div.tab-pane');              // 탭 컨텐츠

                act.reg_event();    // 이벤트 등록

                evt.resize();
                $(window).resize(function() {
                    evt.resize();
                });

                $self.show().tabs({show:{effect:'blind', duration: 500}});
                act.reg_now_tab(false);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
            } // end func.cx_tab -> init


            /*----------------------------------------------
            * @cx_tab 이벤트를 등록
            * @returns  {void)
            ----------------------------------------------*/
            act.reg_event = function() {
                if (cfg.debug) console.log('method.reg_event');
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
            } // end func.cx_tab -> reg_event


            /*----------------------------------------------
            * @cx_tab 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독
            * @param    {bool)  false 면 처리하지 않음 (처음 탭 로드時 search, form, grid 등에서 처리하므로 필요없음)
            * @returns  {void)
            ----------------------------------------------*/
            act.reg_now_tab = function(exec_) {
                if (cfg.debug) console.log('method.reg_now_tab');
                if (exec_ == false) return; // 처음 탭 로드時 search, form, grid 등에서 처리하므로 필요없음
                $.each($mod_, function (key1_, item1_) {        // m100, m101, m012...
                    $.each(item1_, function (key2_, item2_) {   // mfrm, mgrd, mpag, dfrm, dgrd, dpag...
                        if (item2_ == null) return true;
                        item2_.cfg.now_tab = cfg.now_tab;

                        if (item2_.cfg.mytab == item2_.cfg.now_tab) {   // 나의 탭과 현재 active 탭이 같으면 포커스 처리
                            //console.error('여기에서 set_focus 호출', item2_.cfg.myfocus);
                            if (item2_.cfg.myfocus != null) {   // 한 탭에 여러 모듈중 myfocus 가 있는 모듈만 수행(버튼은 제외함)
                                //if (item2_.cfg.myfocus.constructor == jQuery) { // Grid tr 객체
                                //item2_.cfg.myfocus.focus();
                                //} else {
                                //}
                                if (typeof item2_.set_focus == 'function')
                                    item2_.set_focus(item2_.cfg.myfocus);
                                else {
                                    console.error('Grid 포커스 처리하세요', item2_);
                                    console.info($mod_, item1_);
                                }

                            }
                        }
                    });
                });
            } // end func.cx_tab -> reg_now_tab


            /*----------------------------------------------
            * @cx_tab tab btn click,
            * @returns  {void)
            ----------------------------------------------*/
            evt.tab_click = function(evt_) {
                if (cfg.debug) console.log('event.tab_click');
                $.each($btn, function (idx_, item_) {
                    if (evt_.currentTarget == item_) {
                        $($btn[idx_]).blur();
                        $($tab[idx_]).focus();
                        cfg.now_tab = idx_;
                        act.reg_now_tab(true);  // 현재 액티브된 탭 인덱스를 소속 모듈에게 모두 구독




                        //_act.$mode.val('tab'+m_+(idx_ + 1));
                        //_mod[0] = idx_ + 1;       // 현재 active 된 탭 인덱스
                        //_evt.__focus(_mod[idx_+1].focus.item);
                        return false;
                    }
                });
            } // end event.cx_tab -> tab_click
            /*----------------------------------------------
            * @cx_tab tab tab move
            * @returns  {void)
            ----------------------------------------------*/
            evt.tab_move = function(param_) {
                if (cfg.debug) console.log('event.tab_move');
                $btn[param_].click();
            } // end event.cx_tab -> tab_click

            /*----------------------------------------------
            * @cx_tab tab > item set focus
            * @returns  {void)
            ----------------------------------------------*/
            evt.set_focus = function(paramItem_, caller) {
                if (cfg.debug) console.log('event.set_focus');
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
            } // end event.cx_tab -> set_focus

            /*----------------------------------------------
            * @cx_tab tab resize (750px 이하로 줄어들면 처리안 함)
            * @returns  {void)
            ----------------------------------------------*/
            evt.resize = function() {
                if (cfg.debug) console.log('event.resize');
                app_.cfg.h = $(window).height();
                if (app_.cfg.h < 750) // 필요이상으로 줄어들면 처리하지 않음
                    return;
                app_.cfg.$wrap_body.css('height', app_.cfg.h - 100);    // 이곳에서 잘못하면 스크롤이 생김
                $tab.css('height', app_.cfg.h - 250);
            } // end event.cx_tab -> resize

            act.init();

            // 외부 접근 허용
            this.cfg = cfg;
            this.tab_move = evt.tab_move;
            return this;
        } // end method.cx_tab -> init
    }; app_.fn.cx_tab = function (method) { return __cx_tab.init.apply(this, arguments); } // end of cx_tab


    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Random
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_random = function () {
        this.version = '0.0.0.1';
        /*----------------------------------------------
        * @cx_random 한글을 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_kor = function(len_) {
            try {
                var res = '';
                for (var i=0; i<len_; i++) {
                    res += String.fromCharCode( 44031 + Math.ceil(11172 * Math.random()));
                }
                return res;
            } catch(e) {
                console.error(e);
            }
        } // end func
    } // end of cx_random

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Utility
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_util = function () {
        this.version = '0.0.0.1';
        /*----------------------------------------------
        * @cx_util 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_browser = function() {
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
        } // end.method.cx_util -> get_browser

        /*----------------------------------------------
        * @cx_util HTML Entity 를 원래로 치환
        * @param    {string} E: edit, V:view
        * @param    {string}
        * @returns  {string}
        ----------------------------------------------*/
        this.replace_html = function(mode_, str_) {
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
        } // end.method.cx_util -> replace_html
    } // end of cx_util

    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    // Validation
    // ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
    app_.cx_validator = function () {
        this.version = '0.0.0.1';

        /*----------------------------------------------
        * @cx_validator check number
        ----------------------------------------------*/
        this.is_num = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_num

        /*----------------------------------------------
        * @cx_validator check id
        ----------------------------------------------*/
        this.is_id = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_id

        /*----------------------------------------------
        * @cx_validator check password
        ----------------------------------------------*/
        this.is_pwd = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_pwd

        /*----------------------------------------------
        * @cx_validator check email
        ----------------------------------------------*/
        this.is_email = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_email

        /*----------------------------------------------
        * @cx_validator check biz no
        ----------------------------------------------*/
        this.is_bizno = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_bizno

        /*----------------------------------------------
        * @cx_validator check reg no
        ----------------------------------------------*/
        this.is_regno = function() {
            var res = false;

            return res;
        } // end.method.cx_validator -> is_regno

        /*----------------------------------------------
        * @cx_validator 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.is_auth = function(arr_) {
            var res = true, reg = '';
            $.each(arr_, function (idx_, item_) {
                reg = new RegExp(item_+'$', '');
                if (location.hostname.match(reg) != null) { res = false;return false; }
                else if (document.domain.match(reg) != null) { res = false;return false; }
                else if (window.location.hostname.match(reg) != null) { res = false;return false; }
            });
            if (res) {
                alert('유효하지 않은 라이센스입니다');
                throw '======== error ========';
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
        } // end.method.cx_validator -> is_auth
        this.is_auth(['dsitec.com','msos.kr','dsit.in']);

    } // end of cx_validator

        })(cxApp);

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
                        rowspan = $(that).attr('rowspan') || 1;
                        rowspan = Number(rowspan)+1;
                        $(that).attr('rowspan', rowspan);
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
                    colspan = $(that).attr('colSpan');
                    if (colspan == undefined) {
                        $(that).attr('colSpan', 1);
                        colspan = $(that).attr('colSpan');
                    }
                    colspan = Number(colspan)+1;
                    $(that).attr('colSpan', colspan);
                    $(this).hide(); // .remove();
                } else {
                    that = this;
                }
                that = (that == null) ? this : that; // set the that if not already set
              });
             });
        });
    };


$(function() {
    'use strict';
    // cxApp initalize
    cxApp.init();

//    var $$ = $('#cx_alert').cx_alert({});
//    var cxUtil = new cxApp.cx_util();
//    var cxValidator = new cxApp.cx_validator();

//    $$.alert('b', function() { console.log('good');});
//    $$.confirm('b<br /><span style="color:#f00">aaaaaa</span>', function() { console.log('YYYYY'); $(this).dialog('close')}, function() { console.log('NNN??');$(this).dialog('close')});

});
