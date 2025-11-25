//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const loginCheck = require("./src/checkLogin");
const fs = require("fs");
//nüüd async jaoks kasutame mysql2 promises osa
const mysql = require("mysql2/promise");
//sessioonihaldur
const session = require("express-session");
const dbInfo = require("../../../vp2025config");
const bodyparser = require("body-parser");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const app = express();
app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui vormist tuleb ainult tekst, siis false, muidu true
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
	let conn;
	let photoData = null;
	let latestNews = null;
	const privacy = 3;
	const sqlPhoto = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
	const sqlNews = "SELECT title, content, filename, alttext FROM news WHERE expired > ? ORDER BY id DESC LIMIT 1";

	try {
		conn = await mysql.createConnection(dbConf);
		const [photoRows] = await conn.execute(sqlPhoto, [privacy]);
		const [newsRows] = await conn.execute(sqlNews, [new Date()]);

		if (photoRows.length > 0) {
			photoData = photoRows[0];
		}

		if (newsRows.length > 0) {
			latestNews = newsRows[0];
		}
		res.render("index", { photo: photoData, news: latestNews });
	}
	catch (err) {
		console.error("Viga andmebaasist andmete laadimisel: " + err);
		res.render("index", { photo: null, news: null });
	}
	finally {
		if (conn) {
			await conn.end();
		}
	}
});

//sisseloginud  kasutajate osa avaleht
app.get("/home", loginCheck.isLogin, (req, res)=>{
	//console.log("Sisse logis kasutaja id: " + req.session.userId);
	res.render("home", {userName: req.session.userFirstName + " " + req.session.userLastName});
});

//väljalogimine
app.get("/logout", (req, res)=>{
	console.log("Kasutaja id: " + req.session.userId + " logis välja!");
	//tühistame sessioni
	req.session.destroy();
	res.redirect("/");
});

app.get("/timenow", (req, res)=>{
	res.render("timenow", {nowDate: dateET.longDate(), nowWD: dateET.weekDay()});
});

app.get("/vanasonad", (req, res)=>{
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data) => {
		if(err){
			res.render("genericlist", {heading: "Valik Eesti tuntud vanasõnasid", listData: ["Kahjuks vanasõnasid ei tea! :("]});
		} else {
			let folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti tuntud vanasõnasid", listData: folkWisdom});
		}
	});

});

// Galerii marsruudid
const galleryphotoupRouter = require("./routes/galleryphotoupRoutes");
app.use("/galleryphotoupload", galleryphotoupRouter);

const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

// Külastuse marsruudid
const visitRouter = require("./routes/visitRoutes");
app.use("/visits", visitRouter);

// Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

// Uudiste marsruudid
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

// Konto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

// Sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5210);