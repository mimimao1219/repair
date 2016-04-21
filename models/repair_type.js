var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var RepairTypeSchema = new Schema({ 
  repairtype: { type: Number },  //报修项目id
  repairname: { type: String },  //报修项目
  orderindex: { type: Number, default: 2000},  //排序
  statu: { type: Number , default:'1'},  //默认维修完成天数  默认值1有效
  msk1: { type: String },  
  msk2: { type: String },  
  companyid:[Number],
  //create_at: { type: Date, default: Date.now },
  //update_at: { type: Date, default: Date.now },

});

//RepairTypeSchema.plugin(BaseModel);
RepairTypeSchema.index({repairType: 1});
RepairTypeSchema.index({orderindex: 1});

mongoose.model('RepairType', RepairTypeSchema);
