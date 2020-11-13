class Slideshow{
	constructor(){
		this.div = document.getElementById("slideshow");
		this.OPACITY = 10;
		this.opacity = this.OPACITY;
		//make new instances of the slides rather than references
		this.slides = [];
		for(let x of this.div.getElementsByTagName("img"))
			this.slides.push(x);
		this.div.innerHTML = "";
		this.slideNo = 0;
		this.changeSlide();
		this.cur = this.slides[0];
		this.next = this.slides[1];
		this.cur.style.position = "absolute";
		this.cur.style.width = "100%";
		this.div.appendChild(this.cur);
		this.div.appendChild(this.next);
		
		this.waitCount = 0;
		this.waitTime = 60;
		this.wait();
	}
	
	//wait a period and then start transitioning
	wait(){
		this.waiting = true;
		this.waitInterval = window.setInterval(() => {
			this.waitCount++;
			if(this.waitCount >= this.waitTime){
				this.waitCount = 0;
				this.waiting = false;
				window.clearInterval(this.waitInterval);
			}
		}, 40);
	}
	
	changeStack(){
		//restore cur and clear stack
		this.opacity = this.OPACITY;
		this.cur.style.filter = "alpha(opacity=100)";
		this.cur.style.opacity = 1.0;
		this.cur.style.width = "calc(100% + 6pt)";
		this.cur.style.position = "static";
		this.div.innerHTML = "";
		this.cur = null;
		this.next = null;
		
		//restore stack based on current slide
		this.cur = this.slides[this.slideNo];
		this.changeSlide();
		this.next = this.slides[this.slideNo];
		this.cur.style.position = "absolute";
		this.cur.style.width = "100%";
		this.div.appendChild(this.cur);
		this.div.appendChild(this.next);
		
		this.wait();
	}
	
	changeSlide(){
		this.slideNo++;
		if(this.slideNo >= this.slides.length)
			this.slideNo = 0;
	}
	
	transition(){
		if(!this.waiting){
			this.cur.style.filter = "alpha(opacity=" + (--this.opacity / this.OPACITY * 100) + ")";
			this.cur.style.opacity = this.opacity / this.OPACITY;
			
			if(this.opacity <= 0)
				this.changeStack();
		}
	}
}
var slideshow = new Slideshow();

window.setInterval(() => {
	slideshow.transition();
}, 40);