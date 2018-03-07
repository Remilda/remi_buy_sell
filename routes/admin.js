var router = require('express').Router();
var path = require('path');
var view = require('../config').view
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('./auth');
var flash = require('connect-flash');
var auth = require(path.join(__dirname, '../config/auth.js'));
var moment = require('moment');
var http = require('http');
var url = require('url') ;
var google_map_key = require('../config').google_map_key;

router.get('/', function (req,res,next) {
	res.render(view+'/admin/login.ejs', {"loginMessage": ""});
})

router.post('/register', function(req, res, next){

	//return res.json({username:req.body.username, email:req.body.email, password:req.body.password});
	var user = new User();
	user.username = req.body.username;
	user.email = req.body.email;
	user.role = "admin";
	user.setPassword(req.body.password);

	user.save().then(function(){
		res.redirect('admin/profile');
	}).catch(next);
});

router.get('/profile', function(req, res, next){
	var hostname = req.headers.host;
	var baseurl = req.protocol+"://"+hostname;
	res.render(view+'/admin/dashboard.ejs',{path:view, base:baseurl});
});

router.get('/users', function(req, res, next){
	var hostname = req.headers.host;
	var baseurl = req.protocol+"://"+hostname;
	User.find({}, function(err, users) {
	    res.render(view+'/admin/users.ejs',{users:users, moment:moment, base:baseurl});
	});
});

router.get('/products', function(req, res, next){
	var hostname = req.headers.host;
	var baseurl = req.protocol+"://"+hostname;
	res.render(view+'/admin/products.ejs',{path:view, base:baseurl});
});

//Auctions
router.get('/auctions', function(req, res, next){
	var hostname = req.headers.host;
	var baseurl = req.protocol+"://"+hostname;
	res.render(view+'/admin/auctions.ejs',{base:baseurl});
});

router.get('/auctions/add', function(req, res, next) {
	var hostname = req.headers.host;
	var baseurl = req.protocol+"://"+hostname;
	res.render(view+'/admin/auctions_add.ejs', {base:baseurl, google_map_key:google_map_key});
});
router.post('/auctions/add', function(req, res, next) {
	res.json({'params': req.body});
});


router.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({err: info});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({err: 'Could not log in user'});
			}
			passport.authenticate('session');
			res.redirect('/admin/profile');
			//res.status(200).json({status: 'Login successful!'});
		});
	})(req, res, next);
});

module.exports = router;