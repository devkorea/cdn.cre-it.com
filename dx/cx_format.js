        (function(app_) {

    app_.cx_format = function () {
        this.version = '0.0.0.1';
        this.debug = false;
        /*----------------------------------------------
        * @cx_formattor 포멧처리
        * @returns  {string}
        ----------------------------------------------*/
        this.format = function(format_, data_, len_) {
            try {
                if (this.debug) console.log('cx_format.format');
                if (data_ == undefined || !data_) return data_;
                switch (format_) {
                    case 'yyyy-mm-dd':
                        if (data_.length == 19) {
                            data_ = data_.substring(0, 10);
                            data_ = data_.substr(0, 4)+'-'+data_.substr(5, 2)+'-'+data_.substr(8, 2);
                        } else if (data_.length == 8)
                            data_ = data_.substr(0, 4)+'-'+data_.substr(4, 2)+'-'+data_.substr(6, 2);
                        else if (data_.length == 10)
                            data_ = data_.substr(0, 4)+'-'+data_.substr(5, 2)+'-'+data_.substr(8, 2);
                        break;
                    case 'yyyy.mm.dd':
                        if (data_.length == 19) {
                            data_ = data_.substring(0, 10);
                            data_ = data_.substr(0, 4)+'.'+data_.substr(5, 2)+'.'+data_.substr(8, 2);
                        } else if (data_.length == 8)
                            data_ = data_.substr(0, 4)+'.'+data_.substr(4, 2)+'.'+data_.substr(6, 2);
                        else if (data_.length == 10)
                            data_ = data_.substr(0, 4)+'.'+data_.substr(5, 2)+'.'+data_.substr(8, 2);
                        break;
                    case '#,##0':
                    case 'comma':
                        data_ = (data_+'').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
                        break;
                    case 'zerofill':
                        if (len_ == undefined || typeof len_ != 'number')
                            throw '■■■ error: length param is undefined ■■■';
                        len_ -= data_.toString().length;
                        if (len_ > 0) {
                            data_ = new Array(len_ + (/\./.test(data_) ? 2 : 1)).join('0') + data_;
                        }
                        break;
                    case 'int':
                        data_ = (data_+'').replace(/[,]/g, '');
                        break;

                }
                return data_;
            } catch(e) {
                console.error(e);
                throw '■■■ error: cx_format.format ■■■';
            }
        } // end.method.cx_format -> format

    } // end of cx_format

        })(cxApp);
