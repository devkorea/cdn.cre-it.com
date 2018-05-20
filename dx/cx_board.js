
;(function ($) {
    'use strict';
    var methods = {
        init: function (mod_) {
            var _self = null, _act = {}, _evt = {}, _mod = {}, _url = {};
            var _form = [], _btn = [], _com = {};
            var _cmt = {};
            var version = '0.0.0.2';

            // ###############################################################################################
            // @desc method
            // ###############################################################################################

            /*----------------------------------------------
            * @desc initialize
            ----------------------------------------------*/
            _act.init = function() {
                _mod = mod_;
                _btn = [
                          {type:'button',   id:'btn_new',       text:'신규', click:_evt.btn_new}
                        , {type:'button',   id:'btn_save',      text:'저장', click:_evt.btn_save}
                        , {type:'button',   id:'btn_del',       text:'삭제', click:_evt.btn_del}
                        , {type:'button',   id:'btn_search',    text:'조회', click:_evt.btn_search}
                        , {type:'button',   id:'btn_modify',    text:'수정', click:_evt.btn_modify}
                        , {type:'button',   id:'btn_list',      text:'목록', click:_evt.btn_list}
                        , {type:'button',   id:'con_modify',    text:'수정', click:_evt.con_modify}];

                _form = [
                          {type:'hidden',   id:'act',           text:'act'}
//                        , {type:'hidden',   id:'mode',          text:'mode'}
                        , {type:'hidden',   id:'p',             text:'테이블', value:_mod.cf_table, url:true}
                        , {type:'hidden',   id:'b',             text:'게시판', value:1, url:true}
                        , {type:'hidden',   id:'w',             text:'쓰기',   value:'w', url:true}
                        , {type:'select',   id:'scol',          text:'검색', focus:true, url:true}
                        , {type:'text',     id:'stxt',          text:'검색어', need:true, next:'btn_search', url:true}
                        , {type:'select',   id:'irows',         text:'Rows', value:mod_.rows, url:true}
                        , {type:'int',      id:'page',          text:'page', url:true}

                        , {type:'hidden',   id:'cf_table',      text:'테이블', value:mod_.cf_table}
                        , {type:'hidden',   id:'bo_pid',        text:'부모코드',  readonly:true, value:0}
                        , {type:'hidden',   id:'bo_is_reply',   text:'답변여부',  readonly:true, value:0}
                        , {type:'hidden',   id:'bo_is_comment', text:'코멘트여부',readonly:true, value:0}
                        , {type:'hidden',   id:'bo_reply',      text:'답변깊이',  readonly:true, value:''}
                        , {type:'hidden',   id:'bo_id',         text:'코드',      readonly:true, value:0}
                        , {type:'select',   id:'bo_cate',       text:'분류',      need:true, next:'bo_subject', url:true, focus:true}
                        , {type:'text',     id:'bo_subject',    text:'제목',      need:true, next:'bo_content', align:'left'}
                        , {type:'textarea', id:'bo_content',    text:'내용',      need:true, next:'bo_link1', align:'left'}
                        , {type:'text',     id:'bo_link1',      text:'링크1',     next:'bo_link2', align:'left'}
                        , {type:'text',     id:'bo_link2',      text:'링크2',     next:'btn_save', align:'left'}
                        , {type:'checkbox', id:'bf_no',         text:'파일삭제',  multi:true}
                        , {type:'file',     id:'bf_file',       text:'첨부파일',  multi:true}

                        , {type:'label',    id:'mb_id',         text:'입력자',  value:x1_mb_name}
                        , {type:'label',    id:'bo_date',       text:'입력일',  value:x1_ymd}
                        , {type:'label',    id:'bo_ip',         text:'IP',      value:x1_ip}];


                _cmt = {    // 코멘트
                        'con_write':    {type:'button',     multi:true, text:'수정', click:_evt.con_write},
                        'con_del':      {type:'button',     multi:true, text:'삭제', click:_evt.con_del},
                        'con_cancel':   {type:'button',     multi:true, text:'취소', click:_evt.con_cancel},
                        'con_modify':   {type:'button',     multi:true, text:'저장', click:_evt.con_modify},
                        'con_div':      {type:'div',        multi:true, text:'기존코멘트'},
                        'cmt_box':      {type:'td',         multi:false, text:'코멘트Box'},
                        'cmt_save':     {type:'button',     multi:false, text:'저장', click:_evt.cmt_save},
                        'cmt_content':  {type:'textarea',   multi:false, text:'코멘트'}
                        };

                _act.set_config(mod_.m, _btn);
                _act.set_config(mod_.m, _form);
                _act.set_comment(mod_.m, _cmt);
            } // end func


            /*----------------------------------------------
            * @desc initialize
            ----------------------------------------------*/
            _act.set_comment = function(m, cfg_) {
                $.each(cfg_, function (key_, item_) {
                    if (item_.multi == true) {
                        if (item_.type == 'button') {
                            item_.$obj = $('button[name="'+m+key_+'"]');
                            item_.$obj.on('click', {item:item_}, item_.click);
                        } else if (item_.type == 'div') {
                            item_.$obj = $('div[name="'+m+key_+'"]');
                        }
                    } else {
                        item_.$obj = $('#'+m+key_);
                        if (item_.click)
                            item_.$obj.on('click', {item:item_}, item_.click);
                    }
                });
            } // end func

            /*----------------------------------------------
            * @desc initialize
            ----------------------------------------------*/
            _act.set_config = function(m, cfg_) {
                $.each(cfg_, function (idx_, item_) {
                    if (item_.multi && item_.multi == true) {
                        if (item_.type == 'button') {
                            item_.$obj = $('button[name="'+m+item_.id+'"]');
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


                    if (item_.$obj.length > 0 && item_.url && item_.url === true) {
                        if (item_.value && item_.value != '')
                            _url[item_.id] = item_.value;
                        else
                            _url[item_.id] = item_.$obj.val();
                    }

                    if (item_.align && item_.align != '') {
                        item_.$obj.css('text-align', item_.align);
                    }

                    item_.$obj.prop('name', item_.id);

                    // 이벤트 바인딩 (keypress)
                    switch (item_.type) {
                        case 'button':
                                item_.m = m;     // 버튼클릭시 어느탭의 버튼을 클릭했는지의 구분값
//                                item_.$obj.on('keypress', {item:item_}, _evt.keypress_button);
                                item_.$obj.on('click', {item:item_}, item_.click);
                            break;
                        case 'select':
                            if (x1_theme == 'ui') {
                                if (item_.$obj.attr('width') == undefined || item_.$obj.attr('width') == '0')
                                    item_.$obj.attr('width', '100%');
                                item_.$obj.selectmenu({width : item_.$obj.attr('width')});

//                                item_.$obj.selectmenu({width : item_.$obj.attr('width') != undefined ? item_.$obj.attr('width') : '95%'});
                                item_.$ui = $('#'+m+item_.id+'-button');
                                item_.$ui.on('keydown', {prefix:m, item:item_}, _evt.keydown_select);
                                item_.$obj.selectmenu('refresh');
                            } else {
                                item_.$obj.on('keydown', {prefix:m, item:item_}, _evt.keydown_select);
//                                item_.$obj.on('change', {prefix:m, item:item_}, _evt.change_select);
//                                item_.$obj.on('blur', {prefix:m, item:item_}, _evt.blur_select);
                            }

//console.info(item_.$obj.children('.ui-selectmenu-button'));
//                                item_.$obj.selectmenu({width : item_.$obj.attr('width')});
//                                item_.$obj.on('keydown', {item:item_}, _evt.keydown_select);
//                                item_.$obj.on('change', {item:item_}, _evt.change_select);
//                                item_.$obj.on('blur', {item:item_}, _evt.blur_select);

                            break;
                        case 'text':
                            if (item_.mask && item_.mask != '') {
                                item_.$obj.prop('placeholder', item_.mask);
                            } else {
                                item_.$obj.prop('placeholder', item_.text);
                            }

                            if (item_.next) {
                                item_.$obj.on('keypress', {item:item_}, _evt.keypress_text);
                            }
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
                            break;
                        case 'textarea':
                            if (item_.$obj.length > 0) {
                                item_.$obj.prop('placeholder', item_.text);
                                var lines = item_.$obj.val().split('\n').length;
                                if (lines > 2)
                                    item_.$obj.css({'height': (lines*20) +'px'});
                            }
                            break;
                    }
                    if (item_.mask && item_.mask != '') {
                        item_.$obj.data('mask', item_.mask);
                        item_.$obj.mask(item_.mask);
                    }

                    _evt.__focus(item_, 100);
                });

                return cfg_;
            } // end func

            /*----------------------------------------------
            * @desc reset 폼
            ----------------------------------------------*/
            _act.reset_form = function(cfg_) {
                $.each(cfg_, function (idx_, item_) {
                    if (item_.type == 'hidden' || item_.$obj.length < 1) return true;
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
                        else if (item_.type == 'text')
                            item_.$obj.val('');
                        else if (item_.type == 'select') {
                            item_.$obj.val(item_.value);
                            item_.$obj.selectmenu('refresh');
//                            item_.$obj.children('option:eq(0)').prop('selected', 'selected');
                        }

                    if (item_.readonly && item_.readonly === true) item_.$obj.prop('readonly', true);
                    _evt.__focus(item_, 100);
                });
            } // end func

            _act.url = function(exit_) {
                var url = '', flag = true;
                $.each(_form, function (key_, item_) {
                    if (item_.$obj.length > 0 && item_.url && item_.url === true) {
                        if (exit_ !== undefined && exit_.length > 0) {
                            flag = true;
                            $.each(exit_, function (idx_, out_) {   // 제외변수를 확인
                                if (item_.id == out_) {
                                    flag = false;
                                    return false;
                                }
                            });
                        }
                        if (flag == false)
                            return true;
                        if (!url) url = '?';
                        else url += '&';
                        url += item_.id + '=' + item_.$obj.val();
                    }
                });
                return url;
            } // end func

            /*----------------------------------------------
            * @desc get data
            ----------------------------------------------*/
            _act.get_data = function(cfg_) {
                var param = {};
                $.each(cfg_, function (idx_, item_) {
                    if (item_.$obj.length < 1) return true;
                    if (item_.multi && item_.multi == true) {
                        param[item_.id] = [];
                        for (var i=0; i<item_.$obj.length; i++) {
                            switch (item_.type) {
                                case 'file':
                                        param[item_.id][i] = '';
                                    break;
                                case 'checkbox':
                                case 'radio':
                                    if (item_.$obj[i].checked == true)
                                        param[item_.id][i] = $.trim($(item_.$obj[i]).val());
                                    else
                                        param[item_.id][i] = '';
                                    break;
                                case 'date':
                                case 'hidden':
                                case 'select':
                                case 'text':
                                case 'textarea':
                                    param[item_.id][i] = $.trim($(item_.$obj[i]).val());
                                    break;
                                case 'int':
                                case 'number':
                                    param[item_.id][i] = parseInt($.trim($(item_.$obj[i]).val()), 10);
                                    break;
                                case 'double':
                                case 'float':
                                    param[item_.id][i] = parseFloat($.trim($(item_.$obj[i]).val()));
                                    break;
                            }
                        }
                    } else {
                        switch (item_.type) {
                            case 'date':
                            case 'hidden':
                            case 'select':
                            case 'text':
                            case 'textarea':
                                param[item_.id] = $.trim(item_.$obj.val());
                                break;
                            case 'int':
                            case 'number':
                                param[item_.id] = parseInt($.trim(item_.$obj.val()), 10);
                                break;
                            case 'double':
                            case 'float':
                                param[item_.id] = parseFloat($.trim(item_.$obj.val()));
                                break;
                        }
                    }
                });
                if (Object.keys(param).length == 0) {
                    alertBox.show('알림', '요청을 처리할 값이 하나도 없거나<br />조회된 데이터가 없습니다');
                    return false;
                }
                return param;
            } // end func

            // 코멘트 파라메타를 반환
            _act.get_cmt_param = function(evt_, act_) {
                var param = {};
                param['bo_pid'] = parseInt($(evt_.currentTarget).data('bo_pid'), 10);
                if (param['bo_pid'] < 1) {
                    alertBox.show('알림', '부모코드가 없으므로<br />코멘트를 작성할 수 없습니다', function(){document.location.reload();});
                    return false;
                }
                param['bo_id'] = parseInt($(evt_.currentTarget).data('bo_id'), 10);
                param['act'] = act_;
                return $.extend(param, _act.get_cmt_default(param));
            } // end event
            _act.get_cmt_default = function(param) {
                param['b'] = 1;
                param['p'] = _mod.m;
                param['cf_table'] = _mod.cf_table;
                param['bo_is_comment'] = 1;
                param['bo_is_reply'] = 0;
                param['bo_reply'] = '';
                param['bo_cate'] = '';
                param['bo_subject'] = '';
                param['bo_link1'] = '';
                param['bo_link2'] = '';
                param['bo_content'] = $.trim(_cmt['cmt_content'].$obj.val());
                return param;
            } // end func


            // ###############################################################################################
            // @desc event
            // ###############################################################################################
            _evt.btn_control = function(show_) {
                $.each(_btn, function (idx_, item_) {
                    if (show_ == true)
                        item_.$obj.css('visibility', 'visible');
                    else
                        item_.$obj.css('visibility', 'hidden');
                });
            } // end event

            _evt.btn_new = function(evt_) {
                document.location.href = x1_url + _act.url() + '&w=w';
            } // end event
            _evt.btn_save = function(evt_) {
                var param = _act.get_data(_form);
                if (!param['bo_cate']) {
                    alertBox.show('알림', '분류는 필수입니다', function(){ $('#'+_mod.m+'bo_cate').focus();});
                    return false;
                }
                if (!param['bo_subject']) {
                    alertBox.show('알림', '제목은 필수입니다', function(){ $('#'+_mod.m+'bo_subject').focus(); });
                    return false;
                }

                if (_mod.is_dhtml && _mod.editor) {
                    param['bo_content'] = CKEDITOR.instances[_mod.m+'bo_content'].getData();
                    if (!param['bo_content']) {
                        alertBox.show('알림', '내용은 필수입니다', function(){CKEDITOR.instances[_mod.m+'bo_content'].focus();});
                        return false;
                    }
                    $('#'+_mod.m+'bo_content').val(param['bo_content']);
                } else {
                    if (!param['bo_content']) {
                        alertBox.show('알림', '내용은 필수입니다', function(){ $('#'+_mod.m+'bo_content').focus(); });
                        return false;
                    }
                }

                $('#'+_mod.m+'act').val('save');
                _evt.btn_control(false);    // 버튼 감추기
                document.getElementById('frm_board').submit();
            } // end event
            _evt.btn_del = function(evt_) {
                if (_cmt['con_div'].$obj.length > 0) {
                    alertBox.show('알림', '코멘트가 있는 게시물은 삭제할 수 없습니다');
                    return false;
                }

                alertBox.show('알림', '게시물을 삭제하시겠습니까?', function() {
                    if (alertBox.getValue() == '예') {
                        var param = _act.get_data(_form);
                        $('#'+_mod.m+'act').val('del');
                        _evt.btn_control(false);    // 버튼 감추기
                        $('#frm_board').submit();
                    }
                }, '예|아니오', 2);
            } // end event
            _evt.btn_search = function(evt_) {
                var param = _act.get_data(_form);
                var url = x1_url + '/?p='+param['p']
                        + '&b='+param['b']
                        + '&bo_cate='+param['bo_cate']
                        + '&irows='+param['irows']
                        + '&page='+param['page']
                        + '&scol='+param['scol']
                        + '&stxt='+param['stxt'];
                document.location.href = url;
            } // end event
            _evt.btn_list = function(evt_) {
                document.location.href = x1_url + _act.url(['w']);
            } // end event
            _evt.btn_modify = function(evt_) {
                document.location.href = x1_url + _act.url() + '&w=w&bo_id='+$('#'+_mod.m+'bo_id').val();
            } // end event

            _evt.keypress_button = function(evt_) {

            } // end event

            _evt.keydown_select = function(evt_) {
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        if (!evt_.currentTarget.value) {
                            alertBox.show('알림', '필수입니다', function(){ _evt.__focus(evt_.data.item); /*evt_.currentTarget.focus();*/});
                            return false;
                        }
                    }
                    if (evt_.data.item.next) {
                        _evt.__focus(evt_.data.item.next);
//                        $('#'+_mod.m+evt_.data.item.next).focus();
                    }
                }
            } // end event

            _evt.change_select = function(evt_) {
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.next) {
                        _evt.__focus(evt_.data.item.next);
//                        $('#'+_mod.m+evt_.data.item.next).focus();
                    }
                }
            } // end event

            _evt.blur_select = function(evt_) {

            } // end event

            _evt.keypress_text = function(evt_) {
                if (evt_.keyCode == 13) {
                    if (evt_.data.item.need && evt_.data.item.need == true) {
                        evt_.currentTarget.value = $.trim(evt_.currentTarget.value);
                        if (evt_.currentTarget.value == '') {
                            alertBox.show('알림', '필수입니다', function(){ _evt.__focus(evt_.data.item); /*evt_.currentTarget.focus();*/});
                            return false;
                        }
                    }
                    if (evt_.data.item.next) {
                        _evt.__focus(evt_.data.item.next);
//                        $('#'+_mod.m+evt_.data.item.next).focus();
                    }
                }
            } // end event

            // 코멘트 수정 코어
            _evt.con_write_core = function(evt_) {
                var param = _act.get_cmt_param(evt_, 'get_comment');
                var result = $global['util'].submit_post(_mod.act, param);
                if (result.result == false) {
                    alertBox.show('알림', result.msg);
                } else {
                    for (var i=0; i<_cmt['con_write'].$obj.length; i++) {
                        if (evt_.currentTarget == _cmt['con_write'].$obj[i]) {
                            _cmt['cmt_content'].$obj.val(result.data[0]['bo_content']);
                            $(_cmt['con_div'].$obj[i]).html(_cmt['cmt_content'].$obj);
                            _cmt['cmt_save'].$obj.hide();
                            $(_cmt['con_write'].$obj[i]).hide();
                            $(_cmt['con_del'].$obj[i]).hide();
                            $(_cmt['con_modify'].$obj[i]).show();
                            $(_cmt['con_cancel'].$obj[i]).show();
//                            _evt.__focus(evt_.data.item.next);
                            _cmt['cmt_content'].$obj.focus();
                        }
                    }
                }
            } // end event
            // 코멘트 수정으로 이동
            _evt.con_write = function(evt_) {
                // 기존에 수정중이던 것 부터 정리
                var flag = true;
                for (var i=0; i<_cmt['con_write'].$obj.length; i++) {
                    if ($(_cmt['con_cancel'].$obj[i]).css('display') == 'inline-block') {
                        flag = false;
                        alertBox.show('알림', '수정중이던 코멘트를 취소하시겠습니까?', function() {
                            if (alertBox.getValue() == '예') {
                                $(_cmt['con_cancel'].$obj[i]).click();
                                _evt.con_write_core(evt_);
                            } else {
                                _cmt['cmt_content'].$obj.focus(); // 수정중이든 아니든 현재 코멘트영역에 포커싱
                            }
                        }, '예|아니오', 2);
                        return false;
                    }
                }
                if (flag)   // 수정중이던것이 있으면 처리안함
                    _evt.con_write_core(evt_);

            } // end event
            // 코멘트 삭제
            _evt.con_del = function(evt_) {
                var param = _act.get_cmt_param(evt_, 'del_comment');
                if (!param['bo_id']) {
                    alertBox.show('알림', '필수입니다', function(){document.location.reload();});
                    return false;
                }
                alertBox.show('알림', '코멘트를 삭제하시겠습니까?', function() {
                    if (alertBox.getValue() == '예') {
                        var result = $global['util'].submit_post(_mod.act, param);
                        if (result.result == false) {
                            alertBox.show('알림', result.msg);
                        } else {    // 여러 처리 필요없이 새로고침
                            document.location.reload();
                        }
                    }
                }, '예|아니오', 2);
            } // end event
            // 코멘트 수정
            _evt.con_modify = function(evt_) {
                var param = _act.get_cmt_param(evt_, 'save_comment');
                if (!param['bo_content']) {
                    alertBox.show('알림', '코멘트를 입력하세요', function(){_cmt['content'].focus();});
                    return false;
                }
                if (!param['bo_id']) {
                    alertBox.show('알림', '코멘트를 수정할 수 없습니다', function(){document.location.reload();});
                    return false;
                }
                alertBox.show('알림', '코멘트를 수정하시겠습니까?', function() {
                    if (alertBox.getValue() == '예') {
                        var result = $global['util'].submit_post(_mod.act, param);
                        if (result.result == false) {
                            alertBox.show('알림', result.msg);
                        } else {
                            param['bo_content'] = param['bo_content'].replace(/\n/g, '<br />');
                            for (var i=0; i<_cmt['con_modify'].$obj.length; i++) {
                                if (evt_.currentTarget == _cmt['con_modify'].$obj[i]) {
                                    $(_cmt['con_div'].$obj[i]).data('content', param['bo_content']);
                                    $(_cmt['con_div'].$obj[i]).html(param['bo_content']);
                                    $(_cmt['con_cancel'].$obj[i]).click();
                                    return;
                                }
                            }
                        }
                    }
                }, '예|아니오', 2);
            } // end event
            _evt.cmt_save = function(evt_) {
                var param = {};
                param['bo_pid'] = parseInt($('#'+_mod.m+'bo_id').val(), 10);
                if (param['bo_pid'] < 1) {
                    alertBox.show('알림', '부모코드가 없으므로<br />코멘트를 작성할 수 없습니다', function(){document.location.reload();});
                    return false;
                }
                param['bo_id'] = 0;
                $.extend(param, _act.get_cmt_default(param));
                alertBox.show('알림', '코멘트를 저장하시겠습니까?', function() {
                    if (alertBox.getValue() == '예') {
                        param['act'] = 'save_comment';
                        var result = $global['util'].submit_debug(_mod.act, param);
                        if (result.result == false) {
                            alertBox.show('알림', result.msg);
                        } else {    // 여러 처리 필요없이 새로고침
                            document.location.reload();
                        }
                    }
                }, '예|아니오', 2);
            } // end event
            // 코멘트 수정 취소
            _evt.con_cancel = function(evt_) {
                var param = {};
                param['bo_pid'] = $(evt_.currentTarget).data('bo_pid');
                param['bo_id'] = 0;
                param['bo_content'] = '';
                for (var i=0; i<_cmt['con_cancel'].$obj.length; i++) {
                    if (evt_.currentTarget == _cmt['con_cancel'].$obj[i]) {
                        $(_cmt['con_write'].$obj[i]).show();
                        $(_cmt['con_del'].$obj[i]).show();
                        $(_cmt['con_modify'].$obj[i]).hide();
                        $(_cmt['con_cancel'].$obj[i]).hide();

                        $(_cmt['con_div'].$obj[i]).html($(_cmt['con_div'].$obj[i]).data('content'));
                        _cmt['cmt_content'].$obj.val('');
                        _cmt['cmt_box'].$obj.html(_cmt['cmt_content'].$obj);
                        _cmt['cmt_save'].$obj.show();
                        _cmt['cmt_content'].$obj.focus();
                        break;
                    }
                }
            } // end event

            /*----------------------------------------------
            * @desc focus
            ----------------------------------------------*/
            _evt.__focus = function(paramItem_, timer_) {
                if (timer_ == undefined)
                    timer_ = 0;

                if (typeof paramItem_ == 'string') {
                    $.each(_cfg, function (idx_, item_) {
                        if (paramItem_ == item_.id) {
                            setTimeout(function() {
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
                    setTimeout(function() {
                        if (paramItem_.focus && paramItem_.focus === true) {
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
                        }
                    }, timer_);
                }
            } // end event

            // ###############################################################################################
            // @desc initialize
            // ###############################################################################################
            _act.init();
            return this;
        } // end func
    }
    $.fn.cx_board = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);
