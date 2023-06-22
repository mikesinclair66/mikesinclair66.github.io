function loadOverlaps(){
	let sb = document.getElementsByClassName("scroll_block");
	for(let i = 0; i < sb.length; i++){
		let sc = sb[i].getElementsByClassName("scroll_container")[0];
		let sco = sb[i].getElementsByClassName("scroll_container_overlap")[0];
		
		if(window.innerWidth < 1025){
			if(sc.offsetHeight >= 525){
				sc.style.height = "400pt";
				sc.style.overflowY = "scroll";
			} else
				sc.style.height = "auto";
			
			if(i === 0 && document.getElementById("candidate_img")){
				document.getElementById("candidate_img").style.width = sc.offsetWidth + "px";
				document.getElementById("candidate_img").style.marginLeft = "calc(50% - " + (sc.offsetWidth / 2) + "px)";
			}
			if(window.innerWidth === 1024 || window.innerHeight === 1024){
				sc.style.width = sc.offsetWidth * 2 + "px";
				sc.style.marginLeft = "calc(50% - " + sc.offsetWidth / 2 + "px)";
				sb[i].getElementsByTagName("h3")[0].style.marginLeft = sc.offsetLeft + 3 + "px";
			}
		} else if(window.innerWidth >= 1025 && i === 1){
			let prev = sb[0].getElementsByClassName("scroll_container")[0];
			sc.style.width = prev.offsetWidth + "px";
			sb[1].style.position = "absolute";
			sb[1].style.left = prev.offsetLeft + prev.offsetWidth + 25 + "px";
			sb[1].style.top = sb[0].offsetTop
				- sb[0].getElementsByTagName("h3")[0].offsetHeight + 3 + "px";
		}
		
		sco.style.left = sc.offsetLeft - 4 + "px";
		sco.style.top = sc.offsetTop + 30 + "px";
		sco.style.width = sc.offsetWidth - 8 + "px";
		if(window.innerWidth !== 1024 && window.innerHeight !== 1024)
			sco.style.height = sc.offsetHeight - ((window.innerWidth < 1025) ? 30 : 20) + "px";
		else
			sco.style.height = sc.offsetHeight - 10 + "px";
		sco.style.display = "block";
	}
	if(window.innerWidth >= 1025 && document.getElementById("candidate_img"))
		document.getElementById("candidate_img").style.position = "fixed";
}

window.addEventListener("load", () => loadOverlaps());
window.addEventListener("resize", () => loadOverlaps());