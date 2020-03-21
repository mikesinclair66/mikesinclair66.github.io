var TRANS_TIME = 4;

class Slideshow{
    constructor(div){
        this.div = div;
        this.elements = div.getElementsByClassName('slideshowEl');
        this.elNo = 0;
        this.initInterval();

        let leftArrow = document.createElement('button');
        leftArrow.textContent = '<';
        leftArrow.className = 'leftArrow';

        leftArrow.onclick = () => {
            window.clearInterval(this.interval);
            this.transitionLeft();
            this.initInterval();
        };

        this.div.appendChild(leftArrow);

        let rightArrow = document.createElement('button');
        rightArrow.textContent = '>';
        rightArrow.className = 'rightArrow';

        rightArrow.onclick = () => {
            window.clearInterval(this.interval);

            this.elNo++;
            if(this.elNo >= this.elements.length)
                this.elNo = 0;

            this.transition();
            this.initInterval();
        };

        this.div.appendChild(rightArrow);
    }

    transition(){
        for(let i = 0; i < this.elements.length; i++){
            if(i === this.elNo)
                this.elements[i].style.display = 'block';
            else
                this.elements[i].style.display = 'none';
        }

        this.elNo++;
        if(this.elNo >= this.elements.length)
            this.elNo = 0;
    }

    initInterval(){
        this.interval = window.setInterval(() => {
            this.transition();
        }, TRANS_TIME * 1000);
    }

    transitionLeft(){
        this.elNo -= 2;
        if(this.elNo < 0)
            this.elNo = this.elements.length - 1;

        for(let i = 0; i < this.elements.length; i++){
            if(i === this.elNo)
                this.elements[i].style.display = 'block';
            else
                this.elements[i].style.display = 'none';
        }
    }
}

var slideshows = document.getElementsByClassName('slideshow');
for(s of slideshows){
    s = new Slideshow(s);
    s.transition();
}