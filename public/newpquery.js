function SubButtonClick() {
    let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let complainttextform = document.getElementById("complaint-text-form");
    let make = maketextform.value;
    let model = modeltextform.value;
    let complaint = complainttextform.value;
    if(ValidateTextForms(make, model, complaint)) {
        SetCookie(make, model, complaint);
        window.location.href = "predictresults.html";
    }
}

function ValidateTextForms(make, model, complaint) {
    return (make !== "") && (model !== "") && (complaint != "");
}

function SetCookie(make, model, complaint) {
    let d = new Date();
    d.setTime(d.getTime() + (7 * 1000 * 60 * 60 * 24));
    let cookieStr = "OMISP_WEB_COOKIE={";
    cookieStr += '"make":"' + make + '",';
    cookieStr += '"model":"' + model + '",';
    cookieStr += '"complaint":"' + complaint + '"}';
    document.cookie = cookieStr + ";expires="+d.toUTCString()+";path=/;";
}

function DeleteCookie() {
    let d = new Date(1970, 0, 1);
    document.cookie = "OMISP_WEB_COOKIE=null;expires=" + d.toUTCString() + ";"
}

function Resize() {
    RelocateButton();
    //ResizeFooter();
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
    let button = document.getElementById("submitbutton");
    button.onclick = SubButtonClick;
    let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let complainttextform = document.getElementById("complaint-text-form");
    let jobIdTextForm = document.getElementById("jobid-text-form");
    let yearTextForm = document.getElementById("year-text-form");
    let overrideSubmit = function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            button.click();
        }
    }
    maketextform.addEventListener("keydown", overrideSubmit);
    modeltextform.addEventListener("keydown", overrideSubmit);
    complainttextform.addEventListener("keydown", overrideSubmit);
    jobIdTextForm.addEventListener("keydown", overrideSubmit);
    yearTextForm.addEventListener("keydown", overrideSubmit);
    DeleteCookie();
    window.addEventListener("resize", Resize);
    Resize();
}

window.onload = init;