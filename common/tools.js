var bcrypt = require('bcryptjs');
var moment = require('moment');
var crypto = require('crypto');

moment.locale('zh-cn'); // 使用中文

//加密
exports.myCipheriv = function (data,config) {
	var algorithm = 'aes-256-cbc';
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    console.log(config.key + ' ciphertext: ' + config.iv);
    var cipher = crypto.createCipheriv(algorithm, config.key,config.iv);
    var cipherChunks = [];
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    //console.log(cipherEncoding + ' ciphertext: ' + cipherChunks.join(''));
    return cipherChunks.join('');	
};
//解密
exports.myDecipheriv = function (data,config) {
	var algorithm = 'aes-256-cbc';
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var decipher = crypto.createDecipheriv(algorithm, key,iv);
    var plainChunks = [];
    plainChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    plainChunks.push(decipher.final(clearEncoding));
    //console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));	
    return plainChunks.join('');	
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

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};
