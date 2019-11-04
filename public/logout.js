function init() {
    PerformLogout();
    ChangeDisplayedLinksByLoginStatus();
    resizeNavbar();
    let statusStr = document.getElementById("status");
    statusStr.innerHTML += ": Logout Successful";
}

window.addEventListener("load", init)