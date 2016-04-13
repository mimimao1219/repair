var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
//var CompanyModel = require("./index").Company;
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var config    = require('../config');
var _         = require('lodash');


var RepairCompanySchema = new Schema({ 
  id:{ type: Number },
  companyid: { type: Number },   //管理员id
  comtact: { type: String },     //联系人
  comtact_tel: { type: String }, //联系电话
  comtact_mob: { type: Number }, //手机
  comtact_mail: { type: String }, //邮件
  repairtype: { type: Number },  //报修项目id
  repairtypename: { type: String },
  orderindex: { type: Number, default: 0},  //排序
  statu: { type: Number , default:1},  //状态  默认值1有效
  msk1: { type: Number },  //联系人类型 1工程师2维修主管3总经理
  msk2: { type: String },  
  //create_at: { type: Date, default: Date.now },
  //update_at: { type: Date, default: Date.now },

});

//RepairCompanySchema.virtual('companyname').get(function () {
//	CompanyModel.findOne({id: this.companyid}, 'name',function (err, company) {
//		return company.name;
//	});
//});

//RepairCompanySchema.plugin(BaseModel);
RepairCompanySchema.index({companyid: 1});
RepairCompanySchema.index({orderindex: 1});

RepairCompanySchema.virtual('comtactname').get(function () {
  var msk1  = this.msk1;
  var pair = _.find(config.linkType, function (_pair) {
    return _pair[0] === msk1;
  });

  if (pair) {
    return this.comtact+pair[1];
  } else {
    return '';
  }
});

mongoose.model('RepairCompany', RepairCompanySchema);
