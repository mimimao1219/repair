var mongoose = require('mongoose');
var config   = require('../config');
var logger = require('../common/logger')

mongoose.connect(config.db, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.db, err.message);
    process.exit(1);
  }
});

// models
require('./company');
require('./repair_company');
require('./repair_current');
require('./repair_manager');
require('./repair_type');
require('./counters');
require('./repair_image');
require('./costcenter');

exports.Costcenter         = mongoose.model('Costcenter');
exports.Company         = mongoose.model('Company');
exports.Counters         = mongoose.model('Counters');
exports.RepairCompany	= mongoose.model('RepairCompany');
exports.RepairCurrent	= mongoose.model('RepairCurrent');
exports.RepairManager	= mongoose.model('RepairManager');
exports.RepairType		= mongoose.model('RepairType');
exports.RepairImage		= mongoose.model('RepairImage');
