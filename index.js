//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
//nüüd async jaoks kasutame mysql2 promises osa
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
const bodyparser = require("body-parser");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui vormist tuleb ainult tekst, siis false, muidu true
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
	let conn;
	let photoData = null;
	const privacy = 3;
	const sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
	
	try {
		conn = await mysql.createConnection(dbConf);
		const [rows] = await conn.execute(sqlReq, [privacy]);

		if (rows.length > 0) {
			photoData = rows[0];
		}
		res.render("index", { photo: photoData });
	}
	catch (err) {
		console.error("Viga andmebaasist foto laadimisel: " + err);
		res.render("index", { photo: null });
	}
	finally {
		if (conn) {
			await conn.end();
		}
	}
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

// Külastuse marsruudid
const visitRouter = require("./routes/visitRoutes");
app.use("/visits", visitRouter);

// Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5210);