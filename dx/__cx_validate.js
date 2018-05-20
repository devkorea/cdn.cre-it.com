/*******************************************************************************************************
1. Plugin       : https://github.com/renzhn/phpjs/tree/master/website/_functions
2. Plugin Desc  :
3. Create Date  : 2018-03-19
4. Create User  : koreaERP@gmail.com
5. Dependency   : dx_util
6. Execute Test :
*******************************************************************************************************/
;(function ($) {
    var _act = {};
    var version = '0.0.0.1';


    /*----------------------------------------------
    * @desc check id
    ----------------------------------------------*/
    _act.is_id = function() {
        var res = false;

        return res;
    } // end func

    /*----------------------------------------------
    * @desc check password
    ----------------------------------------------*/
    _act.is_pwd = function() {
        var res = false;

        return res;
    } // end func

    /*----------------------------------------------
    * @desc check email
    ----------------------------------------------*/
    _act.is_email = function() {
        var res = false;

        return res;
    } // end func

    /*----------------------------------------------
    * @desc check biz no
    ----------------------------------------------*/
    _act.is_bizno = function() {
        var res = false;

        return res;
    } // end func

    /*----------------------------------------------
    * @desc check reg no
    ----------------------------------------------*/
    _act.is_regno = function() {
        var res = false;

        return res;
    } // end func

    /*----------------------------------------------
    * @desc check password
    ----------------------------------------------*/
    _act.is_regex = function(arr_) {
        var res = true, reg = '';
        $.each(arr_, function (idx_, item_) {
            reg = new RegExp(item_+'$', '');
            if (location.hostname.match(reg) != null) { res = false;return false; }
            else if (document.domain.match(reg) != null) { res = false;return false; }
            else if (window.location.hostname.match(reg) != null) { res = false;return false; }
        });
        if (res) {
            alertBox.show('알림', '유효하지 않은 라이센스입니다', function(){
                try{
                    window.open('about:blank','_parent').parent.close();
                } catch (e){
                    window.history.back();
                    top.document.location.href='http://dsit.in';
                }
            });
            try{
                window.open('about:blank','_parent').parent.close();
            } catch (e){
                window.history.back();
                top.document.location.href='http://dsit.in';
            }
        }
    } // end func


    var methods = {
        init: function (options) {
            this.is_bizno = _act.is_bizno;
            this.is_email = _act.is_email;
            this.is_id = _act.is_id;
            this.is_pwd = _act.is_pwd;
            this.is_regno = _act.is_regno;
            this.is_regex = _act.is_regex;
            this.submit_post = _act.submit_post;
//            this.html_entity_decode = _act.html_entity_decode;  // &gt; 를 < 로 변환
//            this.htmlspecialchars = _act.htmlspecialchars;      // < 을 &gt; 로 변환
//            this.in_array = _act.in_array;

            return this;
        }
    }
    $.fn.dx_validate = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);

