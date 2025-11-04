const express = require("express");
const router = express.Router();
const multer = require("multer");

//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	galleryphotoupPage, 
	galleryphotoupPagePost} = require("../controllers/galleryphotoupControllers"); 


router.route("/").get(galleryphotoupPage);
router.route("/").post(uploader.single("photoInput"), galleryphotoupPagePost);

module.exports = router;