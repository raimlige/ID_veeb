const mysql = require("mysql2/promise");
//const fs = require("fs").promises;
const dbInfo = require("../../../../vp2025config");


const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for news
//@route GET /news
//@access public

//@desc Page for adding news
//@route POST /news
//@access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO news (title, content, expired, user_id, filename, origname, alttext) VALUES (?,?,?,?,?,?,?)";
	try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasi ühendus loodud!");

module.exports = {
	newsHome
	newsHomePost
};
