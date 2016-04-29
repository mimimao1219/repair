
var express = require('express');
var repair = require('./controllers/repair');
var setup = require('./controllers/setup');
//var search = require('./controllers/search');
var auth = require('./middlewares/auth');
var config = require('./config');
var signature = require('./common/signature');
var router = express.Router();
var createSignature = signature.getSignature(config.weixin);
//模拟用户
router.get('/',auth.authUserOne,auth.authUserTwo,auth.authUserThree,repair.list);

router.get('/sign',repair.sign);

router.post('/login',repair.login);
//维修管理列表
router.get('/list',auth.authUserOne,auth.authUserTwo,auth.authUserThree,repair.list);
//申请维修管理
router.get('/repair/create',  repair.create);
router.get('/:tid/edit',auth.authUserOne,auth.authUserTwo,auth.authUserThree,  repair.showEdit);  // 编辑记录题
router.post('/repair/create',   repair.put);// 保存新建的记录
router.post('/repair/update',   repair.update);//更新维修记录

//router.get('/search', search.index);

router.get('/setup/comtactlist',   setup.comtactlist);//维修人员列表
router.post('/setup/comtactsave',  setup.comtactsave); //维修人员更新保存

router.get('/setup/typelist',   setup.typelist);//维修类型列表
router.post('/setup/typesave',  setup.typesave); //维修类型更新保存
router.get('/setup/companylist',   setup.companylist);//维修公司列表
router.post('/setup/companysave',  setup.companysave); //维修公司更新保存

// 微信签名
router.post('/getsignature', getSignature);
//微信测试
//router.get('/test', fun);
//function fun(req, res,next) {
//  var u = req.protocol + "://" + req.get('Host') + req.url;
//  console.log(u);
//  createSignature(u, function(error, result) {
//      console.log(result);
//      res.render('public/test', result);
//  });
//}

function getSignature(req, res,next) {
    var url = req.body.url;
    console.log(url);
    createSignature(url, function(error, result) {
        if (error) {
            res.json({
                'error': error
            });
        } else {
            res.json(result);
        }
    });
}

module.exports = router;
