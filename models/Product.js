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
		images: [
			{
			    path: "https://picsum.photos/786/512/?image=890",
			    id: "5aa0e0a42e20d42a04869f9e"
			},
			{
			    path: "https://picsum.photos/786/512/?image=891",
			    id: "5aa0e0a4fe1e2dd9d2c6bf14"
			},
			{
			    path: "https://picsum.photos/786/512/?image=892",
			    id: "5aa0e0a44acda11ade3dc16b"
			},
			{
			    path: "https://picsum.photos/786/512/?image=893",
			    id: "5aa0e0a4379a88e8424440da"
			},
			{
			    path: "https://picsum.photos/786/512/?image=894",
			    id: "5aa0e0a4edf53948177a4609"
			}
		],
		is_sold:this.is_sold,
		owner:{
			name: fullname,
			email: user.email,
			_id:user._id
		},
		category:{
			_id:category._id,
			title:category.title
		}
	};
};


mongoose.model('Product', ProductSchema);
