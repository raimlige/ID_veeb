const express = require("express");
const router = express.Router();
const loginCheck = require("../src/checkLogin");

//kõigile marsruutidele lisan sisselogimise kontrolli vahevara
router.use(loginCheck.isLogin);

//kontrollerid
const {
	photogalleryHome,
	photogalleryPage} = require("../controllers/photogalleryControllers"); 


router.route("/").get(photogalleryHome);
router.route("/:page").get(photogalleryPage);

module.exports = router;