var CryptoJS = require('crypto.js');  //引用AES源码js
var key = CryptoJS.enc.Utf8.parse("fa5c76efcc3c9bfe");//十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse("11a1f773e5612639");//十六位十六进制数作为秘钥偏移量
//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf - 8);
  return decryptedStr.toString();
}
//加密方法
function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
  var encryptedString = encrypted.toString();
  return encryptedString.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
}

//暴露接口
module.exports.Decrypt = Decrypt;
module.exports.Encrypt = Encrypt;