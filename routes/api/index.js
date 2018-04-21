var router = require('express').Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var ProductImages = mongoose.model('ProductImages');
var auth = require('../auth');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var slug = require('slug');
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

router.post('/product/image', auth.required, function(req, res, next){
    var form = new formidable.IncomingForm();
    var uploadpath = path.join(__dirname, "../../uploads/products/");
    files = [];
    fields = [];
    form.on('field', function(field, value) {
        fields.push(value);
    });
    form.on('file', function(field, file) {
        console.log("==="+file.name+"===");
        files.push(file);
    });
    form.parse(req, function (err) {
        images = [];
        for(index in files){
            var oldpath = files[index].path;
            console.log(files[index].path+" name "+fields[index]);
            var newpath = uploadpath +'product_'+fields[0]+files[index].name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                var image = new ProductImages();
                image.title = 'product_'+fields[0]+files[index].name;
                image.fullpath = newpath;
                image.url = 'uploads/products/product_'+fields[0]+files[index].name;
                image.product = fields[0];
                image.save().then(function(image){
                    images.push(image);
                }).catch(next);
            });
        }
        return res.json({"status":"Images uploaded"});
    });
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

router.get('/category/:name/products', function(req, res, next){
    Category.findOne({slug:req.params.name}).exec(function(err, category){
        Product.find({category:category._id}).populate('owner').populate('category').sort(
            {'createdAt':-1}).exec(function(err, products){
            var response = []
            for(var index in products){
                response.push(products[index].toJSON(products[index].owner, products[index].category));
            }
            return res.json({"products": response});
        });
    });
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