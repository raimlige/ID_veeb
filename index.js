//moodulid
const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
const bodyparser = require("body-parser");
//loome objekti, mis ongi express.js programm ja edasi kasutamegi seda
const app = express();
//määrame renderajaks ejs'i
app.set("view engine", "ejs");
//määrame kasutamiseks avaliku kataloogi
app.use(express.static("public"));
//päringu URL-i parsimine ja eraldame POST osa. False, kui ainult tekst, True kui muud infot ka. 
app.use(bodyparser.urlencoded({extended: false}));

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
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
		if(err){
			res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: ["Kahjuks ei saanud seda kuvada! :("]});
		} else {
			let visitorsLog = data.split(";");
			res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: visitorsLog});
		}
	});
});

app.listen(5210);