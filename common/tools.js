var bcrypt = require('bcryptjs');
var moment = require('moment');
var CryptoJS = require("crypto-js");

moment.locale('zh-cn'); // 使用中文




//加密
exports.myCipheriv = function (data,config) {
	var _strKey = CryptoJS.enc.Utf8.parse(config.key);
	var _strVi = CryptoJS.enc.Utf8.parse(config.iv);
	var _QueryStr = CryptoJS.AES.encrypt(Buffer(utf16to8(data)).toString('base64'), _strKey, { iv: _strVi, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding }).toString();
	return _QueryStr;

};
//解密
exports.myDecipheriv = function (data,config) {
	var _strKey = CryptoJS.enc.Utf8.parse(config.key);
	var _strVi = CryptoJS.enc.Utf8.parse(config.iv);
	var _QueryStr = CryptoJS.AES.decrypt(data, _strKey, { iv: _strVi, padding: CryptoJS.pad.ZeroPadding }).toString(CryptoJS.enc.Utf8);
    return utf8to16(Buffer(_QueryStr,'base64').toString());	
	
};

// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

function utf16to8(str) {
	var out, i, len, c;
	out = "";
	len = str.length;
	for(i = 0; i < len; i++) {
	c = str.charCodeAt(i);
	if ((c >= 0x0001) && (c <= 0x007F)) {
	out += str.charAt(i);
	} else if (c > 0x07FF) {
	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
	out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
	out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	} else {
	out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
	out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
	}
	}
	return out;
	}

function utf8to16(str) {
	var out, i, len, c;
	var char2, char3;
	out = "";
	len = str.length;
	i = 0;
	while(i < len) {
	c = str.charCodeAt(i++);
	switch(c >> 4)
	{
	case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
	// 0xxxxxxx
	out += str.charAt(i-1);
	break;
	case 12: case 13:
	// 110x xxxx 10xx xxxx
	char2 = str.charCodeAt(i++);
	out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
	break;
	case 14:
	// 1110 xxxx 10xx xxxx 10xx xxxx
	char2 = str.charCodeAt(i++);
	char3 = str.charCodeAt(i++);
	out += String.fromCharCode(((c & 0x0F) << 12) |
	((char2 & 0x3F) << 6) |
	((char3 & 0x3F) << 0));
	break;
	}
	}
	return out;
	}
exports.utf16to8=utf16to8;
exports.utf8to16=utf8to16;
exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};
