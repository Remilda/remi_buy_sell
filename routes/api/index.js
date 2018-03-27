var router = require('express').Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = require('../auth');
router.use('/', require('./users'));

router.post('/product', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }
        var product = new Product();
        product.title = req.body.product.title;
        product.quantity = req.body.product.quantity;
        product.description = req.body.product.description;
        product.price = req.body.product.price;
        product.owner = user.toAuthJSON().id;
        product.category = req.body.product.category;
        product.save().then(function(product) {
            return res.json({"product": product.toJSON(product.owner, product.category)})
        }).catch(next);
    }).catch(next);
});

router.get('/categories', function(req, res, next){
    Category.find({}, function(err, category) {
        return res.json({'categories': category});
    });
});

router.get('/products', function(req, res, next) {
    Product.find().populate('owner').populate('category').exec(function(err, products) {
        var response = []
        for(var index in products){
            response.push(products[index].toJSON(products[index].owner, products[index].category));
        }
        return res.json({"products": response});
    });
});

router.get('/product/:id', function(req, res, next) {
    Product.findById(req.params.id).populate('owner').populate('category').exec(function(err, product) {
        return res.json({"product": product.toJSON(product.owner, product.category)});
    });
});

router.get('/product/:id/similar', function(req, res, next) {
    var type = req.query.type;
    var id = req.query.id;
    if(type == "user"){
        Product.find({owner:id, '_id':{$ne:req.params.id}}).populate('owner').populate('category').limit(4).sort(
            {'createdAt':-1}).exec(function(err, products){
            var response = []
            for(var index in products){
                response.push(products[index].toJSON(products[index].owner, products[index].category));
            }
            return res.json({"similar_by_user": response});
        });
    }
    if(type == "category"){
        Product.find({category:id, '_id':{$ne:req.params.id}}).populate('owner').populate('category').limit(4).sort(
            {'createdAt':-1}).exec(function(err, products){
            var response = []
            for(var index in products){
                response.push(products[index].toJSON(products[index].owner, products[index].category));
            }
            return res.json({"similar_by_category": response});
        });
    }
});


router.use(function(err, req, res, next){
    if(err.name === 'ValidationError'){
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function(errors, key){
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    return next(err);
});

module.exports = router;