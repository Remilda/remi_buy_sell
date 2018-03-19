var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');
var Category = mongoose.model('Category');

var ProductSchema = new mongoose.Schema({
	title: {type:String, require: [true, "Title is required"]},
	description: {type:String, require: [true, "Title is required"]},
	quantity: {type:Number, default:0},
	owner: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'User'
	},
	category: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Category'
	},
	is_sold: {type:Boolean, default:false},
	is_verified: {type:Boolean, default:false},
	price: {type:Number, require:[true, "Price must be given"]}
}, {timestamps: true});

ProductSchema.methods.toJSON = function(user, category){
	var fullname = '';
	if(typeof user.firstname != 'undefined'){
		fullname += user.firstname;
	}
	if(typeof user.lastname != 'undefined'){
		fullname = fullname+" "+user.lastname;
	}
	return {
		_id: this._id,
		title: this.title,
		price: this.price,
		description: this.description,
		quantity: this.quantity,
		images: [{}],
		owner:{
			name: fullname,
			email: user.email,
		},
		category:{
			_id:category._id,
			title:category.title
		}
	};
};

mongoose.model('Product', ProductSchema);
