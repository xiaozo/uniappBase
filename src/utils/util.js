var api = require('config/api.js');

///oss地址
function ossResource(path) {
    return `/static/${path}`
  }

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatTimeNum(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

function testMobile(num) {
    console.log
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (num.length == 0) {
        uni.showToast({
            title: '手机号为空',
            image: '/static/icon_error.png',
        })
        return false;
    } else if (num.length < 11) {
        uni.showToast({
            title: '手机号长度有误！',
            image: '/static/icon_error.png',
        })
        return false;
    } else if (!myreg.test(num)) {
        uni.showToast({
            title: '手机号有误！',
            image: '/static/icon_error.png',
        })
        return false;
    } else {
        return true;
    }
}

function uploadFile(filePath, name = "upload_file") {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: api.UploadAvatar,
            filePath: filePath,
            name: name,
            formData: {

            },
            success(res) {
                if (res.statusCode == 200) {
                    let re = res.data;
                    
                } else {
                    reject('上传失败！')
                }
            },
            fail(error) {
                reject('上传失败！')
            }
        });
    })

}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {

    return self_requestV2.call(this, url, data, {
        method
    })
}

/**
 * 封封微信的的request
 */
function requestV2(url, data = {}, extend = {}) {
    return self_requestV2.call(this, url, data, extend)
}

function self_requestV2(url, data = {}, extend = {}) {
    let that = this

    let defaultExtend = {
        showLoading: false,
        method: "GET",
        ///是否是静默请求，true不提示错误信息
        silent: false
    }
    defaultExtend = {
        ...defaultExtend,
        ...extend
    }
    let {
        showLoading,
        method,
        silent
    } = defaultExtend
    if (!!showLoading) {
        uni.showLoading({
            title: "",
            mask: true,
        });
    }
    return new Promise(function (resolve, reject) {
        uni.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-Hioshop-Token': uni.getStorageSync('token')
            },
            success: function (res) {
                if (res.statusCode == 200) {

                    if (res.data.errno == 401) {
                        //需要登录后才可以操作

                    } else {
                        if (res.data.errno == 0) {
                            ///处理界面

                            resolve(res.data.data);
                            uni.$emit('net-success', {
                                page: that
                            })
                        } else {
                            reject(res.data.errmsg);
                            uni.$emit('net-error', {
                                page: that,
                                msg: res.data.errmsg

                            })
                            if (!silent) {
                                showErrorToast(res.data.errmsg);
                            }

                        }

                    }
                } else {
                    reject(res.errMsg);
                    uni.$emit('net-error', {
                        page: that,
                        msg: res.errMsg

                    })
                    if (!silent) {
                        showErrorToast(res.errMsg);
                    }

                }

            },
            fail: function (err) {
                reject(err)
                uni.$emit('net-error', {
                    page: that,
                    msg: err

                })
                if (!silent) {
                    showErrorToast(err);
                }

            }
        })
    }).finally(function () {
        if (!!showLoading) {
            uni.hideLoading();
        }
    });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        uni.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}

/**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        uni.login({
            success: function (res) {
                if (res.code) {
                    //登录远程服务器
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function getUserInfo() {
    return new Promise(function (resolve, reject) {
        uni.getUserInfo({
            withCredentials: true,
            success: function (res) {
                resolve(res);
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
}

function redirect(url) {

    //判断页面是否需要登录
    uni.redirectTo({
        url: url
    });
}

function showErrorToast(msg) {
    uni.showToast({
        title: msg,
        image: "/static/icon_error.png",
    })
}

function showSuccessToast(msg) {
    uni.showToast({
        title: msg,
        icon: 'success',
    })
}

function sentRes(url, data, method, fn) {
    data = data || null;
    if (data == null) {
        var content = require('querystring').stringify(data);
    } else {
        var content = JSON.stringify(data); //json format
    }

    var parse_u = require('url').parse(url, true);
    var isHttp = parse_u.protocol == 'http:';
    var options = {
        host: parse_u.hostname,
        port: parse_u.port || (isHttp ? 80 : 443),
        path: parse_u.path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(content, "utf8"),
            'Trackingmore-Api-Key': '1b70c67e-d191-4301-9c05-a50436a2526d'
        }
    };
    var req = require(isHttp ? 'http' : 'https').request(options, function (res) {
        var _data = '';
        res.on('data', function (chunk) {
            _data += chunk;
        });
        res.on('end', function () {
            fn != undefined && fn(_data);
        });
    });
    req.write(content);
    req.end();
}

function loginNow() {
    let userInfo = uni.getStorageSync('userInfo');

    if (userInfo == '') {
        uni.login({
            success: (res) => {
                request(api.AuthLoginByWeixin, {
                    code: res.code
                }, 'POST').then(function (res) {
                    let userInfo = res.userInfo;
                    uni.setStorageSync('token', res.token);
                    uni.setStorageSync('userInfo', userInfo);
                });
            },
        });
    } else {
        return true;
    }
}

function getTextLength(str, full) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += (full ? 2 : 1);
        }
    }
    return len;
}

/**
 * rgba(255, 255, 255, 1) => #ffffff
 * @param {String} color 
 */
function transferColor(color = '') {
    let res = '#';
    color = color.replace(/^rgba?\(/, '').replace(/\)$/, '');
    color = color.split(', ');

    color.length > 3 ? color.length = 3 : '';
    for (let item of color) {
        item = parseInt(item || 0);
        if (item < 10) {
            res += ('0' + item)
        } else {
            res += (item.toString(16))
        }
    }

    return res;
}

function transferBorder(border = '') {
    let res = border.match(/(\w+)px\s(\w+)\s(.*)/);
    let obj = {};

    if (res) {
        obj = {
            width: +res[1],
            style: res[2],
            color: res[3]
        }
    }

    return res ? obj : null;
}


/**
 * 内边距，依次为上右下左
 * @param {*} padding 
 */
function transferPadding(padding = '0 0 0 0') {
    padding = padding.split(' ');
    for (let i = 0, len = padding.length; i < len; i++) {
        padding[i] = +padding[i].replace('px', '');
    }

    return padding;
}
/**
 * type1: 0, 25, 17, rgba(0, 0, 0, 0.3)
 * type2: rgba(0, 0, 0, 0.3) 0px 25px 17px 0px => (0, 25, 17, rgba(0, 0, 0, 0.3))
 * @param {*} shadow 
 */
function transferBoxShadow(shadow = '', type) {
    if (!shadow || shadow === 'none') return;
    let color;
    let split;

    split = shadow.match(/(\w+)\s(\w+)\s(\w+)\s(rgb.*)/);

    if (split) {
        split.shift();
        shadow = split;
        color = split[3] || '#ffffff';
    } else {
        split = shadow.split(') ');
        color = split[0] + ')'
        shadow = split[1].split('px ');
    }

    return {
        offsetX: +shadow[0] || 0,
        offsetY: +shadow[1] || 0,
        blur: +shadow[2] || 0,
        color
    }
}

function getUid(prefix) {
    prefix = prefix || '';

    return (
        prefix +
        'xxyxxyxx'.replace(/[xy]/g, c => {
            let r = (Math.random() * 16) | 0;
            let v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    );
}


module.exports = {
    ossResource,
    formatTime: formatTime,
    formatTimeNum: formatTimeNum,
    request,
    requestV2,
    redirect,
    showErrorToast,
    showSuccessToast,
    checkSession,
    login,
    getUserInfo,
    testMobile,
    sentRes,
    loginNow,
    getTextLength,
    transferBorder,
    transferColor,
    transferPadding,
    transferBoxShadow,
    getUid,
    uploadFile
}