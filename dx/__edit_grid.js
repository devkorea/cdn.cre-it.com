
/*****************************************************************************************
1. Edit Mode (항상 마지막 row 에 edit row 추가되어 있음)
    edit_grid: 전체 Row 가 edit mode 형태로 표시
    edit_row: row 를 클릭할때마다 edit mode 로 전환
2. addrow
    마지막 row 에서 엔터칠때 신규 row 추가 여부
*****************************************************************************************/
        ;var cxApp = window.minQuery || window.jQuery;
        (function(app_) {
        'use strict';

    var __cx_grid = {
        init: function (mod_) {
            this.version = '0.0.0.1';
            var $self = this;
            var evt = {};

            var mod = {};
            var modi = {};
            var grid = {};
//            grid.grid = $('#editor');
            grid.tr = [];
            grid.ttr = null;
            grid.focused = null;


            /*----------------------------------------------
            * @cx_label initialize
            * @returns  {void)
            ----------------------------------------------*/
            evt.init = function() {
                try {
                    // get template object
                    var _self = this;
                    mod = mod_;
                    grid.ttr = $('<tr>');
                    $.each(mod, function (idx_, item_) {
                        if (item_.rowstart == undefined) item_.rowstart = '';
                        if (item_.rowend == undefined) item_.rowend = '';
                        if (item_.value == undefined) item_.value = '';
                        if (item_.next == undefined) item_.next = '';
                        if (item_.checked == true) item_.checked = false;
                        switch (item_.type) {
                        case 'hidden':
                            item_.$edit = $('<input type="hidden" id="'+item_.id+'" value="'+item_.value+'" />');
                            item_.$td = $('<td style="display:none">'+item_.value+'</td>');
                            break;
                        case 'label':
                            item_.$edit = $('<div id="'+item_.id+'"></div>');
                            item_.$td = $('<td>'+item_.value+'</td>');
                            break;
                        case 'text':
                        case 'date':
                        case 'int':
                        case 'float':
                        case 'pop':
                            item_.$edit = $('<input type="text" id="'+item_.id+'" value="'+item_.value+'" class="edit" />');
                            item_.$td = $('<td>'+item_.value+'</td>');
                            break;
                        case 'radio':
                            item_.$edit = $('<input type="radio" id="'+item_.id+'" value="'+item_.value+'" />');
                            if (item_.checked)
                                item_.$td = $('<td>'+item_.value+'</td>');
                            else
                                item_.$td = $('<td></td>');
                            break;
                        case 'check':
                            item_.$edit = $('<input type="checkbox" id="'+item_.id+'" value="'+item_.value+'" />');
                            if (item_.checked)
                                item_.$td = $('<td>'+item_.value+'</td>');
                            else
                                item_.$td = $('<td></td>');
                            break;
                        }
                        modi[item_.id] = item_;
                        grid.ttr.append(item_.$td);
                    });
                } catch(e) {
                    console.info(e);
                    throw '■■■ error: cx_edit.init ■■■';
                }
            } // end func.cx_edit -> init


            this.add_row = function() {
                var _tr = grid.ttr.clone(true);
                _tr.on('dblclick', evt.evt_dblclick);
                $self.append(_tr);
                grid.tr.push(_tr);
            }

            // event handler: dblclick
            evt.evt_dblclick = function(evt_) {
                var _self = this;
                var _val = '', _rdo = -1;
                $.each(grid.tr, function (idx2_, row_) {
                    if ($(row_).data('edit') == true) {
                        if (row_.get(0) == evt_.currentTarget) {
                            return;
                        }
                        $.each($(row_).children('td'), function (idx_, td_) {
                            _val = '';
                            switch (mod[idx_].type) {
                            case 'label':
                                _val = mod[idx_].$edit.text();
                                break;
                            case 'text':
                            case 'date':
                            case 'int':
                            case 'float':
                            case 'pop':
                            case 'hidden':
                                _val = mod[idx_].$edit.val();
                                break;
                            case 'radio':
                            case 'check':
                                if (mod[idx_].$edit.prop('checked') == true) {
                                    _val = mod[idx_].$edit.val();
                                    _rdo = idx2_;
                                }
                                break;
                            }
                            $(td_).removeClass('edit').children().remove();
                            $(td_).text(_val);
                        });
                        $(row_).data('edit', false);
                    }
                });
                // reset data of radio
                if (_rdo > -1) {
                    $.each(grid.tr, function (idx2_, row_) {
                        if (_rdo == idx2_) return true;
                        $.each($(row_).children('td'), function (idx_, td_) {
                            if (mod[idx_].type == 'radio') {
                                td_.innerText = '';
                            }
                        });
                    });
                }

                // changing editing mode
                if ($(this).data('edit') == true) return;
                var _tr = $(this);
                _tr.data('edit', true);
                $.each(_tr.children('td'), function (idx_, td_) {
                    _val = td_.innerText;
                    $(td_).addClass('edit').html(mod[idx_].$edit);

                    switch (mod[idx_].type) {
                    case 'label':
                        mod[idx_].$edit.text(_val);
                        break;
                    case 'text':
                    case 'date':
                    case 'int':
                    case 'float':
                    case 'pop':
                    case 'hidden':
                        mod[idx_].$edit.val(_val);
                        break;
                    case 'radio':
                    case 'check':
                        if (_val != '' && mod[idx_].value == _val)
                            mod[idx_].$edit.prop('checked', true);
                        else
                            mod[idx_].$edit.prop('checked', false);
                        break;
                    }
                    mod[idx_].$edit.on('keydown', evt.evt_keydown);
                    mod[idx_].$edit.on('click', evt.evt_click);
                    if (grid.focused == null) {
                        if (mod[idx_].rowstart) {
                            mod[idx_].$edit.select().focus();
                            grid.focused = mod[idx_].$edit;
                        }
                    } else {
                        grid.focused.focus();
                    }
                });
            }

            // event handler: keydown
            evt.evt_keydown = function(evt_) {
                var _self = this;
                var _tr = '', e = '';
                switch(evt_.keyCode) {
                case 13:
                    var _id = evt_.currentTarget.id;
                    if (modi[_id].rowend) {
                        _tr = $(evt_.currentTarget).closest('tr').next('tr');
                        if (_tr.length > 0) {
                            grid.focused = null;
                            e = jQuery.Event('dblclick');
                            _tr.trigger(e);
                        } else {    // end of last row
                            grid.focused = null;
                            $self.add_row();
                            _tr = $(evt_.currentTarget).closest('tr').next('tr');
                            e = jQuery.Event('dblclick');
                            _tr.trigger(e);
                        }
                    } else {
                        grid.focused = modi[modi[evt_.currentTarget.id].next].$edit;
                        grid.focused.focus();
                    }
                    break;
                case 38:
                    _tr = $(evt_.currentTarget).closest('tr').prev('tr');
                    if (_tr.length > 0) {
                        e = jQuery.Event('dblclick');
                        _tr.trigger(e);
                    }
                    break;
                case 40:
                    _tr = $(evt_.currentTarget).closest('tr').next('tr');
                    if (_tr.length > 0) {
                        e = jQuery.Event('dblclick');
                        _tr.trigger(e);
                    } else {    // end of last row
                        $self.add_row();
                        _tr = $(evt_.currentTarget).closest('tr').next('tr');
                        e = jQuery.Event('dblclick');
                        _tr.trigger(e);
                    }
                    break;
                }
            }

            // event handler: click
            evt.evt_click = function(evt_) {
                if (modi[evt_.currentTarget.id].$edit != undefined) {
                    grid.focused = modi[evt_.currentTarget.id].$edit;
                }
            }
            evt.init();

            return this;
        } // end method.cx_edit ->  init
    }; app_.fn.cx_edit = function (method) { return __cx_grid.init.apply(this, arguments); } // end of cx_edit

        })(cxApp);

