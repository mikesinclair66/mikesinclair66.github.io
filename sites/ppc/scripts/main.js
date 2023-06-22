class Anim{
	constructor(el, animAtr, atrIsId){
		this.el = el;
		this.initAtr = "";
		this.animAtr = animAtr;
		this.atrIsId = atrIsId;
		this.toggled = false;
		this.transitioning = false;
		
		if(atrIsId)
			this.initAtr = this.el.id;
		else
			this.initAtr = this.el.className;
	}
	
	toggle(){
		if(!this.transitioning){
			if(!this.toggled){
				if(this.atrIsId)
					this.el.id = this.animAtr;
				else
					this.el.className = this.animAtr;
				this.toggled = true;
			} else {
				if(this.atrIsId)
					this.el.id = this.initAtr;
				else
					this.el.className = this.initAtr;
				this.toggled = false;
			}
		}
	}
}

async function pSleep(t) { return new Promise(r => setTimeout(r, t)); }

/*
Keys:
-marginTop
-marginLeft,
-filter,
-opacity
*/
class AsyncAnim{
	constructor(el, display=false){
		this.el = el;
		this.display = display;
		this.initMods = {};
		//default
		this.animMods = {
			"marginTop": "0",
			"marginLeft": "0",
			"filter": "alpha(opacity=100)",
			"opacity": "1.0"
		};
		this.toggled = false;
		this.transitioning = false;
		this.TRANSITION_TIME = 350;
		
		if(!display)
			this.el.style.display = "none";
	}
	
	pushInitMod(prop, atr){
		this.initMods[prop] = atr;
		if(prop === "marginTop")
			this.el.style.marginTop = atr;
		if(prop === "marginLeft")
			this.el.style.marginLeft = atr;
		if(prop === "filter")
			this.el.style.filter = atr;
		if(prop === "opacity")
			this.el.style.opacity = atr;
	}
	
	pushAnimMod(prop, atr){
		this.animMods[prop] = atr;
	}
	
	async toggle(){
		if(!this.transitioning){
			this.transitioning = true;
			if(window.innerWidth < 1025)
				hamBtn.transitioning = true;
			
			if(!this.toggled){
				if(!this.display){
					this.el.style.display = "block";
					await pSleep(25);
				}
				if(this.animMods.marginTop)
					this.el.style.marginTop = this.animMods.marginTop;
				if(this.animMods.marginLeft)
					this.el.style.marginLeft = this.animMods.marginLeft;
				if(this.animMods.filter)
					this.el.style.filter = this.animMods.filter;
				if(this.animMods.opacity)
					this.el.style.opacity = this.animMods.opacity;
				await pSleep(this.TRANSITION_TIME);
				this.toggled = true;
			} else {
				if(this.initMods.marginTop)
					this.el.style.marginTop = this.initMods.marginTop;
				if(this.initMods.marginLeft)
					this.el.style.marginLeft = this.initMods.marginLeft;
				if(this.initMods.filter)
					this.el.style.filter = this.initMods.filter;
				if(this.initMods.opacity)
					this.el.style.opacity = this.initMods.opacity;
				await pSleep(this.TRANSITION_TIME);
				if(!this.display)
					this.el.style.display = "none";
				this.toggled = false;
			}
			
			this.transitioning = false;
			if(window.innerWidth < 1025)
				hamBtn.transitioning = false;
		}
	}
}

var nav = new Anim(document.getElementById("nav_default"), "nav_animated", true);
var navDisplay = nav.el.getElementsByClassName("nav_display")[0];
var hamBtn = new Anim(document.getElementById("ham_btn"), "ham_btn_animated", true);
var navContent = new AsyncAnim(document.getElementById("nav_content"));
navContent.pushInitMod("marginLeft", "-6pt");
navContent.pushInitMod("filter", "alpha(opacity=0)");
navContent.pushInitMod("opacity", "0.0");

hamBtn.el.addEventListener("click", async() => {
	if(window.scrollY === 0)
		nav.toggle();
	hamBtn.toggle();
	navContent.toggle();
});

var navContentDisplay = document.getElementsByClassName("nav_content_display")[0];
var navContentSubdisplay = document.getElementsByClassName("nav_content_subdisplay")[0];

function coordinateNav(){
	//hamBtn.el.style.top = navDisplay.offsetTop + navDisplay.offsetHeight / 2 -
		//((window.innerWidth <= window.innerHeight) ? 12 : 9) + "px";
	document.getElementById("nav_content").style.top = navDisplay.offsetHeight - 1 + "px";
	navContentSubdisplay.style.height = window.innerHeight - navDisplay.offsetHeight
		- navContentDisplay.offsetHeight + "px";
}
coordinateNav();

function fixFooter(){
	let ft = document.getElementsByTagName("footer")[0];
	if(ft.offsetTop + ft.offsetHeight < window.innerHeight){
		ft.style.position = "absolute";
		ft.style.top = window.innerHeight - ft.offsetHeight + "px";
	}
}

window.addEventListener("load", () => {
	coordinateNav();
	fixFooter();
});
window.addEventListener("resize", () => {
	coordinateNav();
	fixFooter();
});

window.addEventListener("scroll", () => {	
	if(!hamBtn.toggled){
		if(window.scrollY > 0 && !nav.toggled)
			nav.toggle();
		else if(window.scrollY === 0 && nav.toggled)
			nav.toggle();
	} else if(hamBtn.toggled)
		window.scrollTo(0, 0);
});