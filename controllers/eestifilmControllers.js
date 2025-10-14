const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Homepage for Estonian film section
//@route GET /eestifilm
//@access public

const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

//@desc Page for people involved in Estonian film industry
//@route GET /eestifilm/inimesed
//@access public

const filmPeople = async (req, res)=>{
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
};

//@desc Page for adding people involved in Estonian film industry
//@route GET /eestifilm/inimesed_add
//@access public

const filmPeopleAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
};

//@desc Page for adding people involved in Estonian film industry
//@route POST /eestifilm/inimesed_add
//@access public

const filmPeopleAddPost = async (req, res)=>{
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
};

//@desc Page for listing jobs in film industry
//@route GET /eestifilm/ametid
//@access public

const filmPosition = async (req, res)=>{
	let conn;
	let sqlReq = "SELECT * FROM positions";
	
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("ametid", {ametid: rows});
	}
	catch(err) { 
		console.log("Viga: " + err)
		res.render("ametid", {ametid: []});
	}
	finally{
		if(conn){
			await conn.end();
			console.log("Andmebaasi ühendus suletud!");
		}
	}
};

/* const filmPosition = (req, res)=>{
	let sqlReq = "SELECT * FROM positions";
	conn.execute(sqlReq, (err, sqlRes) => {
		if(err){
			console.log(err);
			res.render("ametid", {ametid: []});
		} else {
			res.render("ametid", {ametid: sqlRes});
		}
	});
}; */

//@desc Page for adding jobs, which are in the film industry, to the list 
//@route GET /eestifilm/inimesed_add_amet
//@access public

const filmPositionAdd = (req, res)=>{
	res.render("filmiinimesed_add_amet", {notice: "Ootan sisestust!"});
};

//@desc Page for adding jobs, which are in the film industry, to the list 
//@route POST /eestifilm/inimesed_add_amet
//@access public

const filmPositionAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO positions (position_name, description) VALUES (?,?)";
	
	if(!req.body.positionInput || !req.body.positionDescriptionInput){
		res.render("filmiinimesed_add_amet", {notice: "Andmed on vigased! Vaata üle!"});
		return;
	}
	else {
		try{
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasi ühendus loodud!");
			const [result] = await conn.execute (sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlRes);
			console.log("Salvestati kirje id: "  + result.insertId);
			res.render("filmiinimesed_add_amet", {notice: "Andmed on edukalt salvestatud!"});
		}
		catch(err){
			console.log("Viga! " + err);
			res.render("filmiinimesed_add_amet", {notice: "Tekkis tehniline viga:" + err});
		}
		finally{
			if(conn){
				await conn.end();
			console.log("Andmebaasi ühendus suletud!");
			}
		}
	}
};
	
/* const filmPositionAddPost = (req, res)=>{
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
}; */

module.exports = {
	filmHomePage, 
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost
};
