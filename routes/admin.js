var router = require('express').Router();
var path = require('path');
var view = require('../config').view
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('./auth');
var flash = require('connect-flash');


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
	return res.json({status:200, message:"Admin registered successfully", user: user.toAuthJSON()});
	}).catch(next);
});

router.get('/profile', function(req, res, next){
	return res.json({status:200, message:"Logged"});
});


router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/admin/profile', // redirect to the secure profile section
    failureRedirect : '/admin', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

/*router.post('/login', function(req, res, next){

	passport.authenticate('admin', {session: false}, function(err, user, info){
		console.log(info);
		if(err){ return done(err);}
		if(user){
			user.token = user.generateJWT();
			return res.json({status:200, message:"Admin logged in successfully",user: user.toAuthJSON()});
		} else {
			return res.json({status:200, message:info});
			//res.redirect('', {"message": "Invalid user credentials"});
		}
	})(res,req,next);

});*/


module.exports = router;
