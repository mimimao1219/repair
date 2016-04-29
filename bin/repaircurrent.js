// 一次性脚本
var EventProxy   = require('eventproxy');
var CompanyModel = require('../models').Company;
var RepairCompanyModel = require('../models').RepairCompany;
var RepairCurrentModel = require('../models').RepairCurrent;
var CostcenterModel = require('../models').Costcenter;
var RepairTypeModel = require('../models').RepairType;
var RepairManagerModel = require('../models').RepairManager;
//RepairManagerModel.distinct('managerid').exec(function (err, u) { 
//	console.log(u);
//} );

RepairCurrentModel.find({}).exec(function (err, RepairCurrents) {
RepairCurrents.forEach(function (RepairCurrent) {
	
	var ep = new EventProxy();
	ep.all('Company','Costcenter','RepairType','comtact','manager',function (Company,Costcenter,RepairType,comtact,manager) { 
		//if (tel){
		if (RepairType){
		RepairCurrent.repairtypename=RepairType.repairname;
		}
		if (Costcenter){
		RepairCurrent.costcentername=Costcenter.costCenterName;
		}
		if (Company){
		RepairCurrent.companyname=Company.name;
		}
		if (comtact){
		RepairCurrent.comtact=comtact.comtact;
		RepairCurrent.comtact_tel=comtact.comtact_tel;
		RepairCurrent.comtact_mob=comtact.comtact_mob;
		RepairCurrent.comtact_mail=comtact.comtact_mail;
		RepairCurrent.comtact_type=comtact.msk1;
		}
		if (manager){
			RepairCurrent.managerid=manager.managerid;
			}
		
		//console.log(company);
		RepairCurrent.save();
		//}
	 });
	 CompanyModel.findOne({id:RepairCurrent.companyid},'name',ep.done('Company'));
	 CostcenterModel.findOne({costCenter:RepairCurrent.costcenter},'costCenterName',ep.done('Costcenter'));
	 RepairTypeModel.findOne({repairtype:RepairCurrent.repairType},'repairname',ep.done('RepairType'));
	 RepairManagerModel.findOne({repairtype:RepairCurrent.repairType},'managerid',ep.done('manager'));
	 //RepairCompanyModel.distinct('repairtype',{companyid:company.id},ep.done('typename'))
	 RepairCompanyModel.findOne({companyid:RepairCurrent.companyid,repairtype:RepairCurrent.repairType},null,{sort: 'msk1'},ep.done('comtact'))

});
});



