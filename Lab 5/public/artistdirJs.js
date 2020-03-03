/*
 * Send data using fetch
 * fetch('/clicked', {method: 'POST', data={}})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
 */

var artists = [];

class Artist {
	constructor(data){
		this.data = data;
	}
}

var artistListDiv = document.getElementById("artistList");

function clearDiv(div){
	while(div.firstChild)
		div.firstChild.remove();
}

let addArtistDirToggled = false;
function toggleAddArtist(){
	let addArtistDiv = document.getElementById('addArtistDirectory');

	if(!addArtistDirToggled){
		addArtistDirToggled = true;
		addArtistDiv.style.display = "inline-block";
		artistListDiv.style.display = "none";
	} else {
		addArtistDirToggled = false;
		addArtistDiv.style.display = "none";
		artistListDiv.style.display = "inline";
	}
}

function addArtist(){
	let nameInp = document.getElementById('artistNameInp');
	let descInp = document.getElementById('artistDescInp');
	let imgInp = document.getElementById('imgUrlInp');

	//determines if all values are filled
	let redBorder = "solid 1px red";
	let defBorder = "solid 1px grey";//default border?
	let allInit = true;

	let validate = inp => {
		if(inp.value.trim() != '')
			inp.style.border = defBorder;
		else {
			inp.style.border = redBorder;
			allInit = false;
		}
	};

	validate(nameInp);
	validate(descInp);
	validate(imgInp);

	if(!allInit)
		return;

	let artist = new Artist({
		name: nameInp.value.trim(),
		desc: descInp.value.trim(),
		img: imgInp.value,
		id: artists.length
	});
	artists.push(artist);

	let clear = inp => {inp.value = ''}
	clear(nameInp);
	clear(descInp);
	clear(imgInp);

	//post the artist
	fetch('/artistAdded', {
		method: 'POST',
		body: JSON.stringify(artist.data),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	}).then(res => res.json()).catch(e => {console.error(e)});

	artistListDiv.appendChild(getArtistHTML(artist));
	toggleAddArtist();
}

function getArtistHTML(artist){
	let div = document.createElement("div");
	div.className = "artistContainer";

	let h2 = document.createElement("h2");
	h2.textContent = artist.data['name'];

	let p = document.createElement("p");
	p.textContent = artist.data['desc'];

	let img = document.createElement("img");
	img.src = artist.data['img'];

	let delBtn = document.createElement("button");
	delBtn.textContent = "Delete";
	delBtn.id = artist.data['id']
	delBtn.onclick = function(){
		div.remove();

		//delete data from the file
		fetch('/deleteArtist', {
			method: 'POST',
			body: JSON.stringify({ id: artist.data['id'] }),
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		}).then(res => res.json()).catch(e => {if(e) throw e});
	};

	div.appendChild(h2);
	div.appendChild(p);
	div.appendChild(img);
	div.appendChild(delBtn);

	return div;
}

function searchArtists(){
	let text = document.getElementById('searchBar').value;

	fetch('/searchedArtists', {
		method: 'POST',
		body: JSON.stringify({ value: text }),
		headers: new Headers({
			'Content-Type': 'application/json'
		})
	}).then(res => res.json()).then(data => {
		if(data.length == 0)
			window.alert("Error: you must enter something in the searchbar to search.");
		clearDiv(artistListDiv);

		let searchedArtists = [];
		for(el of data)
			searchedArtists.push(new Artist({
				name: el['name'],
				desc: el['desc'],
				img: el['img'],
				id: el['id']
			}))

		for(el of searchedArtists)
			artistListDiv.appendChild(getArtistHTML(el));
	}).catch(e => {if(e) throw e});
}

async function loadArtistData(){
	let res = await fetch('/getArtists');
	let data = await res.json();

	for(el of data)
		artists.push(new Artist({
			name: el.name,
			desc: el.desc,
			img: el.img,
			id: el.id
		}))

	for(a of artists)
		artistListDiv.appendChild(getArtistHTML(a));
}
loadArtistData();