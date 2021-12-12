//TODO add load-in transition
class Anim{
	constructor(el, initName, animName, isId=true){
		this.el = el;
		this.initName = initName;
		this.animName = animName;
		this.isId = isId;
		this.curName = initName;
		this.toggled = false;
	}
	
	toggle(){
		this.toggled = !this.toggled;
		if(this.toggled)
			this.curName = this.animName;
		else
			this.curName = this.initName;
		
		if(this.isId)
			this.el.id = this.curName;
		else
			this.el.className = this.curName;
	}
}

var navTransitioning = false;
var navBtn = new Anim(document.getElementById("nav_btn"), "nav_btn", "nav_btn_anim");
navBtn.el.onclick = () => {
	if(!navTransitioning)
		navBtn.toggle();
}
var navBtnBlack = new Anim(document.getElementById("nav_btn_black"), "nav_btn_black", "nav_btn_black_anim");
navBtnBlack.el.onclick = () => {
	if(!navSublinksTransitioning)
		navBtnBlack.toggle();
};

class BoxShadowAnim{
	constructor(el, x1, x2, x3, color){
		this.el = el;
		this.X1MAX = x1;
		this.X2MAX = x2;
		this.X3MAX = x3;
		this.TRANS_SPEED = 30;
		this.x1 = 0;
		this.x2 = 0;
		this.x3 = 0;
		this.color = color;
		this.el.style.boxShadow = this.getProperty();
		this.toggled = false;
		this.interval = null;
		this.transitioning = false;
	}
	
	getProperty(){
		return this.x1 + "px " + this.x2 + "px " + this.x3 + "px " + this.color;
	}
	
	toggle(){
		if(!this.transitioning){
			this.transitioning = true;
			this.toggled = !this.toggled;
			if(this.toggled){
				this.interval = window.setInterval(() => {
					if(this.x1 < this.X1MAX)
						this.x1++;
					if(this.x2 < this.X2MAX)
						this.x2++;
					if(this.x3 < this.X3MAX)
						this.x3++;
					
					this.el.style.boxShadow = this.getProperty();
					
					if(this.x1 >= this.X1MAX && this.x2 >= this.X2MAX
						&& this.x3 >= this.X3MAX){
						this.transitioning = false;
						window.clearInterval(this.interval);
					}
				}, this.TRANS_SPEED);
			} else {
				this.interval = window.setInterval(() => {
					if(this.x1 > 0)
						this.x1--;
					if(this.x2 > 0)
						this.x2--;
					if(this.x3 > 0)
						this.x3--;
					
					this.el.style.boxShadow = this.getProperty();
					
					if(this.x1 <= 0 && this.x2 <= 0 && this.x3 <= 0){
						this.transitioning = false;
						window.clearInterval(this.interval);
					}
				}, this.TRANS_SPEED);
			}
		}
	}
}
var nav = document.getElementsByTagName("nav")[0];
var navShadow = new BoxShadowAnim(nav, 3, 5, 9, "#888888");

class Rgba{
	constructor(r, g, b, a=0){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	
	getColor(){
		return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
	}
}
class GradientRotation{
	constructor(el, c1, c2){
		this.el = el;
		this.c1 = c1;//rgba
		this.c2 = c2;//rgba
		this.toggled = false;
		this.opacityInterval = null, this.rotateInterval = null;
		this.OPACITY_SPEED = 40, this.ROTATE_SPEED = 20;
		this.angle = 0;
	}
	
