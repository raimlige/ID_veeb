exports.isLogin = function(req, res, next){
	if(req.session != null){
		if(req.session.userId){
			//console.log("Sisse loginud on kasutaja: " + req.session.userId);
			next();
		} else {
			console.log("Sisselogimist ei tuvastatud!!");
			return res.redirect("/signin");
		}
	} else {
		console.log("Sessiooni ei tuvastatud!!");
		return res.redirect("/signin");
	}
}