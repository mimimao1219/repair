var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;
var config    = require('../config');
var _         = require('lodash');
var tools = require('../common/tools');


var RepairHistorySchema = new Schema({
  id:{ type: Number },
  signdate:{ type: String },//保修时间
  signtime:{ type: String },
  costcenter:{ type: Number }, //成本中心
  costcentername:{ type: String },
  signid: { type: String },     //联系人
  repairtel: { type: String },   //联系电话
  repairType: { type: Number },  //报修项目id
  repairtypename: { type: String },
  repairname: { type: String },  //联系人
  repairmail: { type: String },  //联系人邮箱
  repairContent: { type: String },  //保修内容
  companyid: { type: Number }, //维修公司id
  companyname: { type: String },
  warnspace: { type: Number },  //提醒时间 
  confirmdate:{ type: String },//通知维修时间
  confirmtime:{ type: String },//通知维修时间
  LstWarnDate:{ type: String },//要求结束时间
  LstWarnTime:{ type: String },//要求结束时间
  companyreturncontent:{ type: String },
  repairenddate:{ type: String },//维修结束时间
  repairendtime:{ type: String },
  repairassess: { type: Number,default:2 },  //评价
  repairassesscontent: { type: String },  //评价内容
  statu: { type: Number,default:1 },  //状态  默认值1待分配2已分配3已终结4强制结束5评价过
  msk1: { type: Number,default:0 },  //0公司未响应1公司已响应
  
  sign_at: { type: Date },
  confirm_at: { type: Date },
  LstWarn_at: { type: Date },
  repairend_at: { type: Date },
  code:{ type: String }, //资产编号
  
  comtact:String,
  comtact_tel:String,
  comtact_mob:Number,
  comtact_mail:String,
  comtact_type:Number,
  managerid:String,
  
  
});

//RepairCurrentSchema.plugin(BaseModel);
RepairHistorySchema.index({sign_at: -1});
RepairHistorySchema.index({companyid: 1});

RepairHistorySchema.methods.confirm_at_ago = function () {
    return tools.formatDate(this.confirm_at, false);
  };

  RepairHistorySchema.methods.LstWarn_at_ago = function () {
    return tools.formatDate(this.LstWarn_at, false);
  };
  
  RepairHistorySchema.methods.sign_at_ago = function () {
    return tools.formatDate(this.sign_at, false);
  };
  RepairHistorySchema.methods.repairend_at_ago = function () {
    return tools.formatDate(this.repairend_at, false);
  };

  RepairHistorySchema.virtual('repairStatu').get(function () {
  var statu  = this.statu;
  var pair = _.find(config.repairStatu, function (_pair) {
    return _pair[0] === statu;
  });

  if (pair) {
    return pair[1];
  } else {
    return '';
  }
});

  RepairHistorySchema.virtual('fpStatu').get(function () {
  var msk1  = this.msk1;
  var pair = _.find(config.fpStatu, function (_pair) {
    return _pair[0] === msk1;
  });

  if (pair) {
    return pair[1];
  } else {
    return '';
  }
});

  RepairHistorySchema.virtual('comtactname').get(function () {
  var msk1  = this.comtact_type;
  var pair = _.find(config.linkType, function (_pair) {
    return _pair[0] === msk1;
  });

  if (pair) {
    return this.comtact+pair[1];
  } else {
    return '';
  }
});



mongoose.model('RepairHistory', RepairHistorySchema);
