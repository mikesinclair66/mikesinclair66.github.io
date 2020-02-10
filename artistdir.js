var artists = new Array();
var artistList = document.getElementById("artistList");
var showAddArtist = false;
var storage = window.localStorage;
var count = 0;

//hides artists and shows add artist directory
function toggleAddArtist(){
	let list = document.getElementById("artistList");
	let addDir = document.getElementById("addArtistDirectory");
	
	if(!showAddArtist){
		showAddArtist = true;
		
		list.style.display = "none";
		addDir.style.display = "block";
	} else {
		showAddArtist = false;
		
		list.style.display = "block";
		addDir.style.display = "none";
	}
}

function getArtist(artistName, artistDesc, artistImg){
	if(artistName == null || artistDesc == null)
		return null;
	
	let artist = {
		name: artistName,
		desc: artistDesc,
		img: artistImg
	};
	
	return artist;
}

//using an artist object made with getArtist(), returns html artistContainer element
function getArtistContainer(artist){
	let div = document.createElement("div");
	div.className = "artistContainer";
	
	let img = document.createElement("img");
	img.src = artist.img;
	
	let name = document.createElement("strong");
	name.textContent = artist.name;
	
	let desc = document.createElement("p");
	desc.textContent = artist.desc;
	
	let artistInfo = document.createElement("div");
	artistInfo.className = "artistInfo";
	
	let del = document.createElement("input");
	del.type = "button";
	del.className = "delButton";
	del.value = "Delete";
	
	del.addEventListener("click", function(){
		deleteArtist(Number(del.id));
	});
	
	div.appendChild(img);
	artistInfo.appendChild(name);
	artistInfo.appendChild(desc);
	div.appendChild(artistInfo);
	div.appendChild(del);
	
	return div;
}

function addArtist(){
	count = storage.getItem("count")
	if(count == null)
		count = 0;
	else
		count = Number(count);
	
	let info = new Array();
	
	info[0] = document.getElementById("artistNameInp");
	info[1] = document.getElementById("artistDescInp");
	info[2] = document.getElementById("imgUrlInp");
	
	let notInit;//true if a field is left empty
	for(let i = 0; i < info.length; i++)
		if(info[i].value == undefined || info[i].value.trim() == ""){
			info[i].style.border = "solid 1px red";
			notInit = true;
		} else
			info[i].style.border = "solid 1px #e6e6ee";
	
	if(notInit)
		return;
	
	//if function hasn't been exited, return inputs to normal
	for(let i = 0; i < info.length; i++)
		info[i].style.border = "solid 1px #e6e6ee";
	
	let artist = getArtist(info[0].value, info[1].value, info[2].value);
	artistList.appendChild(getArtistContainer(artist));
	artists[count++] = artist;
	
	//clear dir info
	for(let i = 0; i < info.length; i++)
		info[i].value = "";
	
	storeArtist(count - 1);
	updateIds();
	toggleAddArtist();
}

function updateIds(){
	let artistDivs = document.getElementsByClassName("artistContainer");
	let delButtons = document.getElementsByClassName("delButton");
	
	for(let i = 0; i < artistDivs.length; i++){
		artistDivs[i].id = i;
		delButtons[i].id = i;
	}
}

function deleteArtist(num){
	//remove the html element
	document.getElementsByClassName("artistContainer")[num].remove();
	artists[num] = undefined;
	count--;
	
	//decrement array size
	for(let i = num; i < artists.length - 1; i++){
		artists[i] = artists[i+1];
		artists[i+1] = undefined;
	}
	
	deleteStorage(num);
	updateIds();
}

//storage functions

function deleteStorage(num){
	if(storage.getItem("name" + num) == null)
		num--;
	
	storage.removeItem("name" + num);
	storage.removeItem("desc" + num);
	storage.removeItem("img" + num);
	
	//decrement storage size
	for(let i = num; i < artists.length - 1; i++){
		storage.setItem("name" + num, storage.getItem("name" + (i+1)));
		storage.setItem("desc" + num, storage.getItem("desc" + (i+1)));
		storage.setItem("img" + num, storage.getItem("img" + (i+1)));
		
		storage.removeItem("name" + (i+1));
		storage.removeItem("desc" + (i+1));
		storage.removeItem("img" + (i+1));
	}
	
	storage.setItem("count", count);
}

function storeArtist(num){
	storage.setItem("name" + num, artists[num].name);
	storage.setItem("desc" + num, artists[num].desc);
	storage.setItem("img" + num, artists[num].img);
	
	storage.setItem("count", count);
}

function loadStorage(){
	let i = 0;
	let artist;
	
	do {
		artist = getArtist(
				storage.getItem("name" + i), storage.getItem("desc" + i), storage.getItem("img" + i)
			);
		if(artist != null){
			artists[i] = artist;
			artistList.appendChild(getArtistContainer(artist));
		}
		
		i++;
	} while(artist != null);
	
	count = storage.getItem("count");
	if(count == null)
		count = 0;
	else
		count = Number(count);
	
	updateIds();
}
loadStorage();

function searchArtists(){
	while(artistList.firstChild)
		artistList.removeChild(artistList.firstChild);
	
	let val = document.getElementById("searchBar").value;
	
	for(let i = 0; i < artists.length; i++)
		if(artists[i].name.substring(0, val.length) == val)
			artistList.appendChild(getArtistContainer(artists[i]));
}

document.getElementById("search").onclick = searchArtists;