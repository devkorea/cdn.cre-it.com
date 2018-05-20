        (function(app_) {
    app_.widget('ui.cx_row', {
        options: {
              degug: false

        },
        template: {},
        cfg: {},
        mod: {},
        modi: {},
        //==============================================================================================
        // event trigger
        //==============================================================================================
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        row_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_grid.row_click');
                var _self = this, _param = {};
//                this.cfg.clicks++;  //count clicks
//                if(this.cfg.clicks == 1) {  // 클릭됨(오직 row_click 만 호출함)
//                    this.element.children('tr').removeClass('cx_active');
//                    _self.cfg.row_index = evt_.currentTarget.rowIndex;   // 현재 선택된 rowindex
//                    $(evt_.currentTarget).addClass('cx_active');
//                    this.cfg.timer = setTimeout(function() {
//                        _self.cfg.clicks = 0;                     // 타이머 안에서 초기화
//
//                        if (typeof _self.cfg.row_click == 'function') {
//                            _self.cfg.row_click(evt_, _self.row.rowdata[evt_.currentTarget.rowIndex]);
//                        }
//                    }, this.cfg.times);
//                } else {        // 더블클릭
//                    clearTimeout(this.cfg.timer);
//                    this.cfg.clicks = 0;
//                    this.cfg.timer = null;
//                    if (typeof this.cfg.row_dblclick == 'function') {
//                        _param = this.cfg.row_dblclick(evt_, this.row.rowdata[evt_.currentTarget.rowIndex]);
//                    }
//
//                    if (_self.cfg.grid_type == 'edit_row') {
//                        var _val = '', _rdo = -1, _stop = true;
//                        $.each(_self.row.tr, function (idx2_, row_) {
//                            if (_stop == false) return false;
//                            if ($(row_).data('edit') == true) {
//                                if (row_.get(0) == evt_.currentTarget) {
//                                    _stop = false;
//                                    return false;
//                                }
//                                _param = _self.$row.cx_row('set_label', row_);
//                                _self.row.rowdata[idx2_] = _param;   // 편집이 완료된 데이터도 반영
//                                if (_param.rdo == true) {
//                                    _rdo = idx2_;   // 라디오는 전체 row 에서 유일한 값이어야 함
//                                }
//                            }
//                        });
//                        if (_stop == false) return false;   // 동일한 row 일때는 처리하지 않음
//
//                        // reset data of radio
//                        if (_rdo > -1) {
//                            $.each(_self.row.tr, function (idx2_, row_) {
//                                if (_rdo == idx2_) return true;
//                                $.each($(row_).children('td'), function (idx_, td_) {
//                                    if (_self.mod[idx_].type == 'radio') {
//                                        td_.innerText = '';
//                                    }
//                                });
//                            });
//                        }
//                        if ($(this).data('edit') == true) return;
//                        _self.$row.cx_row('set_edit', evt_.currentTarget);
//                    }
//                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_grid.row_click ■■■';
            }
        },  // cx_grid.row_click

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        $(this).closest('div').attr('contenteditable', 'true');
        https://codewithmark.com/easily-edit-html-table-rows-or-cells-with-jquery
        ----------------------------------------------*/
        //row_dblclick: function(evt_) {
        //    try {
        //        if (this.options.debug) console.log('cx_row.row_dblclick');
        //        this._trigger('row_dblclick', 0, evt_);
        //    console.error('row_dblclick', this.options.parent);
        //    //console.error(this.options.parent.get_template());
        //    //console.error(this.options.parent.element.cx_row('get_template'));
        //    //console.error(this.template['ttr']);
        //
        //    } catch(e) {
        //        console.error(e);
        //        throw '■■■ error: cx_row.row_dblclick ■■■';
        //    }
        //},  // cx_row.row_dblclick

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        edit_click: function(evt_) {
            try {
                if (this.options.debug) console.log('cx_row.edit_click');
                var _self = this;
                this.cfg.clicks++;  //count clicks
                if(this.cfg.clicks == 1) {  // 클릭됨(오직 row_click 만 호출함)
//                    this.element.addClass('cx_active');
//                    evt_.stopImmediatePropagation();        // 현재 이벤트 버블 중지
                    this.cfg.timer = setTimeout(function() {
                        _self.cfg.clicks = 0;                     // 타이머 안에서 초기화
                        if (_self.modi[evt_.currentTarget.id].$edit != undefined) {
                            _self.cfg.focused = _self.modi[evt_.currentTarget.id].$edit;
                        }

                    }, this.cfg.times);
                } else {        // 더블클릭
                    clearTimeout(this.cfg.timer);
                    this.cfg.clicks = 0;
                    this.cfg.timer = null;
                }
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.edit_click ■■■';
            }
        },  // cx_row.edit_click

        //==============================================================================================
        // method set
        //==============================================================================================
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        reg_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_row.reg_focus_now');
                this.cfg.now_focus = item_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.reg_focus_now ■■■';
            }
        },  // cx_row.reg_focus_now
        /*----------------------------------------------
        * @cx_grid
        * @returns  {void}
        ----------------------------------------------*/
        set_focus_now: function(item_) {
            try {
                if (this.options.debug) console.log('cx_row.set_focus_now');
console.error('????????');
//                if (this.cfg.now_focus)
//                    this.__excute(this.cfg.now_focus, 'set_focus');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_focus_now ■■■';
            }
        },  // cx_row.set_focus

        /*----------------------------------------------
        * @cx_row loading
        ----------------------------------------------*/
        set_loading: function() {
            try {
                if (this.options.debug) console.log('cx_row.set_loading');
                return '<tr class="hover_clear"><td class="center" colspan="'+this.cfg.column_count+'" style=""><img src="//cdn.cre-it.com/dx/img/loading/ajax-loader.gif" /></td></tr>';
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_row.set_loading ■■■';
            }
        },  // cx_row.set_loading

        /*----------------------------------------------
        * @cx_row loading
        ----------------------------------------------*/
        set_no_data: function() {
            try {
                if (this.options.debug) console.log('cx_row.set_no_data');
                return '<tr class="hover_clear"><td class="center" colspan="'+this.cfg.column_count+'" style="">No Data..</td></tr>';
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_row.set_no_data ■■■';
            }
        },  // cx_row.set_no_data

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_focus: function(focus_) {
            try {
                if (this.options.debug) console.log('cx_row.set_focus');
                if (this.cfg.grid_type == 'edit_grid') {
                    console.error('????????? cx_row.set_focus 점검하세요');
                } else if (this.cfg.grid_type == 'edit_row') {

//console.error(focus_.attr('id'), this.modi[focus_.attr('id')], this.modi[focus_.attr('id')].check);
//                            if (typeof item.check == 'function') {
//                                _data = item.check(evt_, item, _data);
//                                if (_data == undefined || _data == false)   // 사용자가 취소하면 더 이상 진행안함
//                                    return false;
//                            }

                    if (typeof focus_ == 'object') {
                        switch (this.modi[focus_.attr('id')].type) {
                        case 'label':
                        case 'hidden':  // 여기는 포커스를 줄 필요가 없음
                            break;
                        case 'text':
                        case 'date':
                        case 'int':
                        case 'float':
                        case 'pop':
                            focus_.select().focus();
                            break;
                        case 'radio':
                        case 'check':
                            focus_.focus();
                            break;
                        case 'combo':
                            focus_.focus();
                            break;
                        case 'button':
                            focus_.focus();
                            break;
                        }
                    }
                } else {
                    console.error('????????? cx_row.set_focus 점검하세요');
                }

                //this.options.parent.element.cx_form('reg_focus_now', this.options);     // 현재 폼의 포커스객체로 등록
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_focus ■■■';
            }
        },  // cx_row.set_focus
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_hide: function() {
            try {
                if (this.options.debug) console.log('cx_row.set_hide');
                this.element.css('visibility', 'hidden');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_hide ■■■';
            }
        },  // cx_row.set_hide
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_show: function() {
            try {
                if (this.options.debug) console.log('cx_row.set_show');
                this.element.css('visibility', 'visible');
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_show ■■■';
            }
        },  // cx_row.set_show

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_css: function(css_, value_) {
            try {
                if (this.options.debug) console.log('cx_row.set_css');
                this.element.css(css_, value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_css ■■■';
            }
        },  // cx_row.set_css

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_align: function(value_) {
            try {
                if (this.options.debug) console.log('cx_row.set_align');
                this.set_css('text-align', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_align ■■■';
            }
        },  // cx_row.set_align

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_color: function(value_) {
            try {
                if (this.options.debug) console.log('cx_row.set_color');
                this.set_css('color', value_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_color ■■■';
            }
        },  // cx_row.set_color

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_value: function(value_) {
            try {
                if (this.options.debug) console.log('cx_row.set_value');
                //if (this.cfg.grid_type == 'edit_row') {
                //
                //} else {
                //
                //}
//                this.element.text($.trim(value_));
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_value ■■■';
            }
        },  // cx_row.set_value

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_value: function() {
            try {
                if (this.options.debug) console.log('cx_row.get_value');
//                this.set_value(this.element.text());
//                return this.element.text();
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_value ■■■';
            }
        },  // cx_row.get_value

        /*----------------------------------------------
        * @cx_row
        * @param    {void}
        * @param    {void}
        * @param    {int}   tree 구현을 위한 전체 데이터 수
        * @param    {json}  tree 구현을 위한 다음 데이터
        * @returns  {void}
        ----------------------------------------------*/
        set_values: function(rowindex_, data_) {
            try {
                if (this.options.debug) console.log('cx_row.set_values');
                var _self = this, _tr = this.element.clone(true), _td = '';
//console.error(data_);
                _tr.prop('tabindex', rowindex_)
                    .data('rowindex', rowindex_)    // tabindex 는 포커스 처리가 가능하도록
                    .data('edit', false);           // 편집모드는 false
                $.each(_self.mod, function (idx_, item_) {
                    _td = item_.$td.clone(true);

                    if (idx_ == 0 && _self.cfg.grid_type == 'tree') {
                        _tr.data('toggle', _self.cfg.tree.open);  // 이 값을 보고 toggle 시킴
                        if (data_['tree_node'] == -9) {
//console.error(_self.cfg);
//                            _td.attr('rowspan', data_['total_rows']).css({'vertical-align':'text-top', 'text-align':'left', 'padding': 0, 'margin':0});
                            _td.attr('rowspan', data_['total_rows']).addClass('tree');
//                            _td.text('O');
                            _td.html('<div id="'+_self.cfg.id+'_tree" class="tree"></div>');
                            _tr.append(_td);
                        }
//                        if (data_['tree'] == -9 || data_['tree'] == 1) {
//                            _td.text('O');
//                        } else {
//                            _td.text('X');
//                        }
//                        _tr.append(_td);
                    } else {
                        if (data_[item_.id] == undefined) {
                            _tr.append(_td);
                        } else {
                            if (item_.format) {
                                data_[item_.id] = app_.cxFormat.format(item_.format, data_[item_.id]);
                            }
                            _tr.append(_td.text(app_.cxUtil.replace_html('E', data_[item_.id])));
                        }
                    }
                });
                return _tr;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_values ■■■';
            }
        },  // cx_row.set_values

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_clear: function() {
            try {
                if (this.options.debug) console.log('cx_row.set_clear');
                var _self = this, _tr = this.element.clone(true);
                _tr.prop('tabindex', 0).data('rowindex', 0);
                $.each(_self.mod, function (idx_, item_) {
                    _tr.append($(item_.template.replace(/❦❦/, '')));
                });
                return _tr;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_clear ■■■';
            }
        },  // cx_row.set_clear

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_label: function(row_) {
            try {
                if (this.options.debug) console.log('cx_row.set_label');
                var _self = this, _$row = $(row_), _param = {'rdo':false};
                $.each(_$row.children('td'), function (idx_, td_) {
                    _param[_self.mod[idx_].id] = '';
                    switch (_self.mod[idx_].type) {
                    case 'label':
                        _param[_self.mod[idx_].id] = _self.mod[idx_].$edit.text();
                        break;
                    case 'text':
                    case 'date':
                    case 'int':
                    case 'float':
                    case 'pop':
                    case 'hidden':
                        _param[_self.mod[idx_].id] = _self.mod[idx_].$edit.val();
                        break;
                    case 'radio':
                    case 'check':
                        if (_self.mod[idx_].$edit.prop('checked') == true) {
                            _param[_self.mod[idx_].id] = _self.mod[idx_].$edit.val();
                            _param['rdo'] = true;   // 라디오는 전체 row 에서 유일하게 체크되어야 하므로 반환해 줌
                        }
                        break;
                    }
                    $(td_).removeClass('edit').children().remove();
                    $(td_).text(_param[_self.mod[idx_].id]);
                });
                _$row.data('edit', false);
                return _param;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_label ■■■';
            }
        },  // cx_row.set_label


        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_edit: function(row_) {
            try {
                if (this.options.debug) console.log('cx_row.set_edit');
                var _self = this, _$row = $(row_);
                var _val = '';
                $.each(_$row.children('td'), function (idx_, td_) {
                    _val = td_.innerText;
                    $(td_).addClass('edit').html(_self.mod[idx_].$edit);

                    switch (_self.mod[idx_].type) {
                    case 'label':
                        if (_self.mod[idx_].mask) _self.mod[idx_].$edit.mask(_self.mod[idx_].mask, {reverse: true, placeholder:_self.mod[idx_].mask.replace(/[0|#|?|*]/g, '_')});
                        _self.mod[idx_].$edit.text(_val);
                        break;
                    case 'text':
                    case 'date':
                    case 'int':
                    case 'float':
                    case 'hidden':
                        if (_self.mod[idx_].mask) _self.mod[idx_].$edit.mask(_self.mod[idx_].mask, {reverse: true, placeholder:_self.mod[idx_].mask.replace(/[0|#|?|*]/g, '_')});
                        _self.mod[idx_].$edit.val(_val);
                        break;
                    case 'pop':
                        _self.mod[idx_].$edit.val(_val);
                        _self.mod[idx_].$edit.cx_pop(_self.cfg, _self.mod[idx_], {'parent':_self});
                        break;
                    case 'radio':
                    case 'check':
                        if (_val != '' && _self.mod[idx_].value == _val)
                            _self.mod[idx_].$edit.prop('checked', true);
                        else
                            _self.mod[idx_].$edit.prop('checked', false);
                        break;
                    case 'combo':
                        console.error('cx_row.set_edit.combo 구현하세요');
                        break;
                    case 'button':
                        console.error('cx_row.set_edit.button 구현하세요');
                        break;
                    }
                    if (!_self.mod[idx_].mask)
                        _self.mod[idx_].$edit.prop('placeholder', _self.mod[idx_].text);


                    _self.mod[idx_].$edit.click(function(evt_) {
                        _self.edit_click(evt_);
                        return true;
                    });
                    _self.mod[idx_].$edit.keydown(function(evt_) {
                        _self.options.parent.edit_keydown(evt_);
                        return true;
                    });

                    if (_self.cfg.focused == null) {
                        if (_self.mod[idx_].rowstart) {
                            _self.mod[idx_].$edit.select().focus();
                            _self.cfg.focused = _self.mod[idx_].$edit;
                        }
                    } else {
//                        _self.set_focus(_self.cfg.focused);
                    }
                });
                _$row.data('edit', true);
                _self.set_focus(_self.cfg.focused);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_edit ■■■';
            }
        },  // cx_row.set_edit
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_edit: function() {
            try {
                if (this.options.debug) console.log('cx_row.get_edit');
                return this.modi;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_edit ■■■';
            }
        },  // cx_row.get_edit

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        add_row: function(row_) {
            try {
                if (this.options.debug) console.log('cx_row.add_row');
                var _self = this, _tr = this.element.clone(true), _td = '';
                $.each(_self.mod, function (idx_, item_) {
                    _td = item_.$td.clone(true);
                    //_tr.append(_td);
                    _tr.append(item_.$td.clone(true));
                });
                return _tr;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.add_row ■■■';
            }
        },  // cx_row.add_row

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_rowend: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.get_rowend');
                return this.modi[id_].rowend;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_rowend ■■■';
            }
        },  // cx_row.get_rowend
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_rowstart: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.get_rowstart');
                return this.modi[id_].rowstart;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_rowstart ■■■';
            }
        },  // cx_row.get_rowstart

        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        add_label: function(data_) {
            try {
                if (this.options.debug) console.log('cx_row.add_label');
                var _self = this, _tr = this.element.clone(true), _td = '';

//console.error(_self.cfg);
                $.each(_self.mod, function (idx_, item_) {
                    if (data_[item_.id] != undefined) {
                        if (item_.format) {
//                            console.error(item_);
                            data_[item_.id] = app_.cxFormat.format(item_.format, data_[item_.id]);
                        }
                        _td = item_.$td.clone(true);
                        $(_td).text(data_[item_.id]);
                        _tr.append(_td);
                    }
                });
                return _tr;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.add_label ■■■';
            }
        },  // cx_row.add_label


        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_focused: function() {
            try {
                if (this.options.debug) console.log('cx_row.get_focused');
                return this.cfg.get_focused;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_focused ■■■';
            }
        },  // cx_row.get_focused
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_focused: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.set_focused');
                if (id_ == null)
                    this.cfg.get_focused = null;
                else
                    this.cfg.get_focused = this.modi[id_].$edit;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.set_focused ■■■';
            }
        },  // cx_row.set_focused
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        get_next: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.get_next');
                return this.modi[id_].next;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_next ■■■';
            }
        },  // cx_row.get_next
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        set_next_focused: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.get_next_focused');
                this.cfg.get_focused = this.modi[this.modi[id_].next].$edit;
                this.cfg.get_focused.select().focus();

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.get_next_focused ■■■';
            }
        },  // cx_row.get_next_focused
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        check_value: function(id_) {
            try {
                if (this.options.debug) console.log('cx_row.check_value');
                if (typeof this.modi[id_].check == 'function') {
                    return this.modi[id_].check();
                }
                return true;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.check_value ■■■';
            }
        },  // cx_row.check_value


        //==============================================================================================
        // core method
        //==============================================================================================
        _create: function() {
            try {
                if (this.options.debug) console.log('cx_row._create');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row._create ■■■';
            }
        },  // cx_row._create

/*****************************************************************************************
1. Edit Mode (항상 마지막 row 에 edit row 추가되어 있음)
    edit_grid: 전체 Row 가 edit mode 형태로 표시
    edit_row: row 를 클릭할때마다 edit mode 로 전환
2. addrow
    마지막 row 에서 엔터칠때 신규 row 추가 여부
*****************************************************************************************/

        _init: function() {
            try {
                if (this.options.debug) console.log('cx_row._init');
                this.clear();
                var _self = this;
                this.options.cfg = app_.init_cfg(this.options.cfg); // cfg 통일
                this.cfg = $.extend(this.cfg, this.options.cfg);
                this.mod = $.extend(this.mod, this.options.mod);
//console.error(this.cfg.grid_type);
                var _attr = '', _style = '';
                $.each(_self.mod, function (idx_, item_) {
                    _attr = '', _style = '';
                    item_.pt_idx = _self.cfg.pt_idx;  // 강제로 할당
                    item_ = app_.init_item(item_, 'cx_row._init'); // item 통일
                    if (item_.rowstart)
                        _self.cfg.rowstart = item_.id;
                    if (item_.rowend)
                        _self.cfg.rowend = item_.id;

//console.error(item_.id, item_.check);

                    if (_self.cfg.grid_type == 'edit_row') { // ================== 일반 Grid
                        if (item_.type == 'hidden') {
                            //if (item_.align) _attr += ' class="'+item_.align+'"';
                            item_.$td = $('<td style="display: none"></td>');
                        } else if (item_.type == 'button') {
                            ++_self.cfg.column_count;
                            item_.$edit = $('<button name="'+_self.cfg.pt_idx+'row_'+item_.id+'" class="btn btn_normal btn_red">'+item_.text+'</button>');
                            item_.$td = $('<td></td>');
                        } else {
                            ++_self.cfg.column_count;
                            if (item_.align) _attr += ' class="'+item_.align+'"';
                            if (item_.color) _style += ' style="color:'+item_.color+'"';
                            item_.$td = $('<td'+_attr+_style+'></td>');
//console.error(item_.id, item_.align);
                        }
                    } else {    // ========================================= 편집 Grid
                        if (item_.align) _attr += ' '+item_.align;
                        if (item_.color) _style += ' style="color:'+item_.color+'"';
//console.error(item_);

                        switch (item_.type) {
                        case 'hidden':
                            item_.$edit = $('<input type="hidden" id="'+item_.id+'" value="'+item_.value+'" />');
                            item_.$td = $('<td style="display:none">'+item_.value+'</td>');
                            break;
                        case 'label':
                            ++_self.cfg.column_count;
                            item_.$edit = $('<div id="'+item_.id+'" class="'+_attr+'" '+_style+'></div>');
                            item_.$td = $('<td class="'+_attr+'" '+_style+'>'+item_.value+'</td>');
                            break;
                        case 'text':
                        case 'date':
                        case 'int':
                        case 'float':
                        case 'pop':
                            item_.ptype = 'grid';
                            ++_self.cfg.column_count;
                            item_.$td = $('<td class="'+_attr+'" '+_style+'>'+item_.value+'</td>');
                            item_.$edit = $('<input type="text" id="'+item_.id+'" value="'+item_.value+'" class="edit'+_attr+'" '+_style+' />');
                            break;
                        case 'radio':
                            ++_self.cfg.column_count;
                            item_.$edit = $('<input type="radio" id="'+item_.id+'" value="'+item_.value+'" />');
                            if (item_.checked)
                                item_.$td = $('<td class="edit'+_attr+'" '+_style+'>'+item_.value+'</td>');
                            else
                                item_.$td = $('<td class="edit'+_attr+'" '+_style+'></td>');
                            break;
                        case 'check':
                            ++_self.cfg.column_count;
                            item_.$edit = $('<input type="checkbox" id="'+item_.id+'" value="'+item_.value+'" />');
                            if (item_.checked)
                                item_.$td = $('<td class="edit'+_attr+'" '+_style+'>'+item_.value+'</td>');
                            else
                                item_.$td = $('<td class="edit'+_attr+'" '+_style+'></td>');
                            break;
                        case 'combo':
                            ++_self.cfg.column_count;
                            item_.$td = $('<td class="'+_attr+'" '+_style+'>'+item_.value+'</td>');
                            item_.$edit = $('<select id="'+item_.id+'" class="edit'+_attr+'" '+_style+'><option value="">♣선택</option></select>');
                            break;
                        case 'button':
                            ++_self.cfg.column_count;
                            item_.$td = $('<td class="'+_attr+'" '+_style+'><button id="'+item_.id+'" class="btn btn_normal '+item_.color+'">'+item_.text+'</button></td>');
                            item_.$edit = $('<button id="'+item_.id+'" class="btn btn_normal '+item_.color+'">'+item_.text+'</button>');
                            break;
                        }
//                        if (item_.mask) item_.$edit.mask(item_.mask, {reverse: true, placeholder:item_.mask.replace(/[0|#|?|*]/g, '_')});
//                        else item_.$edit.prop('placeholder', item_.text);
                        /**/
                    }
                    _self.modi[item_.id] = item_;
                });
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row._init ■■■';
            }
        },  // cx_row._init

        destroy: function() {
            try {
                if (this.options.debug) console.log('cx_row.destroy');

            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.destroy ■■■';
            }
        },  // cx_row.destroy

        set_cfg: function(param_) {
            try {
                if (this.options.debug) console.log('cx_row.cfg');
                this.cfg = $.extend(this.cfg, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.cfg ■■■';
            }
        },  // cx_row.cfg

        set_option: function(param_) {
            try {
                if (this.options.debug) console.log('cx_row.cfg');
                this.options = $.extend(this.options, param_);
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.cfg ■■■';
            }
        },  // cx_row.cfg
        /*----------------------------------------------
        * @cx_row
        * @returns  {void}
        ----------------------------------------------*/
        clear: function() {
            try {
                if (this.options.debug) console.log('cx_row.clear');
                this.cfg = {
                      version: '0.0.0.1'
                    , column_count: 0
                    , rowstart:''
                    , rowend:''
                    , focused: null

                },
                this.template = {
                     $tr : $('<tr>')         // editing template (TR)

                },
                this.mod = {},
                this.modi = {};
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_row.clear ■■■';
            }
        },  // cx_row.clear

    });
        })(cxApp);

