var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var RepairImageSchema = new Schema({ 
  id: { type: ObjectId },   //维修记录id
  weixinsrc: {  type: String },
  qnsrc: [String] ,  
  create_at: { type: Date, default: Date.now }
});

mongoose.model('RepairImage', RepairImageSchema);
