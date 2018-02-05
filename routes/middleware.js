var passport = require('passport');
function isLoggedIn(){
	passport.authenticate('local-login', { session: false }, function(err, user, info) { 
        if (err) { 
        	//return next(err);
        	res.redirect('/admin')
        } 
        if (!user) {
        	res.redirect('/admin');
        } 
        req.user = user;   // Forward user information to the next middleware
        return next();
    })(req, res, next);
};



module.exports = {
	isLoggedIn : isLoggedIn,
};