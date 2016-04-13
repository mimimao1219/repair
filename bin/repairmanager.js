// 一次性脚本
var EventProxy   = require('eventproxy');
var RepairTypeModel = require('../models').RepairType;
var RepairManagerModel = require('../models').RepairManager;

//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

RepairManagerModel.find({}).exec(function (err, repairmanagers) {
repairmanagers.forEach(function (repairmanager) {
	
	var ep = new EventProxy();
	ep.all('typename', function (typename) { 
		repairmanager.repairname=typename.repairname
		repairmanager.save();
	 });
	 RepairTypeModel.findOne({repairtype:repairmanager.repairtype},'repairname',ep.done('typename'))

});
});



