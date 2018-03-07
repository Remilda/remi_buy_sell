var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');
var User = mongoose.model('User');

var AuctionSchema = new mongoose.Schema({
  title: {type:String, require: [true, "Title is required"]},
  is_premium: {type:Boolean, default: false},
  maximum_products: Number,
  location: {type:String, require:[true, "Location is required"]},
  start_date: {type:Date, require: [true, "Mention when will be aution starts"]},
  end_date: Date
}, {timestamps: true});


mongoose.model('Auction', AuctionSchema);
