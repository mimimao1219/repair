// 一次性脚本
var EventProxy   = require('eventproxy');
var CompanyModel = require('../models').Company;
var RepairCompanyModel = require('../models').RepairCompany;
var RepairTypeModel = require('../models').RepairType;
//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

RepairCompanyModel.find({}).exec(function (err, comtacts) {
comtacts.forEach(function (comtact) {
	
	var ep = new EventProxy();
	ep.all('typename' ,function (typename) { 
		if (typename){
		comtact.repairtypename=typename.repairname;
		comtact.save();
		}
	 });
	 
	 RepairTypeModel.findOne({repairtype:comtact.repairtype},'repairname',ep.done('typename'))


});
});



