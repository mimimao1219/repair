// 一次性脚本
var config = require('../config');
var auth = require('../middlewares/auth');
//auth.getUserInfo('oYVvgv9ECQTYKRfXaQqxNd2z2Xm8',config ,function (e,query) {
	
//	console.log(query);
//});

auth.getAssets('005800000000032447',config ,function (e,query) {
	
	console.log(query);
});
//加密后的结果:yffobFj2ybyM5ApDa6Fs+2HKsKQQxkptG4O11JOdVCI0dpvm+Jm+igc2dOj3NJxs

//counters = new CountersModel({name : 'company'});
//counters.save();
//counters = new CountersModel({name : 'repair_type',seq:23});
//counters.save();
