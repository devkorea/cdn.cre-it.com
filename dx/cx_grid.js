        (function(app_) {
    app_.widget('ui.cx_grid', {
        options: {
              debug: false

        },
        cfg: {},
        mod: {},
        modi: {},
        template: {},
        row: {},

// row 위 아래 치환기능 구현할 것 (2018-05-07)
        // https://www.google.co.kr/search?q=jquery+tr+up+down&oq=jquery+tr+up+down&aqs=chrome..69i57.5111j0j1&sourceid=chrome&ie=UTF-8
        //    $("tr:even").not(".even").addClass("even").removeClass("odd");
        //    $("tr:odd").not(".odd").addClass("odd").removeClass("even");
        // row move : http://jsfiddle.net/vaDkF/

// 전체 체크박스
// 저장표시여부
// No 기능
// Tree 기능
// 소계기능, 누계기능

        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        evt_click: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_grid.evt_click');
                //this._trigger('evt_click', 0, evt_);

//                if (this.options.cfg.multi == false) {
//                    switch (item_.type) {
//                    case 'label':
//                        item_.$obj.cx_label('evt_click', evt_, item_);
//                        break;
//                    case 'hidden':
//                        //item_.$obj.cx_hidden('evt_click', evt_, item_);
//                        break;
//                    case 'date':
//                        item_.$obj.cx_date('evt_click', evt_, item_);
//                        break;
//                    case 'int':
//                        item_.$obj.cx_int('evt_click', evt_, item_);
//                        break;
//                    case 'float':
//                        item_.$obj.cx_float('evt_click', evt_, item_);
//                        break;
//                    case 'radio':
//                        item_.$obj.cx_radio('evt_click', evt_, item_);
//                        break;
//                    case 'check':
//                        item_.$obj.cx_check('evt_click', evt_, item_);
//                        break;
//                    case 'text':
//                        item_.$obj.cx_text('evt_click', evt_, item_);
//                        break;
//                    case 'combo':
//                        item_.$obj.cx_combo('evt_click', evt_, item_);
//                        break;
//                    case 'button':
//                        item_.$obj.cx_button('evt_click', evt_, item_);
//                        break;
//                    case 'pop':
//                        item_.$obj.cx_pop('evt_click', evt_, item_);
//                        break;
//                    }
//                } else {
//
//                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.evt_click ■■■';
            }
        },  // cx_grid.evt_click
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        evt_keydown: function(evt_, item_) {
            try {
                if (this.options.debug) console.log('cx_grid.evt_keydown');
                this._trigger('evt_keydown', 0, evt_);
                if (this.options.cfg.multi == false) {
                    switch (evt_.keyCode) {
                    case 13:
                        if (item_.$next) {
                            switch (item_.next_type) {
                            case 'label':
                                item_.$next.cx_label('set_focus');
                                break;
                            case 'hidden':
                                //item_.$next.cx_hidden('set_focus');
                                break;
                            case 'date':
                                item_.$next.cx_date('set_focus');
                                break;
                            case 'int':
                                item_.$next.cx_int('set_focus');
                                break;
                            case 'float':
                                item_.$next.cx_float('set_focus');
                                break;
                            case 'radio':
                                item_.$next.cx_radio('set_focus');
                                break;
                            case 'check':
                                item_.$next.cx_check('set_focus');
                                break;
                            case 'text':
                                item_.$next.cx_text('set_focus');
                                break;
                            case 'combo':
                                item_.$next.cx_combo('set_focus');
                                break;
                            case 'button':
                                item_.$next.cx_button('set_focus');
                                break;
                            case 'pop':
                                item_.$next.cx_pop('set_focus');
                                break;
                            }
                        }
                    }
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.evt_keydown ■■■';
            }
        },  // cx_grid.evt_keydown

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        edit_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_grid.edit_keydown');
                this._trigger('keydown', 0, evt_);
                var _self = this, _tr = '', e = '';
                var _id = evt_.currentTarget.id;
                switch(evt_.keyCode) {
                case 13:
                    //_self.$row.cx_row('edit_keydown', evt_);
//                    if (typeof item.check == 'function') {
//                        _data = item.check(evt_, item, _data);
//                        if (_data == undefined || _data == false)   // 사용자가 취소하면 더 이상 진행안함
//                            return false;
//                    }
                    var _res = _self.$row.cx_row('check_value', _id);
                    if (_res != true) { // check_value = false 면 진행안함
                        app_.show_tip($(evt_.currentTarget), _res +' ('+_id+')');
                        return;
                    }

                    //if (_self.modi[_id].rowend) {
                    if (_self.$row.cx_row('get_rowend', _id)) {

                        _tr = $(evt_.currentTarget).closest('tr').next('tr');
                        if (_tr.length > 0) {
//                            console.error('다음 row Y');
                            _self.$row.cx_row('set_focused', null);
                            //_self.cfg.focused = null;
//                            e = jQuery.Event('click');
//                            _tr.trigger(e);
//                            _tr.trigger(e); // 더블클릭 효과를 위해 2번호출dbl
                            _tr.click();
                            _tr.click();    // 더블클릭 효과
                        } else {    // end of last row
//                            console.error('마지막 row');
                            _self.$row.cx_row('set_focused', null);
//                            _self.$row.cx_row('add_row');
                            _self.add_row();
                            //obj.focused = null;
                            //obj.add_row();
                            _tr = $(evt_.currentTarget).closest('tr').next('tr');
//                            e = jQuery.Event('click');
//                            _tr.trigger(e);
//                            _tr.trigger(e); // 더블클릭 효과를 위해 2번호출dbl
                            _tr.click();
                            _tr.click();    // 더블클릭 효과
                        }
                    } else {
                        _self.$row.cx_row('set_next_focused', _id);
                        //_self.$row.cx_row('set_focused', _self.$row.cx_row('get_next', _id));
                        //_self.$row.cx_row('set_focus'); // 각각의 폼객체로 포커싱 처리해야 할텐데..(2018-05-09)

                        //obj.focused = _self.modi[_self.modi[evt_.currentTarget.id].next].$edit;
                        //obj.focused.focus();
                    }
                    break;
                case 38:
                    _tr = $(evt_.currentTarget).closest('tr').prev('tr');
                    if (_tr.length > 0) {
//                        e = jQuery.Event('click');
//                        _tr.trigger(e);
//                        _tr.trigger(e); // 더블클릭 효과를 위해 2번호출
                        _tr.click();
                        _tr.click();    // 더블클릭 효과
                    }
                    break;
                case 40:
                    _tr = $(evt_.currentTarget).closest('tr').next('tr');
                    if (_tr.length > 0) {
//                        e = jQuery.Event('click');
//                        _tr.trigger(e);
//                        _tr.trigger(e); // 더블클릭 효과를 위해 2번호출
                        _tr.click();
                        _tr.click();    // 더블클릭 효과
                    } else {    // end of last row
                        //obj.add_row();
                        var _res = _self.$row.cx_row('check_value', _id);
                        if (_res != true) { // check_value = false 면 진행안함
                            app_.show_tip($(evt_.currentTarget), _res +' ('+_id+')');
                            return;
                        }


                        _self.add_row();
//                        _self.$row.cx_row('add_row');
                        _tr = $(evt_.currentTarget).closest('tr').next('tr');
                        _tr.click();
                        _tr.click();    // 더블클릭 효과

//                        e = jQuery.Event('click');
//                        _tr.trigger(e);
//                        _tr.trigger(e); // 더블클릭 효과를 위해 2번호출
                    }
                    break;
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.edit_keydown ■■■';
            }
        },  // cx_grid.edit_keydown
        ///*----------------------------------------------
        //* @cx_grid
        //* @returns  {void}
        //----------------------------------------------*/
        //edit_row: function(evt_, item_) {
        //    try {
        //        if (this.options.debug) console.log('cx_grid.edit_row');
        //        this._trigger('edit_row', 0, evt_);
        //        if (this.options.cfg.multi == true) {
        //
        //        }
        //    } catch(e) {
        //        console.error(e);
        //        throw '■■■ error: cx_grid.edit_row ■■■';
        //    }
        //},  // cx_grid.edit_row
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        row_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_grid.row_click');
                var _self = this, _param = {};
                //this._trigger('click', 0, evt_);

                //if (_self.cfg.edit == false) {
                //    _self.element.children('tr').removeClass('cx_active');    // addGrid=true 라면 편집중인 데이터 표시를 모두 초기화함(
                //    $(evt_.currentTarget).addClass('cx_active');
                //} else {
                //    _self.element.children('tr').removeClass('cx_edit');    // addGrid=true 라면 편집중인 데이터 표시를 모두 초기화함(
                //    $(evt_.currentTarget).addClass('cx_edit');
                //}
//console.error(33);
//console.error('cx_grid.row_click');
//console.error(this.row.rowdata);
//                console.error(evt_.currentTarget.rowIndex);

//                evt_.stopPropagation();    // 이벤트 버블 중지
//                evt_.preventDefault();     // 기본 이벤트 취소
//                evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
//console.error(this.cfg);
                //console.info('row_click', evt_.currentTarget.tabIndex);
//                if (this.cfg.addgrid == false)
//                    this.set_focus($tr[evt_.currentTarget.tabIndex], evt_);
                this.cfg.clicks++;  //count clicks
                if(this.cfg.clicks == 1) {  // 클릭됨(오직 row_click 만 호출함)
                    this.element.children('tr').removeClass('cx_active');
                    _self.cfg.row_index = evt_.currentTarget.rowIndex;   // 현재 선택된 rowindex
//console.error(evt_.currentTarget.rowIndex);
                    $(evt_.currentTarget).addClass('cx_active');
//                    evt_.stopImmediatePropagation();        // 현재 이벤트 버블 중지
                    this.cfg.timer = setTimeout(function() {
                        _self.cfg.clicks = 0;                     // 타이머 안에서 초기화

                        if (typeof _self.cfg.row_click == 'function') {
//                            if (_self.cfg.addgrid = true) {
//                                _self.element.children('tr').removeClass('cx_edit');    // addGrid=true 라면 편집중인 데이터 표시를 모두 초기화함(
//                                $(evt_.currentTarget).addClass('cx_edit');
//                            }
                            _self.cfg.row_click(evt_, _self.row.rowdata[evt_.currentTarget.rowIndex]);
                        }
                    }, this.cfg.times);
                } else {        // 더블클릭
                    clearTimeout(this.cfg.timer);
                    this.cfg.clicks = 0;
                    this.cfg.timer = null;
//                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
//console.error(evt_.currentTarget.rowIndex, this.row.rowdata[evt_.currentTarget.rowIndex].item_name);
                    if (typeof this.cfg.row_dblclick == 'function') {
//                        console.error(evt_.currentTarget.rowIndex);
//                        console.error(this.row.rowdata);
                        this.row.rowdata['rowindex'] = evt_.currentTarget.rowIndex;
                        _param = this.cfg.row_dblclick(evt_, this.row.rowdata[evt_.currentTarget.rowIndex]);
//                        this.row_popup_open(_param);     // 팝업 Grid 가 있다면 처리
                    }

                    if (_self.cfg.grid_type == 'edit_row') {
//console.error(333);
                        var _val = '', _rdo = -1, _stop = true;
                        // changing label mode
                        $.each(_self.row.tr, function (idx2_, row_) {
                            if (_stop == false) return false;
                            if ($(row_).data('edit') == true) {
                                if (row_.get(0) == evt_.currentTarget) {
                                    _stop = false;
                                    return false;
                                }
                                _param = _self.$row.cx_row('set_label', row_);
                                _self.row.rowdata[idx2_] = _param;   // 편집이 완료된 데이터도 반영
                                if (_param.rdo == true) {
                                    _rdo = idx2_;   // 라디오는 전체 row 에서 유일한 값이어야 함
                                }
                            }
                        });
                        if (_stop == false) return false;   // 동일한 row 일때는 처리하지 않음

                        // reset data of radio
                        if (_rdo > -1) {
                            $.each(_self.row.tr, function (idx2_, row_) {
                                if (_rdo == idx2_) return true;
                                $.each($(row_).children('td'), function (idx_, td_) {
                                    if (_self.mod[idx_].type == 'radio') {
                                        td_.innerText = '';
                                    }
                                });
                            });
                        }

                        // changing editing mode
                        if ($(this).data('edit') == true) return;
                        _self.$row.cx_row('set_edit', evt_.currentTarget);
                    }
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.row_click ■■■';
            }
        },  // cx_grid.row_click
        ///*----------------------------------------------
        //* @cx_grid
        //* @returns  {void}
        //----------------------------------------------*/
        //row_dblclick: function(evt_) {
        //    try {
        //        if (this.options.debug) console.log('cx_grid.row_dblclick');
        //        this._trigger('row_dblclick', 0, evt_);
        //        this.cfg.clicks = 0;    // 초기화
        //        this.cfg.timer = null;  // 초기화
        //    } catch(e) {
        //        console.error(e);
        //        throw '■■■ error: cx_grid.row_dblclick ■■■';
        //    }
        //},  // cx_grid.row_dblclick
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        row_keydown: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_grid.row_keydown');
                var _self = this;
                //this._trigger('keydown', 0, evt_);
                switch (evt_.keyCode) {
                case 13:
//console.error('cx_grid.row_keydown');
//                    console.error(evt_.currentTarget);
                    if (typeof this.cfg.row_enter == 'function') {
                        var _param = this.cfg.row_enter(evt_, this.row.rowdata[evt_.currentTarget.tabIndex]);
//                        this.row_popup_open(_param);     // 팝업 Grid 가 있다면 처리
                    }

//console.error('add_row??', this.cfg.row_count, evt_.currentTarget.tabIndex);
                    break;
                case 38:    // ▲
                case 40:    // ▼
                    //console.error($self.get(0).scrollHeight, $self.get(0).scrollTop, $self.get(0).clientHeight, $self.get(0).clientHeight / $tr.length);
//                    evt_.stopImmediatePropagation();    // 현재 이벤트 버블 중지
                    var _idx = -1;
                    $.each(this.row.tr, function (idx_, row_) {
                        if (evt_.currentTarget == row_[0]) {
                            if (evt_.keyCode == 38) {
                                if (idx_ > 0) {
                                    _idx = idx_-1;
                                    return false;
                                }
                            } else {
                                if (idx_ < _self.row.tr.length - 1) {
                                    _idx = idx_+1;
                                    return false;
                                }
                            }
                        }
                    });
                    if (_idx > -1) { // 방향키 스크롤 위치
                        this.element.closest('div').scrollTop(0);
//                        this.set_focus(this.row.tr[_idx], evt_);
                        this.set_focus(_idx);
                    }
                    _self.cfg.row_index = _idx;   // 현재 선택된 rowindex
//console.error(_self.cfg.row_index);

                    break;
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.row_keydown ■■■';
            }
        },  // cx_grid.row_keydown




        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        reg_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_grid.reg_focus_now');
                this.cfg.now_focus = item_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.reg_focus_now ■■■';
            }
        },  // cx_grid.reg_focus_now
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_focus_now');
                if (this.cfg.now_focus)
                    this.__excute(this.cfg.now_focus, 'set_focus');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_focus_now ■■■';
            }
        },  // cx_grid.set_focus
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(rowindex_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_focus');
                var _self = this;

/**/
                    if (this.cfg.grid_type == 'edit_grid' || this.cfg.grid_type == 'edit_row') {

                        this.$row.cx_row('set_focus', rowindex_);   // rowindex 는 $edit 객체임

//                        if (typeof $eobj_ == 'string') {
//                            console.error('탭 클릭시 현재탭 포커싱 처리하시요');
//                            console.info($eobj_, evt_);
//                        } else {
//                            $eobj_.set_focus('cx_grid.set_focus', $eobj_);
//                            //if (cfg.is_popup == false) {    // 탭클릭시 포커스를 처리할 클로저 생성
//                            //    evt.set_closure_focus($eobj_);  // 다음 탭을 위해 등록
//                            //}
//                        }
//                        //$eobj_.select().focus();
                    } else {
//                        _self.row.tr.removeClass('cx_active').blur();
//                        _self.row.tr[rowindex_].addClass('cx_active').focus();
//                        _self.cfg.row_index = rowindex_;   // 현재 선택된 rowindex
//                        var _create = false;
                        $.each(this.row.tr, function (idx_, row_) {
                            if (rowindex_ == idx_) {
                                _self.cfg.row_index = idx_;   // 현재 선택된 rowindex
                                _self.row.tr[idx_].addClass('cx_active').focus();
                                _self.cfg.now_focus = _self.row.tr[idx_];
//                                if (cfg.is_popup == false && _create == false) {     // 탭클릭시 포커스를 처리할 클로저 생성
//                                    _create = true;
//                                    evt.set_closure_focus($tr[idx_]);
//                                }
                            } else {
                                _self.row.tr[idx_].removeClass('cx_active').blur();
                            }
                        });
                    }
/**/
//                this.cfg.now_focus = this.modi[id_];
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_focus ■■■';
            }
        },  // cx_grid.set_focus
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function(id_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_hide');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_grid.set_hide -> undefined item '+id_+' ■■■';
                this.__excute(this.modi[id_], 'set_hide');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_hide ■■■';
            }
        },  // cx_grid.set_hide
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function(id_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_show');
                if (this.modi[id_] == undefined)
                    throw '■■■ error: cx_grid.get_value -> undefined item '+id_+' ■■■';
                this.__excute(this.modi[id_], 'set_show');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_show ■■■';
            }
        },  // cx_grid.set_show

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(id_, value_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_value');
                if (this.cfg.grid_type == 'edit_row') {
                    if (this.modi[id_] == undefined)
                        throw '■■■ error: cx_grid.set_value -> undefined item '+id_+' ■■■';
                    this.__excute(this.modi[id_], 'set_value', value_);
                } else if (this.cfg.grid_type == 'edit_grid') {
console.error('cx_grid.set_value 구현하세요');
                } else {
                    this.$row.cx_row('set_value', id_, value_); // id:rowindex, value_:{1건}


                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_value ■■■';
            }
        },  // cx_grid.set_value
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        get_values: function() {
            try {
                if (this.options.debug) console.log('cx_grid.get_values');
console.error(this.row.rowdata);
                return this.row.rowdata;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.get_values ■■■';
            }
        },  // cx_grid.get_values
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function(id_) {
            try {
                if (this.options.debug) console.log('cx_grid.get_value');
                if (this.cfg.grid_type == 'edit_row') {
                    if (this.modi[id_] == undefined)
                        throw '■■■ error: cx_grid.get_value -> undefined item '+id_+' ■■■';
                    return this.__excute(this.modi[id_], 'get_value');
                } else if (this.cfg.grid_type == 'edit_grid') {
console.error('cx_grid.get_value 구현하세요');
                } else {
                    return this.row.rowdata[this.cfg.row_index];
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.get_value ■■■';
            }
        },  // cx_grid.get_value

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        __excute: function(item_, action_, param1_, param2_) {
            try {
                if (this.options.debug) console.log('cx_grid.__excute');
                if (this.options.cfg.multi == false) {
                    switch (item_.type) {
                    case 'label':
                            return item_.$obj.cx_label(action_, param1_, param2_);
                        break;
                    case 'hidden':
                            return item_.$obj.cx_hidden(action_, param1_, param2_);
                        break;
                    case 'date':
                            return item_.$obj.cx_date(action_, param1_, param2_);
                        break;
                    case 'int':
                            return item_.$obj.cx_int(action_, param1_, param2_);
                        break;
                    case 'float':
                            return item_.$obj.cx_float(action_, param1_, param2_);
                        break;
                    case 'radio':
                            return item_.$obj.cx_radio(action_, param1_, param2_);
                        break;
                    case 'check':
                            return item_.$obj.cx_check(action_, param1_, param2_);
                        break;
                    case 'text':
                            return item_.$obj.cx_text(action_, param1_, param2_);
                        break;
                    case 'combo':
                            return item_.$obj.cx_combo(action_, param1_, param2_);
                        break;
                    case 'button':
                        return item_.$obj.cx_button(action_, param1_, param2_);
                        break;
                    case 'pop':
                        return item_.$obj.cx_pop(action_, param1_, param2_);
                        break;
                    }
                } else {

                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.__excute ■■■';
            }
        },  // cx_grid.__excute

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_next: function() {
            try {
                if (this.options.debug) console.log('cx_grid.set_next');
                var _self = this;
                if (_self.cfg.multi == false) {
                    $.each(_self.mod, function (idx_, item_) {
                        if (item_.next) {
                            if (item_.next.match(/^#/g)) {
                                // 다른폼 객체일때
                            } else {
                                if (_self.modi[item_.next] == undefined)
                                    throw '■■■ error: cx_grid.set_next -> undefined item (id: '+item_.next+') ■■■';
                                item_.$next = $('#'+_self.cfg.pt_idx+item_.next);
                                item_.next_type = _self.modi[item_.next].type;
                            }
                        }
                        // 각 콤포넌트에 next 설정을 반영
                        _self.__excute(item_, 'set_option', item_);
                    });
                } else {
                        console.error('cx_grid.set_next 구현하세요');
                    $.each(this.mod, function (idx_, item_) {
                        //if (item_.next) {
                        //    item_.$next = $('#'+_self.cfg.pt_idx+item_.next);
                        //    item_.next_type = _self.modi[item_.next].type;
                        //}
                    });
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_next ■■■';
            }
        },  // cx_grid.set_next

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        add_row: function(data_) {
            try {
                if (this.options.debug) console.log('cx_grid.add_row');
                var _self = this, _tr = '';
                if (_self.cfg.grid_type == 'edit_row') {
                    _tr = _self.$row.cx_row('add_row');
    //console.error('called cx_grid.add_row');
    //console.error(_tr.children('td'));
                    _tr.click(function(evt_) {        // dblclick 일때 편집모드로 전환됨
                        _self.row_click(evt_);
                        return true;
                    });
                    _self.element.append(_tr);
                    _self.row.tr.push(_tr);
                    _self.cfg.row_count++;
                    _tr.click();
                    _tr.click();    // 더블클릭 효과
//                } else if (_self.cfg.add_label == true) {
                } else if (_self.cfg.grid_type == 'add_label') {
                    _tr = _self.$row.cx_row('add_label', data_);
                    _tr.click(function(evt_) {        // dblclick 일때 편집모드로 전환됨
                        _self.row_click(evt_);
                        return true;
                    });
                    if (data_['edit_index'] == undefined || !data_['edit_index'] || data_['edit_index'] < 0) {
                        _self.element.append(_tr);
                        _self.row.tr.push(_tr);
                        _self.row.rowdata.push(data_);
                        _self.cfg.row_count++;
//console.error(data_['lbl_sd_amt_l'], data_['lbl_sd_amt_r'], _self.row.rowdata[_self.cfg.row_count-1]['lbl_sd_amt_l'], _self.row.rowdata[_self.cfg.row_count-1]['lbl_sd_amt_r']);
                    } else {
//console.error(333);
                        var _old = _self.element.children('tr')[data_['edit_index']];
                        $(_old).replaceWith(_tr);
//                        _self.element.append(_tr);
                        _self.row.tr[data_['edit_index']] = _tr;
                        this.row.rowdata[data_['edit_index']] = data_;


                    }
//console.error(_self.row);
                }

//                var _edit = this.get_edit();
//                setTimeout(function() {
//$.each(_edit, function (idx_, item_) {
//    if (item_.mask) {
//                        item_.$edit.mask(item_.mask, {reverse: true, placeholder:item_.mask.replace(/[0|#|?|*]/g, '_')});
//
//console.log(idx_, item_, item_.$edit);
//    }
//
//});
//
//                }, 1000);
                _self.element.closest('div').scrollTop(_self.element.get(0).clientHeight);
//                var e = jQuery.Event('click');
//                _tr.trigger(e);
//                _tr.trigger(e); // 더블클릭 효과를 위해 2번호출
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.add_row ■■■';
            }
        },  // cx_grid.add_row
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        get_edit: function() {
            try {
                if (this.options.debug) console.log('cx_row.cx_grid');
                return this.$row.cx_row('get_edit');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.cx_grid ■■■';
            }
        },  // cx_row.cx_grid


        /*----------------------------------------------
        * @cx_grid cx_grid.loading
        ----------------------------------------------*/
        set_loading: function() {
            try {
                if (this.options.debug) console.log('cx_grid.set_loading');
                this.element.children().remove();
                this.element.append(this.$row.cx_row('set_loading'));
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_grid.set_loading ■■■';
            }
        },  // cx_grid.set_loading

        /*----------------------------------------------
        * @cx_grid draw row (edit grid)
        ----------------------------------------------*/
        draw_grid: function(data_) {
            try {
                if (this.options.debug) console.log('cx_grid.draw_grid');
                var _self = this;
//console.error(data_);
//console.error(this.element, _self.cfg.offset);
                if (_self.cfg.offset.top == 0 && _self.cfg.is_popup == false) {  // Resize 안 되었다면 처리
                    _self.set_resize();
                }
//console.error(_self.cfg.tree);
                _self.set_clear(false);
                var _len = data_.length, i = 0, _tmpData = [];
                if (_len == 0) return false;
                if (_self.cfg.grid_type == 'tree') {        //  tree 처리를 위해
                    if (_self.cfg.tree == undefined || _self.cfg.tree.key == undefined || _self.cfg.tree.value == undefined || _self.cfg.tree.open == undefined)
                        throw '■■■ error: cx_grid._init -> undefined cfg.tree(key, value, open)  ■■■';

                    var _tmp = []; //$.extend(true, {}, data_);
                    $.each(data_, function (idx_, row_) {
//                        row_['tree_class'] = _self.cfg.tree.open;
                        if (idx_ == 0) {
                            row_['total_rows'] = _len;
                            row_['tree_node'] = -9; // 루트노드
                            row_['tree_idx'] = idx_; // 자신노드
                            row_['tree_pidx'] = -1; // 부모노드
//                            row_['tree_close'] = 0; // 닫기 depth
                            data_[idx_+1]['tree_pidx'] = idx_;  // 부모노드
                            _tmp[idx_] = [idx_];
                        } else {
                            if (data_[idx_+1] != undefined) {
//                                row_['tree_close'] = row_[_self.cfg.tree.key] - data_[idx_+1][_self.cfg.tree.key]; // 닫기 depth
                                if (row_[_self.cfg.tree.key] < data_[idx_+1][_self.cfg.tree.key]) {


                                    row_['tree_node'] = 1;   // 자손있음, 이전놈보다 조상이면 다른쪽에 넣어야 함
                                    row_['tree_idx'] = idx_; // 자신노드
                                    data_[idx_+1]['tree_pidx'] = idx_;    // 다음자식에게 나를 부모로 지정
                                    for(i=idx_-1; i>=0; i--) {    // 역탐색하면서 나와 부모를 찾아 내 부모삼기
//console.error(idx_, row_['depth']);
                                        if ((row_['depth']-1) == data_[i]['depth']) {
//                                            row_['tree_pidx'] = data_[i]['tree_pidx'];  // 부모노드
                                            row_['tree_pidx'] = data_[i]['tree_idx'];  // 부모노드
                                            break;
                                        }
                                    }
//console.error(idx_);
//                                    if (idx_ == 16 || idx_ == 17) {
//console.error(row_);
//                                    }
                                    _tmp[idx_] = [idx_];
                                } else if (row_[_self.cfg.tree.key] == data_[idx_+1][_self.cfg.tree.key]) {
                                    if (row_[_self.cfg.tree.key] > data_[idx_-1][_self.cfg.tree.key]) {
                                        row_['tree_node'] = 10;   // 첫번째 자식
                                        row_['tree_idx'] = idx_; // 자신노드
                                    } else {
                                        row_['tree_node'] = 11;   // 형제
                                        row_['tree_idx'] = idx_; // 자신노드
                                        for(i=idx_-1; i>=0; i--) {    // 역탐색하면서 나와 동급의 부모를 찾아 내 부모삼기
                                            if (row_['depth'] == data_[i]['depth']) {
                                                row_['tree_pidx'] = data_[i]['tree_pidx'];  // 부모노드
                                                break;
                                            }
                                        }
                                    }
//                                    _tmp[row_['tree_pidx']].push(idx_);
                                } else {
                                    row_['tree_node'] = -1;  // 다음이 조상임
                                    row_['tree_idx'] = idx_; // 자신노드
                                    row_['tree_pidx'] = data_[idx_-1]['tree_pidx'];  // 부모노드
//                                    _tmp[row_['tree_pidx']].push(idx_);
//                                    if (idx_ == 15) {
//console.error(row_);
//                                    }

                                }
                            } else {
                                row_['tree_node'] = -2;   // 마지막임
                                row_['tree_idx'] = idx_; // 자신노드
                                for(i=idx_-1; i>=0; i--) {    // 역탐색하면서 나와 동급의 부모를 찾아 내 부모삼기
                                    if (row_['depth'] == data_[i]['depth']) {
                                        row_['tree_pidx'] = data_[i]['tree_pidx'];  // 부모노드
                                        break;
                                    }
                                }
//                                row_['tree_close'] = row_[_self.cfg.tree.key] - 0; // 닫기 depth
//                                _tmp[row_['tree_pidx']].push(idx_);
                            }
                        }
                    });
//console.error(_tmp);
//                    var _tmpData = $.extend(true, {}, data_);
//                    data_ = [];
//                    $.each(_tmp, function (idx1_, ui_) {
//                        data_.push(ui_[0]);
////console.info(ui_, ui_.length);
//                        $.each(ui_, function (idx2_, idx_) {
////                            data_.push(_tmpData[idx_]);
//                            data_[idx_] = _tmpData[idx_];
//                            data_[idx_]['oid'] = idx_;
//
////                          console.log(idx_, item_);
//                        });
//////                      console.log(idx_, item_);
//                    });
//console.error(data_);
//console.info(data_.length);
                }
                var _tr = null;
                $.each(data_, function (idx_, row_) {
//console.error(idx_, row_['depth'], row_['tree_node'], row_['tree_pidx']);
                    row_['oid'] = row_['tree_pidx'] + '/' + idx_;
//                    row_['parent_part_no'] = idx_;
                    ++_self.cfg.row_count;
                    row_['rowindex'] = idx_;   // 모듈에서 사용됨
                    _tr = _self.$row.cx_row('set_values', idx_, row_);
                    if (idx_ > 0 && _self.cfg.grid_type == 'tree' && _self.cfg.tree.open == 'collapse') {        //  tree 처리를 위해
//                        _tr.prop('rowspan', _len);
//                        _tr.css('visibility', 'hidden');
//                        _tr.addClass(_self.cfg.tree.open);
                        _tr.toggle();
                    }
                    _self.row.tr.push(_tr);
                });
                _self.row.rowdata = data_;    // 이곳에서 rowindex 가 생성되므로
                this.element.append(_self.row.tr);
                this.bind_event();

                if (_self.cfg.grid_type == 'tree') {        //  tree 처리를 위해 (cx_row.set_values 에서 div 를 생성함)
                    _self.row.$tree = $('#'+_self.cfg.id + '_tree').cx_tree({debug:false, 'mod':null, 'cfg':_self.cfg, 'parent':_self});
                    _self.row.$tree.cx_tree('draw_tree', data_);
//console.error(_self.row.$tree);
                }
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_grid.draw_grid ■■■';
            }
        },  // cx_grid.draw_grid

        /*----------------------------------------------
        * @cx_grid row event bind (only lavel grid)
        ----------------------------------------------*/
        bind_event: function() {
            try {
                if (this.options.debug) console.log('cx_grid.bind_event_label');
                var _self = this, _$tmp = this.element.find('tr');
                if (_self.cfg.grid_type == 'edit_grid') {

                    //this.set_focus(0);
                } else if (_self.cfg.grid_type == 'edit_row') {
                    _$tmp.click(function(evt_) {        // dblclick 일때 편집모드로 전환됨
                        _self.row_click(evt_);
                        return true;
                    });
                    _$tmp.keydown(function(evt_) {
                        _self.row_keydown(evt_);
                        return true;
                    });

                    _self.set_focus(0);
                } else {
                    _$tmp.click(function(evt_) {
                        _self.row_click(evt_);
                        return false;
                    });
//                    _$tmp.dblclick(function(evt_) {
//                        _self.row_dblclick(evt_);
//                        return false;
//                    });
                    _$tmp.keydown(function(evt_) {
                        _self.row_keydown(evt_);
                        return true;
                    });
                    _self.set_focus(0);
                }
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_grid.bind_event_label ■■■';
            }
        },  // cx_grid.bind_event_label

        /*----------------------------------------------
        * @cx_grid
        ----------------------------------------------*/
        get_template: function(id_) {
            try {
                if (this.options.debug) console.log('cx_grid.get_template');
                if (this.template[id_] == undefined)
                    throw '■■■ error: cx_grid.get_template -> undefined ('+id_+') ■■■';
                return this.template[id_];
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_grid.get_template ■■■';
            }
        },  // cx_grid.get_template

        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function(no_data_) {
            try {
                if (this.options.debug) console.log('cx_grid.set_clear');
                var _self = this;
                _self.row.rowdata = [],
                _self.row.tr = [],
                _self.cfg.row_index = -1,
                _self.cfg.row_count = 0,
                _self.cfg.myfocus = null;
                this.element.children().remove();

                if (no_data_ == true) {
                    this.element.append(this.$row.cx_row('set_no_data'));
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.set_clear ■■■';
            }
        },  // cx_grid.set_clear


        /*----------------------------------------------
        * @cx_grid cx_grid.set_resize
        ----------------------------------------------*/
        set_resize: function() {
            try {
                if (this.options.debug) console.log('cx_grid.set_resize');
                var _self = this;
                if (_self.cfg.is_popup == true) {
                    return false;     // 팝업이면 처리하지 않음
                }
                setTimeout(function() {
                    _self.cfg.offset = _self.element.offset();
                    _self.element.closest('div').css({'padding-bottom': '50px', 'height':(app_.cfg.h - _self.cfg.offset.top - 140) + 'px'});
                }, 0);
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_grid.set_resize ■■■';
            }
        },  // cx_grid.set_resize
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        popup_close: function(id_) {
            try {
                if (this.options.debug) console.log('cx_grid.popup_close');
                var _self = this;
                //_self.modi[id_].$obj.cx_pop('popup_close');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.popup_close ■■■';
            }
        },  // cx_grid.popup_close


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_grid._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid._create ■■■';
            }
        },  // cx_grid._create

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_grid._init');
                if (this.element.closest('table').length < 1) {
                    console.error(this.element);
                    throw '■■■ error: undefined html object ■■■';
                }
                this.clear();
                var _self = this;
                this.options.cfg = app_.init_cfg(this.options.cfg); // cfg 통일
                this.cfg = $.extend(this.cfg, this.options.cfg);
                this.mod = $.extend(this.mod, this.options.mod);

                if (this.cfg.mytab == -1) // 탭이 없으면 -1
                    this.cfg.pt_idx = this.cfg.p;
                else
                    this.cfg.pt_idx = this.cfg.p + '' + this.cfg.mytab;

//                if (_self.cfg.grid_type == 'tree')
//                    this.element.hide();

//console.error(this.cfg.id);
                this.cfg.id = this.element.attr('id');
                this.$row.cx_row({debug:this.options.debug, cfg:this.cfg, 'mod':this.mod, 'popup':this.cfg.popup, 'parent':_self});

                _self.set_resize();
                $(window).resize(function() {
                    _self.set_resize();
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid._init ■■■';
            }
        },  // cx_grid._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_grid.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.destroy ■■■';
            }
        },  // cx_grid.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_grid.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.cfg ■■■';
            }
        },  // cx_grid.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_grid.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.cfg ■■■';
            }
        },  // cx_grid.cfg
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_grid.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , id        : null
                    , grid_type : ''    // tree, edit_row
                    , addrow    : false // 최초 행 추가 여부
                    , addgrid   : false // Label Grid 로 행이 추가되는 Grid
                    , is_popup  : false // 팝업 그리드 여부
                    , pt_idx    : null  // m + tab index
                    , myfocus   : null  // 나의 현재 포커스 객체(item_)
                    , mytab     : -1    // 나의 탭 인덱스
                    , now_tab   : -1    // 현재 active 된 탭 인덱스
