var router = require('express').Router();
var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var Category = mongoose.model('Category');
var User = mongoose.model('User');
var auth = require('../auth');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var slug = require('slug');
var ProductImages = mongoose.model('ProductImages');
var AuctionProducts = mongoose.model('AuctionProducts');
router.use('/', require('./users'));
var config = require('../../config');
var Auction = mongoose.model('Auction');

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

        product.save()
        .then(function(product) { 
            var images = req.body.product.images;
            var promises = [];
            for(var i = 0; i < images.length; i++) {
                
                var productImage = new ProductImages();
                productImage.product = product._id,
                productImage.image = images[0],
                productImage.title = product.title+'_'+i;
                promises.push(productImage.save());
            }
            
            return Promise.all(promises);
        })
        .then(function(){
            return res.json({"product": product.toJSON(product.owner, product.category, [])})
        })
        .catch(next);
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

router.post('/product/images', auth.required, function (req,res, next) {

  })

router.get('/categories', function(req, res, next){
    Category.find({}, function(err, category) {
        return res.json({'categories': category});
    });
});

router.get('/products', function(req, res, next) {
    Product.find().populate('owner').populate('category').sort({'createdAt':-1}).exec(function(err, products) {
        var response = []
        var ids = [];
        for(var index in products){
            ids.push(products[index]._id);
            var images = [];
            console.log(products[index]._id);
            console.log(images);
            response.push(products[index].toJSON(products[index].owner, products[index].category, null));
        }

        ProductImages.find({product:{$in:ids}}, function(err,img){
            var image = [];
            for(var i in img){
                image.push({"product":img[i].product, "path":config.base_url+"/"+img[i].title, "image": img[i].image});
            }
            return res.json({"products": response, "images":image});
        });

    });
});

router.get('/product/:id', function(req, res, next) {
    Product.findById(req.params.id).populate('owner').populate('category').exec(function(err, product) {
        ProductImages.find({product:req.params.id}, function(err,img){
            var image = [];
            for(var i in img){
                image.push({"product":img[i].product, "path":config.base_url+"/"+img[i].title})
            }
            console.log('images length'+image.length);
            if(image.length > 0){
                return res.json({"product": product.toJSON(product.owner, product.category, image)});
            }else if(product){
                return res.json({"product": product.toJSON(product.owner, product.category, null)});
            }
        });
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
                response.push(products[index].toJSON(products[index].owner, products[index].category, null));
            }
            return res.json({"similar_by_user": response});
        });
    }
    if(type == "category"){
        Product.find({category:id, '_id':{$ne:req.params.id}}).populate('owner').populate('category').limit(4).sort(
            {'createdAt':-1}).exec(function(err, products){
            var response = []
            for(var index in products){
                response.push(products[index].toJSON(products[index].owner, products[index].category, null));
            }
            return res.json({"similar_by_category": response});
        });
    }
});

router.get('/category/:name/products', function(req, res, next){
    Category.findOne({slug:req.params.name}).exec(function(err, category){
        Product.find({category:category._id}).populate('owner').populate('category').sort(
            {'createdAt':-1}).exec(function(err, products){
            var response = [];
            var ids = [];
            for(var index in products){
                ids.push(products[index]._id);
                response.push(products[index].toJSON(products[index].owner, products[index].category, null));
            }
            console.log(ids);
            ProductImages.find({product:{$in:ids}}, function(err,img){
                var image = [];
                for(var i in img){
                    image.push({"product":img[i].product, "path":config.base_url+"/"+img[i].title})
                }
                return res.json({"products": response, "images":image});
            });
            ///return res.json({"products": response});
        });
    });
});


router.get('/auctions', function(req, res, next){
	Auction.find({}, function(err, auctions) {
        return res.json({'auctions': auctions});
    });
});
router.post('/auctions/add', function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }
        var auction = new Auction();
        auction.title = req.body.title;
        auction.is_premium = false;
        auction.maximum_products = req.body.maximum_products;
        auction.start_date = req.body.start_date;
        auction.end_date = req.body.end_date;
        auction.location = req.body.location;
        auction.owner = user.toAuthJSON().id;
        auction.save().then(function(created_auction){
            var ids = [];
            var pids = req.body.products;
            for(var id in pids){
                ids.push({"auction":auction._id, "product":pids[id]});
            }
            AuctionProducts.insert(ids);
            return res.json({"auction":created_auction})
        });
    }).catch(next);
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