// 一次性脚本
var EventProxy   = require('eventproxy');
var RepairTypeModel = require('../models').RepairType;
var RepairCompanyModel = require('../models').RepairCompany;

//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

RepairTypeModel.find({}).exec(function (err, RepairTypes) {
RepairTypes.forEach(function (RepairType) {
	
	var ep = new EventProxy();
	ep.all('companyid' ,function (companyid) { 
		if (companyid){
		RepairType.companyid=companyid;

		RepairType.save();
		}
	 });
	 
	 RepairCompanyModel.distinct('companyid',{repairtype:RepairType.repairtype},ep.done('companyid'))
	 //RepairCompanyModel.findOne({companyid:company.id},null,{sort: '-msk1'},ep.done('tel'))

});
});



