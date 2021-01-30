//navbar script
var navbarToggled = false;
var hamburgerBtn = document.getElementById("hamburger_btn");
var hamburgerSlots = [];
hamburgerSlots.push(document.getElementById("slot1"));
hamburgerSlots.push(document.getElementById("slot2"));
hamburgerSlots.push(document.getElementById("slot3"));
var navbarMenu = document.getElementById("navbar_menu");
var links = document.getElementsByClassName("link");

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

//TODO make window non-scrollable if the navbar menu is active?

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
	constructor(slideshowId, slideEl){
		this.slideshow = document.getElementById(slideshowId);
		this.slides = this.slideshow.getElementsByClassName(slideEl);
		this.slides[1].style.marginTop = "-" + this.slides[0].offsetHeight + "px";
		this.slides[1].style.opacity = "0.0";
		this.slides[1].style.filter = "alpha(opacity=0)";
		for(let i = 2; i < this.slides.length; i++)
			this.slides[i].style.display = "none";
		
		this.slideNo = 0;
		this.nextSlideNo = 1;
		this.count = 0;
		this.COUNT_METER = 50;
		this.opacityLvl = 0;//0.0, 0.1, 0.2...
		
		this.hasGuide = false;
		this.guideDiv = document.createElement("div");
		this.guideDiv.id = "guide";
		this.leftArrow = document.createElement("span");
		this.leftArrowPressed = false;
		this.rightArrow = document.createElement("span");
		this.rightArrowPressed = false;
		this.guides = [];
		
		this.toggled = false;
		window.addEventListener("click", ev => this.requestGuidePress(ev));
		//window.addEventListener("click", () => this.requestGuideRelease());
	}
	
	start(){
		this.slides[this.slideNo].style.display = "block";
		this.slides[this.nextSlideNo].style.display = "block";
		
		this.interval = window.setInterval(() => {
			if(this.count < this.COUNT_METER)
				this.count++;
			else{
				if(this.opacityLvl < 1)
					this.opacityLvl += 0.1;
				else if(this.opacityLvl > 1)
					this.opacityLvl = 1;
				
				this.slides[this.nextSlideNo].style.filter = "alpha(opacity=" + (this.opacityLvl * 100) + ")";
				this.slides[this.nextSlideNo].style.opacity = this.opacityLvl;
				this.slides[this.slideNo].style.filter = "alpha(opacity=" + ((1 - this.opacityLvl) * 100) + ")";
				this.slides[this.slideNo].style.opacity = 1 - this.opacityLvl;
				
				if(this.opacityLvl == 1)
					this.next()
			}
			
			if(this.hasGuide && this.guides[this.slideNo].id != "guide_selected"){
				for(let i = 0; i < this.guides.length; i++)
					this.guides[i].id = "";
				this.guides[this.slideNo].id = "guide_selected";
			}
		}, 50);
		
		if(this.hasGuide)
			this.guideDiv.style.display = "block";
		if(!this.toggled)
			this.toggled = true;
	}
	
	pause(){
		window.clearInterval(this.interval);
		this.count = 0;
		this.opacityLvl = 0;
		this.slides[this.slideNo].style.filter = "alpha(opacity=100)";
		this.slides[this.slideNo].style.opacity = "1.0";
		this.slides[this.slideNo].style.display = "none";
		this.slides[this.nextSlideNo].style.filter = "alpha(opacity=0)";
		this.slides[this.nextSlideNo].style.opacity = "0.0";
		this.slides[this.nextSlideNo].style.display = "none";
		
		if(this.hasGuide)
			this.guideDiv.style.display = "none";
		
		this.toggled = false;
	}
	
	next(){
		this.slides[this.slideNo].style.filter = "alpha(opacity=100)";
		this.slides[this.slideNo].style.opacity = 1.0;
		this.slides[this.slideNo].style.display = "none";
		
		this.slideNo = this.nextSlideNo;
		this.nextSlideNo++;
		if(this.nextSlideNo >= this.slides.length)
			this.nextSlideNo = 0;
		this.slides[this.nextSlideNo].style.display = "block";
		this.slides[this.slideNo].style.marginTop = "0";
		if(this.nextSlideNo != 0)
			this.slides[this.nextSlideNo].style.marginTop = "-" + this.slides[this.slideNo].offsetHeight + "px";
		else
			this.slides[this.slideNo].style.marginTop = "-" + this.slides[this.nextSlideNo].offsetHeight + "px";
		this.slides[this.nextSlideNo].style.filter = "alpha(opacity=0)";
		this.slides[this.nextSlideNo].style.opacity = "0.0";
		
		//reset
		this.opacityLvl = 0;
		this.count = 0;
	}
	
	back(){
		this.slides[this.slideNo].style.filter = "alpha(opacity=100)";
		this.slides[this.slideNo].style.opacity = 1.0;
		this.slides[this.slideNo].style.display = "block";
		
		this.slideNo--;
		if(this.slideNo < 0){
			this.slideNo = this.slides.length - 1;
			this.nextSlideNo = 0;
			
			
			
			//reset
			this.opacityLvl = 0;
			this.count = 0;
		}
	}
	
	enableGuide(){
		this.hasGuide = true;
		this.leftArrow.innerHTML = "<";
		this.leftArrow.id = "left_guide";
		this.guideDiv.appendChild(this.leftArrow);
		this.rightArrow.innerHTML = ">";
		this.rightArrow.id = "right_guide";
		for(let i = 0; i < this.slides.length; i++){
			let dot = document.createElement("span");
			dot.innerHTML = ".";
			dot.className = "center_guide";
			this.guides.push(dot);
			this.guideDiv.appendChild(this.guides[i]);
		}
		this.guideDiv.appendChild(this.rightArrow);
		
		this.slideshow.appendChild(this.guideDiv);
	}
	
	requestGuidePress(ev){
		if(this.toggled){
			if(ev.pageX >= this.leftArrow.offsetLeft && ev.pageX <= this.leftArrow.offsetLeft + this.leftArrow.offsetWidth
				&& ev.pageY >= this.guideDiv.offsetTop && ev.pageY <= this.guideDiv.offsetTop + this.guideDiv.offsetHeight){
				console.log("Left arrow clicked");
				this.leftArrow.style.border = "solid black 10pt";
				this.leftArrow.style.backgroundColor = "white";
				this.leftArrow.style.color = "black";
				this.leftArrowPressed = true;
				this.back()
			}
			if(ev.pageX >= this.guideDiv.offsetLeft + this.guideDiv.offsetWidth - this.leftArrow.offsetLeft * 2 &&
				ev.pageX <= this.guideDiv.offsetLeft + this.guideDiv.offsetWidth
				&& ev.pageY >= this.guideDiv.offsetTop && ev.pageY <= this.guideDiv.offsetTop + this.guideDiv.offsetHeight){
				console.log("Right arrow clicked");
				this.rightArrow.style.border = "solid black 10pt";
				this.rightArrow.style.backgroundColor = "white";
				this.rightArrow.style.color = "black";
				this.rightArrowPressed = true;
				this.next()
			}
		}
	}
	
	requestGuideRelease(){
		console.log("screen released");
		if(this.leftArrowPressed){
			this.leftArrow.style.border = "solid white 10pt";
			this.leftArrow.style.backgroundColor = "black";
			this.leftArrow.style.color = "white";
			this.leftArrowPressed = false;
		}
		if(this.rightArrowPressed){
			this.rightArrow.style.border = "solid white 10pt";
			this.rightArrow.style.backgroundColor = "black";
			this.rightArrow.style.color = "white";
			this.rightArrowPressed = false;
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
		this.captions[index].style.top = (propertyInfo.offsetTop - 981) + "px";
		this.captions[index].style.left = "0";
		propertyInfo.insertBefore(this.captions[index], propertyInfo.firstChild);
	}
}