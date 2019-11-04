let initialLeft = 0;
let initialDisplayLinks = 2;
let displayedLinks = initialDisplayLinks;
function Init() {
    let navbar = document.getElementById("topnav");
    navbar.addEventListener("wheel", ScrollWheel);
    initialLeft = navbar.offsetLeft;
    window.onresize = resizeNavbar;
    ChangeDisplayedLinksByLoginStatus();
    resizeNavbar();
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
    navbar.style.minWidth = (156 * displayedLinks) + "px";
}

function ChangeDisplayedLinksByLoginStatus() {
    let loginCookie = RetrieveLoginCookie();
    let loginLink = document.getElementsByClassName("login")[0];
    let signUpLink = document.getElementsByClassName("signup")[0];
    let logoutLink = document.getElementsByClassName("logout")[0];
    let adminLink = document.getElementsByClassName("admin")[0];
    let partsLink = document.getElementsByClassName("parts")[0];
    let safetyLink = document.getElementsByClassName("safety")[0];
    let accountLink = document.getElementsByClassName("account")[0];
    if(loginCookie == undefined) {
        displayedLinks = initialDisplayLinks + 2;
        loginLink.style.display = "inline";
        signUpLink.style.display = "inline";
        logoutLink.style.display = "none";
        adminLink.style.display = "none";
        partsLink.style.display = "none";
        safetyLink.style.display = "none";
        accountLink.style.display = "none";
        return undefined;
    }
    displayedLinks = initialDisplayLinks;
    let accessLevel = loginCookie.accessLevel;
    loginLink.style.display = "none";
    signUpLink.style.display = "none";
    logoutLink.style.display = "inline";
    accountLink.style.display = "inline";
    displayedLinks += 2;
    if((accessLevel & 8) != 0){
        adminLink.style.display = "inline";
        displayedLinks += 1;
    }
    if((accessLevel & 4) != 0) {
        partsLink.style.display = "inline";
        displayedLinks += 1;
    }
    if((accessLevel & 2) != 0) {
        safetyLink.style.display = "inline";
        displayedLinks += 1;
    }
}

window.addEventListener("load", Init);;
