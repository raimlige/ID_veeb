const fs = require('fs');
const dateET = require('../src/dateTimeET');

//@desc Page to register visitors visits to the website
//@route GET /visits
//@access Public
const showVisitPage = (req, res) => {
    res.render("regvisit", { notice: "Ootan sisestust!"});
};

//@desc Page to register visitors visits to the website
//@route POST /visits
//@access Public
const registerVisit = (req, res) => {
    console.log(req.body);
    const fullName = req.body.firstNameInput + ' ' + req.body.lastNameInput;
    const dateStr = dateET.longDate();
    const timeStr = dateET.time();
    const logEntry = fullName + ', ' + dateStr + ' kell ' + timeStr + "; ";
    fs.appendFile("public/txt/visitlog.txt", logEntry, (err) => {
        if (err) {
            console.error(err);
            return res.render("regvisit", { notice: "Viga salvestamisel!" });
        }     
        console.log("Salvestatud!");
        res.redirect('/visits/log');
    });
};

//@desc Page to show registered visitors visits to the website
//@route GET /visits/log
//@access Public
const showVisitLog = (req, res) => {
    fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) => {
        if(err){
            console.error(err);
            res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: ["Logi lugemine ebaõnnestus!"]});
        } else {
            let listData = [];
            let tempVisitorsLog = data.split(";");
            for(let i = 0; i < tempVisitorsLog.length - 1; i ++){
                listData.push(tempVisitorsLog[i]);
            }
            res.render("visitlog", {heading: "Kes meie veebilehte külastanud on?", listData: listData});
        }
    });
};

module.exports = {
    showVisitPage,
    registerVisit,
    showVisitLog
};