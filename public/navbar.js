function OnResize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    
    resizeNavbar(w, h);
    //let x = document.getElementById("predict-new-text");
    //console.log(x);
    //console.log(x.style.fontSize);
}

function resizeNavbar(w, h) {
    let navbar = document.getElementById("topnav");
    let predictNavbutton = document.getElementById("pnavbutton");
    let archiveNavbutton = document.getElementById("anavbutton");
    navbar.style.height = .064 * h;
    predictNavbutton.style.height = .024 * h;
    archiveNavbutton.style.height = .024 * h;
}

window.onload = OnResize;