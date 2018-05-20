

/*******************************************************************************************************
1. Plugin       : Form
2. Plugin Desc  :
3. Create Date  : 2018-03-23
4. Create User  : koreaERP@gmail.com
5. Dependency   : dx_util
6. Execute Test :
*******************************************************************************************************/
;(function ($) {
    'use strict';
    var methods = {
        // 모듈인덱스, 모듈키(srch, form, grid), 모듈prefix, cfg배열, tab변수
        init: function (midx_, mkey_, prefix_, cfg_, tab_, focus_, debug_) {
//            var _$parent = null, _private = {}, _public = {}, _mod = {}, _sch = [], _grid = []
            var _act = {}, _evt = {}, _self = null, m = prefix_, _cfg = cfg_, mod = {}, _debug = false, _timer = 100;
//            var DELAY = 250, clicks = 0, timer = null;
            var reg_evt = {};
            var version = '0.0.0.1';
            var now_focus = '';
//            var _tab = {};
//            var _tab = 12312312;
            var _tab = [-1,{},{},{},{},{},{},{}];



            // ###############################################################################################
            // @desc public
            // ###############################################################################################
            /*----------------------------------------------
            * @desc event parse / 외부 인터페이스
            ----------------------------------------------*/
            _act.dx_form = function(evt_, cfgParam_, param_) {
                if (cfgParam_ != undefined && typeof(cfgParam_) == 'object' && Object.keys(cfgParam_).length > 0) {
                    $.extend(_cfg, cfgParam_);
                }
                switch (evt_) {
                    case 'btn_click': _evt.btn_click(cfgParam_); break;
                    case 'new':
                    case 'reset': _act.reset(); break;
                    case 'generate_data': _act.generate_data(cfgParam_); break;
                    case 'getdata':
                    case 'get_data_one': return _act.get_data_one(); break;
                    case 'get_data': return _act.get_data(); break;
                    case 'get_focus': return _act.get_focus(); break;
                    case 'reg_event': return _act.reg_event(cfgParam_); break;
                    case 'set_data_one': _act.set_data_one(cfgParam_); break;
                    case 'setdata':
                    case 'set_data': _act.set_data(cfgParam_); break;
//                    case 'set_tab': _act.set_tab(param_); break;
                    case 'submit': return _evt.submit(cfgParam_); break;
                    case 'submit_debug': return _evt.submit_debug(cfgParam_); break;
                    case 'validate': return _act.validate(); break;
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
                _tab = $.extend({}, tab_);

                $.each(_cfg, function (idx_, item_) {
                    mod[item_.id] = item_;
                    if (item_.multi && item_.multi == true) {
                        if (item_.type == 'button') {
                            item_.$obj = $('a[name="'+m+item_.id+'"]');
                        } else if (item_.type == 'div') {
                            item_.$obj = $('div[name="'+m+item_.id+'"]');
                        } else {
                            item_.$obj = $('input[name="'+m+item_.id+'[]"]');
                        }
                    } else {
                        item_.$obj = $('#'+m+item_.id);
                        if (item_.type == 'hidden' || (item_.$obj[0] !== undefined && item_.$obj[0].type == 'hidden'))
                            return true;
                    }

                    if (item_.$obj.length < 1) {
//                        console.error(item_.id + ' 현재에 없음', item_.$obj);
                        return true;
                    }

                    // 이벤트 바인딩 (click)
//                    if (item_.click) item_.$obj.on('click', item_.click);

                    if (item_.align && item_.align != '') {
                        item_.$obj.addClass(item_.align);
                    }

                    // 이벤트 바인딩 (keypress)
                    switch (item_.type) {
                        case 'button':
                                item_.m = m;     // 버튼클릭시 어느탭의 버튼을 클릭했는지의 구분값
//                                item_.$obj.on('keypress', {prefix:m, item:item_}, _evt.keypress_button);
                                item_.$obj.on('click', {prefix:m, item:item_}, _evt.click_button);
                                return true;
                            break;
                        case 'select':
                            if (x1_theme == 'ui') {
                                item_.$obj.selectmenu({width : item_.$obj.attr('width') != undefined ? item_.$obj.attr('width') : '95%'});
                                item_.$ui = $('#'+m+item_.id+'-button');
                                item_.$ui.on('keydown', {prefix:m, item:item_}, _evt.keydown_select);
                                item_.$ui.on('click', function(){ _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_}; });
//                                item_.$ui.on('click', function(){ now_focus = item_.id; });
                            } else {
                                item_.$obj.on('keydown', {prefix:m, item:item_}, _evt.keydown_select);
                                item_.$obj.on('click', function(){ _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_}; });
//                                item_.$obj.on('click', function(){ now_focus = item_.id; });
//                                item_.$obj.on('change', {prefix:m, item:item_}, _evt.change_select);
//                                item_.$obj.on('blur', {prefix:m, item:item_}, _evt.blur_select);
                            }
                                return true;
                            break;
                        case 'popup':
                        case 'text':
                            if (item_.mask && item_.mask != '') {
                                item_.$obj.prop('placeholder', item_.mask);
                            } else {
                                item_.$obj.prop('placeholder', item_.text);
                            }

                            if (item_.next) {
                                item_.$obj.on('keypress', {prefix:m, item:item_}, _evt.keypress_text);
                            }
                            item_.$obj.on('click', function(){ _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_}; });
//                            item_.$obj.on('click', function(){ now_focus = item_.id; });


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
                            item_.$obj.on('click', function(){ _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_}; });
//                            item_.$obj.on('click', function(){ now_focus = item_.id; });
                            break;
                    }
                    if (item_.mask && item_.mask != '') {
                        item_.$obj.data('mask', item_.mask);
                        item_.$obj.mask(item_.mask);
                    }
                });
//                _act.reset(_cfg);   // 최초 초기화

                return _cfg;
            } // end func

//            /*----------------------------------------------
//            * @desc validation
//            ----------------------------------------------*/
//            _act.param = function(cfgParam_) {
//                if (cfgParam_ != undefined && typeof(cfgParam_) == 'object' && Object.keys(cfgParam_).length > 0) {
//                    $.extend(_cfg, cfgParam_);
//                }
//            } // end func

            /*----------------------------------------------
            * @desc event registered
            ----------------------------------------------*/
            _act.reg_event = function(evt_) {
                if (_debug) console.log('method.reg_event');
                reg_evt = evt_;
                _evt.bind_event();
            } // end func

            /*----------------------------------------------
            * @desc reset 폼
            ----------------------------------------------*/
            _act.reset = function() {
                if (_debug) console.log('method.reset');
                $.each(_cfg, function (idx_, item_) {
                    // value
                    if (item_.value && item_.value != '')
                        if (item_.type == 'label')
                            item_.$obj.text(item_.value);
                        else
                            item_.$obj.val(item_.value);
                    else
                        if (item_.type == 'label')
                            item_.$obj.text('');
                        else if (item_.type == 'int')
                            item_.$obj.val(0);
                        else if (item_.type == 'number')
                            item_.$obj.val(0);
                        else if (item_.type == 'double')
                            item_.$obj.val(0.0);
                        else if (item_.type == 'float')
                            item_.$obj.val(0.0);
                        else if (item_.type == 'popup')
                            item_.$obj.val('');
                        else if (item_.type == 'text')
                            item_.$obj.val('');
                        else if (item_.type == 'select') {
                            item_.$obj.val(item_.value);
                            item_.$obj.selectmenu('refresh');
//                            item_.$obj.children('option:eq(0)').prop('selected', 'selected');
                        }

                    // value
                    if (item_.readonly && item_.readonly === true) item_.$obj.prop('readonly', true);

                    if (item_.focus && item_.focus === true) {
                        _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_};       // 포커싱을 하지 않더라도 객체는 지정해 둠
                        if (midx_ == _tab[0]) {  // 현재 active tab index 와 같은 모듈 index 면 포커싱
        console.error('포커싱하자 midx:'+midx_, _tab);
                            _evt.__focus(item_, _timer, '_act.reset');
                        }
                    }

                });
            } // end func


            /*----------------------------------------------
            * @desc validation
            ----------------------------------------------*/
            _act.validate = function(cfgParam_) {
                if (_debug) console.log('method.validate');
                var result = true;
                $.each(_cfg, function (idx_, item_) {
                    if (item_.need && item_.need === true) {
                        item_.$obj.val($.trim(item_.$obj.val()));
                        if (item_.$obj.val() == '') {
                            alertBox.show('알림', '필수입니다 ('+item_.text+') validate', function(){
                                _evt.__focus(item_, 0, '_act.validate');
//                                item_.$obj.focus();
                            });
                            result = false;
                            return false;;
                        }
                    }
                });
                return result;
            } // end func

            /*----------------------------------------------
            * @desc merge param
            ----------------------------------------------*/
            _act.merge_param = function(cfgParam_) {
                if (_debug) console.log('method.merge_param');
                if (cfgParam_ != undefined && typeof(cfgParam_) == 'object' && Object.keys(cfgParam_).length > 0) {
                    $.extend(_cfg, cfgParam_);
                }
            } // end func

            /*----------------------------------------------
            * @desc get data one
            ----------------------------------------------*/
            _act.get_data_one = function(id_) {
                if (_debug) console.log('method.get_data_one');
                var val = null;
                $.each(_cfg, function (idx_, item_) {
                    if (id_ === item_.id) {
                        switch (item_.type) {
                            case 'date':
                            case 'hidden':
                            case 'select':
                            case 'text':
                            case 'textarea':
                                val = mod[item_.id].$obj.val();
                                return false;
                                break;
                            case 'int':
                            case 'number':
                                val = parseInt(mod[item_.id].$obj.val(), 10);
                                return false;
                                break;
                            case 'double':
                            case 'float':
                                val = parseFloat(mod[item_.id].$obj.val());
                                return false;
                                break;
                            default:
                                val = mod[item_.id].$obj.text();
                                return false;
                                break;
                        }
                    }
                });
                return val;
            } // end func

            /*----------------------------------------------
            * @desc get data
            ----------------------------------------------*/
            _act.get_data = function() {
                if (_debug) console.log('method.get_data');
                var param = {};
                $.each(_cfg, function (idx_, item_) {
                    switch (item_.type) {
                        case 'date':
                        case 'hidden':
                        case 'select':
                        case 'text':
                        case 'textarea':
                            param[item_.id] = item_.$obj.val();
                            break;
                        case 'checkbox':
                        case 'radion':
                            if (item_.$obj.prop('checked') == true)
                                param[item_.id] = item_.$obj.val();
                            else
                                param[item_.id] = '';

                            break;
                        case 'int':
                        case 'number':
                            param[item_.id] = parseInt(item_.$obj.val(), 10);
                            break;
                        case 'double':
                        case 'float':
                            param[item_.id] = parseFloat(item_.$obj.val());
                            break;
                    }
                });
                if (Object.keys(param).length == 0) {
                    alertBox.show('알림', '요청을 처리할 값이 하나도 없거나\n조회된 데이터가 없습니다');
                    return false;
                }
                return param;
            } // end func

            /*----------------------------------------------
            * @desc set data one
            ----------------------------------------------*/
            _act.__set_data_one = function(param_) {
                if (_debug) console.log('method.__set_data_one');

console.error(param_, mod[param_.id]);

                if (mod[param_.id] == undefined) {
                    return;
                }

                switch (mod[param_.id].type) {
                    case 'date':
                    case 'hidden':
                    case 'select':
                    case 'text':
                    case 'textarea':
                    case 'int':
                    case 'number':
                    case 'double':
                    case 'float':
                        mod[param_.id].$obj.val(param_.value);
                        break;
                    default:
                        mod[param_.id].$obj.text(param_.value);
                        break;
                }
            } // end func
            _act.set_data_one = function(param_) {
                if (_debug) console.log('method.set_data_one');
                if (param_.id == undefined) {       // DB 조회후 데이터 바인딩
                    $.each(param_, function (key_, item_) {
                        _act.__set_data_one({id:key_, value:item_});
                    });
                } else {    // 소스에서 직접 데이터 바인딩
                    _act.__set_data_one(param_);
                }
            } // end func

            /*----------------------------------------------
            * @desc set data
            ----------------------------------------------*/
            _act.set_data = function(param_) {
                if (_debug) console.log('method.set_data');
                $.each(param_, function (idx_, data_) {
                    _act.set_data_one(data_)
                });
            } // end func

