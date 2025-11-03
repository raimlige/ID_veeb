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
	filmPositionAddPost,
	addMoviePage,
	addMoviePost,
	addRelationPage,
	addRelationPost,
	showRelationPage} = require("../controllers/eestifilmControllers"); 


//          "/" - kuna see on eesti filmi avaleht routeri jaoks
router.route("/").get(filmHomePage);
router.route("/inimesed").get(filmPeople);
router.route("/inimesed_add").get(filmPeopleAdd);
router.route("/inimesed_add").post(filmPeopleAddPost);
router.route("/ametid").get(filmPosition);
router.route("/inimesed_add_amet").get(filmPositionAdd);
router.route("/inimesed_add_amet").post(filmPositionAddPost);
router.route("/lisa-film").get(addMoviePage);
router.route("/lisa-film").post(addMoviePost);
router.route("/lisa-seos").get(addRelationPage);
router.route("/lisa-seos").post(addRelationPost);
router.route("/vaata-seos").get(showRelationPage);

module.exports = router;