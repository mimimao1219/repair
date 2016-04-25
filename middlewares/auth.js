var mongoose   = require('mongoose');

var UserModel = require('../models').User;
var request = require('request');
var tools = require('../common/tools')
//var Message    = require('../proxy').Message;
var config     = require('../config');
var eventproxy = require('eventproxy');
//var UserProxy  = require('../proxy').User;


// 验证用户是否有权限
exports.authUser = function (req, res, next) {
	  if (!req.session || !req.session.user) {
		  
		  
	    return res.status(403).send('forbidden!');
	  }

     next();
};

exports.getIdentify =function (openid,config) {
    var url = 'http://www.spdbcloud.com/WChart/Identify?open_id=' + openid + '&pid='+config.pftoken ;
    request.get(url, function(error, response, body) {
        if (error) {
            return res.status(403).send('forbidden!');
        }
        else {
            try {
                var flag = JSON.parse(body).flag;
                return flag;
            }
            catch (e) {
              	return e;
            }
        }
    });
}

exports.getUserInfo =function (openid,config) {
    var data='{OpenID:' + openid + ',Token:'+config.pftoken+',Pid:'+config.weixingzh+'}';
    var queryStr=tools.myCipheriv(data,config);
    var options = {
    		headers: {"Connection": "close"},
    	    url: 'http://www.spdbcloud.com/api/WChartUserInfo',
    	    method: 'POST',
    	    json:true,
    	    body: {QueryStr:queryStr,UID :'0',ReqCode :"0"}
    	};
    	request(options, function(error, response, body) {
    		if (!error && response.statusCode == 200) {
    			console.log(body);
    			return tools.myDecipheriv(JSON.parse(body).ResultData); 			
    		}
    	});    
}

exports.getAssets =function (AssetsNo,config) {
    var data='{AssetsNo:' + AssetsNo + ',Token:'+config.pftoken+'}';
    var queryStr=tools.myCipheriv(data,config);
    var options = {
    		headers: {"Connection": "close"},
    	    url: 'http://www.spdbcloud.com/api/WChartAssets',
    	    method: 'POST',
    	    json:true,
    	    body: {QueryStr:queryStr,UID :'0',ReqCode :"0"}
    	};
    	request(options, function(error, response, body) {
    		if (!error && response.statusCode == 200) {
    			console.log(body);
    			return tools.myDecipheriv(JSON.parse(body).ResultData);   			
    		}
    	});    
}



function gen_session(user, res) {
  var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;

//// 验证用户是否登录
//exports.authUser = function (req, res, next) {
//var ep = new eventproxy();
//ep.fail(next);
//
//// Ensure current_user always has defined.
//res.locals.current_user = null;
//
//if (config.debug && req.cookies['mock_user']) {
//  var mockUser = JSON.parse(req.cookies['mock_user']);
//  req.session.user = new UserModel(mockUser);
//  if (mockUser.is_admin) {
//    req.session.user.is_admin = true;
//  }
//  return next();
//}
//
//ep.all('get_user', function (user) {
//  if (!user) {
//    return next();
//  }
//  user = res.locals.current_user = req.session.user = new UserModel(user);
//
//  if (config.admins.hasOwnProperty(user.loginname)) {
//    user.is_admin = true;
//  }
//
//  Message.getMessagesCount(user._id, ep.done(function (count) {
//    user.messages_count = count;
//    next();
//  }));
//});
//
//if (req.session.user) {
//  ep.emit('get_user', req.session.user);
//} else {
//  var auth_token = req.signedCookies[config.auth_cookie_name];
//  if (!auth_token) {
//    return next();
//  }
//
//  var auth = auth_token.split('$$$$');
//  var user_id = auth[0];
//  UserProxy.getUserById(user_id, ep.done('get_user'));
//}
//};
