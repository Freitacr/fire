let initialLeft = 0;
function Init() {
    let navbar = document.getElementById("topnav");
    navbar.addEventListener("wheel", ScrollWheel);
    initialLeft = navbar.offsetLeft;
    window.onresize = resizeNavbar;
    //let x = document.getElementById("predict-new-text");
    //console.log(x);
    //console.log(x.style.fontSize);
}

function ScrollWheel(event) {
    event.preventDefault();
    scrollAmount = event.deltaY;
    let navbar = document.getElementById("topnav");
    let leftVal = navbar.offsetLeft;
    let navbarWidth = navbar.offsetWidth;
    if(scrollAmount<0 && leftVal < initialLeft) {
        leftVal += 5;
    }
    else if(leftVal + navbarWidth > window.innerWidth) {
        leftVal -= 5;
    }
    navbar.style.left = leftVal.toString() + "px";
}

function resizeNavbar() {
    let navbar = document.getElementById("topnav");
    navbar.style.left = initialLeft.toString() + "px";
}

window.addEventListener("load", Init);;
