var mongoose = require('mongoose');

var UserModel = require('../models').User;
var RepairManagerModel = require('../models').RepairManager;
var CompanyModel = require('../models').Company;
var RepairCompanyModel = require('../models').RepairCompany;
var request = require('request-json');
var tools = require('../common/tools')
//var Message    = require('../proxy').Message;
var config = require('../config');
var eventproxy = require('eventproxy');
//var UserProxy  = require('../proxy').User;
var WechatAPI = require('wechat-api');




//微信推送
exports.sendTemplateOne = function (repairCurrent, usertype) {
	//var api = new WechatAPI(config.weixin.appId, config.weixin.appSecret);
	var url = 'http://' + config.host + '/' + repairCurrent._id + '/edit?usertype=' + usertype;
	var data = {
		"first": { "value": "您好，您有新的待办任务！", "color": "#174177" },
		"keyword1": { "value": repairCurrent.repairContent, "color": "#173177" },
		"keyword2": { "value": "待办", "color": "#172177" },
		"remark": { "value": "要求完成时间:" + repairCurrent.LstWarn_at_ago + "\n请抽空处理谢谢。", "color": "#171177" }
	};
	var userid = repairCurrent.signid;
	if (usertype === 2) { userid = repairCurrent.managerid; };
	if (usertype === 3) { userid = repairCurrent.companyid; };
	if (usertype === 4) { userid = repairCurrent.comtact_mob; };
	UserModel.findOne({ UserId: userid }, function (e, user) {
		if (user) {
			// console.log(usertype+'---'+userid);
			// api.sendTemplate(user.OpenId, config.weixin.templateId, url, data, function (err, result) { });
			sendTemplate(user.OpenId, url, JSON.stringify(data), config, function (err, result) { });
		}
	});
};
/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
	if (!req.session || !req.session.user) {
		return res.status(403).send('forbidden!');
	}

	next();

};

// 验证用户第一步
exports.authUserOne = function (req, res, next) {
	if (!req.session || !req.session.user) {
		var openid = req.query.open_id;

		UserModel.findOne({ OpenId: openid }, function (e, user) {
			if (user) {
				req.session.user = user;
				return next();
			} else {
				return next();
			}
		});
	} else {
		return next();
	}
};
//验证用户第二步
exports.authUserTwo = function (req, res, next) {
	if (!req.session || !req.session.user) {
		var openid = req.query.open_id;
		getUserInfo(openid, config, function (e, user1) {

			if (user1) {
				var user = JSON.parse(user1);
				var myUser = new UserModel();
				myUser.OpenId = user.OpenId;
				myUser.NickName = user.NickName;
				myUser.UserPhotoUrl = user.UserPhotoUrl;
				myUser.Pid = user.Pid;
				myUser.UserId = user.UserId;
				myUser.UserName = user.UserName;
				myUser.OrgName = user.OrgName;
				myUser.FixedPhone = user.FixedPhone;
				myUser.CellPhone = user.CellPhone;
				myUser.Email = user.Email;
				RepairManagerModel.findOne({ managerid: user.UserId }, function (e, manager) {
					if (manager) {
						myUser.usertype = '2';
						req.session.user = myUser;
						myUser.save();
						return next();
					} else {
						myUser.usertype = '1';
						req.session.user = myUser;
						myUser.save();
						return next();
					}
				});

			} else {
				return next();
			}
		});
	} else {
		return next();
	}
};
//验证用户第三步
exports.authUserThree = function (req, res, next) {
	if (!req.session || !req.session.user) {
		res.redirect('/sign?openid=' + req.query.open_id);
	} else {
		return next();
	}
};

function getIdentify(openid, config, cb) {
    var url = 'WChart/Identify?open_id=' + openid + '&pid=' + config.weixingzh;
    var client = request.createClient('http://www.spdbcloud.com/');
    client.get(url, function (error, response, body) {
        if (error) {
			cb('getIdentify error', error);
        }
        else {
            try {
                var flag = body.flag;
                console.log(body);
                cb(null, flag);
            }
            catch (e) {
				cb('getIdentify error', error);
            }
        }
    });
}

function sendTemplate(openid, url, data, config, cb) {

	var data1 = '{"Token":"' + config.pftoken + '","authflag":"' + config.authflag + '","touser":"' + openid + '","template_id":"' + 1 + '","url":"' + url + '","data":"' + data + '"}';

	var queryStr = tools.myCipheriv(data1, config);
	var client = request.createClient('http://www.spdbcloud.com/');
	var data = {
		UID: 1,
		QueryStr: queryStr,
		ReqCode: '0'
	};
	client.post('api/WChartMsgTemple', data, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if (body.ResultData) {
				cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}

	});
}

function getUserInfo(openid, config, cb) {
    var data1 = '{"OpenID":"' + openid + '","Token":"' + config.pftoken + '","Pid":"' + config.weixingzh + '"}';

    var queryStr = tools.myCipheriv(data1, config);

    var client = request.createClient('http://www.spdbcloud.com/');
    var data = {
		UID: 1,
		QueryStr: queryStr,
		ReqCode: '0'
    };
    client.post('api/WChartUserInfo', data, function (error, response, body) {

		if (!error && response.statusCode == 200) {
			if (body.ResultData) {

				cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}

	});
}

function getAssets(AssetsNo, config, cb) {
    var data = '{AssetsNo:"' + AssetsNo + '",Token:"' + config.pftoken + '"}';

    var queryStr = tools.myCipheriv(data, config);
	var client = request.createClient('http://www.spdbcloud.com/');
    var data = {
		UID: 1,
		QueryStr: queryStr,
		ReqCode: '0'
    };
    client.post('api/WChartAssets', data, function (error, response, body) {

		if (!error && response.statusCode == 200) {

			if (body.ResultData) {
				cb(null, tools.myDecipheriv(body.ResultData, config));
			} else {
				cb(null, null);
			}
		} else {
			cb(null, null);
		}
	});
}
exports.getAssets = getAssets;
exports.getUserInfo = getUserInfo;
exports.getIdentify = getIdentify;
exports.sendTemplate = sendTemplate;