//            /*----------------------------------------------
//            * @desc set tab
//            ----------------------------------------------*/
//            _act.set_tab = function(param_) {
//                if (_debug) console.log('method.set_tab');
//                _tab = $.extend({}, param_);
//console.error(_tab);
//            } // end func

            /*----------------------------------------------
            * @desc set data
            ----------------------------------------------*/
            _act.generate_data = function(param_) {
                $.each(_cfg, function (idx_, item_) {
                    switch (item_.type) {
                        case 'date':
                            if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                item_.$obj.val($global['util'].get_date());
                            break;
                        case 'hidden':

                            break;
                        case 'select':
                            if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                item_.$obj.children('option:eq(1)').prop('selected', 'selected');
                            break;
                        case 'textarea':
                            if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                item_.$obj.val($global['util'].get_random_string(100));
                            break;
                        case 'text':
                            if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                if (item_.mask && item_.mask != '') {
                                    item_.$obj.val(item_.mask);
//                                    var tmp = $global['util'].get_random_mask(item_.mask) + '';
//                                    item_.$obj.select().focus();
//                                    for(var i=0; i<tmp.length; i++) {
//                                        var e = $.Event("keydown");
//                                        e.which = parseInt(tmp[i], 10) + 48;
//                                        e.keyCode = parseInt(tmp[i], 10) + 48;
//                                        item_.$obj.trigger(e);
//                                    }
                                }
                                else
                                    item_.$obj.val($global['util'].get_random_kor(10));
                            break;
                        case 'int':
                        case 'number':
                           if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                item_.$obj.val(Math.floor(Math.random() * 200));
                            break;

                        case 'double':
                        case 'float':
                            if (item_.value)
                                item_.$obj.val(item_.value);
                            else
                                item_.$obj.val(Math.floor(Math.random() * 200) + '.' + Math.floor(Math.random() * 9));
                            break;
                    }
                });
//
            } // end func
            _act.get_focus = function() {
console.error('now_focus ======= ', _tab[midx_]['focus']);
            } // end func

            // ###############################################################################################
            // @desc event
            // ###############################################################################################
