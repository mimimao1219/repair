
var config = require('./config');

if (!config.debug && config.oneapm_key) {
  require('oneapm');
}

require('colors');
var path = require('path');
var Loader = require('loader');
var LoaderConnect = require('loader-connect')
var express = require('express');
var session = require('express-session');
var schedule = require("node-schedule");
require('./middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./models');
var webRouter = require('./web_router');
//var auth = require('./middlewares/auth');
var errorPageMiddleware = require('./middlewares/error_page');
var proxyMiddleware = require('./middlewares/proxy');
//var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');
var requestLog = require('./middlewares/request_log');
var renderMiddleware = require('./middlewares/render');
var logger = require('./common/logger');
var helmet = require('helmet');
var bytes = require('bytes')
var RepairCurrentModel = require('../models').RepairCurrent;


// 静态文件目录
var staticDir = path.join(__dirname, 'public');
// assets
var assets = {};

if (config.mini_assets) {
  try {
    assets = require('./assets.json');
  } catch (e) {
    logger.error('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
//app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');

// Request logger。请求时间
app.use(requestLog);

if (config.debug) {
  // 渲染时间
  app.use(renderMiddleware.render);
}

// 静态资源
if (config.debug) {
app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}
app.use('/public', express.static(staticDir));
app.use('/agent', proxyMiddleware.proxy);

// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
	  secret: config.session_secret,
	  cookie:{
		  maxAge: 1000*60*30,
		  },
	  resave: true,
	  saveUninitialized: true,
	}));

//用户授权
//app.use(auth.authUserOne);
//app.use(auth.authUserTwo);
//app.use(auth.authUserThree);


// set static, dynamic helpers
_.extend(app.locals, {
  config: config,
  Loader: Loader,
  assets: assets
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./common/render_helper'));
app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

app.use(busboy({
  limits: {
    fileSize: bytes(config.file_limit)
  }
}));

// routes
//app.use('/api/v1', cors(), apiRouterV1);   //api 需要支持跨域访问才行的。所以加上cors中间件了。


app.use('/', webRouter);

// error handler
if (config.debug) {
  app.use(errorhandler());
} else {
  app.use(function (err, req, res, next) {
    logger.error(err);
    return res.status(500).send('500 status');
  });
}

if (!module.parent) {
  app.listen(config.port, function () {
    logger.info('repair listening on port', config.port);
    logger.info('God bless love....');
    logger.info('You can debug your app with http://' + config.hostname + ':' + config.port);
    logger.info('');



  });
}
//定时任务 每天8点到17点，每间隔15分钟扫描一次
var WechatAPI = require('wechat-api');
var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = [new schedule.Range(8, 17)];
rule.minute = [0, 30];  
var j = schedule.scheduleJob(rule, function(){
	RepairCurrentModel.find({}).exec(function (err, RepairCurrents) {
		RepairCurrents.forEach(function (RepairCurrent) {
			
			console.log("执行任务");
		});
	});
});



var api = new WechatAPI(config.weixin.appId, config.weixin.appSecret);
var templateId= 'HKRySQQFlR9e-bl7pCvZxheEmk956TdQIh5WbHVbxlA';
//URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
var url= 'http://weixin.qq.com/download';
var data = {
"first": {
  "value":"您好，您有新的待办任务！",
  "color":"#174177"
},
"keyword1":{
  "value":"请到成本中心维修电脑",
  "color":"#173177"
},
"keyword2": {
  "value":"待办",
  "color":"#172177"
},

"remark":{
  "value":"要求完成时间:2016-05-02\n请抽空处理\n谢谢。",
  "color":"#171177"
}
};
api.sendTemplate('oJme-s5bmL9j-Ie2aO3TL9y2zowA', config.weixin.templateId, url, data, function (err, result) {
	console.log(result);
});
//oJme-szsGYjRcIMIFxvvt5XAI8qo
module.exports = app;
