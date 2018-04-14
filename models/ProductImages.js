var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var Product = mongoose.model('Product');

var ProductImagesSchema = new mongoose.Schema({
	title: {type:String},
	fullpath: {type:String},
	url: {type:String},
	product: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Product'
	}
}, {timestamps: true});


mongoose.model('ProductImages', ProductImagesSchema);
