let hamburgerBtn = document.getElementById('hamburgerBtn');
let hamburgerClicked = false;
hamburgerBtn.onclick = () => {
    //slide content open
    let content = document.getElementById('content');
    let banner = document.getElementById('logo_banner');

    //hamburger button icons
    let bar1 = document.getElementById('bar1');
    let bar2 = document.getElementById('bar2');
    let bar3 = document.getElementById('bar3');

    bar1.style.position = 'relative';
    bar3.style.position = 'relative';

    if(!hamburgerClicked){
        content.style.left = 'calc(100% - 600pt)';
        content.style.opacity = '1.0';
        banner.style.width = '605pt';
        banner.style.left = 'calc(100% - 571pt)';
        bar1.style.top = '17pt';
        bar1.style.transform = 'rotate(40deg)';
        bar2.style.opacity = '0.0';
        bar3.style.top = '-17pt';
        bar3.style.transform = 'rotate(-40deg)';
        hamburgerClicked = true;
    } else {
        content.style.left = '100%';
        content.style.opacity = '0.0';
        banner.style.width = '310pt';
        banner.style.left = 'calc(100% - 278pt)';
        bar1.style.top = '0';
        bar1.style.transform = 'rotate(0deg)';
        bar2.style.opacity = '1.0';
        bar3.style.top = '0';
        bar3.style.transform = 'rotate(0deg)';
        hamburgerClicked = false;
    }
};

//limit imgandinfo paragraph
var imgInfos = document.getElementsByClassName('imgAndInfo');
const WORD_LIMIT = 50;
for(el of imgInfos){
    let p = el.getElementsByTagName('p')[0];
    let words = p.innerText.split(' ');
    if(words.length > WORD_LIMIT){
        p.style.display = 'none';
        let limitedP = document.createElement('p');
        for(let i = 0; i < WORD_LIMIT; i++)
            limitedP.textContent += (words[i] + ' ');
        limitedP.innerHTML += '<br /><br />';

        let seeMore = document.createElement('span');
        seeMore.textContent = "See more...";
        seeMore.style.cursor = 'pointer';
        seeMore.onclick = () => {
            limitedP.style.display = 'none';
            p.style.display = 'block';
        };

        limitedP.appendChild(seeMore);
        el.appendChild(limitedP);
    }
}

//translate slideshow divs
class Slideshow{
    constructor(el){
        this.el = el;
        this.slides = el.getElementsByClassName('slideshowEl');
        this.slideNo = 0;
        this.dots = [];

        this.init();
    }

    init(){
        for(let i = 1; i < this.slides.length; i++)
            this.slides[i].style.display = 'none';

        let div = document.createElement('div');
        div.className = 'slideSelector';

        let leftArrow = document.createElement('span');
        leftArrow.textContent = "<";
        leftArrow.style.fontSize = '50pt';
        leftArrow.className = 'leftArrow';
        leftArrow.onclick = () => this.transitionBack();
        div.appendChild(leftArrow);

        for(let i = 0; i < this.slides.length; i++){
            let dot = document.createElement('span');
            dot.className = 'slideshowDot';
            dot.textContent = ' . ';
            if(i !== 0)
                dot.style.opacity = '0.5';
            dot.onclick = () => this.transitionTo(i);
            div.appendChild(dot);
            this.dots.push(dot);
        }

        let rightArrow = document.createElement('span');
        rightArrow.textContent = ">";
        rightArrow.style.fontSize = '50pt';
        rightArrow.className = 'rightArrow';
        rightArrow.onclick = () => this.transition();
        div.appendChild(rightArrow);

        this.el.appendChild(div);
    }

    transition(){
        let next = this.slideNo + 1;
        if(next >= this.slides.length)
            next = 0;

        this.slides[this.slideNo].style.display = 'none';
        this.slides[next].style.display = 'block';
        this.slideNo = next;

        this.updateDots();

        window.clearInterval(slideInterval);
        startSlideshow();
    }

    transitionBack(){
        let next = this.slideNo - 1;
        if(next < 0)
            next = this.slides.length - 1;

        this.slides[this.slideNo].style.display = 'none';
        this.slides[next].style.display = 'block';
        this.slideNo = next;

        this.updateDots();

        window.clearInterval(slideInterval);
        startSlideshow();
    }

    transitionTo(num){
        this.slides[this.slideNo].style.display = 'none';
        this.slides[num].style.display = 'block';
        this.slideNo = num;

        this.updateDots();

        window.clearInterval(slideInterval);
        startSlideshow();
    }

    updateDots(){
        for(let i = 0; i < this.dots.length; i++){
            if(i === this.slideNo)
                this.dots[i].style.opacity = '1.0';
            else
                this.dots[i].style.opacity = '0.5';
        }
    }
}

let slideshowEls = document.getElementsByClassName('slideshow');
var slideshows = [];
for(el of slideshowEls)
    slideshows.push(new Slideshow(el));

var slideInterval;
function startSlideshow(){
    if(slideshows.length > 0){
        slideInterval = window.setInterval(() => {
            for(s of slideshows)
                s.transition();
        }, 4000);
    }
}
startSlideshow();