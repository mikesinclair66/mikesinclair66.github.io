var loaded = false;
let angle = 0;
const ANGLE_INC = 8;

var portraitInterval = null;
var portraitIntervalStarted = false;
var checkPortrait = () => { return window.innerWidth <= window.innerHeight; };
var isPortrait = checkPortrait();

function requestGradientAnimation(){
	if(isPortrait && !portraitIntervalStarted){
		portraitInterval = window.setInterval(function(){
			angle += 4;
			if(angle > 360)
				angle = 0;
			
			document.body.style.backgroundImage = "linear-gradient(" + angle + "deg, #00B3D3, #00D2C1, #00D2A7)";
		}, 30);
		portraitIntervalStarted = true;
	} else if(!isPortrait && portraitIntervalStarted){
		window.clearInterval(portraitInterval);
		portraitIntervalStarted = false;
		angle = 0;
		
		document.body.style.background = "none";
		//TODO resume bg slideshow
	}
}
requestGradientAnimation();

var flipped = false;
var mainInner = document.getElementById("main_el_inner");
var logoInner = document.getElementById("logo_inner");
var previousProjects = document.getElementById("previous_projects");
var homePage = document.getElementById("home_page");

var isMobile = false;
var mobileChecked = false;
async function checkMobile(){
	if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
		isMobile = true;
	
	mobiledChecked = true;
}
checkMobile();

function loadLandscape(){
	let logoContainer = document.getElementById("logo_container");
	let logo = document.getElementById("logo"), logoBlack = document.getElementById("logo_black");
	let phoneNo = document.getElementById("phone_no");
	
	if(isMobile && window.innerWidth > window.innerHeight){
		logoContainer.style.top = "0pt";
		logo.style.position = "relative";
		logo.style.bottom = "12pt";
		logoBlack.style.position = "relative";
		logoBlack.style.bottom = "12pt";
		phoneNo.style.color = "#00B3D3";
		phoneNo.style.position = "relative";
		phoneNo.style.bottom = "10pt";
	} else if(isMobile && window.innerWidth <= window.innerHeight){
		phoneNo.style.color = "white";
		phoneNo.style.position = "static";
		logoBlack.style.position = "static";
		logo.style.position = "static";
	}
}
loadLandscape();

window.addEventListener("resize", () => {
	isPortrait = checkPortrait();
	requestGradientAnimation();
	if(loaded){
		document.getElementById("loading_page").style.display = "none";
		loadLandscape();
		if(isPortrait){
			slideshow.pause();
		} else{
			slideshow.load();
		}
	}
});

class ButtonAnimation{
	constructor(btnClass){
		this.els = document.getElementsByClassName(btnClass);
		this.interval = null;
		this.block = document.createElement("span");
		this.block.id = "animation_block";
		this.curBlock = -1;//current animation block being processed
		
		for(let i = 0; i < this.els.length; i++){
			this.els[i].addEventListener("mouseover", async () => {
				if(!isPortrait){
					this.block.style.top = this.els[i].offsetTop + "px";
					this.refreshBlock(this.els[i].offsetLeft + 1, 2);
					this.block.style.height = this.els[i].offsetHeight + "px";
					this.els[i].appendChild(this.block);
					this.curBlock = i;
					await new Promise(r => setTimeout(r, 1));
					
					this.refreshBlock(this.els[i].offsetLeft + this.els[i].offsetWidth - 11, 10);
					await new Promise(r => setTimeout(r, 400));
					
					this.refreshBlock(this.els[i].offsetLeft + 1, this.els[i].offsetWidth - 1);
				}
			});
			
			this.els[i].addEventListener("mouseout", () => {
				if(this.curBlock !== -1){
					this.els[this.curBlock].removeChild(this.block);
					this.curBlock = -1;
				}
			});
			
			this.els[i].addEventListener("click", async () => {
				console.log(isMobile);
				if(isMobile){
					this.block.style.top = this.els[i].offsetTop + "px";
					this.refreshBlock(this.els[i].offsetLeft + this.els[i].offsetWidth - 2, 1);
					this.block.style.height = this.els[i].offsetHeight + "px";
					this.els[i].appendChild(this.block);
					this.curBlock = i;
					await new Promise(r => setTimeout(r, 1));
					
					this.refreshBlock(this.els[i].offsetLeft + 1, this.els[i].offsetWidth);
					await new Promise(r => setTimeout(r, 400));
					
					if(this.curBlock !== -1){
						this.els[this.curBlock].removeChild(this.block);
						this.curBlock = -1;
					}
				}
				
				if(!flipped){
					mainInner.style.transform = "rotateY(180deg)";
					logoInner.style.transform = "rotateY(180deg)";
					flipped = true;
				} else {
					mainInner.style.transform = "rotateY(0deg)";
					logoInner.style.transform = "rotateY(0deg)";
					flipped = false;
				}
			});
		}
	}
	
	refreshBlock(curX, curWidth){
		this.block.style.left = curX + "px";
		this.block.style.width = curWidth + "px";
	}
}
var animation = new ButtonAnimation("anim1");

async function load(){
	await new Promise(r => setTimeout(r, 500));
	let loadingPage = document.getElementById("loading_page");
	loadingPage.style.filter = "alpha(opacity=0)";
	loadingPage.style.opacity = "0.0";
	await new Promise(r => setTimeout(r, 500));
	loadingPage.style.display = "none";
	loaded = true;
}

let slideshowChecker = window.setInterval(() => {
	if(slideshow.loaded){
		this.load();
		window.clearInterval(slideshowChecker);
		
		if(!isPortrait)
			slideshow.load();
	}
}, 400);