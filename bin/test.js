// 一次性脚本
var config = require('../config');
var auth = require('../middlewares/auth');
var tools = require('../common/tools');
var CryptoJS = require("crypto-js");

//auth.getIdentify('oYVvgv9ECQTYKRfXaQqxNd2z2Xm8',config ,function (e,query) {

//console.log(query);
//});

//auth.getUserInfo('oYVvgv9ECQTYKRfXaQqxNd2z2Xm8',config ,function (e,query) {
	
//	console.log(query);
//});
auth.getAssets('005800000000032447',config ,function (e,query) {	
	console.log(query);
});


//counters = new CountersModel({name : 'company'});
//counters.save();
//counters = new CountersModel({name : 'repair_type',seq:23});
//counters.save();


