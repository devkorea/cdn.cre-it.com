        (function(app_) {
    app_.cx_validate = function () {
        this.version = '0.0.0.1';
        this.debug = false;

        /*----------------------------------------------
        * @cx_validate check number
        ----------------------------------------------*/
        this.is_num = function() {
            try {
                if (this.debug) console.log('cx_validate.is_num');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_num ■■■';
            }
        } // end.method.cx_validate -> is_num

        /*----------------------------------------------
        * @cx_validate check id
        ----------------------------------------------*/
        this.is_id = function() {
            try {
                if (this.debug) console.log('cx_validate.is_id');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_id ■■■';
            }
        } // end.method.cx_validate -> is_id

        /*----------------------------------------------
        * @cx_validate check password
        ----------------------------------------------*/
        this.is_pwd = function() {
            try {
                if (this.debug) console.log('cx_validate.is_pwd');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_pwd ■■■';
            }
        } // end.method.cx_validate -> is_pwd

        /*----------------------------------------------
        * @cx_validate check email
        ----------------------------------------------*/
        this.is_email = function() {
            try {
                if (this.debug) console.log('cx_validate.is_email');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_email ■■■';
            }
        } // end.method.cx_validate -> is_email

        /*----------------------------------------------
        * @cx_validate check biz no
        ----------------------------------------------*/
        this.is_bizno = function() {
            try {
                if (this.debug) console.log('cx_validate.is_bizno');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_bizno ■■■';
            }
        } // end.method.cx_validate -> is_bizno

        /*----------------------------------------------
        * @cx_validate check reg no
        ----------------------------------------------*/
        this.is_regno = function() {
            try {
                if (this.debug) console.log('cx_validate.is_regno');
                var res = false;
                return res;
            } catch(e) {
                console.info(e);
                throw '■■■ error: cx_validate.is_regno ■■■';
            }
        } // end.method.cx_validate -> is_regno

        /*----------------------------------------------
        * @cx_validate 접속한 브라우저 정보를 반한
        * @returns  {string}
        ----------------------------------------------*/
        this.is_auth = function(arr_) {
            try {
                //if (this.debug) console.log('cx_validate.is_auth');
                var res = true, reg = '';
                $.each(arr_, function (idx_, item_) {
                    reg = new RegExp(item_+'$', '');
                    if (location.hostname.match(reg) != null) { res = false;return false; }
                    else if (document.domain.match(reg) != null) { res = false;return false; }
                    else if (window.location.hostname.match(reg) != null) { res = false;return false; }
                });
                if (res) {
                    alert('유효하지 않은 라이센스입니다');
                    throw '■■■ error ■■■';
                    //alertBox.show('알림', '유효하지 않은 라이센스입니다', function(){
                    //    try{
                    //        window.open('about:blank','_parent').parent.close();
                    //    } catch (e){
                    //        window.history.back();
                    //        top.document.location.href='http://dsit.in';
                    //    }
                    //});
                    //try{
                    //    window.open('about:blank','_parent').parent.close();
                    //} catch (e){
                    //    window.history.back();
                    //    top.document.location.href='http://dsit.in';
                    //}
                }
            } catch(e) {
                console.info(e);
                //throw '■■■ error: cx_validate.is_auth ■■■';
            }
        } // end.method.cx_validate -> is_auth
        this.is_auth(['dsitec.com','msos.kr','dsit.in']);

    } // end of cx_validate
        })(cxApp);
