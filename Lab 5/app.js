const fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
const saveFile = './saveFile.txt';

let express = require('express');
let app = express();

//a list containing the resulting artists from a search
var searchResults;

var artistJson = [];

app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/artistAdded', (req, res) => {
	artistJson.push(req.body);
	saveArtists();
	console.log(artistJson);
	res.json(req.body);
});

app.post('/deleteArtist', (req, res) => {
	let artistNo = req.body['id'];
	let artistRemoved = false;

	for(let i = 0; i < artistJson.length - 1; i++){
		if(i == artistNo)
			artistRemoved = true;

		if(artistRemoved) {
			artistJson[i] = artistJson[i+1];
		}
	}

	//decrease array size by one if an artist has been deleted
	artistJson.length--;

	//reset each artist's ID
	for(let i = 0; i < artistJson.length; i++)
		artistJson[i]['id'] = i;

	saveArtists();
	res.json(req.body);
});

app.post('/searchedArtists', (req, res) => {
	let searched = [];
	let text = req.body['value'];
	for(el of artistJson)
		if(el['name'].includes(text))
			searched.push(el);

	res.json(searched);
});

app.get('/getArtists', (req, res) => {
	fs.readFile(saveFile, (err, data) => {
		if(!err) {
			let json = JSON.parse(data);
			artistJson = json;
			res.json(json);
		} else {
			console.error(err);
			res.sendStatus(404);
		}
	});
});

function saveArtists(){
	fs.writeFile(saveFile, JSON.stringify(artistJson), function(err){
		if(err) throw err;
	});
}

app.listen(process.env.PORT || 3000);