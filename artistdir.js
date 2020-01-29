var artists = new Array();
var artistListDiv = document.getElementById("artistList");
var count = 0;

function insertArtist(imgLink, artistName, artistDesc){
	//if an element is empty within the array, fill it without incrementing count
	let index;
	for(index = 0; index < count; index++)
		if(artists[index] == undefined)
			break;
	
	artists[index] = {
		img: imgLink,
		name: artistName,
		desc: artistDesc,
		id: index
	};
	
	if(index == count)
		count++;
	
	return index;
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
	
	let t = document.createTextNode(artist.name);
	
	let strongTag = document.createElement("strong");
	strongTag.appendChild(t);
	
	t = document.createTextNode(artist.desc);
	
	let pTag = document.createElement("p");
	pTag.appendChild(t);
	
	let inpTag = document.createElement("input");
	inpTag.className = "delButton";
	inpTag.type = "button";
	inpTag.value = "Delete";
	inpTag.onclick = function(){removeArtist(artist.id);};
	inpTag.name = artist.id;
	
	let infoDiv = document.createElement("div");
	infoDiv.appendChild(strongTag);
	infoDiv.appendChild(pTag);
	infoDiv.className = "artistInfo";
	
	let divTag = document.createElement("div");
	divTag.appendChild(imgTag);
	divTag.appendChild(infoDiv);
	divTag.appendChild(inpTag);
	divTag.className = "artistContainer";
	
	return divTag;
}

//adds up to <limit> artists to the HTML file
function printArtists(limit){
	//if <limit> artists don't exist, print all existing artists
	if(count < limit)
		limit = count;
	
	for(let i = 0; i < limit; i++)
		if(artists[i] != undefined)
			artistListDiv.appendChild(getArtistContainer(artists[i]));
}

printArtists(count);

var addArtistDiv = document.getElementById("addArtistDirectory");
var addArtistToggled = false;
//executed when add artist button is pressed
function toggleAddArtist(){
	if(!addArtistToggled){
		addArtistToggled = true;
		let artists = document.getElementsByClassName("artistContainer");
		for(e of artists)
			e.style.display = "none";
		addArtistDiv.style.display = "block";
	} else {
		addArtistToggled = false;
		let artists = document.getElementsByClassName("artistContainer");
		for(e of artists)
			e.style.display = "block";
		addArtistDiv.style.display = "none";
	}
}

var addInp = document.getElementById("addInp");

//executed when add button is pressed
function addArtist(){
	//get the input values
	let artistName = document.getElementById("artistNameInp");
	let artistDesc = document.getElementById("artistDescInp");
	let imgUrl = document.getElementById("imgUrlInp");
	
	let valEmpty = false;
	
	if(artistName.value == ""){
		printError(artistName, "You must enter the artist's name.");
		valEmpty = true;
	} if(artistDesc.value == ""){
		printError(artistDesc, "You must enter a description.");
		valEmpty = true;
	} if(imgUrl.value == ""){
		printError(imgUrl, "You must enter an image url.");
		valEmpty = true;
	}
	
	//if all values have been filled, continue
	if(!valEmpty){
		let index = insertArtist(imgUrl.value, artistName.value, artistDesc.value);
		artistListDiv.appendChild(getArtistContainer(artists[index]));
		
		//reset values
		artistName.placeholder = "Artist name";
		artistName.value = "";
		artistDesc.placeholder = "About artist";
		artistDesc.value = "";
		imgUrl.placeholder = "Image url";
		imgUrl.value = "";
		addInp.style.border = "none";
		
		toggleAddArtist();
	}
}

//prints error into the div
function printError(input, msg){
	input.value = "";
	input.placeholder = msg;
	addInp.style.border = "solid 1px red";
}

function removeArtist(id){
	let containers = document.getElementsByClassName("artistContainer");
	let delButtons = document.getElementsByClassName("delButton");
	
	for(let i = 0; i < delButtons.length; i++)
		if(Number(delButtons[i].name) == id){
			containers[i].remove();
			artists[i] = undefined;
		}
}

addInp.onclick = addArtist;