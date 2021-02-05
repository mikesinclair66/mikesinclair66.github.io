//navbar script
var navbarToggled = false;
var hamburgerBtn = document.getElementById("hamburger_btn");
var hamburgerSlots = [];
hamburgerSlots.push(document.getElementById("slot1"));
hamburgerSlots.push(document.getElementById("slot2"));
hamburgerSlots.push(document.getElementById("slot3"));
var navbarMenu = document.getElementById("navbar_menu");
var links = document.getElementsByClassName("link");

//runs part of the animation (not seen by the user) so that it's ready to animate
hamburgerSlots[0].style.top = "34pt";
hamburgerSlots[2].style.top = "-34pt";
hamburgerSlots[0].style.top = "0";
hamburgerSlots[2].style.top = "0";

hamburgerBtn.onclick = () => {
	if(!navbarToggled){
		//navbarMenu.style.display = "block";
		navbarMenu.style.filter = "alpha(opacity=100)";
		navbarMenu.style.opacity = "1.0";
		hamburgerSlots[0].style.transform = "rotate(45deg)";
		hamburgerSlots[0].style.top = "34pt";
		hamburgerSlots[1].style.opacity = "0.0";
		hamburgerSlots[2].style.transform = "rotate(-45deg)";
		hamburgerSlots[2].style.top = "-34pt";
		
		for(el of links)
			el.style.display = "block";
		
		navbarToggled = true;
		//maintainNavbarHeight();
	} else {
		//navbarMenu.style.display = "none";
		navbarMenu.style.filter = "alpha(opacity=0)";
		navbarMenu.style.opacity = "0.0";
		hamburgerSlots[0].style.transform = "rotate(0deg)";
		hamburgerSlots[0].style.top = "0";
		hamburgerSlots[1].style.opacity = "1.0";
		hamburgerSlots[2].style.transform = "rotate(0deg)";
		hamburgerSlots[2].style.top = "0";
		
		for(el of links)
			el.style.display = "none";
		
		navbarToggled = false;
	}
};

function maintainNavbarHeight(){
	if(window.scrollY > 950)
		window.scrollTo(0, 950);
}

window.addEventListener("scroll", () => {
	if(navbarToggled)
		maintainNavbarHeight();
});

var propertiesDropdownToggled = false;
var contactLink = document.getElementById("contact_link");
var propertiesDropdown = document.getElementById("properties_dropdown");
var propertiesDropdownLink = document.getElementById("properties_dropdown_link");
propertiesDropdownLink.onclick = () => {
	if(!propertiesDropdownToggled){
		propertiesDropdownLink.style.transform = "rotate(0deg)";
		propertiesDropdownLink.style.color = "#EAD160";
		propertiesDropdown.style.display = "block";
		propertiesDropdownToggled = true;
	} else {
		propertiesDropdownLink.style.transform = "rotate(180deg)";
		propertiesDropdownLink.style.color = "white";
		propertiesDropdown.style.display = "none";
		propertiesDropdownToggled = false;
	}
};

//slideshow script
class Slideshow{
	//"-" + (this.slides[this.curSlide].offsetTop * 1.926) + "px";
	constructor(slideshowId, slideEl){
		this.slideshow = document.getElementById(slideshowId);
		this.slides = this.slideshow.getElementsByClassName(slideEl);
		this.DEF_TRANSITION = "opacity 0.5s, filter 0.5s";
		this.curSlide = 0;
		this.nextSlide = 1;
		
		this.notInit = true;
		this.interval = undefined;
		this.count = 0;
		this.guideDiv = this.slideshow.getElementsByClassName("guide")[0];
		this.guideDots = [];
		this.ready();
		this.requestGuide();
	}
	
	start(){
		//does an immediate test on the slideshow to ensure it doesn't glitch
		if(this.notInit){
			this.next();
			this.ready();
			this.previous();
			this.ready();
			
			this.notInit = false;
		}
		
		this.slideshow.style.display = "block";
		this.interval = window.setInterval(() => {
			this.count++;
			if(this.count == 4){
				this.next();
			} else if(this.count > 4){
				this.ready();
				this.count = 0;
			}
		}, 550);
	}
	
