var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var flash = require('connect-flash');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
}, function(email, password, done) {
  User.findOne({email: email}).then(function(user){
    if(!user || !user.validPassword(password)){
      return done(null, false, {errors: {'email or password': 'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
}));

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, email, password, done) { // callback with email and password from our form
	User.findOne({'email':email}).then(function(user){
    	console.log("starts");
    	console.log(user);
    	console.log("ends");
    	if(!user || !user.validPassword(password) || user.role != "admin"){
    		return done(null, false, {errors: {'loginMessage':"Invalid user credentials"}});
    	}
    	return done(null, user);
    }).catch(done);

}));