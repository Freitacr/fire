function Resize() {
    RelocateButton();
    ResizeFooter();
}

function ResizeFooter() {
    let footer = document.getElementsByClassName("footer")[0];
    footer.style.left = "202px";
    let footerWidth = window.innerWidth - 397;
    footer.style.width = footerWidth.toString() + "px";
    let footerTop = window.innerHeight - footer.offsetHeight;
    footer.style.top = footerTop.toString() + "px";
}

function RelocateButton() {
    let button = document.getElementById("submitbutton");
    let titleLeft = document.getElementsByClassName("query-title")[0].offsetLeft;
    let buttonPosition = titleLeft;
    button.style.left = buttonPosition.toString() + "px";
}

function init() {
    window.addEventListener("resize", Resize);
    Resize();
}

window.onload = init;