var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CompanySchema = new Schema({ 
  id: { type: Number },
  name: { type: String },
  addr: { type: String },  
  bankname: { type: String }, 
  acno: { type: String },
  remark: { type: String },
  orderindex: { type: Number},  //排序
  Statu: { type: Number },  //状态  默认值1有效
  Msk1: { type: String },  
  Msk2: { type: String },  
  weixinid:{ type: String },
  tel:{type: Number},
  linkname:{ type: String },
  mail:{ type: String },
  repairtype: [Number],
  //create_at: { type: Date, default: Date.now },
  //update_at: { type: Date, default: Date.now },

});

//CompanySchema.plugin(BaseModel);
CompanySchema.index({id: 1});
CompanySchema.index({orderindex: 1});

mongoose.model('Company', CompanySchema);

