var md5 = require('./md5.js');
var myCrypt = require("./myCrypt.js");
var util = require("./util.js");
var oldPaths = require("./old-path.js");
const cryptoJS = require('./crypto-js.js');

const baseurl = process.env.VUE_APP_BASE_URL

//版本号
const verison = '10000'
//系统编号
const system_num = '7894251'
//AES数据加密KEY
const AES_KEY = 'A5E4E6DDF051C5EB01965235993359B0'
//MD5签名KEY
const MD5_KEY = 'D3B353598278632CD392FEFB1290D601'

let SecretKey = "piw38kulfozrea7ydmjnvbc965q1gt2x"


function postRequest(request) {
    request.method = 'POST'

    return jslRequest.call(this, request)
}

function getRequest(request) {
    request.method = 'GET'
    return jslRequest.call(this, request)
}

function jslRequest(request) {
    let defaultRequest = {
        data: {},
        expand: {},
        path: '',
        method: 'POST',
    }

    request = Object.assign(defaultRequest, request);

    return new Promise((resolve, reject) => {
        const token = uni.getStorageSync('token') || ''
        if (oldPaths.indexOf(request.path) != -1) {
            console.log('旧接口');
            var data = requestData(request.path, request.data, request.expand, token)
            uni.request({
                method: request.method,
                url: baseurl + '/userwxapp/', //仅为示例，并非真实接口地址。
                data: data,
                header: {
                    'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
                },
            }).then(data => {
                console.log(this);
                transformResponse.call(this, data, resolve, reject, request)
            })
        } else {
            console.log('新接口');
            let timestamp = new Date().getTime();
            const path = '/user-wxapp/' + request.path;

            let header = {
                ts: timestamp,
                sign: createSign(request.method.toUpperCase(), path, request.data, timestamp),
                token: '',
                app_version: verison,
            };

            uni.request({
                method: request.method,
                url: baseurl + path, //仅为示例，并非真实接口地址。
                data: Object.assign(request.data, request.expand),
                header: header,
            }).then(data => {
                transformResponse.call(this, data, resolve, reject, request)

            })
        }



    });
}

function transformResponse(response, resolve, reject, requestConfig) {
    // data为一个数组
    // 数组第一项为错误信息 即为 fail 回调
    // 第二项为返回数据
    var [err, res] = response;
    if (!!err) {
        reject(err);
        let noHandleView = requestConfig.noHandleView
        if (!noHandleView) {
            ///处理界面
            uni.$emit('net-error', {
                page: this,
                err
            })
        }
    } else {
        const { data, message, error_code,errorCode } = res.data;

        if (error_code == 0) {
            resolve(data);
        } else {
            console.log("netError:", message);
            reject({
                errorCode: error_code||errorCode,
                message
            });
            let noHandleView = requestConfig.noHandleView
            if (!noHandleView) {
                ///处理界面
                uni.$emit('net-error', {
                    page: this,
                    err: message
                })
            }
        }

    }
}
/**
 * 请求数据处理
 * userId 之后要替换成登录成功返回的id
 */
function requestData(uniqueFunction, inputData, expand, token) {
    var encryptData = {};
    var userinfo = (getApp() && getApp().globalData.userInfo) || uni.getStorageSync('userInfo');
    var userId = 0
    userinfo ? userId = userinfo.user_id : userId = 0;

    encryptData["function"] = uniqueFunction;
    encryptData["unique_data"] =
        userId +
        "|" +
        verison +
        "|" +
        new Date()
            .getTime()
            .toString()
            .substr(0, 10) +
        "|" +
        "userwxapp" +
        "|" +
        system_num +
        "|" +
        util.GUID();
    encryptData["api_version"] = verison;
    encryptData["token"] = token;
    encryptData["input_data"] = util.sortDict(inputData);

    var encryptDataJson = JSON.stringify(encryptData);
    var encryptDataStr = myCrypt.encrypt(
        encryptDataJson,
        AES_KEY
    );
    var expandData = expand != null ? expand : {};
    var expandDataJson = JSON.stringify(expandData);
    var signStr = md5.hex_md5(
        encryptDataStr +
        "&" +
        expandDataJson +
        "&" +
        MD5_KEY
    );
    var random = util.GUID();
    signStr =
        signStr.substring(0, 10) +
        random.substring(0, 5) +
        signStr.substring(10, 20) +
        random.substring(5, 10) +
        signStr.substring(20, 30) +
        random.substring(10, 15) +
        signStr.substring(30, 32);
    var returnData = {
        encrypt: encryptDataStr,
        expand: expandDataJson,
        sign: signStr
    };
    return returnData;
}

let createSign = function (method, URL, param, ClientTimestamp) {
    let StringToSign = method + "\n" + URL + "\n" + ClientTimestamp + "\n" + (param ? JSON.stringify(param) : "");
    let HmacSignature = cryptoJS.enc.Base64.stringify(cryptoJS.HmacSHA256(StringToSign, SecretKey));
    let Base64URL = function (base64Str) {
        let safeB64 = base64Str.replace(/\+/g, "-");
        safeB64 = safeB64.replace(/\//g, "_");
        let mod4 = safeB64.length % 4;
        let modAddStr = "====";
        safeB64 = safeB64 + modAddStr.substring(0, mod4);
        return safeB64;
    };
    return Base64URL(HmacSignature);
};

module.exports = {
    postRequest, getRequest
}