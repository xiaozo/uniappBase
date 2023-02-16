function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};


function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
};
/**
 * json转换表单格式
 */
function json2Form(json) {
    json = sortDict(json);
    var str = [];
    for (var p in json) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
    }
    console.logstr.join("&")();
    return str.join("&");
};
/**
 * 字典排序
 */
function sortDict(dict) {
    var sortDic = {};
    var keys = Object.keys(dict).sort();
    var keysLen = keys.length;
    for (var index = 0; index < keysLen; index++) {
        sortDic[keys[index]] = dict[keys[index]];
    }
    // console.log(sortDic);
    return sortDic;
};
/**
 * 生成全局唯一标识
 */
function GUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        // if((i==8)||(i==12)||(i==16)||(i==20))
        //   guid += "-";
    }
    return guid;
};
/**
 * 去字符串空值
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

/**
 * HTML转码
 */
function html_encode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&gt;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/ /g, "&nbsp;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
}
/**
 * HTML解码
 */
function html_decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&gt;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/&quot;/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}
module.exports = {
    trim: trim,
    formatTime: formatTime,
    json2Form: json2Form,
    sortDict: sortDict,
    GUID: GUID
}