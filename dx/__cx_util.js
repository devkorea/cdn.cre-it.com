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
    * @desc
    ----------------------------------------------*/
    _act.get_browser = function() {
        var agt = navigator.userAgent.toLowerCase();
        if (agt.indexOf('chrome') != -1) return 'Chrome';
        if (agt.indexOf('opera') != -1) return 'Opera';
        if (agt.indexOf('staroffice') != -1) return 'Star Office';
        if (agt.indexOf('webtv') != -1) return 'WebTV';
        if (agt.indexOf('beonex') != -1) return 'Beonex';
        if (agt.indexOf('chimera') != -1) return 'Chimera';
        if (agt.indexOf('netpositive') != -1) return 'NetPositive';
        if (agt.indexOf('phoenix') != -1) return 'Phoenix';
        if (agt.indexOf('firefox') != -1) return 'Firefox';
        if (agt.indexOf('safari') != -1) return 'Safari';
        if (agt.indexOf('skipstone') != -1) return 'SkipStone';
        if (agt.indexOf('msie') != -1) return 'Internet Explorer';
        if (agt.indexOf('netscape') != -1) return 'Netscape';
        if (agt.indexOf('mozilla/5.0') != -1) return 'Mozilla';
    } // end func



    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_date = function() {
        var d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    } // end func

    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_bool = function() {
        return Math.random() >= 0.5;
    } // end func

    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_float = function(min, max, dot) {
        var f = Math.random() * (max - min) + min;
        if (dot) {
            return f.toFixed(dot);
        }
        return f;
    } // end func

    _act.get_random_int = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    } // end func
    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_kor = function(len_) {
        var str = '';
        for(var i=0; i<=len_; i++) {
            str += String.fromCharCode(44031 + Math.ceil(11172 * Math.random()));
        }
        return str;
    } // end func

    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_mask = function(mask_) {
        mask_ = mask_.replace(/[^0-9]/g, '');
        return _act.get_random_int(mask_, Math.pow(9, mask_.length), Math.pow(15, mask_.length-1));
    } // end func





    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_string = function(len_) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        var str = '';
        for(var i=0; i<=len_; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            str += chars.substring(rnum, rnum + 1);
        }
        return str;
    } // end func


    /*----------------------------------------------
    * @desc
    ----------------------------------------------*/
    _act.get_random_yn = function() {
        return (Math.random() >= 0.5) ? 'Y' : 'N';
    } // end func














    /*----------------------------------------------
    * @desc post submit
    ----------------------------------------------*/
    _act.submit_post = function(url, param) {
        var result;
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            contentType:'application/x-www-form-urlencoded; charset=utf-8',
            async: false,
            cache: false,
            data: param,
            success: function(data, textStatus) {
                result = data;
            }
        });
        return result;
    } // end func


    /*----------------------------------------------
    * @desc debug submit
    ----------------------------------------------*/
    _act.submit_debug = function(url, param) {
        var result;
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'text',
            contentType:'application/x-www-form-urlencoded; charset=utf-8',
            async: false,
            cache: false,
            data: param,
            success: function(data, textStatus) {
                result = data;
            }
        });
        return result;
    } // end func


    var methods = {
        init: function (options) {
            this.get_browser = _act.get_browser;
            this.get_date = _act.get_date;
            this.get_random_bool = _act.get_random_bool;
            this.get_random_float = _act.get_random_float;
            this.get_random_int = _act.get_random_int;
            this.get_random_kor = _act.get_random_kor;
            this.get_random_mask = _act.get_random_mask;
            this.get_random_yn = _act.get_random_yn;
            this.get_random_string = _act.get_random_string;
            this.submit_post = _act.submit_post;
            this.submit_debug = _act.submit_debug;






            return this;
        }
    }
    $.fn.dx_util = function (method) { return methods.init.apply(this, arguments); }
})(jQuery);
