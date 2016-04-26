var mongoose   = require('mongoose');

var UserModel = require('../models').User;
var request = require('request-json');
var tools = require('../common/tools')
//var Message    = require('../proxy').Message;
var config     = require('../config');
var eventproxy = require('eventproxy');
//var UserProxy  = require('../proxy').User;


// 验证用户第一步
exports.authUserOne = function (req, res, next) {
	  if (!req.session || !req.session.user) {
		 var openid = req.query.open_id;
		 UserModel.findOne({OpenId:openid},function(user) {
			 if (user) {
				 req.session.user=user;
			 }else{	
				 return next(); 
			 }	 
		 });  
	  }else{
		  if (req.session.user.usertype==='1'){
			  
		  }

	  }   
};
//验证用户第二步
exports.authUserTwo = function (req, res, next) {
	  if (!req.session || !req.session.user) {
		 var openid = req.query.open_id;
		 UserModel.findOne({OpenId:openid},function(user) {
			 if (user) {
				 req.session.user=user;
			 }else{	
				 next(); 
			 }	 
		 });  
	  }else{
		  next(); 
	  }   
};

exports.getIdentify =function (openid,config,cb) {
    var url = 'WChart/Identify?open_id=' + openid + '&pid='+config.weixingzh ;
    var client = request.createClient('http://www.spdbcloud.com/');
    client.get(url, function(error, response, body) {
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

exports.getUserInfo =function (openid,config,cb) {
    var data1='{OpenID:' + openid + ',Token:'+config.pftoken+',Pid:'+config.weixingzh+'}';
    var queryStr=tools.myCipheriv(data1,config);
    var client = request.createClient('http://www.spdbcloud.com/');
    var data = {
    		UID: 1,
    		QueryStr: queryStr,
    		ReqCode: '0'
    };
    client.post('api/WChartUserInfo',data, function(error, response, body) {
    	console.log(response.statusCode);
    	if (!error && response.statusCode == 200) {
    			console.log(body);
    			if (body.ResultData) {   			
    			cb(null, tools.myDecipheriv(body.ResultData));
    			}else{   				
    				cb(null, response.statusCode);
    			}
    			//return tools.myDecipheriv(JSON.parse(body).ResultData); 			
    		}
    	});    
}

exports.getAssets =function (AssetsNo,config,cb) {
    var data='{AssetsNo:' + AssetsNo + ',Token:'+config.pftoken+'}';
    console.log(data);
    var queryStr=tools.myCipheriv(data,config);
    //var queryStr='yffobFj2ybyM5ApDa6Fs+2HKsKQQxkptG4O11JOdVCI0dpvm+Jm+igc2dOj3NJxs'
    	var client = request.createClient('http://www.spdbcloud.com/');
    var data = {
    		UID: 1,
    		QueryStr: queryStr,
    		ReqCode: '0'
    };
    client.post('api/WChartAssets',data, function(error, response, body) {
    	console.log(response.statusCode);
    	if (!error && response.statusCode == 200) {
    			
    			if (body.ResultData) {   			
    			cb(null, tools.myDecipheriv(body.ResultData));
    			}else{   				
    				cb(null, response.statusCode);
    			}
    			//return tools.myDecipheriv(JSON.parse(body).ResultData); 			
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
