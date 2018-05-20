        (function(app_) {
    app_.cx_util = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_util 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_browser = function() {
            try {
                if (this.debug) console.log('cx_util.get_browser');
                var agt = navigator.userAgent.toLowerCase ();   // UserAgent를 이용해서 IE인지를 체크합니다.
                if (agt.indexOf ('msie') != -1 || agt.indexOf('trident') != - 1) {  // IE7엔 브라우저 엔진명인 Trident가 없고 IE11엔 MSIE란 문자열이 없으므로 두 가지 경우를 다 체크합니다.
                    var version = 11 ;
                    agt = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agt);
                    if (agt) {
                        version = parseInt(agt[1]);
                    }
                    return 'ie' + version;
                } else {
                    if (agt.indexOf('chrome') != -1) return 'chrome';
                    if (agt.indexOf('opera') != -1) return 'opera';
                    if (agt.indexOf('staroffice') != -1) return 'star office';
                    if (agt.indexOf('webtv') != -1) return 'webtv';
                    if (agt.indexOf('beonex') != -1) return 'beonex';
                    if (agt.indexOf('chimera') != -1) return 'chimera';
                    if (agt.indexOf('netpositive') != -1) return 'netpositive';
                    if (agt.indexOf('phoenix') != -1) return 'phoenix';
                    if (agt.indexOf('firefox') != -1) return 'firefox';
                    if (agt.indexOf('safari') != -1) return 'safari';
                    if (agt.indexOf('skipstone') != -1) return 'skipstone';
                    if (agt.indexOf('msie') != -1) return 'internet explorer';
                    if (agt.indexOf('netscape') != -1) return 'netscape';
                    if (agt.indexOf('mozilla/5.0') != -1) return 'mozilla';
                }
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_util.get_browser ■■■';
            }
        } // end.method.cx_util -> get_browser

        ///*----------------------------------------------
        //* @cx_util 콤마찍기
        //* @param    {string}
        //* @returns  {string}
        //----------------------------------------------*/
        //this.add_comma = function(str_) {
        //    try {
        //        if (this.debug) console.log('cx_util.add_comma');
        //        return str_.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
        //    } catch(e) {
        //        console.info(e);
        //        throw '■■■ error: cx_util.add_comma ■■■';
        //    }
        //} // end.method.cx_util -> add_comma

        /*----------------------------------------------
        * @cx_util HTML Entity 를 원래로 치환
        * @param    {string} E: edit, V:view
        * @param    {string}
        * @returns  {string}
        ----------------------------------------------*/
        this.replace_html = function(mode_, str_) {
            try {
                if (this.debug) console.log('cx_util.replace_html');
                if (!str_) return '';
                if (typeof str_ != 'string') return str_;
                if (mode_ == 'E') {
                    str_ = str_.replace(/&lt;/g,  '<');
                    str_ = str_.replace(/&gt;/g,  '>');
                    str_ = str_.replace(/&#92;/g, '"');
                    str_ = str_.replace(/&quot;/g, '"');
                    str_ = str_.replace(/&#039;/g, "'");
                    str_ = str_.replace(/<br \/>/g, '\n');
                    str_ = str_.replace(/<br>/g, '\n');
                    str_ = str_.replace(/<br\/>/g, '\n');
                    str_ = str_.replace(/&amp;/g,  '&');
                } else {
                    str_ = str_.replace(/</g,  '&lt;');
                    str_ = str_.replace(/>/g,  '&gt;');
                    str_ = str_.replace(/\"/g, '&quot;');
                    str_ = str_.replace(/\'/g, '&#39;');
                    str_ = str_.replace(/\n/g, '<br />');
                }
                return str_;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_util.replace_html ■■■';
            }
        } // end.method.cx_util -> replace_html
    } // end of cx_util

        })(cxApp);