//                    , column_count : 0 // 현재 Grid 컬럼 수
                    , row_count : 0    // 데이터를 읽어온 Row 수
                    , keyword   : '❦❦'  // 데이터를 바인딩할 위치
                    , timer     : null  // 클릭을 처리할 타이머
                    , times     : 250   // 클릭, 더블클릭을 구분할 시간
                    , clicks    : 0     // click, dblclick 을 구분할 구분자
                    , event     : {}    // 사용자 이벤트 함수
                    , edit      : false // 에디팅 여부
                    , rowstart  : ''    // edit 할때 포커스 처리 및 row 추가
                    , rowend  : ''      // edit 할때 포커스 처리 및 row 추가
                    , now_focus: null   // 현재 포커스 객체
                    , offset    : {top:0, left:0} // 그리드 위치
                    , row_index : -1    // 현재 클릭한 row index
                },
                this.mod = {},
                this.modi = {},
                this.template = {
                      '$tr':null
                    , '$form':[]
                    , ttr : null         // editing template (TR)
                    , $tobj  : {}       // editing template component (...)
                    , $eobj  : []       // binding component (...)
                    ,

                },
                this.row = {
                    '$tr':[]
//                    , $row  : $('<tr>')
                    , rowdata   : []    // Grid row 를 그릴때 현재 Row 데이터를 할당해 둠
                    , tr : []
                };
                this.$row = $('<tr>');



            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.clear ■■■';
            }
        },  // cx_grid.clear

    });
        })(cxApp);

