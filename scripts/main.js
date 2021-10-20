async function pSleep(t){ return new Promise(r => setTimeout(r, t)); }

class Anim{
	constructor(el, initClass, transClass){
		this.el = el;
		this.initClass = initClass;
		this.transClass = transClass;
		this.toggled = false;
	}
	
	toggle(){
		this.el.className = ((!this.toggled) ? this.transClass : this.initClass);
		this.toggled = !this.toggled;
	}
}
var dir = new Anim(document.getElementById("dir"), "info", "info_anim");
var docDisplay = new Anim(document.getElementById("doc_display"), "info", "info_anim");
docDisplay.toggled = true;

var curDate = new Date();
var dueDate = new Date(2021, 09, 20, 17, 0, 0, 0);
var published = true;
if(curDate < dueDate){
	docDisplay.el.getElementsByTagName("embed")[0].style.display = "none";
	document.getElementById("date_notice").textContent = "This article will be published on " + dueDate + ".";
	published = false;
}

async function displayDoc(name){
	if(published)
		document.getElementById("doc_display")
			.getElementsByTagName("embed")[0].src = name;
	dir.toggle();
	await pSleep(400);
	docDisplay.el.style.display = "block";
	dir.el.style.display = "none";
	await pSleep(25);
	docDisplay.toggle();
}

async function revertToDir(){
	docDisplay.toggle();
	await pSleep(400);
	dir.el.style.display = "block";
	docDisplay.el.style.display = "none";
	await pSleep(25);
	dir.toggle();
}

var docLinks = document.getElementsByClassName("doc_link");
docLinks[0].onclick = () => displayDoc("Case_Study_Kingdom_Rush.pdf");
document.getElementsByClassName("back_link")[0].onclick = () => revertToDir();