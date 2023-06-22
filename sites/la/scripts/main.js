function pSleep(t){ return new Promise(r => setTimeout(r, t)); }

class Animation{
	constructor(initId, animateId){
		this.initId = initId;
		this.animateId = animateId;
		this.el = document.getElementById(initId);
		this.toggled = false;
	}
	
	toggle(){
		if(!this.toggled){
			this.el.id = this.animateId;
			this.toggled = true;
		} else {
			this.el.id = this.initId;
			this.toggled = false;
		}
	}
}

class ClickAnimation{
	constructor(initId, animateId){
		this.animation = new Animation(initId, animateId);
		this.animation.el.onclick = () => this.animation.toggle();
	}
}

var hamburgerBtn = new ClickAnimation("hamburger_btn", "hamburger_btn_animated");
var navContent = new Animation("nav_content", "nav_content_animated");
hamburgerBtn.animation.el.addEventListener("click", async () => {
	if(hamburgerBtn.animation.toggled){
		navContent.el.style.display = "block";
		await pSleep(25);
		navContent.toggle();
	} else {
		navContent.toggle();
		await pSleep(525);
		navContent.el.style.display = "none";
	}
});

var parallaxes = document.getElementsByClassName("parallax");
if(parallaxes)
	for(let p of parallaxes){
		let pFunc = () => {
			//TODO paraphrase (slow with high speed scrolling i think)
			var scrolltotop = document.scrollingElement.scrollTop;
			var xvalue = "center";
			var factor = ((window.innerWidth < 1025) ? 0.5 : 0.3);
			if(p.id === "services_parallax"){
				if(window.innerHeight === 1024)
					factor = 0.058;
				else if(window.innerWidth === 1024)
					factor = 0.2;
				else
					factor = ((window.innerWidth < 1025) ? 0.5 : 0.2);
			} else if(p.id === "history_parallax")
				factor = ((window.innerWidth < 1025) ? 0.6 : 0.2);
			else if(p.id === "history_parallax2"){
				if(window.innerWidth === 1024)
					factor = 0.65;
				else if(window.innerHeight === 1024)
					factor = 0.6;
				else if(window.innerWidth < 1025)
					factor = 0.11;
				else if(window.innerWidth < 1450)
					factor = 0.75;
				else
					factor = 0.85;
			} else if(p.id === "footer_parallax"){
				if(window.innerHeight === 1024 || window.innerWidth === 1024)
					factor = 0.2;
				else if(window.innerWidth < 1025)
					factor = 0.045;
				else if(window.innerWidth < 1450)
					factor = 0.65;
				else
					factor = 0.475;
			}
			
			var yvalue = scrolltotop * factor;
			p.style.backgroundPosition = xvalue + " " + yvalue + "px";
		};
		pFunc();
		
		window.addEventListener("scroll", () => pFunc());
	}


class ScrollAnimation{
	constructor(el, marginDisabled=false){
		this.el = el;
		this.desktopEl = document.createElement("div");
		this.toggled = false;
		this.marginDisabled = marginDisabled;
		
		this.el.style.transition = "0.8s";
		this.el.style.filter = "alpha(opacity=0)";
		this.el.style.opacity = "0.0";
		if(!this.marginDisabled)
			this.el.style.marginLeft = "-15pt";
		
		window.addEventListener("scroll", () => {
			let scrollDist = 500;
			if(window.innerWidth >= 1450)
				scrollDist = 750;
			else if(window.innerWidth === 1024 || window.innerHeight === 1024)
				scrollDist = 900;
			if(!this.toggled && window.scrollY > this.el.offsetTop - scrollDist){
				this.el.style.filter = "alpha(opacity=100)";
				this.el.style.opacity = "1.0";
				if(!this.marginDisabled)
					this.el.style.marginLeft = "0pt";
				this.toggled = true;
			}
		});
	}
}

/* Constraints: img sizes must be the same/factorable */
class Slideshow{
	//&#8618;
	constructor(id){
		this.el = document.getElementById(id);
		this.images = this.el.getElementsByTagName("img");
		this.desktopEl = document.createElement("div");
		this.desktopImages = [];
		this.slideNo = 0;
		this.activeMobile = false, this.activeDesktop = false;
		this.transitioning = false;
		this.interval = null;
		this.imgWidth = this.images[0].offsetWidth - 10, this.imgHeight = 0;
		this.arrow = document.createElement("span");
		
		this.init();
	}
	
