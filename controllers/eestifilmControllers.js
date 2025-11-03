const mysql = require("mysql2/promise");
const dbInfo = require("../../../../vp2025config");
const { formatDbDate } = require('../src/dateTimeET');

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
		const formattedPeople = rows.map(person => {
			return {
				id: person.id,
                first_name: person.first_name,
                last_name: person.last_name,
                born: person.born,
                deceased: person.deceased,
                born_formatted: formatDbDate(person.born),
                deceased_formatted: formatDbDate(person.deceased)
			};
		});
		res.render("filmiinimesed", {personList: formattedPeople});
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
			const [result] = await conn.execute (sqlReq, [req.body.positionInput, req.body.positionDescriptionInput], (err, sqlRes));
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

//@desc Page for listing Estonian films
//@route GET /eestifilm/lisa-film
//@access public
const addMoviePage = (req, res) => {
	res.render("lisa-film", {notice: 'Siesta filmi andmed!', movie: {}});
};

//@desc Page for listing Estonian films
//@route POST /eestifilm/lisa-film
//@access public
const addMoviePost = async (req, res) => {
	let conn;
	const sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)";
	const { titleInput, yearInput, durationInput, descriptionInput} = req.body;
	if (!titleInput || !yearInput || !durationInput || !descriptionInput) {
		return res.render('lisa-film', {
			notice: "Palun täida kõik kohustuslikud väljad (pealkiri, aasta, kestus, kirjeldus)!",
			movie: req.body
		})
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud!");
		const [result] = await conn.execute(sqlReq, [titleInput, yearInput, durationInput, descriptionInput]);
		res.render("lisa-film", { notice: "Film edukalt salvestatud!", movie: {}});
	}
	catch (err) {
		console.error("Viga filmi lisamisel: " + err);
		res.render("lisa-film", {
			notice: "Tekkis tehniline viga filmi salvestamisel! " + err.message,
			movie: req.body
		});
	}
	finally {
		if (conn) {
			await conn.end();
			console.log("Andmebaasi ühendus suletud!");
		}
	};
};

//@desc Page for adding relations between different aspects of Estonian films
//@route GET /eestifilm/lisa-seos
//@access public
const addRelationPage = async (req, res) => {
	let conn;
	try{
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud");
		const [persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY first_name, last_name");
		const [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
		const [positions] = await conn.execute("SELECT id, position_name FROM positions ORDER BY position_name");
		res.render("lisa-seos", {
			persons: persons,
			movies: movies, 
			positions: positions,
			notice: "Vali rippmenüüst seos",
			data: {}
		});
	}
	catch (err) {
		console.error("Viga seoste lehe laadimisel: " + err);
		res.render("lisa-seos", {
			persons: [],
			movies: [],
			positions: [],
			notice: "Viga andmete laadimisel: " + err.message,
			data: {}
		});
	}
	finally {
		if (conn) {
			await conn.end();
			console.log("Andmebaasi ühendus suletud!");
		}
	}
};

//@desc Saves a new relation between different aspects of Estonian films
//@route POST /eestifilm/lisa-seos
//@access public
const addRelationPost = async (req, res) => {
	let conn;
	const { personSelect, movieSelect, positionsSelect, roleInput } = req.body;
	const sqlReq = "INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)";
	if (!personSelect || !movieSelect || !movieSelect || !positionsSelect) {
		let persons = [];
		let movies = [];
		let positions = [];
		try {
			conn = await mysql.createConnection(dbConf);
			[persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY first_name, last_name");
			[movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
			[positions] = await conn.execute("SELECT id, position_name FROM positions ORDER BY position_name");
		}
		catch (err) {
			console.error("Viga valideerimisjärgsel laadimisel: " + err);
		}
		finally { if (conn) { await conn.end(); conn = null;}}

		return res.render("lisa-seos", {
			persons: persons,
			movies: movies,
			positions: positions,
			notice: "Viga: Kõik väljad (isik, film, amet) peavad olema valitud!",
			data: req.body
		});
	}
	let roleValue = null;
	if (roleInput && roleInput.trim() !== "") {
		roleValue = roleInput.trim();
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud!")
		await conn.execute(sqlReq, [personSelect, movieSelect, positionsSelect, roleValue]);
		console.log("Uus seos edukalt salvestatud!");
		res.redirect("/eestifilm/lisa-seos");
	}
	catch (err) {
		console.error("Viga seose salvestamisel: " + err);
		let persons = [];
		let movies = [];
		let positions = [];
		try {
			conn = await mysql.createConnection(dbConf);
            [persons] = await conn.execute("SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name");
            [movies] = await conn.execute("SELECT id, title FROM movie ORDER BY title");
            [positions] = await conn.execute("SELECT id, position_name FROM positions ORDER BY position_name");
        } catch (err2) { 
            console.error("Viga veateate lehe laadimisel: " + err2);
        } 
        finally { if (conn) { await conn.end(); } }

        res.render("lisa_seos", {
            persons: persons,
            movies: movies,
            positions: positions,
            notice: "Viga seose salvestamisel: " + err.message,
            data: req.body
        });
    } finally {
        if (conn && conn.state !== 'disconnected') {
            await conn.end();
            console.log("Andmebaasi ühendus suletud seose salvestamisel!");
        }
    }
};

// @desc    Shows all the relations between tables: person, movie, position
// @route   GET /eestifilm/vaata-seos
// @access  Public
const showRelationPage = async (req, res) => {
	let conn;
	const sqlReq = `
        SELECT 
            person.id AS person_id, 
            person.first_name, 
            person.last_name,
            movie.title,
            positions.position_name,
            person_in_movie.role
        FROM 
            person_in_movie
        JOIN 
            person ON person.id = person_in_movie.person_id
        JOIN 
            movie ON movie.id = person_in_movie.movie_id
        JOIN 
            positions ON positions.id = person_in_movie.position_id
        ORDER BY 
            person.last_name, person.first_name, movie.title;
    `;
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasi ühendus loodud!")
		const [relations] = await conn.execute(sqlReq);
		res.render("vaata-seos", {
			relations: relations,
			pageTitle: "Filmis osalenud isikud"
		});
	}
	catch (err) {
		console.error("Viga seosste nimekirja laadimisel: " + err);
		res.render("vaata-seos", {
			relations: [],
			pageTitle: "Viga andmete laadimisel"
		});
	}
	finally {
		if (conn);
		await conn.end();
		console.log("Andmebaasi ühendus suletud!")
	}
}

module.exports = {
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
	showRelationPage
};
