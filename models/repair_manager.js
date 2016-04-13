var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var RepairManagerSchema = new Schema({ 
  id:{ type: Number },
  managerid: { type: Number },   //管理员id
  repairtype: { type: Number },  //报修项目id
  repairname: { type: String },  //报修项目
  orderindex: { type: Number, default: 0},  //排序
  statu: { type: Number , default:1},  //状态  默认值1有效
  msk1: { type: String },  
  msk2: { type: String },  
 // create_at: { type: Date, default: Date.now },
 // update_at: { type: Date, default: Date.now },

});

//RepairManagerSchema.plugin(BaseModel);
RepairManagerSchema.index({managerid: 1});
RepairManagerSchema.index({orderindex: 1});

mongoose.model('RepairManager', RepairManagerSchema);
