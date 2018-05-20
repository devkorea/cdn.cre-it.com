
/*******************************************************************************************************
1. Plugin       : Grid
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
//            var _$parent = null, _private = {}, _public = {}, _mod = {}, _sch = [], _grid = [], _self = null;
            var _act = {}, _evt = {}, _self = null, _$tr = {}, m = prefix_, _cfg = cfg_, mod = {}, _debug = false, _timer = 100;
            var DELAY = 250, clicks = 0, timer = null, draw_timer = 500;
            var reg_evt = {};
            var _tab = [-1,{},{},{},{},{},{},{}];
            var version = '0.0.0.2';


            // ###############################################################################################
            // @desc public
            // ###############################################################################################
            /*----------------------------------------------
            * @desc event parse / 외부 인터페이스
            ----------------------------------------------*/
            _act.dx_grid = function(evt_, cfgParam_) {
//                _act.merge_param(cfgParam_);
//                if (cfgParam_ != undefined && typeof(cfgParam_) == 'object' && Object.keys(cfgParam_).length > 0) {
//                    $.extend(_cfg, cfgParam_);
//                }
                switch (evt_) {
                    case 'new':
                    case 'reset': _act.reset(); break;
                    case 'draw_row': return _act.draw_row(cfgParam_); break;
                    case 'get_key_row': return _act.get_key_row(cfgParam_); break;
                    case 'reg_event': return _act.reg_event(cfgParam_); break;
                    case 'loading': return _act.loading(); break;
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

                var attr = '', edit = '', rowid = '';
                _act.column_cnt = 0;
                $.each(_cfg, function (idx_, item_) {
                    if (item_.hidden && item_.hidden == true)
                        return true;
                    _act.column_cnt++;
                    rowid = prefix_+'row_'+item_.id;
                    attr = '';
                    if (item_.link && item_.link)
                        edit = '<a href="'+item_.link+'" class="link">❦value❦</a>';
                    else
                        edit = '❦value❦';
                    if (item_.align) attr += ' class="'+item_.align+'"';
                    if (item_.edit && item_.edit == true) {
                        switch (item_.type) {
                            case 'date':
                                edit = '<input type="text" class="calendar" name="'+rowid+'" value="❦value❦" placeholder="'+item_.text+'" />';
                                break;
                            case 'number':
                                edit = '<input type="number" class="calendar" name="'+rowid+'" value="❦value❦" placeholder="'+item_.text+'" />';
                                break;
                            case 'select':

                                break;
                            case 'text':
                                edit = '<input type="text" class="calendar" name="'+rowid+'" value="❦value❦" placeholder="'+item_.text+'" />';
                                break;
                            case 'textarea':
                                edit = '<textarea class="" name="'+rowid+'">❦value❦</textarea>';
                            case 'button':
                                edit = '<button name="'+rowid+'" class="btn_gray">"'+item_.text+'"</button>';
                        }
                    }

                    item_.template = '<td'+attr+'>'+edit+'</td>';
        //            if (item_.align && item_.focus === true) item_.$obj.focus();
                });
                return _cfg;
            } // end func

            /*----------------------------------------------
            * @desc event registered object
            ----------------------------------------------*/
            _act.reg_event = function(evt_) {
                if (_debug) console.log('method.reg_event');
                reg_evt = evt_;
                _evt.bind_event();
            } // end func



            /*----------------------------------------------
            * @desc
            ----------------------------------------------*/
            _act.loading = function() {
                if (_debug) console.log('method.loading');
                $(_self).children().remove();
                $(_self).append('<tr><td class="center" colspan="'+_act.column_cnt+'" style="height: 50vh"><img src="//cdn.cre-it.com/dx/img/loading/ajax-loader.gif" /></td></tr>');
            } // end func





            /*----------------------------------------------
            * @desc draw row
            ----------------------------------------------*/
            _act.draw_row = function(data_) {
                _act.loading();

                _$tr = {};      // 변수 초기화
                var html = '',  tmp = '', key = '';
                $.each(data_, function (idx1_, row_) {
                    key = '';
                    tmp = '';
                    $.each(_cfg, function (idx2_, item_) {
                        if (item_.hidden && item_.hidden == true)
                            return true;
        //                row_[item_.id] = $global['phpjs'].html_entity_decode(row_[item_.id]);
                        if (item_.key && item_.key === true) {
                            key += ' data-'+item_.id+'="'+row_[item_.id]+'"';
                        }

                        if (item_.type == 'seq') {  // sequency calc
                            tmp += item_.template.replace(/❦value❦/, row_['iseq']);
                        } else
                            tmp += item_.template.replace(/❦value❦/, row_[item_.id]);
                    });

                    if (tmp)
                        html += '<tr'+key+' tabindex="'+idx1_+'">'+tmp+'</tr>';
                });
                setTimeout(function() {
                    $(_self).children().remove();
                    $(_self).append(html);
                    _evt.bind_event();
                    setTimeout(function() {
                        if (Object.keys(_$tr).length > 0)
                            $(_$tr[0]).select().focus().click();
                    }, _timer);
                }, draw_timer);
            } // end func

            /*----------------------------------------------
            * @desc get key row
            ----------------------------------------------*/
            _act.get_key_row = function(evt_) {
                var param = {};
                var $row = $(evt_.currentTarget);
                $.each(_cfg, function (idx_, item_) {
                    if (item_.key && item_.key == true) {
                        param[item_.id] = $row.data(item_.id);
                    }
                });
                return param;
            } // end func

            // ###############################################################################################
            // @desc event
            // ###############################################################################################
            _evt.keypress_text = function(evt_) {
                if (_debug) console.log('event.keypress_text');
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        evt_.currentTarget.value = $.trim(evt_.currentTarget.value);
                        if (evt_.currentTarget.value == '') {
                            alertBox.show('알림', '필수입니다 ('+evt_.data.item.text+') keypress_text', function(){evt_.currentTarget.focus();});
                            return false;;
                        }
                    }
                    if (evt_.data.item.next)
                        $('#'+evt_.data.prefix+evt_.data.item.next).focus();
                }
            } // end func

            _evt.change_select = function(evt_) {
                if (_debug) console.log('event.change_select');
                if (evt_.keyCode == 13 && evt_.data.item.next) {
                    $('#'+evt_.data.item.next).focus();
                }
            } // end func

            _evt.keypress_button = function(evt_) {
                if (_debug) console.log('event.keypress_button');
                if (evt_.keyCode == 13 && evt_.data.item.next) {
                    $('#'+evt_.data.item.next).focus();
                }
            } // end func

            /*----------------------------------------------
            * @desc button clicked
            ----------------------------------------------*/
            _evt.click_button = function(evt_) {
                if (_debug) console.log('event.click_button');
                evt_.data.item.click(evt_, evt_.data.item);
            } // end func

            _evt.submit = function(param_) {
                if (_debug) console.log('event.submit');
                var result = $global['util'].submit_post(param_.act, param_.data);
                if (result == undefined) {
                    throw '결과값 오류입니다';
//                    return false;
                }
                if (result.result == false) {
                    alertBox.show('알림', result.msg);
                }
                return result;
            } // end func

            /*----------------------------------------------
            * @desc row event bind
            ----------------------------------------------*/
            _evt.bind_event = function() {
                if (_debug) console.log('event.bind_event');
                if (Object.keys(_$tr).length == 0)
                    _$tr = $(_self).children('tr');
/**
//                $(document).on('keydown', function(evt_) {
                $(':focus').on('keydown', function(evt_) {
                    if (evt_.keyCode > 111 && evt_.keyCode < 124) { // F1 ~ F12
                        switch (evt_.keyCode) {
                            case 113:   // F2
                                evt_.preventDefault();   // 기본 이벤트 취소
                                reg_evt.btn_new(evt_, {'m':m});
                                break;
                            case 114:   // F3
                                evt_.preventDefault();   // 기본 이벤트 취소
                                reg_evt.btn_save(evt_, {'m':m});
                                break;
                            case 115:   // F4
                                evt_.preventDefault();   // 기본 이벤트 취소
                                reg_evt.btn_del(evt_, {'m':m});
                                break;
                            case 116:   // F5
                                evt_.preventDefault();   // 기본 이벤트 취소
                                reg_evt.btn_search(evt_, {'m':m});
                                break;
                        }
                    }

                    if (Object.keys(_$tr).length > 0) {
                        _$tr.on('keydown', function(evt_) {
                            if (typeof reg_evt.rowclick != 'function' && typeof reg_evt.rowdblclick != 'function')
                                return;

                            if (evt_.keyCode == 13) {
                                switch (evt_.currentTarget.nodeName) {
                                    case 'TR':
                                        reg_evt.rowenter(evt_, {'m':m});
                                        return true;
                                        break;
                                }
                            } else if (evt_.keyCode == 38 || evt_.keyCode == 40) { // ↑ ↓
                                            evt_.preventDefault();   // 기본 이벤트 취소

                                $.each(_$tr, function (idx_, row_) {
                                    if ($(row_).hasClass('clicked') === true) {
                                        if (evt_.keyCode == 38) {    // 첫번째 행인지 검사
//                                            evt_.preventDefault();   // 기본 이벤트 취소
                                            if (idx_ == 0) {
                                                alertBox.show('알림', '첫번째 행입니다');

                                                return false;   // break;
                                            } else {
                                                $(_$tr[idx_-1]).select().focus().click();
                                                return false;   // break;
                                            }
                                        } else if (evt_.keyCode == 40) {     // 마지막 행인지 검사
//                                            evt_.preventDefault();   // 기본 이벤트 취소
                                            if (_$tr.length - 1 == idx_) {
                                                alertBox.show('알림', '마지막 행입니다');

                                                return false;   // break;
                                            } else {
                                                $(_$tr[idx_+1]).select().focus().click();
                                                return false;   // break;
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
**/

                _$tr.on('keypress', function(evt_) {
                    if (evt_.keyCode == 13) {
                        switch (evt_.currentTarget.nodeName) {
                            case 'TR':
                                reg_evt.rowenter(evt_, {'m':m});
                                return true;
                                break;
                        }
                    }
                });

                _$tr.on('click', function(evt_) {
                    clicks++;  //count clicks
                    if(clicks === 1) {
                        if (typeof reg_evt.rowclick != 'function')
                            return;
                        _$tr.removeClass('dx_active');
                        $(evt_.currentTarget).addClass('dx_active');
                        timer = setTimeout(function() {
                            clicks = 0;
                            reg_evt.rowclick(evt_, {'m':m})
                        }, DELAY);
                    } else {
                        if (typeof reg_evt.rowdblclick != 'function')
                            return;

                        _$tr.removeClass('dx_active');
                        $(evt_.currentTarget).addClass('dx_active');
                        clearTimeout(timer);
                        clicks = 0;
                        reg_evt.rowdblclick(evt_, {'m':m})
//                        _$tr.trigger('rowdblclick', [{b:2}, 33]);
                    }
                })
                .on('dblclick', function(evt_){
                    evt_.preventDefault();
                });
            } // end func

            // ###############################################################################################
            // @desc initialize
            // ###############################################################################################
            if (debug_ === true) _debug = true;
            _self = this;
            _act.init();

            this.dx_grid = _act.dx_grid
            return this;
        } // end func
    }
    $.fn.dx_grid = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);
// $('<span></span>').module_11_1(mod_);

