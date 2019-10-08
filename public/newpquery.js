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
    console.log(document.cookie);
}

function DeleteCookie() {
    let d = new Date(1970, 0, 1);
    document.cookie = "OMISP_WEB_COOKIE=null;expires=" + d.toUTCString() + ";"
}

function init() {
    let button = document.getElementById("submitbutton");
    button.onclick = SubButtonClick;
    console.log(document.cookie);
    DeleteCookie();
    console.log(document.cookie);
}

window.onload = init;