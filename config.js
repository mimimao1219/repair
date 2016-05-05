
var path = require('path');

var config = {
  // debug 为 true 时，用于本地调试
  debug: true,

  get mini_assets() { return !this.debug; }, // 是否启用静态文件的合并压缩，详见视图中的Loader

  name: 'repair', // 名字
  description: '浦发保修管理', // 描述
  keywords: '保修',
  site_static_host: '', // 静态文件存储域名
  // 设置域名
  host: 'localhost',

  // mongodb 配置
  db: 'mongodb://127.0.0.1/repair_dev',

  // redis 配置，默认是本地
  //redis_host: '127.0.0.1',
  //redis_port: 6379,
  //redis_db: 0,

  session_secret: 'repair_mimimao', // 签名密钥 务必修改
  auth_cookie_name: 'nmimimao',

  // 程序运行的端口
  port: 3000,
  // oneapm 是个用来监控网站性能的服务
  oneapm_key: '',

  // 文件上传配置

  upload: {
    path: path.join(__dirname, 'public/upload/'),
    url: '/public/upload/'
  },

  file_limit: '1MB',

  // 版块
  tabs: [
    ['share', '分享'],
    ['ask', '问答'],
    ['job', '招聘'],
  ],
  
   // repair状态
  repairStatu: [
    [1, '待分配'],
    [2, '已分配'],
    [3, '已终结'],
    [4, '强制结束'],
  ],
    // 分配状态
  fpStatu: [
    [0, '公司未响应'],
    [1, '公司已响应'],
  ],
  
   // 维修人类型
  linkType: [
    ['1', '工程师'],
    ['2', '维修主管'],
    ['3', '总经理'],
  ],
  //微信
  weixin: {
  		appId: 'wxc6459c121f2e6399',
        appSecret: 'ae9b79a09a05aef3ff0b72e21174a2d0',
        appToken: 'mimimao',
        jsdkToken: '',
        templateId:'ValECG0NODDNWsthxekCyJ_ux90KyZrz7rEZ2hLAGmI',
 	},
 	//ValECG0NODDNWsthxekCyJ_ux90KyZrz7rEZ2hLAGmI
 //浦发接口
 	pftoken:'FaultRepair',
 	weixingzh:'spdbcloud',
 	//key:'SrJoxSWRwSPUVo1L6Ta84K7vCAADv6Ov',
 	//iv:"6iQsiXGB@w>K$g\a",
 	key:'SrJoxSWRwSPUVo1L6Ta84K7vCAADv6Ov',
 	iv:"6iQsiXGB@w>K$g*a",

 	//正式的OpenID：oYVvgv9ECQTYKRfXaQqxNd2z2Xm8 （张晓辉）

};

if (process.env.NODE_ENV === 'test') {
  config.db = 'mongodb://127.0.0.1/repair_test';
}

module.exports = config;
