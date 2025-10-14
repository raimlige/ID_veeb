//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
//nüüd async jaoks kasutame mysql2 promises osa
//const mysql = require("mysql2/promise");
//const dbInfo = require("../../../vp2025config");
const bodyparser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
/* const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
}); */

/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};
 */
app.get("/", (req, res)=>{
	res.render("index");
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

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);

	const fullName = req.body.firstNameInput + ' ' + req.body.lastNameInput;
	const dateStr = dateET.longDate();
	const timeStr = dateET.time();
	const logEntry = fullName + ', ' + dateStr + ' kell ' + timeStr;

	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", logEntry + "; ", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
		if(err){
			res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: ["Kahjuks ei saanud seda kuvada! :("]});
		} else {
			let tempVisitorsLog = data.split(";");
			for(let i = 0; i < tempVisitorsLog.length - 1; i ++){
				listData.push(tempVisitorsLog[i]);
			}
			res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: tempVisitorsLog});
		}
	});
});

// Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.listen(5210);