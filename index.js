//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
//nüüd async jaoks kasutame mysql2 promises osa
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config")
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

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

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

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/inimesed", async (req, res)=>{
	let conn;
	const sqlReq = "SELECT  * FROM person";
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) { 
		console.log("Viga: " + err)
		res.render("filmiinimesed", {personList: []});
	}
	finally{
		if(conn){
			await conn.end();
			console.log("Andmebaasi ühendus suletud!");
		}
	}
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/inimesed_add", async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasi ühendus loodud!");
			let deceasedDate = null;
			if (req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje id: "  + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed on edukalt salvestatud!"});
		}
		catch(err){
			console.log("Viga! " + err);
			res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
		}
		finally{
			if(conn){
				await conn.end();
			console.log("Andmebaasi ühendus suletud!");
			}
		}
	}	
});

app.get("/eestifilm/ametid", (req, res)=>{
	let sqlReq = "SELECT * FROM positions";
	conn.execute(sqlReq, (err, sqlRes) => {
		if(err){
			console.log(err);
			res.render("ametid", {ametid: []});
		} else {
			res.render("ametid", {ametid: sqlRes});
		}
	});
});

app.get("/eestifilm/inimesed_add_amet", (req, res)=>{
	res.render("filmiinimesed_add_amet", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/inimesed_add_amet", (req, res)=>{
	console.log(req.body);
	if(!req.body.positionInput || !req.body.positionDescriptionInput){
		res.render("filmiinimesed_add_amet", {notice: "Andmed on vigased! Vaata üle!"});
	}
	else {
		let sqlReq = "INSERT INTO positions (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlRes)=>{
			if (err){
				res.render("filmiinimesed_add_amet", {notice: "Tekkis tehniline viga:" + err});
			}
			else{
				res.redirect("/eestifilm/ametid");
			}
		});
	}
});
app.listen(5210);