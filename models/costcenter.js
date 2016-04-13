var mongoose  = require('mongoose');
var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CostcenterSchema = new Schema({ 
  id: { type: Number },
  costCenter: { type: Number },
  costCenterName: { type: String },  
  Areald: { type: Number }, 
  Statu: { type: Number },
  OrderIndex: { type: Number},  //排序
  Msk1: { type: String },  
  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },

});

CostcenterSchema.plugin(BaseModel);
CostcenterSchema.index({costCenter: 1});
CostcenterSchema.index({orderindex: 1});

mongoose.model('Costcenter', CostcenterSchema);
