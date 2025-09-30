//function dateFormattedET() {
const dateFormattedET = function (){
	let timeNow = new Date();
	const monthNamesET = ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}

const weekdayFormattedET = function (){
	let timeNow = new Date();
	const weekdayNamesET = ["pühapäev", "esmaspäev", "teisipäev","kolmapäev", "neljapäev", "reede", "laupäev"];
	return weekdayNamesET[timeNow.getDay()];
}

const timeFormattedET = function (){
	let timeNow = new Date();
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

module.exports = {longDate: dateFormattedET, weekDay: weekdayFormattedET, time: timeFormattedET};