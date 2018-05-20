/*
  created by koreaERP@gmail.com
                    2007. 11. 11
  last modified     2007. 12. 24 ver 1.4
  init -> initDesign -> setFocus -> setValue -> hide
*/
  var aquaimgpath = 'http://cdn.cre-it.com/dx/plugin/alert/img/alertBox/'; // 이미지 경로 변경시 이 라인 변경
  if (typeof(_isIE) == 'undefined') var _isIE=(navigator.userAgent.match(/Gecko/))?false:true;
  var alertBox = {
	version: '0.0.0.1',
	msgobj: null,
	bglayer: null,
	msgtitle: null,
	msgdesc: null,
	msgicon: null,
	msgbtn: null,
	blnDrag: false,
    isOpen:false,
	curmove: {'x': 0, 'y:': 0},
	returnValue: false,
	returnFunction: null,
	initDesign: function() {
		if (document.body) var b = document.body;
		else if (document.documentElement) var b = document.documentElement;
		if (b.nodeName != 'BODY') {
			for (var i=0;i<b.childNodes.length; i++) { if (b.childNodes[i].nodeName == 'BODY') { b = b.childNodes[i]; break; } }
		}
		if (b.nodeName != 'BODY') return false;
		var obj = document.createElement('DIV');
		var t = obj.cloneNode(false);
		var _t = obj.cloneNode(false);
		var _m = obj.cloneNode(false);
		var _b = obj.cloneNode(false);
		obj.id = 'alertBox';
		b.appendChild(obj);
		this.msgobj = obj;
		_t.className = 'aquamsgBox_t';
		_m.className = 'aquamsgBox_ml';
		_b.className = 'aquamsgBox_b';
		obj.appendChild(_t);
		obj.appendChild(_m);
		obj.appendChild(_b);
		t.className = 'aquamsgBoxtitle';
		t.onmousedown = function (e) { alertBox.dragStart(e); };
		this.msgtitle = t;
		_t.appendChild(t);
		var t = document.createElement('IMG');
		var img = t.cloneNode(false);
		this.msgicon = img;
		img.className = 'aquamsgBoximg';
		img.style.display = 'none';
		t.className = 'aquamsgBoxclose';
		t.src = aquaimgpath+'close.gif';
		t.onclick = function () { alertBox.setValue('close'); alertBox.hide(); };
		_t.appendChild(t);

		var t = _m.cloneNode(false);
		t.className = 'aquamsgBox_mr';
		_m.appendChild(t);
		_m = t;
		var t = _m.cloneNode(false);
		t.className = 'aquamsgBox_mm';
		_m.appendChild(t);
		_m = t;
		_m.appendChild(img);
		var t = this.msgtitle.cloneNode(false);
		t.className = 'aquamsgBoxmsg';
		_m.appendChild(t);
		this.msgdesc = t;
		var t = this.msgtitle.cloneNode(false);
		t.className = 'aquamsgBoxbtn';
		_m.appendChild(t);
		this.msgbtn = t;
//		delete t,obj,img,_t,_m,_b;
		t=null,obj=null,img=null,_t=null,_m=null,_b=null;
		return true;
	},
	dragStart: function (event) {
		alertBox.blnDrag = true;
////		if (_isIE) {
////			var e = window.event;
////			window.document.attachEvent('onmousemove', alertBox.draging);
////			window.document.attachEvent('onselectstart', alertBox.cancelEvent);
////			window.document.attachEvent('onmouseup', alertBox.dragEnd);
////		}
////		else {
////			var e = event;
////			window.document.addEventListener('mousemove', alertBox.draging, false);
////			window.document.addEventListener('mouseup', alertBox.dragEnd, false);
////		}
        var e = event;
        window.document.addEventListener('mousemove', alertBox.draging, false);
        window.document.addEventListener('mouseup', alertBox.dragEnd, false);
		alertBox.curmove.x = parseInt(e.clientX);
		alertBox.curmove.y = parseInt(e.clientY);
	},
	dragEnd: function (e) {
////		if (_isIE) window.document.detachEvent('onmousemup', alertBox.dragEnd);
////		else window.document.removeEventListener('mouseup', alertBox.dragEnd, false);
        window.document.removeEventListener('mouseup', alertBox.dragEnd, false);
		alertBox.blnDrag = false;
	},
	draging: function (e) {
		if (alertBox.blnDrag == true) {
			if (parseInt(e.clientX - alertBox.curmove.x) > 5 || parseInt(e.clientX - alertBox.curmove.x) < -5) {
			alertBox.msgobj.style.left = parseInt(e.clientX) - parseInt(alertBox.msgobj.offsetWidth) / 3 + document.documentElement.scrollLeft + 'px';
			alertBox.curmove.x = e.clientX;
			}
			if (parseInt(e.clientY - alertBox.curmove.y) > 5 || parseInt(e.clientY - alertBox.curmove.y) < -5) {
			alertBox.msgobj.style.top = parseInt(e.clientY) - 15 + document.documentElement.scrollTop + 'px';
			alertBox.curmove.y = e.clientY;
			}
		}
	},
	cancelEvent: function (e) {
//		return false;
	},
	resizecheck: function () {
		alertBox.bglayer.style.height = (document.body.offsetHeight > document.documentElement.offsetHeight ? document.body.offsetHeight : document.documentElement.offsetHeight) + 'px';
		alertBox.bglayer.style.width = (document.body.offsetWidth > document.documentElement.offsetWidth ? document.body.offsetWidth : document.documentElement.offsetWidth) + 'px';
	},
	bgshow: function (val) {
		if (this.bglayer == null) {
			var obj = document.createElement('DIV');
			obj.className = 'aquamsgBoxbg';
			try {obj.style.opacity = .7;} catch(e) {}
			try {obj.style.MozOpacity = 0.7;} catch(e) {}
			try {obj.style.filter = 'alpha(opacity=70)';} catch(e) {}
			try {obj.style.KhtmlOpacity = 0.7;} catch(e) {}
			document.body.appendChild(obj);
			this.bglayer = obj;
		}
		if (val == 1) {
			var _height = this.trueBody().scrollHeight;
			var _width = this.trueBody().scrollWidth;
			_height = _height > this.trueBody().offsetHeight ? _height :this.trueBody().offsetHeight;
			_width = _width > this.trueBody().offsetWidth ? _width :this.trueBody().offsetWidth;
			this.bglayer.style.height = _height + 'px';
			this.bglayer.style.width = _width + 'px';
			this.bglayer.style.display = 'block';
		}
		else {
			this.bglayer.style.display = 'none';
		}
	},
	init: function (getTitle, getMsg, getBtn, getIcon, returnObj) {
		if (this.msgobj == null) var result = this.initDesign();
		if (result == false) { return false; }
		if (!getTitle) getTitle = '알림';
		if (!getMsg) getMsg = '오류로 인하여 요청이 처리되지 않았습니다';
		if (!getBtn) getBtn = 'OK';
		if (!getIcon) getIcon = 1;
		this.msgobj.style.left = '40%';
		this.msgobj.style.top = '40%';
		this.msgtitle.innerHTML = getTitle;
		this.msgdesc.innerHTML = getMsg.replace(/\n/g,'<br />');
		this.returnFunction=null;
		if (returnObj != null) this.returnFunction = returnObj;

		if (document.documentElement.scrollTop != 0) { this.msgobj.style.top = document.documentElement.scrollTop + (document.documentElement.offsetHeight/3) + 'px'; }
		else if (document.body.scrollTop != 0) { this.msgobj.style.top = document.body.scrollTop + (document.body.offsetHeight/4) + 'px'; }
		if (document.documentElement.scrollLeft != 0) this.msgobj.style.left = document.documentElement.scrollLeft + (document.documentElement.offsetWidth/3) + 'px';
		else if (document.body.scrollLeft != 0) this.msgobj.style.left = document.body.scrollLeft + (document.body.offsetWidth/4) + 'px';

		if (getIcon != 0 && getIcon < 5) {
			if (getIcon == 1) this.msgicon.src = aquaimgpath+'icon_info.gif';
			else if (getIcon == 2) this.msgicon.src = aquaimgpath+'icon_question.gif';
			else if (getIcon == 3) this.msgicon.src = aquaimgpath+'icon_warning.gif';
			else if (getIcon == 4) this.msgicon.src = aquaimgpath+'icon_error.gif';
			this.msgicon.style.display = 'block';
		}
		var btnstr = '';
		var btnarr = getBtn.split(';')[0].split('|');
		var cnt = btnarr.length;
		for (var i=0;i<cnt;i++) { btnstr += '<input type="button" class="aquamsgBoxbtnin" onclick="alertBox.setValue(this.value);alertBox.hide();" value="' + btnarr[i] + '">'; }
		this.msgbtn.innerHTML = btnstr;
		return true;
	},
	show: function (title, msg, returnobj, btn, icontype) {
		var result = this.init(title, msg, btn, icontype, returnobj);
		if (result == true) {
		    this.bgshow(1);
            window.addEventListener('resize', alertBox.resizecheck, false);
//            if (_isIE) window.attachEvent('onresize', alertBox.resizecheck);
//            else window.addEventListener('resize', alertBox.resizecheck, false);
            this.msgobj.style.display = 'block';
            if (btn != undefined && btn.split(';')[1] != undefined) {
                this.setFocus(btn.split(';')[1]);
            } else{
                setTimeout(function() {
                    this.alertBox.isOpen = true;
                    this.alertBox.setFocus()
                }, 0);
            }
		}
		else { window.alert(msg); }
	},
	hide: function() {
		this.bgshow(0);
		this.msgobj.style.display = 'none';
//		if (_isIE) {
//			window.document.detachEvent('onmousemove', alertBox.draging);
//			window.document.detachEvent('onselectstart', alertBox.cancelEvent);
//			window.document.detachEvent('onmouseup', alertBox.dragEnd);
//			window.detachEvent('onresize', alertBox.resizecheck);
//		}
//		else {
			window.document.removeEventListener('mousemove', alertBox.draging, false);
			window.document.removeEventListener('mouseup', alertBox.dragEnd, false);
			window.removeEventListener('resize', alertBox.resizecheck, false);
//		}
        this.isOpen = false;
		if (this.returnFunction != null) this.returnFunction();
	},
	setValue: function(val) {
		if (typeof(val) == 'string') this.returnValue = val;
		else this.returnValue = val;
	},
	getValue: function() {
		return this.returnValue;
	},
	setFocus: function(val) {
		if (!val) {
			if (this.msgbtn.hasChildNodes() == false) return false;
			if (this.msgbtn.firstChild.nodeName == 'INPUT') {
                    this.msgbtn.firstChild.focus();
			} else {
                this.msgbtn.firstChild.nextSibling.focus();
            }
			return true;
		}
		else {
			if (this.msgbtn.hasChildNodes() == false) return false;
			for (var i=0;i<this.msgbtn.childNodes.length;i++) { if (this.msgbtn.childNodes[i].nodeName == 'INPUT' && this.msgbtn.childNodes[i].value == val) { this.msgbtn.childNodes[i].focus(); return true; } }
			if (this.msgbtn.firstChild.nodeName == 'INPUT') this.msgbtn.firstChild.focus();
			else this.msgbtn.firstChild.nextSibling.focus();
		}
	},
	trueBody: function () {
		 return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement: document.body;
	}
  };

