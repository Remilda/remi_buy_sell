var router = require('express').Router();

router.use('/api', require('./api'));
router.get('/', function (req,res,next) {
	return res.json({"status":200, "message":"successfull"});
})
module.exports = router;
