var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var ProductSchema = new mongoose.Schema({
	title: {type:String, require: [true, "Title is required"]},
	description: {type:String, require: [true, "Title is required"]},
	quantity: {type:Number, default:0},
	owner: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	is_sold: {type:Boolean, default:false},
	is_verified: {type:Boolean, default:false},
	price: {type:Number, require:[true, "Price must be given"]}
}, {timestamps: true});

ProductSchema.methods.toJSON = function(){
	return {
		id: this._id,
		title: this.title,
		price: this.price,
		description: this.description,
		quantity: this.quantity,
		image: [{}]
	};
};

mongoose.model('Product', ProductSchema);
