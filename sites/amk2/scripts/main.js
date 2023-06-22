async function pSleep(t){
	return new Promise(r => setTimeout(r, t));
}

class Animation{
	constructor(initId, animateId){
		this.el = document.getElementById(initId);
		this.toggled = false;
		this.initId = initId;
		this.animateId = animateId;
	}
}

class ClickableAnimation{
	constructor(initId, animateId){
		this.animateBtn = new Animation(initId, animateId);
		this.animateBtn.el.onclick = () => {
			if(!this.animateBtn.toggled){
				this.animateBtn.el.id = this.animateBtn.animateId;
				this.animateBtn.toggled = true;
			} else {
				this.animateBtn.el.id = this.animateBtn.initId;
				this.animateBtn.toggled = false;
			}
		}
	}
}

class ScrollAnimation{
	constructor(initId, animateId){
		this.animateBtn = new Animation(initId, animateId);
		this.offsetDistance = 500;
		window.addEventListener("scroll", () => {
			if(window.scrollY > (this.animateBtn.el.offsetTop - this.offsetDistance)
				&& !this.animateBtn.toggled){
				this.animateBtn.el.id = this.animateBtn.animateId;
				this.animateBtn.toggled = true;
			}
		});
	}
	
	setOffsetDistance(dist){
		this.offsetDistance = dist;
	}
}

var hamburgerBtn = new ClickableAnimation("hamburger_btn", "hamburger_btn_animated");
var navContent = document.getElementById("nav_content");

hamburgerBtn.animateBtn.el.addEventListener("click", async () => {
	if(hamburgerBtn.animateBtn.toggled){
		navContent.style.display = "block";
		await pSleep(1);
		navContent.style.filter = "alpha(opacity=100)";
		navContent.style.opacity = "1.0";
	} else {
		navContent.style.filter = "alpha(opacity=0)";
		navContent.style.opacity = "0.0";
		await pSleep(401);
		navContent.style.display = "none";
	}
});

var navLinks = navContent.getElementsByClassName("link");
var navLinkSelected = 0;

function navigateToHeader(n){
	let offset;
	
	switch(n){
		case 0:
			offset = document.getElementById("about_parallax").offsetTop;
			break;
		case 1:
			offset = document.getElementById("team").offsetTop;
			break;
		case 2:
			offset = document.getElementById("services_parallax").offsetTop;
			break;
		default:
			offset = document.getElementById("contact").offsetTop;
			break;
	}
	
	window.scrollTo({
		top: offset,
		left: 0,
		behavior: 'smooth'
	});
}

for(let i = 0; i < navLinks.length; i++)
	navLinks[i].onclick = async () => {
		if(hamburgerBtn.animateBtn.toggled){
			hamburgerBtn.animateBtn.el.click();
			await pSleep(400);
		}
		navigateToHeader(i);
	};

let scrollAnimations = [];
scrollAnimations.push(new ScrollAnimation("contact_btn", "contact_btn_animated"));
scrollAnimations[0].animateBtn.el.addEventListener("click", () => { navigateToHeader(3); });
scrollAnimations.push(new ScrollAnimation("hook_text", "hook_text_animated"));

class PopupFolder{
	constructor(containerId, elementClass, titleClass){
		this.container = document.getElementById(containerId);
		this.files = document.getElementsByClassName(elementClass);
		this.fileTitles = document.getElementsByClassName(titleClass);
		this.btns = [];
		this.start();
	}
	
	start(){
		for(let i = 0; i < this.files.length; i++){
			let div = this.files[i].getElementsByTagName("div")[0];
			if(i !== 0)
				div.style.display = "none";
			
			let btn = document.createElement("button");
			btn.textContent = "View";
			btn.style.cursor = "pointer";
			btn.style.transition = "0.5s";
			if(i == 0){
				btn.style.display = "none";
				if(window.innerWidth < 1000)
					this.fileTitles[0].style.color = "#BD30FF";
			}
			this.btns.push(btn);
			this.fileTitles[i].style.transition = "0.5s";
			this.fileTitles[i].appendChild(btn);
			
			btn.onmouseover = () => {
				btn.style.color = "#BD30FF";
				btn.style.border = "solid #BD30FF 1px";
				this.fileTitles[i].style.color = "#BD30FF";
			}
			
			btn.onmouseout = () => {
				btn.style.color = "white";
				btn.style.border = "solid white 1px";
				this.fileTitles[i].style.color = "white";
			}
			
			btn.onclick = async (e) => {
				div.style.filter = "alpha(opacity=0)";
				div.style.opacity = "0.0";
				div.style.display = "block";
				btn.style.display = "none";
				await pSleep(50);
				
				div.style.filter = "alpha(opacity=100)";
				div.style.opacity = "1.0";
				
				for(let j = 0; j < this.files.length; j++)
					if(j !== i){
						let otherDiv = this.files[j].getElementsByTagName("div")[0];
						otherDiv.style.display = "none";
						this.btns[j].style.display = "block";
						this.fileTitles[j].style.color = "white";
					}
				
				window.scrollTo({
					top: this.fileTitles[i].offsetTop - 15,
					left: 0,
					behavior: 'smooth'
				});
			};
		}
	}
}
var popupFolder = new PopupFolder("popup_folder", "popup_file", "popup_title");

