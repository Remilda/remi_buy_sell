var router = require('express').Router();
var path = require('path');
var view = require('../config').view

router.use('/seeders', require('./seeder.js'));

router.use('/api', require('./api'));
router.use('/admin', require('./admin.js'));
router.get('/', function (req,res,next) {
	res.sendFile(view+'/index.html');
});
router.get('/:fname', function (req,res,next) {
	var str = req.params.fname;
	console.log(str);
	console.log(str.indexOf(".html"));
	if(str.indexOf(".html") > -1){
		res.sendFile(view+'/partials/'+req.params.fname);
	}else{
		res.json({"status":404, "message":req.params.fname+" file not found or invalid extensions"});
	}
});
router.get('/public/views/frontends/:file', function (req,res,next) {
	res.sendFile(view+'/frontends/'+req.params.file);
});
module.exports = router;
