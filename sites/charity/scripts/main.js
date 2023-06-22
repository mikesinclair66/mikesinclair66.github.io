var countryList = document.getElementById("country-list-col");
var countryEls = countryList.getElementsByTagName("li");
const ELEMENT_HEIGHT = 36;
for(let i = 0; i < countryEls.length; i++){
	let rowPos = Math.floor(i / 2) * ELEMENT_HEIGHT;
	countryEls[i].style.marginTop = rowPos + "pt";
	if(i % 2 !== 0)
		countryEls[i].style.marginLeft = "50%";
}
countryList.style.height = (Math.ceil(countryEls.length / 2) * ELEMENT_HEIGHT + 90) + "pt";


class Anim{
	constructor(el, isId=true){
		this.el = el;
		this.initToken = isId ? el.id : el.className;
		this.animToken = this.initToken + '-anim';
		this.isId = isId;
		this.toggled = false;
	}
	
	toggle(){
		this.toggled = !this.toggled;
		if(this.isId)
			this.el.id = this.toggled ? this.animToken : this.initToken;
		else
			this.el.className = this.toggled ? this.animToken : this.initToken;
	}
}

class PopupAnim extends Anim{
	constructor(el){
		super(el, false);
		this.offset = 650;
	}
	
	setOffset(offset){
		
	}
	
	requestToggle(){
		if(!this.toggled && window.scrollY >= this.el.offsetTop - this.offset)
			this.toggle();
	}
}

var anims = [], popupAnims = [];
anims.push(new Anim(document.getElementById("slogan")));
window.addEventListener("load", () => {
	if(window.innerWidth <= 1025)
		anims[0].toggle();
	let popupEls = document.getElementsByClassName("popup");
	for(let i = 0; i < popupEls.length; i++){
		popupAnims.push(new PopupAnim(popupEls[i]));
		window.addEventListener("scroll", () => {
			popupAnims[i].requestToggle();
		});
	}
});

function locateOffsets(){
	let winWidth = window.visualViewport.width;
	let offset;
	if(winWidth <= 375)
		offset = 650;
	else if(winWidth <= 414)
		offset = 750;
	else{
		for(let i = 0; i < popupAnims.length; i++){
			if(!popupAnims[i].toggled)
				popupAnims[i].toggle();
		}
	}
	
	if(window.innerWidth >= 1025){
		let imageGroups = document.getElementsByClassName("image-group");
		for(let i = 1; i < 3; i++)
			imageGroups[i].style.top = "calc(" + imageGroups[0].offsetTop + "px - 28pt)";
	}
}

window.addEventListener("resize", locateOffsets);
window.addEventListener("load", locateOffsets);