	init(){
		this.arrow.id = "info_slideshow_arrow";
		this.arrow.innerHTML = "&#8618";
		this.el.appendChild(this.arrow);
		
		this.el.appendChild(this.desktopEl);
	}
	
	async start(){
		let loadingScreen = document.getElementById("loading_screen");
		if(loadingScreen){
			loadingScreen.style.filter = "alpha(opacity=0)";
			loadingScreen.style.opacity = "0.0";
			await pSleep(r => setTimeout(r, 525));
			loadingScreen.style.display = "none";
		}
		
		this.imgHeight = ((this.images[0].offsetHeight !== 0) ? this.images[0].offsetHeight : 263);
		
		if(window.innerWidth < 1025){
			for(let i = 2; i < this.images.length; i++){
				this.images[i].style.filter = "alpha(opacity=0)";
				this.images[i].style.opacity = "0.0";
				this.images[i].style.display = "none";
			}
			
			this.images[0].style.marginBottom = -this.imgHeight + "px";
			this.images[1].style.zIndex = "-1";
			this.images[1].style.position = "relative";
			
			this.activeMobile = true;
		} else {
			this.desktopImages = [];
			this.arrow.style.top = this.el.offsetTop - 68 + "px";
			
			for(let i = 0; i < this.images.length; i++){
				let desktopImage = document.createElement("img");
				desktopImage.src = this.images[i].src;
				desktopImage.alt = this.images[i].alt;
				
				if(i >= 3){
					desktopImage.style.filter = "alpha(opacity=0)";
					desktopImage.style.opacity = "0.0";
					desktopImage.style.display = "none";
				}
				
				this.images[i].style.filter = "alpha(opacity=0)";
				this.images[i].style.opacity = "0.0";
				this.images[i].style.display = "none";
				
				this.desktopImages.push(desktopImage);
			}
			
			this.desktopEl.innerHTML = "";
			for(let i of this.desktopImages)
				this.desktopEl.appendChild(i);
			
			this.slideNo = 0;
			this.activeDesktop = true;
		}

		this.interval = window.setInterval(async () => {
			if(!this.transitioning){
				if(this.activeMobile)
					await this.nextMobile();
				else if(this.activeDesktop)
					await this.nextDesktop();
				else
					window.clearInterval(this.interval);
			}
		}, 5000);
		
		this.arrow.onclick = () => {
			let activated = false;
			
			if(this.activeMobile && !this.transitioning){
				this.nextMobile();
				activated = true;
			} else if(this.activeDesktop && !this.transitioning){
				this.nextDesktop();
				activated = true;
			}
			
			if(activated){
				window.clearInterval(this.interval);
				this.interval = window.setInterval(async () => {
					if(!this.transitioning){
						if(this.activeMobile)
							await this.nextMobile();
						else if(this.activeDesktop)
							await this.nextDesktop();
						else
							window.clearInterval(this.interval);
					}
				}, 5000);
			}
		};
		
		window.addEventListener("resize", () => {
			if(this.activeMobile || this.activeDesktop)
				this.resize();
		});
	}
	
	async nextMobile(){
		this.transitioning = true;
		this.images[this.slideNo].style.transition = "0.5s";
		await pSleep(25);
		this.images[this.slideNo].style.filter = "alpha(opacity=0)";
		this.images[this.slideNo].style.opacity = "0.0";
		await pSleep(500);
		
		this.images[this.slideNo].style.transition = "none";
		this.images[this.slideNo].style.display = "none";
		this.images[this.slideNo].style.marginBottom = "0";
		this.images[this.slideNo].style.marginTop = "0";
		
		if(++this.slideNo >= this.images.length)
			this.slideNo = 0;
		let next = this.slideNo;
		if(++next >= this.images.length)
			next = 0;
		
		this.images[next].style.display = "block";
		this.images[next].style.filter = "alpha(opacity=100)";
		this.images[next].style.opacity = "1.0";
		this.images[this.slideNo].style.zIndex = "0";
		this.images[this.slideNo].style.position = "static";
		this.images[next].style.zIndex = "-1";
		this.images[next].style.position = "relative";
		
		if(this.slideNo < this.images.length - 1)
			this.images[this.slideNo].style.marginBottom = -this.imgHeight + "px";
		else
			this.images[this.slideNo].style.marginTop = -this.imgHeight + "px";
		this.transitioning = false;
	}
	
