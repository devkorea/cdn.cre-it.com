
/*******************************************************************************************************
1. Plugin       : Grid
2. Plugin Desc  :
3. Create Date  : 2018-03-23
4. Create User  : koreaERP@gmail.com
5. Dependency   : $global['h'], $global['wrap_body']
6. Execute Test :
*******************************************************************************************************/
;(function ($) {
    'use strict';
    var methods = {
        init: function (m_, debug_) {
            var _act = {}, _evt = {}, m = m_, _self = null, _debug = false, _timer = 100;
            var _$tab = {}, _$btn = {};


            var _mod = [-1,{},{},{},{},{},{},{}];
//            var _form = {}, _grid = {}, _srch = {}, _page = {};
//            var _$tab = {}, _$form = {}, _$grid = {}, _$srch = {}, _$page = {};






            var reg_evt = {};
            var version = '0.0.0.2';


            // ###############################################################################################
            // @desc public
            // ###############################################################################################
            /*----------------------------------------------
            * @desc event parse / 외부 인터페이스
            ----------------------------------------------*/
            _act.dx_tab = function(evt_, data_) {
                switch (evt_) {
                    case 'move':
                    case 'tabclick': _act.tabclick(data_); break;
                    case 'is_active': return _act.is_active(data_); break;
                    case 'reg': return _act.reg(data_); break;
                    case 'reg_event': _act.reg_event(data_); break;
                }
            } // end func

            /*----------------------------------------------
            * @desc initialize
            ----------------------------------------------*/
            _act.init = function() {
                if (_debug) console.log('method.init');
                _act.$mode = $('#'+m_+'mode');      // 활성탭을 구분해 줄 객체

                _$btn = _self.children().find('a');    // 탭 버튼
                if (x1_theme == 'boot')
                    _$tab = _self.children().find('div.tab-pane');  // 탭 컨텐츠
                else if (x1_theme == 'ui')
                    _$tab = _self.find('div.tab-pane');  // 탭 컨텐츠

                $.each(_$tab, function (idx_, item_) {
//                    $(item_).data('obj', {});
                    $(item_).data('logos', {});
//                  console.log(idx_, item_);
                });

//console.error(_$tab);

                _$btn.on('click', _evt.btn_click);
                _evt.resize();
                $(window).resize(function() {
                    _evt.resize();
                });

                if (x1_theme == 'ui') {
                    $(_self).tabs();
                    _act.$mode.val('tab'+m_+((_self.tabs('option', 'active') + 1)));

//console.error((_self.tabs('option', 'active')));


//                    $(_self).tabs({
//                      active: _self.tabs('option', 'active')
//                    });
//                    $(_self).tabs({
//                      active: 0
//                    });
//                    setTimeout(function() {
                        $(_self).tabs({show:{ effect:'blind', duration: 800}});
                        _mod[0] = _self.tabs('option', 'active') + 1;       // 현재 active 된 탭 인덱스
console.info('active tab idx ' + _mod[0]);
//                        $(_self).show();
//                        _act.find_active(); // active tab id 를 찾아둔다
//console.info(_act.$mode);
//                        setTimeout(function() {
//                            _self.select().focus();
//                        }, 0);

//                    }, 500);
                } else {
alert('cx_form._act.init -> bootstrap 구현하세요');
                }
            } // end func

//            /*----------------------------------------------
//            * @desc find active tab
//            ----------------------------------------------*/
//            _act.find_active = function() {
////                _act.$mode.val('tab'+m_+(_self.tabs('option', 'active') +1));
//            } // end func


            /*----------------------------------------------
            * @desc event registered
            ----------------------------------------------*/
            _act.reg = function(param_) {
                if (_debug) console.log('method.reg');
                if (_obj[param_.m] == undefined) {
                    _obj[param_.m] = {};
//                    $(_$tab[param_.tab-1]).data('obj', {});
                }

                if (_obj[param_.m][param_.type] == undefined) {
                    _obj[param_.m][param_.type] = {};
//                    $(_$tab[param_.tab-1]).data('obj', {});
                }

//console.info('get_focus');
//param_.obj.dx_form('get_focus');
                _obj[param_.m][param_.type] = param_;
                 $(_$tab[param_.tab-1]).data('obj', _obj[param_.m]);

//                $.each(_$tab, function (idx_, item_) {
//                    console.info($(item_).attr('id'));
////                    console.error($(item_).logos);
////                  console.log(idx_, $(item_).data('logos'));
//                });

//console.info(_$tab);
console.info(param_.m);
//_obj[param_.m] =
//                if (Object.keys(_obj[param_.m]).length == 0)
//
//                if (_obj.length == 0) {
//                    console.error('여기했다');
//                    _obj[param_.m] = [];
//                }

//_obj = {'a':param_};

//                _obj[param_.m]
//                _obj[param_.m][param_.type] = {};
//                _obj[param_.m] = param_;
//console.error(param_.m, _obj);
//                reg_evt = evt_;
//                _evt.bind_event();
            } // end func

            /*----------------------------------------------
            * @desc register event
            ----------------------------------------------*/
            _act.reg_event = function(evt_) {
                if (_debug) console.log('method.reg_event');
                reg_evt = evt_;
            } // end func


            /*----------------------------------------------
            * @desc is active
            ----------------------------------------------*/
            _act.is_active = function(idx_) {
                if (_debug) console.log('method.is_active');
                var tmp = 'active';
                if (x1_theme == 'boot')
                    return $('#tab'+m+idx_).hasClass(tmp);
                else if (x1_theme == 'ui')
                    return (_self.tabs('option', 'active') +1) == idx_;
            } // end func

            /*----------------------------------------------
            * @desc tab click
            ----------------------------------------------*/
            _act.tabclick = function(param_) {
                if (_debug) console.log('method.tabclick');
                if (typeof param_ == 'number') {
                    _$btn[param_-1].click();
                } else {
                    _$btn[param_.tabindex-1].click();
                }
            } // end func


            // ###############################################################################################
            // @desc event
            // ###############################################################################################
            /*----------------------------------------------
            * @desc resize
            ----------------------------------------------*/
            _evt.resize = function() {
//                return;
                if (_debug) console.log('event.resize');
                $global['h'] = $(window).height();
                if ($global['h'] < 750) // 필요이상으로 줄어들면 처리하지 않음
                    return;
                $global['wrap_body'].css('height', $global['h'] - 50);
                _$tab.css('height', $global['h'] - 250);
            } // end func


            /*----------------------------------------------
            * @desc tab click
            ----------------------------------------------*/
            _evt.btn_click = function(evt_) {
                if (_debug) console.log('event.btn_click');

//                $.each(_$tab, function (idx_, item_) {
//                  console.log(idx_, $(item_).data('obj'));
//                });
//                 $(_$tab[param_.tab-1]).data('obj', _obj[param_.m]);

                $.each(_$btn, function (idx_, item_) {
                    if (evt_.currentTarget == item_) {
                        _act.$mode.val('tab'+m_+(idx_ + 1));
                        $(_$btn[idx_]).blur();
                        $(_$tab[idx_]).focus();
                        _mod[0] = idx_ + 1;       // 현재 active 된 탭 인덱스


_evt.__focus(_mod[idx_+1].focus.item);
//console.error(_mod[idx_+1].focus.item);


//console.info(11, $(_$tab[idx_]).data('obj').form.obj.dx_form('get_focus'), $(_$tab[idx_]).data('obj'));
//console.info(11, $(_$tab[idx_]).data('obj').dx_form('get_focus'), $(_$tab[idx_]).data('obj'));
//                        now_focus
//                        $(_$tab[idx_]).css('background', '#f00');
//console.error(_$tab[idx_]);
//                        setTimeout(function() { // 활성탭 하위에서 active row 활성화
//                            var $tmp = $('div.active').find('.dx_active');
//                            if ($tmp.length > 0) {
//        //                        $tmp.focus();
//                            }
//                        }, _timer);


//console.error('btn_click ', (idx_ + 1), _act.$mode);

//                        _act.find_active(); // active tab id 를 찾아둔다

                        return false;
                    }
                });
            } // end func

            /*----------------------------------------------
            * @desc focus
            ----------------------------------------------*/
            _evt.__focus = function(paramItem_, caller) {
                if (paramItem_ == undefined || paramItem_.type == undefined) {
                    console.error('dx_tab._evt.__focus ', 'undefined focus item ', paramItem_);
                    return;
                }
                if (paramItem_.type == 'hidden' || (paramItem_.$obj[0] !== undefined && paramItem_.$obj[0].type == 'hidden'))
                    return false;
                if (paramItem_.$obj.length < 1) {
                    return false;
                }


                var t = setTimeout(function() {
                //_tab[midx_][prefix_]['focus'] = {'idx':midx_, 'm':prefix_, 'id':paramItem_.id};    // 현재의 포커스 객체를 할당
                //console.info('paramItem_', _tab[midx_][prefix_]['focus']);
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
                }, 0);



            } // end event







            // ###############################################################################################
            // @desc initialize
            // ###############################################################################################
            if (debug_ === true) _debug = true;
            _self = this;
            _act.init();

            this.dx_tab = _act.dx_tab;
            this.mod = _mod;    // 외부 참조는 이값에서 참조하게 되므로 삭제금지

            return this;
        } // end func
    }
    $.fn.dx_tab = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);

