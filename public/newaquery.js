function SubButtonClick() {
    let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let problemTextForm = document.getElementById("problem-text-form");
    let companyDropdownForm = document.getElementById("company-dropdown-form");
    let yearForm = document.getElementById("year-text-form");
    let complaintForm = document.getElementById("complaint-text-form");
    let make = maketextform.value;
    let model = modeltextform.value;
    let problem = problemTextForm.value;
    let companyId = companyDropdownForm.options[companyDropdownForm.selectedIndex].value
    let complaint = complaintForm.value;
    let year = yearForm.value;
    if(make == '')
        make = undefined;
    if(model == '')
        model = undefined;
    if(problem == '')
        problem = undefined;
    if(complaint == '')
        complaint = undefined;
    if(year == '')
        year = undefined;
    SetCookie(make, model, problem, companyId, complaint, year);
    window.location.href = "archiveresults.html";
}

function Resize() {
    RelocateButton();
    //ResizeFooter();
}

function RetrieveValidCompanies(loginCookie) {
    let reqObj = {
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token
    };
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/company/list", fetchInit).then(response=>{
        response.text().then(value => {
            if(response.status == 200) {
                let companyDropdownForm = document.getElementById("company-dropdown-form");
                let respObj = JSON.parse(value);
                respObj.forEach((companyIdObj, index) => {
                    companyDropdownForm.innerHTML += convertCompanyIdObject(companyIdObj, index == respObj.length);
                })
            } else{
                alert("Retrieving valid companies failed: " + value);
            }

        })
    })
}

function convertCompanyIdObject(companyIdObj, isLast) {
    let retStr = '<option value="' + companyIdObj.Id + '"';
    if(isLast)
        retStr += ' selected';
    retStr += '>' + companyIdObj.LegalName + "</option>";
    return retStr;
}

function DeleteCookie() {
    let d = new Date(1970, 0, 1);
    document.cookie = "OMISA_WEB_COOKIE=null;expires=" + d.toUTCString() + ";"
}

function ValidateTextForms(make, model, problem) {
    return (make !== "") && (model !== "") && (problem != "");
}

function SetCookie(make, model, problem, companyId, complaint, year) {
    let d = new Date();
    d.setTime(d.getTime() + (7 * 1000 * 60 * 60 * 24));
    let cookieObj = {};
    cookieObj.make = make;
    cookieObj.model = model;
    cookieObj.companyId = companyId;
    cookieObj.complaint = complaint;
    cookieObj.year = year;
    cookieObj.problem = problem;
    
    let cookieStr = "OMISA_WEB_COOKIE=" + JSON.stringify(cookieObj);
    document.cookie = cookieStr + ";expires="+d.toUTCString()+";path=/;";
}

function RelocateButton() {
    let button = document.getElementById("submitbutton");
    let titleLeft = document.getElementsByClassName("query-title")[0].offsetLeft;
    let buttonPosition = titleLeft;
    button.style.left = buttonPosition.toString() + "px";
}

async function init() {
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if(loginCookie == false) {
        ConstructRedirectCookie(false, "newaquery.html");
        window.location.replace("login.html");
        alert("User was not logged in, redirecting");
        return;
    }
    let button = document.getElementById("submitbutton");
    button.onclick = SubButtonClick;
    let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let problemtextform = document.getElementById("problem-text-form");
    let companyDropdownForm = document.getElementById("company-dropdown-form");
    let yearTextForm = document.getElementById("year-text-form");
    let complaintTextForm = document.getElementById("complaint-text-form");
    let overrideSubmit = function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            button.click();
        }
    }
    maketextform.addEventListener("keydown", overrideSubmit);
    modeltextform.addEventListener("keydown", overrideSubmit);
    problemtextform.addEventListener("keydown", overrideSubmit);
    companyDropdownForm.addEventListener("keydown", overrideSubmit);
    yearTextForm.addEventListener("keydown", overrideSubmit);
    complaintTextForm.addEventListener("keydown", overrideSubmit);
    RetrieveValidCompanies(loginCookie);

    window.addEventListener("resize", Resize);
    Resize();
}

window.onload = init;