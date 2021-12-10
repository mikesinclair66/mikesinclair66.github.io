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
				navSublinks[i].style.height = "34pt";
				navSublinks[i].style.border = "solid black 2pt";
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

window.onload = () => navShadow.toggle();