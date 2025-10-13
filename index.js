//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
//lisan andmebaasiga suhtlemiseks mooduli
const mysql = require("mysql2");
//lisan andmebaasi juurdepääsuinfo
const dbInfo = require("../../../vp2025config")
const bodyparser = require("body-parser");

//loome objekti, mis ongi express.js programm ja edasi kasutamegi seda
const app = express();
//määrame renderajaks ejs'i
app.set("view engine", "ejs");
//määrame kasutamiseks avaliku kataloogi
app.use(express.static("public"));
//päringu URL-i parsimine ja eraldame POST osa. False, kui ainult tekst, True kui muud infot ka. 
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});

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
					// lisa siia res.render("visitregistered") - see jääb samale aadressile aga renderdab uue faili, et kuvada registreerimine õnnestus
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

app.get("/eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT  * FROM person";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if (err){
			console.log(err);
			res.render("filmiinimesed", {personList: []});
		}
		else {
			console.log(sqlRes);
			res.render("filmiinimesed", {personList: sqlRes});
		}
		
	});
	//res.render("filmiinimesed");
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/inimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas?
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!"});
	}
	else {
		let deceasedDate = null;
		if (req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlRes)=>{
			if (err){
				res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
			}
			else{
				res.render("filmiinimesed_add", {notice: "Andmed on edukalt salvestatud!"});
			}
		});
	}
	//res.render("filmiinimesed_add", {notice: "Andmed olemas! " + req.body});
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