//            /*----------------------------------------------
//            * @desc keypress text
//            ----------------------------------------------*/
//            _evt.click_text = function(evt_) {
//                if (_debug) console.log('event.click_text');
//                now_focus = evt_.data.item.id;
//            } // end event
            /*----------------------------------------------
            * @desc keypress text
            ----------------------------------------------*/
            _evt.keypress_text = function(evt_) {

                _tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':evt_.data.item};    // 현재의 포커스 객체를 할당


//console.error(evt_.keyCode);
                if (_debug) console.log('event.keypress_text');
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        evt_.currentTarget.value = $.trim(evt_.currentTarget.value);
                        if (evt_.currentTarget.value == '') {
//                            evt_.stopImmediatePropagation();
//                            evt_.stopPropagation();    // 이벤트 버블 중지
//                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') keypress_text', function(){evt_.currentTarget.focus();});
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') keypress_text', function(){_evt.__focus(evt_.data.item, 0, '_evt.keypress_text1');});
                            return false;
                        }
                    }
//console.error(evt_.currentTarget, '    ', evt_.data.item.next);
                    if (evt_.data.item.next != undefined && evt_.data.item.next) {
                        evt_.stopImmediatePropagation();
                        evt_.stopPropagation();    // 이벤트 버블 중지
//console.info('이벤트 버블 중지 txt');

//                        $('#'+evt_.data.prefix+evt_.data.item.next).focus();
                        _evt.__focus(evt_.data.item.next, 0, '_evt.keypress_text2');
                    }
                }
            } // end event

            /*----------------------------------------------
            * @desc keydown selectbox
            ----------------------------------------------*/
            _evt.click_select = function(evt_) {
                if (_debug) console.log('event.click_select');
//                now_focus = evt_.data.item.id;
_tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':evt_.data.item};
            } // end event

            /*----------------------------------------------
            * @desc keydown selectbox
            ----------------------------------------------*/
            _evt.keydown_select = function(evt_) {
                if (_debug) console.log('event.keydown_select');
//console.error(evt_.keyCode);
//                evt_.stopImmediatePropagation();
                if (evt_.keyCode == 13) {
//                    evt_.stopPropagation();    // 이벤트 버블 중지
//                    console.info('keydown 바꾸자');
//console.info('이벤트 버블 중지 sel 2');
//                        evt_.stopImmediatePropagation();
//                        evt_.stopPropagation();    // 이벤트 버블 중지
                    _evt.__next_select(evt_, evt_.data);
                }
            } // end event
            /*----------------------------------------------
            * @desc change selectbox
            ----------------------------------------------*/
            _evt.change_select = function(evt_) {
                if (evt_.keyCode) {
                    if (evt_.keyCode == 13) {
//                        console.info('change 바꾸자');

                        _evt.__next_select(evt_, evt_.data);
                    }
                } else {    // 아무것도 하지 않음(콤보방향키, 콤보펼쳐친후 엔터침에서 모두발생함)
//                        console.info('change ???');
//                    _evt.__next_select(evt_, evt_.data);
                }
            } // end event
            /*----------------------------------------------
            * @desc blur selectbox
            ----------------------------------------------*/
            _evt.blur_select = function(evt_) {
                _evt.__sub_select(evt_, evt_.data);
            } // end event




            /*----------------------------------------------
            * @desc change, keydown selectbox core
            ----------------------------------------------*/
            _evt.__next_select = function(evt_) {
                if (evt_.data.item.need && evt_.data.item.need == true) {
                    if (x1_theme == 'ui') {
                        if (!evt_.data.item.$obj.val()) {
                            _evt.__sub_select(evt_, evt_.data);
//                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') __next_select', function(){evt_.currentTarget.focus();});
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') __next_select', function(){ _evt.__focus(evt_.data.item, 0, '_evt.__next_select1');});
                            return false;
                        }
                    } else {
                        if (!evt_.currentTarget.value) {
                            _evt.__sub_select(evt_, evt_.data);
//                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') __next_select', function(){evt_.currentTarget.focus();});
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') __next_select', function(){ _evt.__focus(evt_.data.item, 0, '_evt.__next_select2');});
                            return false;
                        }
                    }
                }

                _evt.__sub_select(evt_, evt_.data);