	pause(){
		window.clearInterval(this.interval);
		this.slideshow.style.display = "none";
	}
	
	next(){
		this.slides[this.curSlide].style.transition = this.DEF_TRANSITION;
		this.slides[this.curSlide].style.filter = "alpha(opacity=0)";
		this.slides[this.curSlide].style.opacity = "0.0";
		this.slides[this.nextSlide].style.transition = this.DEF_TRANSITION;
		this.slides[this.nextSlide].style.filter = "alpha(opacity=100)";
		this.slides[this.nextSlide].style.opacity = "1.0";
		
		this.curSlide++;
		this.nextSlide++;
		if(this.nextSlide >= this.slides.length)
			this.nextSlide = 0;
		if(this.curSlide >= this.slides.length)
			this.curSlide = 0;
		
		this.selectGuide(this.curSlide);
	}
	
	previous(){
		let previousSlide = this.curSlide - 1;
		if(previousSlide < 0)
			previousSlide = this.slides.length - 1;
		
		this.slides[this.curSlide].style.transition = this.DEF_TRANSITION;
		this.slides[this.curSlide].style.filter = "alpha(opacity=0)";
		this.slides[this.curSlide].style.opacity = "0.0";
		if(this.curSlide != 0)
			this.slides[this.curSlide].style.marginTop = "-" + (this.slides[this.curSlide].offsetHeight) + "px";
		else
			this.slides[previousSlide].style.marginTop = "-" + (this.slides[this.curSlide].offsetHeight) + "px";
		
		this.slides[previousSlide].style.display = "block";
		this.slides[previousSlide].style.transition = this.DEF_TRANSITION;
		this.slides[previousSlide].style.filter = "alpha(opacity=100)";
		this.slides[previousSlide].style.opacity = "1.0";
		if(this.curSlide == (this.slides.length - 1)){
			this.slides[previousSlide].style.marginTop = "-" + (this.slides[this.curSlide].offsetHeight) + "px";
		}
		
		this.curSlide = previousSlide;
		this.nextSlide = this.curSlide + 1;
		if(this.nextSlide >= this.slides.length)
			this.nextSlide = 0;
		
		this.selectGuide(this.curSlide);
	}
	
	/* Readies the slideshow to transition to the next slide. */
	ready(){
		for(let i = 0; i < this.slides.length; i++){
			if(i == this.curSlide || i == this.nextSlide)
				continue;
			else {
				this.slides[i].transition = "none";
				this.slides[i].style.filter = "alpha(opacity=0)";
				this.slides[i].style.opacity = "0.0";
				this.slides[i].style.display = "none";
				this.slides[i].style.marginTop = "0";
			}
		}
		
		this.slides[this.curSlide].style.transition = this.DEF_TRANSITION;
		this.slides[this.curSlide].style.marginTop = "0";
		this.slides[this.curSlide].style.marginBottom = "0";
		this.slides[this.nextSlide].style.display = "block";
		this.slides[this.nextSlide].style.transition = "none";
		this.slides[this.nextSlide].style.filter = "alpha(opacity=0)";
		this.slides[this.nextSlide].style.opacity = "0.0";
		if(this.nextSlide != 0)
			this.slides[this.nextSlide].style.marginTop = "-" + (this.slides[this.curSlide].offsetHeight) + "px";
		else
			this.slides[this.curSlide].style.marginTop = "-" + (this.slides[this.nextSlide].offsetHeight) + "px";
	}
	
