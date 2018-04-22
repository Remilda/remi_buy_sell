var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var ProductImages = mongoose.model('ProductImages');
var auth = require('../auth');
var config = require('../../config');

router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        return res.json({
            user: user.toAuthJSON()
        });
    }).catch(next);
});

router.put('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if (!user) {
            return res.sendStatus(401);
        }
        // only update fields that were actually passed...
        if (typeof req.body.user.username !== 'undefined') {
            user.username = req.body.user.username;
        }
        if (typeof req.body.user.email !== 'undefined') {
            user.email = req.body.user.email;
        }
        if (typeof req.body.user.bio !== 'undefined') {
            user.bio = req.body.user.bio;
        }
        if (typeof req.body.user.image !== 'undefined') {
            user.image = req.body.user.image;
        }
        if (typeof req.body.user.firstname !== 'undefined') {
            user.firstname = req.body.user.firstname;
        }
        if (typeof req.body.user.lastname !== 'undefined') {
            user.lastname = req.body.user.lastname;
        }
        if (typeof req.body.user.address !== 'undefined') {
            user.address = req.body.user.address;
        }
        if (typeof req.body.user.mobile !== 'undefined') {
            user.mobile = req.body.user.mobile;
        }
        if (typeof req.body.user.password !== 'undefined') {
            user.setPassword(req.body.user.password);
        }
        return user.save().then(function() {
            return res.json({
                user: user.toAuthJSON()
            });
        });
    }).catch(next);
});

router.post('/users/login', function(req, res, next) {
    if (!req.body.user.email) {
        return res.status(422).json({
            errors: {
                email: "can't be blank"
            }
        });
    }
    if (!req.body.user.password) {
        return res.status(422).json({
            errors: {
                password: "can't be blank"
            }
        });
    }
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            if (user.role == "web") {
                user.token = user.generateJWT();
                return res.json({
                    user: user.toAuthJSON()
                });
            } else {
                return res.json({
                    message: "Invalid role"
                });
            }
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.post('/users', function(req, res, next) {
    var user = new User();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.role = "web";
    user.firstname = req.body.user.firstname;
    user.lastname = req.body.user.lastname;
    user.setPassword(req.body.user.password);

    user.save().then(function() {
        return res.json({
            user: user.toAuthJSON()
        });
    }).catch(next);
});

router.get('/user/products', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        Product.find({"owner": req.payload.id}).populate('owner').populate('category').sort({'createdAt':-1}).then(function(products) {
            var response = []; var ids = [];
            for(var product in products) {
                ids.push(products[product]._id)
                response.push(products[product].toJSON(products[product].owner, products[product].category, null));
            }
            ProductImages.find({product:{$in:ids}}, function(err,img){
                var image = [];
                for(var i in img){
                    image.push({"product":img[i].product, "path":config.base_url+"/"+img[i].title})
                }
                return res.json({"products": response, "images":image});
            });
        }).catch(next)
    }).catch(next);
});

module.exports = router;