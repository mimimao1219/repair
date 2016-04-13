// 一次性脚本
var EventProxy   = require('eventproxy');
var CompanyModel = require('../models').Company;
var RepairCompanyModel = require('../models').RepairCompany;

//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

CompanyModel.find({}).exec(function (err, companys) {
companys.forEach(function (company) {
	
	var ep = new EventProxy();
	ep.all('typename','tel' ,function (typename,tel) { 
		if (tel){
		company.repairtype=typename;
		company.tel=tel.comtact_mob;
		company.linkname=tel.comtact;
		company.mail=tel.comtact_mail;		
		//console.log(company);
		company.save();
		}
	 });
	 
	 RepairCompanyModel.distinct('repairtype',{companyid:company.id},ep.done('typename'))
	 RepairCompanyModel.findOne({companyid:company.id},null,{sort: '-msk1'},ep.done('tel'))

});
});



