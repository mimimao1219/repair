var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var CountersSchema = new Schema({ 
  name: { type: String },   
  seq: {  type: Number, default: 0 },  
});

mongoose.model('Counters', CountersSchema);