	toggle(){
		this.toggled = !this.toggled;
		if(this.toggled){
			this.opacityInterval = window.setInterval(() => {
				if(this.c1.a < 1)
					this.c1.a += 0.05;
				if(this.c2.a < 1)
					this.c2.a += 0.05;
				
				if(this.c1 >= 1 && this.c1 >= 1){
					this.c1.a = 1;
					this.c2.a = 1;
					window.clearInterval(this.opacityInterval);
				}
			}, this.OPACITY_SPEED);
			
			this.rotateInterval = window.setInterval(() => {
				if(++this.angle >= 360)
					this.angle = 0;
				
				this.el.style.background = "linear-gradient(" + this.angle + "deg, " +
					this.c1.getColor() + ", " + this.c2.getColor() + ")";
			}, this.ROTATE_SPEED);
		} else {
			this.opacityInterval = window.setInterval(() => {
				if(this.c1.a > 0)
					this.c1.a -= 0.05;
				if(this.c2.a > 0)
					this.c2.a -= 0.05;
				
				if(this.c1.a <= 0 && this.c2.a <= 0){
					this.c1.a = 0;
					this.c2.a = 0;
					window.clearInterval(this.opacityInterval);
					window.clearInterval(this.rotateInterval);
				}
			}, this.OPACITY_SPEED);
		}
	}
}

var navLinks = [], navSublinks = [], navGradientRotations = [];
var navLinksDiv = document.getElementById("nav_links");
let navLinkTags = navLinksDiv.getElementsByTagName("a");
for(let a of navLinkTags){
	if(a.className === "nav_sublink"){
		navSublinks.push(a);
		continue;
	}
	navLinks.push(a);
}
var navLinkColors = [
	new Rgba(1, 178, 211),
	new Rgba(0, 211, 168)
];
for(let i = 0; i < navLinks.length; i++){
	navGradientRotations.push(new GradientRotation(navLinks[i], navLinkColors[0], navLinkColors[1]));
	navGradientRotations[i].toggle();
}

async function pSleep(t) { return new Promise(r => setTimeout(r, t)); }

var navToggled = false;
var navTopStart = -navLinksDiv.offsetHeight;
navLinksDiv.style.top = navTopStart + "px";
async function toggleNav(){
	if(!navTransitioning){
		navTransitioning = true;
		
		navToggled = !navToggled;
		if(navToggled){
			navLinksDiv.style.marginTop = navLinksDiv.offsetHeight + nav.offsetHeight + "px";
			await pSleep(500);
			navShadow.toggle();
			await pSleep(navShadow.X3MAX * navShadow.TRANS_SPEED);
		} else {
			navShadow.toggle();
			await pSleep(navShadow.X3MAX * navShadow.TRANS_SPEED);
			navLinksDiv.style.marginTop = "0";
			await pSleep(500);
		}
		
		navTransitioning = false;
	}
}
navBtn.el.addEventListener("click", async () => toggleNav());

function getSizeQuery(){
	let isPortrait = window.innerWidth <= window.innerHeight;

	if(window.innerWidth < 1025){
		return ((isPortrait) ? "mobile" : "mobile_landscape");
	}
}

for(let i = 0; i < navSublinks.length; i++){
	let span = navSublinks[i].getElementsByTagName("span")[0];
	span.style.opacity = "0.0";
	span.style.display = "none";
	navSublinks[i].style.border = "0";
	navSublinks[i].style.height = "0";
	navSublinks[i].style.padding = "0";
}
var navSublinksToggled = false, navSublinksTransitioning = false;
async function toggleNavSublinks(){
	if(!navSublinksTransitioning){
		navSublinksTransitioning = true;
		
		navSublinksToggled = !navSublinksToggled;
		if(navSublinksToggled){
			for(let i = 0; i < navSublinks.length; i++){
				let sizeQuery = getSizeQuery();
				if(sizeQuery === "mobile"){
					navSublinks[i].style.height = "34pt";
					navSublinks[i].style.border = "solid black 2pt";
				} else if(sizeQuery === "mobile_landscape"){
					navSublinks[i].style.height = "26pt";
					navSublinks[i].style.border = "solid black 1.5pt";
				}
				navSublinks[i].style.borderTop = "none";
			}
			await pSleep(400);
			for(let i = 0; i < navSublinks.length; i++){
				let span = navSublinks[i].getElementsByTagName("span")[0];
				span.style.left = "50%";
				span.style.display = "block";
			}
			await pSleep(25);
			for(let i = 0; i < navSublinks.length; i++){
				let span = navSublinks[i].getElementsByTagName("span")[0];
				span.style.opacity = "1.0";
			}
			await pSleep(200);
		} else {
			for(let i = 0; i < navSublinks.length; i++){
				let span = navSublinks[i].getElementsByTagName("span")[0];
				span.style.opacity = "0.0";
			}
			await pSleep(200);
			for(let i = 0; i < navSublinks.length; i++){
				let span = navSublinks[i].getElementsByTagName("span")[0];
				span.style.display = "none";
			}
			await pSleep(25);
			for(let i = 0; i < navSublinks.length; i++){
				navSublinks[i].style.height = "0";
				navSublinks[i].style.border = "0";
			}
			await pSleep(400);
		}
		
		navSublinksTransitioning = false;
	}
}
navBtnBlack.el.addEventListener("click", async () => toggleNavSublinks());
document.getElementById("software_link").addEventListener("click", () => {
	if(!navSublinksTransitioning)
		window.location.href = "./software.html";
});

class Popup{
	constructor(el, dir, offset, referenceEl=null){
		this.el = el;
		this.dir = dir;
		this.offset = offset;
		this.scrollDist = 400;//range for popup to activate
		this.activated = false;
		this.referenceEl = referenceEl;
		this.disabled = false;
		this.clear();
	}
	
