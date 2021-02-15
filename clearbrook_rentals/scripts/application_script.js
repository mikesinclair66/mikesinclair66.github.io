var formExitBtn = document.createElement("span");
formExitBtn.style.fontSize = "50pt";
formExitBtn.style.position = "fixed";
formExitBtn.style.top = "20pt";
formExitBtn.style.right = "45pt";
formExitBtn.style.color = "#EAD160";
formExitBtn.innerHTML = "X";
formExitBtn.style.transform = "rotate(0deg)";
formExitBtn.style.zIndex = "2";
formExitBtn.style.cursor = "pointer";
formExitBtn.onclick = () => toggleForm();

//toggle form
var formToggled = false;
var formBtn = document.getElementById("form_btn");
var iframe = document.createElement("iframe");
if(formBtn){
	formBtn.onclick = () => toggleForm("../application.html");
}

function toggleForm(src){
	if(!formToggled){
		iframe.id = "application_form";
		iframe.src = src;
		if(window.innerWidth <= 1000){
			navbarMenu.style.backgroundColor = "black";
			hamburgerBtn.click();
			hamburgerBtn.style.display = "none";
		}
		propertiesDropdownLink.style.display = "none";
		document.getElementsByTagName("footer")[0].style.display = "none";
		for(el of links)
			el.style.display = "none";
		
		document.getElementsByClassName("info")[0].appendChild(iframe);
		document.body.appendChild(formExitBtn);
		formToggled = true;
		
		//desktop
		if(window.innerWidth > 1000){
			navbar.style.display = "none";
			navbarMenu.style.display = "none";
		}
	} else {
		propertiesDropdownLink.style.display = "inline-block";
		for(el of links)
			el.style.display = "inline-block";
		for(el of document.getElementById("properties_dropdown").getElementsByClassName("link"))
			el.style.display = "block";
		if(navbarToggled){
			navbarMenu.style.backgroundColor = "#3D3D3D";
			if(window.innerWidth <= 1000)
				hamburgerBtn.style.display = "block";
			hamburgerBtn.click();
		}
		
		document.getElementsByTagName("footer")[0].style.display = "block";
		document.getElementsByClassName("info")[0].removeChild(document.getElementById("application_form"));
		document.body.removeChild(formExitBtn);
		formToggled = false;
		
		//desktop
		navbar.style.display = "block";
		navbarMenu.style.display = "block";
	}
	
	/*
	if(!formToggled){
		document.getElementById("temp_form").style.display = "block";
		formToggled = true;
	}
	
	document.getElementById("exit_temp").onclick = () => {
		document.getElementById("temp_form").style.display = "none";
		formToggled = false;
	};
	*/
}