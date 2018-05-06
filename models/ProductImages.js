var mongoose = require('mongoose');

var ProductImagesSchema = new mongoose.Schema({
	title: {type:String},
	fullpath: {type:String},
	url: {type:String},
	product: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Product'
	},
	image:{type: String}
}, {timestamps: true});


mongoose.model('ProductImages', ProductImagesSchema);