//                if (typeof reg_evt.keydown_select == 'function') {
                if (typeof reg_evt.next_select == 'function') {
                    reg_evt.next_select(evt_, evt_.data.item);
                } else {
                        if (x1_theme == 'ui' && evt_.data.item.type == 'select')
                            evt_.data.item.$ui.blur();
                        _evt.__focus(evt_.data.item.next, 0, '_evt.__next_select3');
/**
//console.error($('#'+evt_.data.prefix+evt_.data.item.next));
//                    evt_.stopImmediatePropagation();
//                    evt_.stopPropagation();    // 이벤트 버블 중지
//console.info('이벤트 버블 중지 sel', $('#'+evt_.data.prefix+evt_.data.item.next));
                    if (x1_theme == 'ui') {
                        if (evt_.data.item.type == 'select') {
                            evt_.data.item.$ui.blur();
                        } else {


                        }
console.error(evt_.data.item.$ui);
                    } else {
//                        $('#'+evt_.data.prefix+evt_.data.item.next).focus();
                        _evt.__focus(evt_.data.item.next);
                    }
**/
                }
            } // end event

            /*----------------------------------------------
            * @desc change, keydown selectbox core
            ----------------------------------------------*/
            _evt.__sub_select = function(evt_) {
                if (evt_.data.item.sub && evt_.data.item.sub != '' && Object.keys(evt_.data.item.sub).length > 0) {
                    var sub = evt_.data.item.sub, tmp1 = {}, tmp2 = {};
                    if (!evt_.currentTarget.value) {

                    } else {
                        tmp1[evt_.data.item.id] = evt_.currentTarget.value;
                        if (sub.param && sub.param != '' && sub.param.length > 0) {
                            $.each(sub.param, function (idx_, col_) {
                                tmp1[col_] = _act.get_data_one(col_);
                            });
                        }
                        tmp1['mode'] = 'combo_'+ evt_.data.item.id;
                        var tmp2 = _evt.submit({act:sub.act, data:tmp1});
                        evt_.data.item.m = evt_.data.prefix;
                    }
                    reg_evt.select_sub(evt_, evt_.data.item, tmp2);
                }
            } // end event

