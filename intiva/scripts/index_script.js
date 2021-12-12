var popups = [];
popups.push(new Popup(document.getElementById("office_index").getElementsByTagName("img")[0],
    1, 10, document.getElementById("office_index")));
popups.push(new Popup(document.getElementById("office_index_link"),
    3, 10, document.getElementById("office_index")));
popups.push(new Popup(document.getElementById("worklog_paragraph_index"), 2, 20));
popups.push(new Popup(document.getElementById("worklog_paragraph_index_parallax"),
    2, 20, document.getElementById("office_index")));
popups[2].setScrollDist(450);

var officeIndexImg = new CustomAnim(document.getElementById("office_index_link").getElementsByTagName("img")[0],
    initMods={ "transform": "rotate(0deg)", "left": "7pt" },
    animMods={ "transform": "rotate(270deg)", "left": "9pt" });
var officeIndexLinkAnimated = false;

var serviceColors = [
    new Rgba(0, 178, 210),
    new Rgba(0, 198, 210),
    new Rgba(0, 210, 208),
    new Rgba(0, 210, 193),
    new Rgba(0, 210, 168)
];
var services = document.getElementsByClassName("service");
var serviceGRs = [];
for(let i = 0; i < serviceColors.length - 1; i++){
    serviceGRs.push(new GradientRotation(services[i], serviceColors[i], serviceColors[i + 1]));
    serviceGRs[i].toggle();
}

var officeIndex = document.getElementById("office_index"),
    officeIndexParallax = document.getElementById("office_index_parallax");
function relocateOfficeIndex(){
    let sizeQuery = getSizeQuery();

    if(sizeQuery === "mobile"){
        popups[0].setDisabled(false);
        popups[2].setDisabled(false);
        popups[3].setDisabled(true);
        popups[1].setScrollDist(400);
        popups[3].setScrollDist(400);
        officeIndexParallax.style.display = "none";
    } else if(sizeQuery === "mobile_landscape"){
        popups[0].setDisabled(true);
        popups[2].setDisabled(true);
        popups[3].setDisabled(false);
        popups[1].setScrollDist(200);
        popups[3].setScrollDist(200);
        officeIndexParallax.style.display = "block";

        if(window.scrollY <= 500){
            let mod = window.scrollY / 40;
            let bgPosX = -12, bgPosY = 25 + mod;
            let bgSize = 160 + mod;

            officeIndexParallax.style.backgroundPosition =
                bgPosX + "% " + bgPosY + "%";
            officeIndexParallax.style.backgroundSize = bgSize + "pt";
        }
    }
}

window.addEventListener("scroll", async () => {
    for(el of popups)
        el.request();
        
    if(!officeIndexLinkAnimated && popups[1].activated){
        officeIndexLinkAnimated = true;
        await pSleep(400);
        officeIndexImg.toggle();
    }

    relocateOfficeIndex();
});

window.addEventListener("resize", () => relocateOfficeIndex());
relocateOfficeIndex();