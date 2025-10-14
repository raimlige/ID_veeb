const express = require("express");
const router = express.Router();

//kontrollerid
const {
	filmHomePage, 
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost} = require("../controllers/eestifilmControllers"); 


//          "/" - kuna see on eesti filmi avaleht routeri jaoks
router.route("/").get(filmHomePage);
router.route("/inimesed").get(filmPeople);
router.route("/inimesed_add").get(filmPeopleAdd);
router.route("/inimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/inimesed_add_amet").get(filmPositionAdd);
router.route("/inimesed_add_amet").post(filmPositionAddPost);

module.exports = router;