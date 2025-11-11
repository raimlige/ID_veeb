window.onload = function(){
	//käin lehe läbi ja igale pisipildile määran tegevuse hiirekliki peal
	let allThumbs = document.querySelector("#gallery").querySelectorAll(".thumbs");                	//# viitab ejs failis div-ile id="gallery" ja . viitab classile
	for (let i = 0; i < allThumbs.length; i++) {
		allThumbs[i].addEventListener("click", openModal);
	}
	document.querySelector("#modalClose").addEventListener("click", closeModal);
	document.querySelector("#modalImage").addEventListener("click", closeModal);
}

function openModal(e){
	document.querySelector("#modalImage").src = "/gallery/normal/" + e.target.dataset.filename;
	document.querySelector("#modalCaption").innerHTML = e.target.alt;
	document.querySelector("#modal").showModal();
}

function closeModal(){
	document.querySelector("#modal").close();
	document.querySelector("#modalImage").src = "/images/empty.png";
	document.querySelector("#modalCaption").innerHTML = "Galeriipilt";
}