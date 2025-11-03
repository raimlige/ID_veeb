//function dateFormattedET() {

const monthNamesET = ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];


const dateFormattedET = function (){
	let timeNow = new Date();
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

const formatDbDateET = function(dateFromDb) {
	if (!dateFromDb) {
		return '';
	}
	const givenDate = new Date(dateFromDb);
	const day = givenDate.getUTCDate();
	const monthIndex = givenDate.getUTCMonth();
	const year = givenDate.getUTCFullYear();
	return day + ". " + monthNamesET[monthIndex] + " " + year;
};

module.exports = {longDate: dateFormattedET, weekDay: weekdayFormattedET, time: timeFormattedET, formatDbDate: formatDbDateET};