	async nextDesktop(){
		this.transitioning = true;
		
		this.desktopImages[0].style.transition = "0.8s";
		this.desktopImages[1].style.transition = "0.8s";
		this.desktopImages[2].style.transition = "0.3s";
		this.desktopImages[2].style.zIndex = "-1";
		this.desktopImages[2].style.position = "relative";
		await pSleep(25);
		
		this.desktopImages[0].style.marginLeft = this.imgWidth + "px";
		this.desktopImages[2].style.marginLeft = -this.imgWidth + "px";
		this.desktopImages[2].style.filter = "alpha(opacity=0)";
		this.desktopImages[2].style.opacity = "0.0";
		await pSleep(825);
		
		this.desktopImages[2].style.transition = "none";
		await pSleep(25);
		
		this.desktopImages[2].style.zIndex = "0";
		this.desktopImages[2].style.position = "static";
		this.desktopImages[2].style.marginLeft = "0";
		this.desktopImages[2].style.display = "none";
		
		let newDesktopImages = [];
		newDesktopImages.push(this.desktopImages.pop());
		for(let i = 0; i < this.desktopImages.length; i++)
			newDesktopImages.push(this.desktopImages[i]);
		newDesktopImages[0].style.display = "inline-block";
		newDesktopImages[0].style.zIndex = "-1";
		newDesktopImages[0].style.position = "relative";
		newDesktopImages[0].style.transition = "0.3s";
		newDesktopImages[1].style.marginLeft = "0";
		this.desktopImages = [];
		this.desktopImages = newDesktopImages;
		this.desktopEl.innerHTML = "";
		for(let i of this.desktopImages)
			this.desktopEl.appendChild(i);
		await pSleep(25);
		
		this.desktopImages[0].style.filter = "alpha(opacity=100)";
		this.desktopImages[0].style.opacity = "1.0";
		await pSleep(325);
		
		this.desktopImages[0].style.zIndex = "0";
		this.desktopImages[0].style.position = "static";
		
		this.transitioning = false;
	}
	
	resize(){
		let resizeInt = window.setInterval(() => {
			if(this.transitioning)
				return;
			
			if(window.innerWidth < 1025){
				this.images[0].style.marginBottom = -this.imgHeight + "px";
				this.images[1].style.zIndex = "-1";
				this.images[1].style.position = "relative";
				this.CARDHOLDER_MOD = 1.5;
				
				if(this.activeMobile || this.activeDesktop){
					this.activeMobile = true;
					this.activeDesktop = false;
				}
			} else {
				this.imgWidth = this.images[0].offsetWidth - 10, this.imgHeight = this.images[0].offsetHeight;
				this.CARDHOLDER_MOD = 0.8;
				
				if(this.activeMobile || this.activeDesktop){
					this.activeDesktop = true;
					this.activeMobile = false;
				}
			}
			
			document.getElementById("cardholder_front").style.top = -document.getElementById("intro_slides").offsetHeight * 0.92 + "px";
			
			window.clearInterval(resizeInt);
		}, 300);
	}
}

function spaceNavLinksMobile(n){
	let navLinkTop = 0;
	for(let l of navContent.el.getElementsByClassName("link")){
		l.style.top = navLinkTop + 'pt';
		navLinkTop += n;
	}
}
if(window.innerWidth < 1025){
	spaceNavLinksMobile(((window.innerWidth <= window.innerHeight) ? 25 : 3));
} else
	spaceNavLinksMobile(0);

window.onresize = () => {
	if(window.innerWidth < 1025)
		spaceNavLinksMobile(((window.innerWidth <= window.innerHeight) ? 25 : 3));
	else
		spaceNavLinksMobile(0);
};