window.onload = () => {
	let par = document.getElementsByClassName("parallax");
	
	if(window.innerWidth >= 1000){
		for(let p of par){
			let img = p.getElementsByTagName("img")[0];
			p.style.backgroundImage = "url(" + img.src + ")";
			p.removeChild(img);
			p.style.minHeight = "500px";
			p.style.backgroundAttachment = "fixed";
			p.style.backgroundPosition = "center";
			p.style.backgroundRepeat = "no-repeat";
			p.style.backgroundSize = "cover";
		}
	}
	
	document.getElementById("we_create").style.top =
		(document.getElementById("about_us").offsetTop + 100) + "px"
};

var anchor = document.getElementById("anchor");
window.addEventListener("scroll", async () => {
	if(window.scrollY > 400){
		anchor.style.display = "block";
		await pSleep(50);
		anchor.style.filter = "alpha(opacity=100)";
		anchor.style.opacity = "1.0";
	} else {
		anchor.style.filter = "alpha(opacity=0)";
		anchor.style.opacity = "0.0";
		await pSleep(50);
		anchor.style.display = "none";
	}
});
anchor.onclick = () => {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth'
	});
};

var moneyRange = document.getElementById("money_range");
var rangeDisplay = document.getElementById("range_display");
rangeDisplay.textContent = "$" + moneyRange.value;
moneyRange.oninput = () => { rangeDisplay.textContent = "$" + moneyRange.value; };

var inputs = [
	document.getElementById("c_first_name"),
	document.getElementById("c_last_name"),
	document.getElementById("c_email"),
	document.getElementById("c_phone"),
	document.getElementById("finance_struggle1"),
	document.getElementById("finance_struggle2"),
	document.getElementById("finance_struggle3"),
	document.getElementById("finance_struggle4"),
	document.getElementById("finance_struggle5"),
	document.getElementById("radio_yes"),
	document.getElementById("radio_no"),
	document.getElementById("debt_relief1"),
	document.getElementById("debt_relief2"),
	document.getElementById("debt_relief3"),
	document.getElementById("debt_relief4"),
	document.getElementById("money_range")
];

document.getElementById("form_submit").onclick = e => {
	e.preventDefault();
	let borderWidth = ((window.innerWidth <= window.innerHeight) ? 5 : 3);
	let filledCount = 0;
	for(let i = 0; i < inputs.length; i++){
		inputs[i].style.border = "solid white " + borderWidth + "pt";
		if(inputs[i].value !== "")
			filledCount++;
		else
			inputs[i].style.border = "solid red " + borderWidth + "pt";
	}
	
	if(filledCount < inputs.length){
		window.alert("Please fill all fields before submitting the form.");
		return;
	}
	
	let checkboxMarked = (val) => { return ((val) ? "Checked" : "Not checked"); }
	let radioChosen = (y) => { return ((y) ? "Yes" : "No" ); };
	
	if(confirm("Are you sure you want to send the current form to AMK?")){
		//info@amkcanada.com
		Email.send({
			SecureToken: "b82c5a1d-e335-4dfd-8045-9f69db788559",
			To: 'intiva.technologies@gmail.com', 
			From: "michaelkevin.sinclair@gmail.com", 
			Subject: "Filled AMK website form", 
			Body: "First name: " + inputs[0].value + ", Last name: " + inputs[1].value + "<br>Email: "
				+ inputs[2].value + ", Phone no.: " + inputs[3].value + "<br>Financial struggle:<br>"
				+ "Debts or payments to be made: " + checkboxMarked(inputs[4].checked) + "<br>"
				+ "The COVID-19 pandemic: " + checkboxMarked(inputs[5].checked) + "<br>"
				+ "A reason that is personal or medical: " + checkboxMarked(inputs[6].checked) + "<br>"
				+ "Loss of income or job: " + checkboxMarked(inputs[7].checked) + "<br>"
				+ "Reason not mentioned: " + checkboxMarked(inputs[8].checked) + "<br>"
				+ "Immediate relief needed: " + radioChosen(inputs[9].checked) + "<br><br>"
				+ "Type of debt relief needed:<br>"
				+ "Tax debt: " + checkboxMarked(inputs[11].checked) + "<br>"
				+ "Credit card debt: " + checkboxMarked(inputs[12].checked) + "<br>"
				+ "Student loan(s): " + checkboxMarked(inputs[13].checked) + "<br>"
				+ "Other debt not mentioned: " + checkboxMarked(inputs[14].checked) + "<br><br>"
				+ "Estimated debt amount: " + inputs[15].value
				
		}).then(function (message){
			alert("mail sent successfully");
		});
	}
};