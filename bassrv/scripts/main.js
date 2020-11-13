var navbarBtn = document.getElementById("navbar-btn");
var navbar = document.getElementById("navbar");
var navbarToggled = false;
navbarBtn.onclick = () => {
	if(!navbarToggled){
		navbarBtn.style.color = "black";
		navbarBtn.style.backgroundColor = "white";
		navbarBtn.style.transform = "rotate(0deg)";
		navbar.style.marginTop = "0";
		
		navbarToggled = true;
	} else {
		navbarBtn.style.color = "white";
		navbarBtn.style.background = "none";
		navbarBtn.style.transform = "rotate(180deg)";
		navbar.style.marginTop = "-450pt";
		
		navbarToggled = false;
	}
};