	setScrollDist(dist){
		this.scrollDist = dist;
	}
	
	activate(){
		this.el.style.opacity = "1.0";
		switch(this.dir){
			case 0:
				break;
			case 1:
				this.el.style.marginLeft = "0";
				break;
			case 2:
				this.el.style.top = "0";
				break;
			case 3:
				this.el.style.marginLeft = "0";
				break;
		}
		this.activated = true;
	}

	clear(){
		this.activated = false;
		this.el.style.opacity = "0.0";
		
		switch(this.dir){
			case 0:
				break;
			case 1:
				this.el.style.marginLeft = -this.offset + "px";
				break;
			case 2:
				this.el.style.position = "relative";
				this.el.style.top = this.offset + "px";
				break;
			case 3:
				this.el.style.marginLeft = this.offset + "px";
				break;
		}
	}
	
	request(){
		if(!this.activated && !this.disabled){
			if((this.referenceEl !== null && window.scrollY > this.referenceEl.offsetTop - this.scrollDist)
				|| (this.referenceEl === null && window.scrollY > this.el.offsetTop - this.scrollDist))
			this.activate();
		}
	}

	setDisabled(disabled){
		this.disabled = disabled;
		if(this.disabled)
			this.clear();
	}
}

class CustomAnim{
	constructor(el, initMods={}, animMods={}){
		this.el = el;
		this.initMods = initMods;
		this.animMods = animMods;
		this.toggled = false;
		
		if(this.initMods.transform)
			this.el.style.transform = this.initMods.transform;
		if(this.initMods.left)
			this.el.style.left = this.initMods.left;
	}
	
	toggle(){
		this.toggled = !this.toggled;
		if(this.toggled){
			if(this.animMods.transform)
				this.el.style.transform = this.animMods.transform;
			if(this.animMods.left)
				this.el.style.left = this.animMods.left;
		} else {
			if(this.initMods.transform)
				this.el.style.transform = this.initMods.transform;
			if(this.initMods.left)
				this.el.style.left = this.initMods.left;
		}
	}
}

var anchor = document.getElementById("anchor");
var anchorToggled = false;
anchor.onclick = () => {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth'
	})
};

window.onload = () => navShadow.toggle();
window.onscroll = () => {
	if(navToggled){
		navBtn.toggle();
		toggleNav();
	}

	if(!anchorToggled && window.scrollY > 400){
		anchorToggled = true;
		anchor.style.display = "block";
	} else if(anchorToggled && window.scrollY <= 400){
		anchorToggled = false;
		anchor.style.display = "none"
	}
};