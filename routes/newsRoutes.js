const express = require("express");
const router = express.Router();

//kontrollerid
const {
	newsHome,
	newsHomePost} = require("../controllers/newsControllers"); 


router.route("/").get(newsHome);
router.route("/").post(newsHomePost);

module.exports = router;