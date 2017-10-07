var router = require('express').Router();
var path = require('path');
var view = require('../config').view


router.use('/api', require('./api'));
router.get('/', function (req,res,next) {
	res.sendFile(view+'/index.html');
})
module.exports = router;
