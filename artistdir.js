var artists = new Array();
var count = 0;

function insertArtist(imgLink, artistName, artistDesc){
	artists[count] = {
		img: imgLink,
		name: artistName,
		desc: artistDesc
	};
	count++;
}

insertArtist("https://randomuser.me/api/portraits/med/women/1.jpg", "Jessica Shen", "Lives in Asia");
insertArtist("https://randomuser.me/api/portraits/med/men/1.jpg", "Ben Klasouski", "Lives in the USA");
insertArtist("https://randomuser.me/api/portraits/med/women/2.jpg", "Nadine Tol", "Lives in Canada");
insertArtist("https://randomuser.me/api/portraits/med/men/2.jpg", "Ted Klasouski", "Lives in Europe");
insertArtist("https://randomuser.me/api/portraits/med/women/3.jpg", "Christina Jacob", "Lives in Australia");

//NOTE: must be an artist object used as argument
function getArtistContainer(artist){
	let imgTag = document.createElement("img");
	imgTag.src = artist.img;
	
	let strongTag = document.createElement("strong");
	strongTag.innerHTML = artist.name;
	
	let pTag = document.createElement("p");
	pTag.innerHTML = artist.desc;
	
	let infoDiv = document.createElement("div");
	infoDiv.appendChild(strongTag);
	infoDiv.appendChild(pTag);
	infoDiv.className = "artistInfo";
	
	let divTag = document.createElement("div");
	divTag.appendChild(imgTag);
	divTag.appendChild(infoDiv);
	divTag.className = "artistContainer";
	
	return divTag;
}

//adds up to <limit> artists to the HTML file
function printArtists(limit){
	//if <limit> artists don't exist, print all existing artists
	if(count < limit)
		limit = count;
	
	for(let i = 0; i < limit; i++)
		document.body.appendChild(getArtistContainer(artists[i]));
}

printArtists(count);