/**
$(function() {
    'use strict';

    var modi = {};
    var grid = {}
    grid.grid = $('#editor');
    grid.tr = [];
    grid.focused = null;

    grid.add_row = function() {
        var _tr = grid.ttr.clone(true);
        _tr.on('dblclick', grid.evt_dblclick);
        grid.grid.append(_tr);
        grid.tr.push(_tr);
    }

    // event handler: dblclick
    grid.evt_dblclick = function(evt_) {
        var _val = '', _rdo = -1;
        $.each(grid.tr, function (idx2_, row_) {
            if ($(row_).data('edit') == true) {
                if (row_.get(0) == evt_.currentTarget) {
                    return;
                }
                $.each($(row_).children('td'), function (idx_, td_) {
                    _val = '';
                    switch (mod[idx_].type) {
                    case 'label':
                        _val = mod[idx_].$edit.text();
                        break;
                    case 'text':
                    case 'date':
                    case 'int':
                    case 'float':
                    case 'pop':
                    case 'hidden':
                        _val = mod[idx_].$edit.val();
                        break;
                    case 'radio':
                    case 'check':
                        if (mod[idx_].$edit.prop('checked') == true) {
                            _val = mod[idx_].$edit.val();
                            _rdo = idx2_;
                        }
                        break;
                    }
                    $(td_).removeClass('edit').children().remove();
                    $(td_).text(_val);
                });
                $(row_).data('edit', false);
            }
        });

        // reset data of radio
        if (_rdo > -1) {
            $.each(grid.tr, function (idx2_, row_) {
                if (_rdo == idx2_) return true;
                $.each($(row_).children('td'), function (idx_, td_) {
                    if (mod[idx_].type == 'radio') {
                        td_.innerText = '';
                    }
                });
            });
        }

        // changing editing mode
        if ($(this).data('edit') == true) return;
        var _tr = $(this);
        _tr.data('edit', true);
        $.each(_tr.children('td'), function (idx_, td_) {
            _val = td_.innerText;
            $(td_).addClass('edit').html(mod[idx_].$edit);

            switch (mod[idx_].type) {
            case 'label':
                mod[idx_].$edit.text(_val);
                break;
            case 'text':
            case 'date':
            case 'int':
            case 'float':
            case 'pop':
            case 'hidden':
                mod[idx_].$edit.val(_val);
                break;
            case 'radio':
            case 'check':
                if (_val != '' && mod[idx_].value == _val)
                    mod[idx_].$edit.prop('checked', true);
                else
                    mod[idx_].$edit.prop('checked', false);
                break;
            }
            mod[idx_].$edit.on('keydown', grid.evt_keydown);
            mod[idx_].$edit.on('click', grid.evt_click);
            if (grid.focused == null) {
                if (mod[idx_].rowstart) {
                    mod[idx_].$edit.select().focus();
                    grid.focused = mod[idx_].$edit;
                }
            } else {
                grid.focused.focus();
            }
        });
    }

    // event handler: keydown
    grid.evt_keydown = function(evt_) {
        var _tr = '', e = '';
        switch(evt_.keyCode) {
        case 13:
            var _id = evt_.currentTarget.id;
            if (modi[_id].rowend) {
                _tr = $(evt_.currentTarget).closest('tr').next('tr');
                if (_tr.length > 0) {
                    grid.focused = null;
                    e = jQuery.Event('dblclick');
                    _tr.trigger(e);
                } else {    // end of last row
                    grid.focused = null;
                    grid.add_row();
console.error('???????');
                    _tr = $(evt_.currentTarget).closest('tr').next('tr');
                    e = jQuery.Event('dblclick');
                    _tr.trigger(e);
                }
            } else {
                grid.focused = modi[modi[evt_.currentTarget.id].next].$edit;
                grid.focused.focus();
            }
            break;
        case 38:
            _tr = $(evt_.currentTarget).closest('tr').prev('tr');
            if (_tr.length > 0) {
                e = jQuery.Event('dblclick');
                _tr.trigger(e);
            }
            break;
        case 40:
            _tr = $(evt_.currentTarget).closest('tr').next('tr');
            if (_tr.length > 0) {
                e = jQuery.Event('dblclick');
                _tr.trigger(e);
            } else {    // end of last row
                grid.add_row();
                _tr = $(evt_.currentTarget).closest('tr').next('tr');
                e = jQuery.Event('dblclick');
                _tr.trigger(e);
            }
            break;
        }
    }
    // event handler: click
    grid.evt_click = function(evt_) {
        if (modi[evt_.currentTarget.id].$edit != undefined) {
            grid.focused = modi[evt_.currentTarget.id].$edit;
        }
    }
    // get template object
    grid.ttr = $('<tr>');
    $.each(mod, function (idx_, item_) {
        if (item_.rowstart == undefined) item_.rowstart = '';
        if (item_.rowend == undefined) item_.rowend = '';
        if (item_.value == undefined) item_.value = '';
        if (item_.next == undefined) item_.next = '';
        if (item_.checked == true) item_.checked = false;
        switch (item_.type) {
        case 'hidden':
            item_.$edit = $('<input type="hidden" id="'+item_.id+'" value="'+item_.value+'" />');
            item_.$td = $('<td style="display:none">'+item_.value+'</td>');
            break;
        case 'label':
            item_.$edit = $('<div id="'+item_.id+'"></div>');
            item_.$td = $('<td>'+item_.value+'</td>');
            break;
        case 'text':
        case 'date':
        case 'int':
        case 'float':
        case 'pop':
            item_.$edit = $('<input type="text" id="'+item_.id+'" value="'+item_.value+'" class="edit" />');
            item_.$td = $('<td>'+item_.value+'</td>');
            break;
        case 'radio':
            item_.$edit = $('<input type="radio" id="'+item_.id+'" value="'+item_.value+'" />');
            if (item_.checked)
                item_.$td = $('<td>'+item_.value+'</td>');
            else
                item_.$td = $('<td></td>');
            break;
        case 'check':
            item_.$edit = $('<input type="checkbox" id="'+item_.id+'" value="'+item_.value+'" />');
            if (item_.checked)
                item_.$td = $('<td>'+item_.value+'</td>');
            else
                item_.$td = $('<td></td>');
            break;
        }
        modi[item_.id] = item_;
        grid.ttr.append(item_.$td);
    });

    grid.add_row();
    grid.add_row();
    grid.add_row();
    grid.add_row();
    grid.add_row();



});
**/