	/* Adds a guide to the slideshow if the div is available. */
	requestGuide(){
		if(this.guideDiv){
			var dotsDiv = document.createElement("div");
			dotsDiv.className = "dots";
			
			for(let i = 0; i < this.slides.length; i++){
				let dot = document.createElement("span");
				if(i == 0)
					dot.className = "guide_selected";
				dot.innerHTML = ".";
				this.guideDots.push(dot);
				dotsDiv.appendChild(this.guideDots[i]);
			}
			
			this.guideDiv.insertBefore(dotsDiv, this.guideDiv.getElementsByClassName("right_guide")[0])
			
			window.addEventListener("click", ev => this.requestGuideListen(ev));
			window.addEventListener("touchend", ev => this.requestGuideListen(ev));
		}
	}
	
	requestGuideListen(ev){
		let left = this.guideDiv.getElementsByClassName("left_guide")[0];
		let right = this.guideDiv.getElementsByClassName("right_guide")[0];
		
		if(ev.pageX >= left.offsetLeft && ev.pageX <= left.offsetLeft + left.offsetWidth
			&& ev.pageY >= left.offsetTop && ev.pageY <= left.offsetTop + left.offsetHeight){
			left.style.backgroundColor = "white";
			left.style.color = "black";
			let interval = window.setInterval(() => {
				left.style.backgroundColor = "black";
				left.style.color = "white";
				this.previous();
				this.count = 4;
				window.clearInterval(interval);
			}, 300);
		} else if(ev.pageX >= right.offsetLeft && ev.pageX <= right.offsetLeft + right.offsetWidth
			&& ev.pageY >= right.offsetTop && ev.pageY <= right.offsetTop + right.offsetHeight){
			right.style.backgroundColor = "white";
			right.style.color = "black";
			let interval = window.setInterval(() => {
				right.style.backgroundColor = "black";
				right.style.color = "white";
				this.next();
				this.count = 4;
				window.clearInterval(interval);
			}, 300);
		}
	}
	
	/* Selects a certain element of the guide and slideshow. (May should only work on desktop? */
	selectGuide(n){
		if(this.guideDiv){
			for(let i = 0; i < this.guideDots.length; i++){
				if(i != n)
					this.guideDots[i].className = "";
				else
					this.guideDots[i].className = "guide_selected";
			}
		}
	}
}

//flippable sections script
class SectionFlippableSet{
	constructor(id){
		this.id = document.getElementById(id);
		this.sections = this.id.getElementsByClassName("section_flippable");
		this.captions = [];
		
		for(let i = 0; i < this.sections.length; i++){
			this.captions.push(document.createElement("span"));
		}
	}
	
	enableCaption(caption, index){
		let propertyInfo = document.getElementsByClassName("property_info")[index];
		this.captions[index].width = propertyInfo.offsetWidth;
		this.captions[index].innerHTML = caption;
		this.captions[index].id = "first_child";
		this.captions[index].style.position = "absolute";
		this.captions[index].style.top = this.sections[index].offsetTop - this.sections[index].offsetTop;
		this.captions[index].style.left = "0";
		propertyInfo.insertBefore(this.captions[index], propertyInfo.firstChild);
	}
}

var formExitBtn = document.createElement("span");
formExitBtn.style.fontSize = "50pt";
formExitBtn.style.position = "fixed";
formExitBtn.style.top = "40pt";
formExitBtn.style.right = "35pt";
formExitBtn.style.color = "red";
formExitBtn.innerHTML = "X";
formExitBtn.style.transform = "rotate(0deg)";
formExitBtn.style.zIndex = "2";
formExitBtn.onclick = () => toggleForm();

//toggle form
var formToggled = false;
var formBtn = document.getElementById("form_btn");
var iframe = document.createElement("iframe");
if(formBtn){
	formBtn.onclick = () => toggleForm();
}

function toggleForm(){
	if(!formToggled){
		iframe.id = "application_form";
		iframe.src = "../application.html";
		
		document.getElementsByClassName("info")[0].appendChild(iframe);
		document.body.appendChild(formExitBtn);
		formToggled = true;
	} else {
		document.getElementsByClassName("info")[0].removeChild(document.getElementById("application_form"));
		document.body.removeChild(formExitBtn);
		formToggled = false;
	}
}