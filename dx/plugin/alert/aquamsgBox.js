///*
//  created by nhosw at i-swear.com
//                    2007. 11. 11
//  last modified     2007. 12. 24 ver 1.4
//  aquamsgBox - DHTML Message BOX JAVASCRIPT
//  주석을 삭제하지 않는 조건으로 사용을 허락합니다.
//  init -> initDesign -> setFocus -> setValue -> hide
//*/
  var aquaimgpath = 'http://cdn.cre-it.com/dx/plugin/alert/img/aquamsgBox/'; // 이미지 경로 변경시 이 라인 변경
  if (typeof(_isIE) == 'undefined') var _isIE=(navigator.userAgent.match(/Gecko/))?false:true;
  var aquamsgBox = {
	msgobj: null,
	bglayer: null,
	msgtitle: null,
	msgdesc: null,
	msgicon: null,
	msgbtn: null,
	blnDrag: false,
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
		obj.id = 'aquamsgBox';
		b.appendChild(obj);
		this.msgobj = obj;
		_t.className = 'aquamsgBox_t';
		_m.className = 'aquamsgBox_ml';
		_b.className = 'aquamsgBox_b';
		obj.appendChild(_t);
		obj.appendChild(_m);
		obj.appendChild(_b);
		t.className = 'aquamsgBoxtitle';
		t.onmousedown = function (e) { aquamsgBox.dragStart(e); };
		this.msgtitle = t;
		_t.appendChild(t);
		var t = document.createElement('IMG');
		var img = t.cloneNode(false);
		this.msgicon = img;
		img.className = 'aquamsgBoximg';
		img.style.display = 'none';
		t.className = 'aquamsgBoxclose';
		t.src = aquaimgpath+'close.gif';
		t.onclick = function () { aquamsgBox.setValue('close'); aquamsgBox.hide(); };
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
		delete t,obj,img,_t,_m,_b;
		return true;
	},
	dragStart: function (event) {
		aquamsgBox.blnDrag = true;
////		if (_isIE) {
////			var e = window.event;
////			window.document.attachEvent('onmousemove', aquamsgBox.draging);
////			window.document.attachEvent('onselectstart', aquamsgBox.cancelEvent);
////			window.document.attachEvent('onmouseup', aquamsgBox.dragEnd);
////		}
////		else {
////			var e = event;
////			window.document.addEventListener('mousemove', aquamsgBox.draging, false);
////			window.document.addEventListener('mouseup', aquamsgBox.dragEnd, false);
////		}
        var e = event;
        window.document.addEventListener('mousemove', aquamsgBox.draging, false);
        window.document.addEventListener('mouseup', aquamsgBox.dragEnd, false);
		aquamsgBox.curmove.x = parseInt(e.clientX);
		aquamsgBox.curmove.y = parseInt(e.clientY);
	},
	dragEnd: function (e) {
////		if (_isIE) window.document.detachEvent('onmousemup', aquamsgBox.dragEnd);
////		else window.document.removeEventListener('mouseup', aquamsgBox.dragEnd, false);
        window.document.removeEventListener('mouseup', aquamsgBox.dragEnd, false);
		aquamsgBox.blnDrag = false;
	},
	draging: function (e) {
		if (aquamsgBox.blnDrag == true) {
			if (parseInt(e.clientX - aquamsgBox.curmove.x) > 5 || parseInt(e.clientX - aquamsgBox.curmove.x) < -5) {
			aquamsgBox.msgobj.style.left = parseInt(e.clientX) - parseInt(aquamsgBox.msgobj.offsetWidth) / 3 + document.documentElement.scrollLeft + 'px';
			aquamsgBox.curmove.x = e.clientX;
			}
			if (parseInt(e.clientY - aquamsgBox.curmove.y) > 5 || parseInt(e.clientY - aquamsgBox.curmove.y) < -5) {
			aquamsgBox.msgobj.style.top = parseInt(e.clientY) - 15 + document.documentElement.scrollTop + 'px';
			aquamsgBox.curmove.y = e.clientY;
			}
		}
	},
	cancelEvent: function (e) {
//		return false;
	},
	resizecheck: function () {
		aquamsgBox.bglayer.style.height = (document.body.offsetHeight > document.documentElement.offsetHeight ? document.body.offsetHeight : document.documentElement.offsetHeight) + 'px';
		aquamsgBox.bglayer.style.width = (document.body.offsetWidth > document.documentElement.offsetWidth ? document.body.offsetWidth : document.documentElement.offsetWidth) + 'px';
	},
	bgshow: function (val) {
		if (this.bglayer == null) {
			var obj = document.createElement('DIV');
			obj.className = 'aquamsgBoxbg';
			try {obj.style.opacity = 0;} catch(e) {}
			try {obj.style.MozOpacity = 0;} catch(e) {}
			try {obj.style.filter = 'alpha(opacity=0)';} catch(e) {}
			try {obj.style.KhtmlOpacity = 0;} catch(e) {}
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
		if (!getTitle) getTitle = 'MessageBox Title';
		if (!getMsg) getMsg = 'MessageBox Description';
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
		for (var i=0;i<cnt;i++) { btnstr += '<input type="button" class="aquamsgBoxbtnin" onclick="aquamsgBox.setValue(this.value);aquamsgBox.hide();" value="' + btnarr[i] + '">'; }
		this.msgbtn.innerHTML = btnstr;
		return true;
	},
	show: function (title, msg, returnobj, btn, icontype) {
		var result = this.init(title, msg, btn, icontype, returnobj);
		if (result == true) {
		    this.bgshow(1);
            window.addEventListener('resize', aquamsgBox.resizecheck, false);
//            if (_isIE) window.attachEvent('onresize', aquamsgBox.resizecheck);
//            else window.addEventListener('resize', aquamsgBox.resizecheck, false);
            this.msgobj.style.display = 'block';
            if (btn != undefined && btn.split(';')[1] != undefined) this.setFocus(btn.split(';')[1]);
            else this.setFocus();
		}
		else { window.alert(msg); }
	},
	hide: function() {
		this.bgshow(0);
		this.msgobj.style.display = 'none';
//		if (_isIE) {
//			window.document.detachEvent('onmousemove', aquamsgBox.draging);
//			window.document.detachEvent('onselectstart', aquamsgBox.cancelEvent);
//			window.document.detachEvent('onmouseup', aquamsgBox.dragEnd);
//			window.detachEvent('onresize', aquamsgBox.resizecheck);
//		}
//		else {
			window.document.removeEventListener('mousemove', aquamsgBox.draging, false);
			window.document.removeEventListener('mouseup', aquamsgBox.dragEnd, false);
			window.removeEventListener('resize', aquamsgBox.resizecheck, false);
//		}
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
			if (this.msgbtn.firstChild.nodeName == 'INPUT') this.msgbtn.firstChild.focus();
			else this.msgbtn.firstChild.nextSibling.focus();
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

