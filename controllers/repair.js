

var validator = require('validator');
//var at           = require('../common/at');
var RepairCurrentModel = require('../models').RepairCurrent;
var RepairImageModel = require('../models').RepairImage;
var CostcenterModel = require('../models').Costcenter;
var RepairCompanyModel = require('../models').RepairCompany;
var RepairManagerModel = require('../models').RepairManager;
var RepairTypeModel = require('../models').RepairType;
var CompanyModel = require('../models').Company;
var UserModel = require('../models').User;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var _            = require('lodash');
var wxs       = require('../common/signature');
//var cache        = require('../common/cache');
var moment = require('moment');
var http = require('http');
var fs = require('fs');

exports.sign = function (req, res, next) {
	req.session.yzm='4561';
	var openid= req.query.openid;
	res.render('sign',{openid:openid});	
}
exports.login = function (req, res, next) {
	var openid = validator.trim(req.body.openid);
	var mob = validator.trim(req.body.mob);
	var yzm = validator.trim(req.body.yzm);
	var usertype = validator.trim(req.body.usertype);
    if (usertype=='3'){
     	CompanyModel.findOne({tel:mob }, null, function (err, Company) {
     		if (Company) {
     		var myUser = new UserModel();
			myUser.OpenId= openid;
			myUser.NickName= Company.linkname;
			//myUser.UserPhotoUrl= user.UserPhotoUrl;
			myUser.Pid= config.weixingzh;
			myUser.UserId= Company.id;
			myUser.UserName= Company.name;
			myUser.OrgName= Company.name;
			//myUser.FixedPhone= Company.FixedPhone;
			myUser.CellPhone= mob;
			myUser.Email= Company.mail;
			myUser.usertype=usertype;
			req.session.user=myUser;
			myUser.save();
			res.redirect('/);
     		}else{
     			res.redirect('/sign?openid='+openid);
     		}
     	});
    }
    if (usertype=='4'){
    	RepairCompanyModel.findOne({comtact_mob:mob }, null, function (err, Company) {
     		if (Company) {
     		var myUser = new UserModel();
			myUser.OpenId= openid;
			myUser.NickName= Company.comtact;
			//myUser.UserPhotoUrl= user.UserPhotoUrl;
			myUser.Pid= config.weixingzh;
			myUser.UserId= Company.id;
			myUser.UserName= Company.comtact;
			myUser.OrgName= Company.comtact;
			//myUser.FixedPhone= Company.FixedPhone;
			myUser.CellPhone= mob;
			myUser.Email= Company.comtact_mail;
			myUser.usertype=usertype;
			req.session.user=myUser;
			myUser.save();
			res.redirect('/);
     		}else{
     			res.redirect('/sign?openid='+openid);
     		}
     	});
    }

}

exports.userlist = function (req, res, next) {
	res.render('userlist');	
}

exports.list = function (req, res, next) {		
  var usertype='';
  usertype= req.query.usertype;
  res.locals.usertype =usertype;
  var events = ['repairCurrents','repairCurrentsing','repairfinishs'];
  var ep = EventProxy.create(events, function (repairCurrents,repairCurrentsing,repairfinishs) {
    res.render('list', {
      repairCurrents: repairCurrents,
      repairCurrentsing: repairCurrentsing,
      repairfinishs:repairfinishs
    });
  });

  ep.fail(next);
  //获得查询条件再查询
  var ep1 = EventProxy.create('query', function (query) {
//	 var options = { skip:0,limit: 100, sort: '-signdate'};
	 var options = { sort: '-signdate'};
	 var query1 = _.merge({statu:{$in:[1,2]}},query);
	 var query2 = _.merge({statu:{$in:[3,4,5]}},query);
	 //console.log(query1);
	 if (usertype==='1'){
		 RepairCurrentModel.find(query1,{},options, ep.done('repairCurrents'));
		 RepairCurrentModel.find(query2,{},options, ep.done('repairfinishs'));
	  	 ep.emit('repairCurrentsing',null);
	 }
	 if (usertype==='2'){
	 	 query1=_.merge({statu:1},query);
	 	 var query3= _.merge({statu:2},query);
	 	 RepairCurrentModel.find(query1,{},options, ep.done('repairCurrents'));
		 RepairCurrentModel.find(query2,{},options, ep.done('repairfinishs'));
		 RepairCurrentModel.find(query3,{},options, ep.done('repairCurrentsing'));

	 }
	 if (usertype==='3'){
	 	 query1=_.merge({statu:2,msk1:0},query);
	 	 var query3= _.merge({statu:2,msk1:1},query);
	 	 RepairCurrentModel.find(query1,{},options, ep.done('repairCurrents'));
		 RepairCurrentModel.find(query2,{},options, ep.done('repairfinishs'));
		 RepairCurrentModel.find(query3,{},options, ep.done('repairCurrentsing'));

	 }
	 if (usertype==='4'){
	 	 var query3= _.merge({statu:{$in:[2,3,4,5]}},query);
	 	 ep.emit('repairCurrents',null);
	 	 ep.emit('repairfinishs',null);
		 RepairCurrentModel.find(query3,{},options, ep.done('repairCurrentsing'));
	 }
	 	 
   });
  //查询条件 
  var query = {};

  if (usertype === '1') {
      query = { signid: '11053416' };
      ep1.emit('query',query);
    }
  if (usertype === '2') {	
      RepairManagerModel.find({managerid: 11003720}, 'repairtype',{sort: '-create_at'}, function (err, repairmanagers) {
      if (err) {
        return callback(err);
      }
       query = { repairType: {$in: _.map(repairmanagers,'repairtype')} }; 
       ep1.emit('query',query);
  	  }); 
    }

   if (usertype === '3') {
      query = { companyid: 8 ,};
      ep1.emit('query',query);
    } 
   if (usertype === '4') {
      query = { comtact_mob: 15003990925,msk1:1 };
      ep1.emit('query',query);
    } 

};

exports.create = function (req, res, next) {
	
  var events = ['repairtypes','repaircurrent','costcenters'];
  var ep = EventProxy.create(events, function (repairtypes,repaircurrent,costcenters) {
    res.render('repair/edit', {
      repairtypes: repairtypes,
      costcenters: costcenters,
      repaircurrent:repaircurrent
    });
  });

  ep.fail(next);
  
  RepairTypeModel.find({},null ,{sort: '-orderindex'},ep.done('repairtypes'));
  CostcenterModel.find({Statu:1},null ,{sort: '-orderindex costCenterName'},ep.done('costcenters'));
  
  var repaircurrent = new RepairCurrentModel();
  //需要根据接口获得用户数据
  repaircurrent.signid= '11053416' ;
  repaircurrent.repairname= '谢居正';
  repaircurrent.repairtel= '65752525';
  repaircurrent.repairmail= 'xiejz1@spdb.com.cn';
  repaircurrent.repairType=20;
  //repaircurrent.
  if (req.query.code) {
  	//扫码查询资产需要根据接口获得成本中心数据
  	repaircurrent.costcenter=req.query.code
	ep.emit('repaircurrent',repaircurrent); 
  	
  }else{
  	
  	 ep.emit('repaircurrent',repaircurrent); 
  	 
  }
 
};



//保存新维修信息

exports.put = function (req, res, next) {
	
  var repaircurrent = new RepairCurrentModel();
  repaircurrent.code   = validator.trim(req.body.code);
  repaircurrent.costcenter   = validator.trim(req.body.costcenter);
  repaircurrent.repairType     = validator.trim(req.body.repairType);
  repaircurrent.costcentername   = validator.trim(req.body.costcentername);
  repaircurrent.repairtypename     = validator.trim(req.body.repairtypename);
  repaircurrent.repairname = validator.trim(req.body.repairname);
  repaircurrent.signid   = validator.trim(req.body.signid);
  repaircurrent.repairtel     = validator.trim(req.body.repairtel);
  repaircurrent.repairmail = validator.trim(req.body.repairmail);
  repaircurrent.repairContent   = validator.trim(req.body.repairContent);
  var image1     = validator.trim(req.body.image);
   
  // 验证
  var editError;
  if (repaircurrent.costcenter === '') {
    editError = '请选择成本中心。';
  } else if (repaircurrent.repairType === '') {
    editError = '请选择保修类别。';
  } else if (repaircurrent.repairmail === '') {
    editError = '邮箱不能为空。';
  } else if (repaircurrent.repairContent === '') {
    editError = '保修内容不可为空';
  }
  // END 验证

//if (editError) {
//  res.status(422);
//  return res.render('repair/edit', {
//    edit_error: editError,
//  });
//}


  repaircurrent.signdate=moment().format('YYYY-MM-DD');
  repaircurrent.signtime=moment().format('hh:mm');
  repaircurrent.sign_at=moment().format('YYYY-MM-DD hh:mm');
  repaircurrent.confirm_at=moment().add(1,'h').format('YYYY-MM-DD hh:mm');
  
  var ep = new EventProxy();
      ep.all(['repaircurrent','repairtype'], function (repaircurrent,repairtype) {
      	 repaircurrent.LstWarn_at=moment(repaircurrent.confirm_at).add(repairtype.statu,'d').format('YYYY-MM-DD hh:mm');
      	 repaircurrent.save(function (err, repaircurrent) {
			if (err) {
		      return next(err);
		    }
		    res.redirect('/');
		    
		    if (image1!=''){
		    //  图片保存
		    var proxy = new EventProxy();
		    proxy.after('got_file', image1.split(',').length, function (list) {
		      RepairImage = new RepairImageModel();
		      RepairImage.id = repaircurrent._id;
		      RepairImage.weixinsrc=image1;
		      RepairImage.qnsrc=list;
		      RepairImage.save();
		     });
			//下载图片
		  	var token = config.weixin.jsdkToken;
		  	image1.split(',').forEach(function (image) {
		  	var dowloadUrl = 'http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=' + token + '&media_id=' + image;	
		  	http.get(dowloadUrl, function (file,image) {
		  	store.upload(file, {filename: image}, function (err, result) {
		        if (err) {
		          return next(err);
		        }
		        console.log(result.url);
		        proxy.emit('got_file', result.url);
		      });
		      });
   		 });
   }
    	
    //发送at消息
//  at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);
    
	});      	
   });
   
// 设置默认完成天数
   RepairTypeModel.findOne({repairtype: repaircurrent.repairType}, 'statu', function (err, repairtype) {
   	 ep.emit('repairtype',repairtype);
   });
   //根据保修类别查找保修公司。根据保修公司查找维修人员。
  		CompanyModel.findOne({repairtype: repaircurrent.repairType},  function (err, company) {
  			if (company)  {
   			repaircurrent.companyid= company.id;
   			repaircurrent.companyname=company.name;
   			RepairCompanyModel.findOne({companyid:company.id,repairtype: repaircurrent.repairType},  function (err, repaircompany) {
   				repaircurrent.comtact=repaircompany.comtact;
   				repaircurrent.comtact_tel=repaircompany.comtact_tel;
   				repaircurrent.comtact_mob=repaircompany.comtact_mob;
   				repaircurrent.comtact_mail=repaircompany.comtact_mail;
   				repaircurrent.comtact_type=repaircompany.msk1; 				
  	         ep.emit('repaircurrent',repaircurrent);
   			});
   		}else{
   			ep.emit('repaircurrent',repaircurrent);
   		};
   			
   			
   	    }); 		
   
   
   
  

};


exports.showEdit = function (req, res, next) {
  var repair_id = req.params.tid;
  var usertype='';
  usertype= req.query.usertype;
  res.locals.usertype =usertype;
  
  var ep = new EventProxy();
      ep.all(['repaircurrent','companies','images'], function (repaircurrent,companies,images) {	  	
	  	res.render('repair/showedit', {
	        repaircurrent: repaircurrent,
	        companies: companies,
	        images:images
      });
      });
  
  
  RepairCurrentModel.findOne({_id: repair_id}, function (err, repaircurrent){
  if (!repaircurrent) {
      res.render404('此维修记录不存在或已被删除。');
      return;
    }
    ep.emit('repaircurrent',repaircurrent);
//	判断是否管理用户

    if (usertype==='2') { 	 
      CompanyModel.find({repairtype:repaircurrent.repairType},null ,{sort: '-orderindex'},ep.done('companies'));   
     }else{
      ep.emit('companies',null);
     }	
  });
  //   查询照片
     RepairImageModel.findOne({id:repair_id},null ,ep.done('images'));

};

exports.update = function (req, res, next) {	
	var usertype   = validator.trim(req.body.usertype);
	var repairid   = validator.trim(req.body.repairid);
	
    var ep = new EventProxy();
      ep.all(['repaircurrent'], function (repaircurrent) {	
      	repaircurrent.save(function (err, repaircurrent) {
      		res.redirect('/');
      	});
      
      });
	
	RepairCurrentModel.findOne({_id: repairid}, function (err, repaircurrent){
		if (usertype==1) {
			repaircurrent.repairassess=validator.trim(req.body.repairassess);
			repaircurrent.repairassesscontent=validator.trim(req.body.repairassesscontent);
		    repaircurrent.statu=5;
		    ep.emit('repaircurrent',repaircurrent);
		}
		if (usertype==2) {
			var companyid=validator.trim(req.body.companyid);
			repaircurrent.confirm_at=validator.trim(req.body.confirm_at);
		    repaircurrent.LstWarn_at=validator.trim(req.body.LstWarn_at);
		    repaircurrent.statu=2;
			if (companyid!=repaircurrent.companyid){
			repaircurrent.companyid=validator.trim(req.body.companyid);
			repaircurrent.companyname=validator.trim(req.body.companyname);
			RepairCompanyModel.findOne({companyid:repaircurrent.companyid,repairtype: repaircurrent.repairType},  function (err, repaircompany) {
   				repaircurrent.comtact=repaircompany.comtact;
   				repaircurrent.comtact_tel=repaircompany.comtact_tel;
   				repaircurrent.comtact_mob=repaircompany.comtact_mob;
   				repaircurrent.comtact_mail=repaircompany.comtact_mail;
   				repaircurrent.comtact_type=repaircompany.msk1; 				
  	         ep.emit('repaircurrent',repaircurrent);
   			});
			}else{
			 ep.emit('repaircurrent',repaircurrent);	
			}
		}
		if (usertype==3) {
			repaircurrent.comtact=validator.trim(req.body.comtact);
			repaircurrent.comtact_tel=validator.trim(req.body.comtact_tel);
			repaircurrent.comtact_mob=validator.trim(req.body.comtact_mob);
			repaircurrent.comtact_mail=validator.trim(req.body.comtact_mail);
			repaircurrent.comtact_type=validator.trim(req.body.comtact_type);
			repaircurrent.msk1=1;
			ep.emit('repaircurrent',repaircurrent);
		}
		if (usertype==4) {
			repaircurrent.companyreturncontent=validator.trim(req.body.companyreturncontent);
			repaircurrent.repairend_at=moment().format('YYYY-MM-DD hh:mm');
			repaircurrent.statu=3;
			ep.emit('repaircurrent',repaircurrent);
		}	
		

		
	});
	
	
	
	
}

exports.upload = function (req, res, next) {
  var isFileLimit = false;
  req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      file.on('limit', function () {
        isFileLimit = true;

        res.json({
          success: false,
          msg: 'File size too large. Max is ' + config.file_limit
        })
      });

      store.upload(file, {filename: filename}, function (err, result) {
        if (err) {
          return next(err);
        }
        if (isFileLimit) {
          return;
        }
        res.json({
          success: true,
          url: result.url,
        });
      });

    });

  req.pipe(req.busboy);
};

