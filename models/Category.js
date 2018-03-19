var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var CategorySchema = new mongoose.Schema({
	title: {type:String, require: [true, "Title is required"]},
	slug: String
}, {timestamps: true});

mongoose.model('Category', CategorySchema);