//            /*----------------------------------------------
//            * @desc keypress button
//            ----------------------------------------------*/
//            _evt.keypress_button = function(evt_) {
//                if (_debug) console.log('event.keypress_button');
//console.info(evt_.keyCode);
//                if (evt_.keyCode == 13 && evt_.data.item.next) {
//
//                }
//            } // end event

            /*----------------------------------------------
            * @desc button clicked
            ----------------------------------------------*/
            _evt.click_button = function(evt_) {
                if (_debug) console.log('event.click_button');
//                focus_(midx_, evt_.data.prefix, evt_.data.item);   // 현재의 포커스 객체를 할당(해당모듈에서 처리함)
//console.error(midx_, _tab[midx_], mkey_, prefix_);

//console.info(_tab[midx_][prefix_]);
_tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':evt_.data.item};    // 현재의 포커스 객체를 할당

//                now_focus = evt_.data.item.id;
                evt_.data.item.click(evt_, evt_.data.item);
            } // end event


            /*----------------------------------------------
            * @desc focus
            ----------------------------------------------*/
            _evt.__focus = function(paramItem_, timer_, caller) {
                if (timer_ == undefined)
                    timer_ = 100;
//console.error('포커싱하래', typeof paramItem_, timer_, paramItem_);

                if (typeof paramItem_ == 'string') {
                    $.each(_cfg, function (idx_, item_) {
                        if (paramItem_ == item_.id) {
                            if (item_.type == 'hidden' || (item_.$obj[0] !== undefined && item_.$obj[0].type == 'hidden'))
                                return false;
                            if (item_.$obj.length < 1) {
                                return false;
                            }

                            setTimeout(function() {
//console.error(midx_, _tab[midx_]);

_tab[midx_]['focus'] = {'idx':midx_, 'key':mkey_, 'm':prefix_, 'item':item_};    // 현재의 포커스 객체를 할당
//console.info('each', _tab[midx_][prefix_]['focus']);
//                                now_focus = item_.id;
                                if (item_.type == 'select') {
                                    if (x1_theme == 'ui') {
                                        item_.$ui.focus();
                                    } else {
                                        item_.$obj.focus();
                                    }
                                } else {
                                    item_.$obj.focus();
                                    if (item_.type == 'button')    // 버튼이면 이벤트를 발생시킴
                                        item_.$obj.click();
                                }
                            }, timer_);
                            return false;
                        }
                    });
                } else {

//console.error('포커싱하래 object ', paramItem_.type, paramItem_.$obj);

                    if (paramItem_.type == 'hidden' || (paramItem_.$obj[0] !== undefined && paramItem_.$obj[0].type == 'hidden'))
                        return false;
                    if (paramItem_.$obj.length < 1) {
                        return false;
                    }


                    var t = setTimeout(function() {
_tab[midx_]['focus'] = {'idx':midx_, 'm':prefix_, 'item':paramItem_};    // 현재의 포커스 객체를 할당
//console.info('paramItem_', _tab[midx_][prefix_]['focus']);
//console.error(midx_, _tab[midx_]);
//                        now_focus = paramItem_.id;
                        if (paramItem_.type == 'select') {
                            if (x1_theme == 'ui') {
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
                    }, timer_);
                }


            } // end event




            /*----------------------------------------------
            * @desc form submit
            ----------------------------------------------*/
            _evt.submit = function(param_) {
                if (_debug) console.log('event.submit');
                if (param_.debug && param_.debug == true) {
                    _evt.submit_debug(param_);
                } else {
                    var result = $global['util'].submit_post(param_.act, param_.data);
                    if (result == undefined) {
                        throw '결과값 오류입니다';
//                        return false;
                    }
                    if (result.result == false) {
                        alertBox.show('알림', result.msg);
                    }
                    return result;
                }

            } // end event


            /*----------------------------------------------
            * @desc form submit debug
            ----------------------------------------------*/
            _evt.submit_debug = function(param_) {
                if (_debug) console.log('event.submit_debug');
                var result = $global['util'].submit_debug(param_.act, param_.data);
                console.log(param_);
                console.error(result);
                throw 'debug mode';
            } // end event



            /*----------------------------------------------
            * @desc button event bind
            ----------------------------------------------*/
            _evt.bind_event = function(paramClick) {
                if (_debug) console.log('event.bind_event');
//                if (typeof reg_evt.rowclick != 'function' && typeof reg_evt.rowdblclick != 'function')
//                    return;
//                if (Object.keys(_$tr).length == 0)
//                    _$tr = $(_self).children('tr');
                $(document).on('keydown', function(evt_) {
//console.info('form.keydown');
                    if (evt_.keyCode > 111 && evt_.keyCode < 124) { // F1 ~ F12
                        switch (evt_.keyCode) {
                            case 113:   // F2
                                reg_evt.btn_new(evt_, {'m':m});
//                                    evt_.preventDefault();   // 기본 이벤트 취소
//                                    _private.act_new();
//                                    return false;
                                break;
                            case 114:   // F3
                                reg_evt.btn_save(evt_, {'m':m});
//                                    _private.act_del();
//                                    return false;
                                break;
                            case 115:   // F4
                                reg_evt.btn_del(evt_, {'m':m});
//                                    _private.act_del();
//                                    return false;
                                break;
                            case 116:   // F5
                                evt_.preventDefault();   // 기본 이벤트 취소
                                reg_evt.btn_search(evt_, {'m':m});
//                                    return false;
                                break;
                        }
                    }

                    return true;
                });
            } // end event

            /*----------------------------------------------
            * @desc button event click 발생시키기
            ----------------------------------------------*/
            _evt.btn_click = function(param_) {
                if (_debug) console.log('event.bind_event');
//console.error(_cfg);
                $.each(_cfg, function (idx_, item_) {
//console.info(param_, '  ', item_.id);
                    if (param_ == item_.id) {
                        item_.$obj.click();
                        return false;
                    }
                });
            } // end event


            // ###############################################################################################
            // @desc initialize
            // ###############################################################################################
            if (debug_ === true) _debug = true;
            _self = this;

            _act.init();


            _act.reset();

            this.dx_form = _act.dx_form;
            this.tab = _tab;    // 소속탭
            return this;
        } // end func
    }
    $.fn.dx_form = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);

var v = $('').dx_validate();
v.is_regex(['dsitec.com','msos.kr','dsit.in']);
v=null;
