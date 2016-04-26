
var mongoose  = require('mongoose');
//var BaseModel = require("./base_model");
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var UserSchema = new Schema({ 
OpenId: { type: String },
NickName: { type: String },  
UserPhotoUrl: { type: String }, 
Pid: { type: String },
UserId: { type: String },
UserName: { type: String },
OrgName: { type: String },
FixedPhone: { type: String },
CellPhone: { type: String },
Email:{ type: String },
usertype:{ type: String },


});


mongoose.model('User', UserSchema);

