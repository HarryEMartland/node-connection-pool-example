var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  setTimeout(() => {
    res.json({});
  }, 1000)
});

module.exports = router;
