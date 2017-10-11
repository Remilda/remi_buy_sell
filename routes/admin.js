var router = require('express').Router();
var path = require('path');
var view = require('../config').view


router.get('/', function (req,res,next) {
	//return res.json({"status":200, "msg":"Welcome to admin"});
	res.sendFile(view+'/admin/login.html');
})
/*router.get('/:fname', function (req,res,next) {
	var str = req.params.fname;
	console.log(str);
	console.log(str.indexOf(".html"));
	if(str.indexOf(".html") > -1){
		res.sendFile(view+'/partials/'+req.params.fname);
	}else{
		res.json({"status":404, "message":req.params.fname+" file not found or invalid extensions"});
	}
})*/
module.exports = router;
