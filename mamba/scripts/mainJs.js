var hamburgerToggled = false;
function toggleHamburgerMenu(){
    let hamburger = document.getElementById('hamburger');
    let elements = hamburger.getElementsByTagName('a');

    if(!hamburgerToggled){
        hamburgerToggled = true;
        hamburger.style.display = "block";

        for(x of elements) {
            x.style.display = "block";
            x.onclick = toggleHamburgerMenu;
        }
    } else {
        hamburgerToggled = false;
        hamburger.style.display = "none";

        for(x of elements)
            x.style.display = "none";
    }
}

//close hamburger menu if scrolled or resized
window.onscroll = function(){
    if(hamburgerToggled)
        toggleHamburgerMenu();
};
window.onresize = function(){
    if(hamburgerToggled)
        toggleHamburgerMenu();
};