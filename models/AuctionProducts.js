var mongoose = require('mongoose');

var AuctionProductsSchema = new mongoose.Schema({
	auction: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Auction'
	},
	product: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: 'Product'
	},
	is_sold: { type: Boolean, default: false }
}, {timestamps: true});


mongoose.model('AuctionProducts', AuctionProductsSchema);
