        (function(app_) {
    app_.cx_random = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_random 한글을 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.get_kor = function(len_) {
            try {
                if (this.debug) console.log('cx_random.get_kor');
                var res = '';
                for (var i=0; i<len_; i++) {
                    res += String.fromCharCode( 44031 + Math.ceil(11172 * Math.random()));
                }
                return res;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_random.get_kor ■■■';
            }
        } // end.method.cx_random -> get_kor

        this.get_ymd = function(sep_) {
            try {
                if (this.debug) console.log('cx_random.get_ymd');
                if (sep_ == undefined) sep_ = '-';
                var d = new Date();
                return (d.getFullYear())
                        +sep_+ ((''+(d.getMonth()+1)).length == 1 ? '0'+(d.getMonth()+1) : (d.getMonth())+1)
                        +sep_+ ((''+d.getDay()).length == 1 ? '0'+d.getDay() : d.getDay());
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_random.get_ymd ■■■';
            }
        } // end.method.cx_random -> get_ymd

        this.get_his = function(sep_) {
            try {
                if (this.debug) console.log('cx_random.get_his');
                if (sep_ == undefined) sep_ = ':';
                var d = new Date();
                return ((''+d.getHours()).length == 1 ? '0'+d.getHours() : d.getHours())
                        +sep_+ ((''+d.getMinutes()).length == 1 ? '0'+d.getMinutes() : d.getMinutes())
                        +sep_+ ((''+d.getSeconds()).length == 1 ? '0'+d.getSeconds() : d.getSeconds());
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_random.get_his ■■■';
            }
        } // end.method.cx_random -> get_his

    } // end of cx_random

        })(cxApp);
