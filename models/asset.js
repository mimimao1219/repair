var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var AssetSchema = new Schema({ 
	AssetsNo: { type: String },
	AssetsName: { type: String },  
	AssetsClass: { type: String }, 
	AssetsModel: { type: String },
	UserCostCenter: { type: String },
});


mongoose.model('Asset', AssetSchema);