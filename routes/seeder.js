var router = require('express').Router();
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var slug = require('slug')

router.get('/genarate/category', function (req,res,next) {
	var catarray = ["General", "Electronics & Digital", "Home Appliances", "Vehicles", "Kids", "Other"];
	var response = [];
	for(var index in catarray) {
		var category = new Category();
		category.title = catarray[index];
		category.slug = slug(catarray[index], {lower:true});
		category.save();
	}
	return res.json({"status": 201, "message":"Categories created"});
});

module.exports = router;