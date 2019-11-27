function SubButtonClick() {
	let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let complainttextform = document.getElementById("complaint-text-form");
	let problemtextform = document.getElementById("problem-text-form");
    let make = maketextform.value;
    let model = modeltextform.value;
    let complaint = complainttextform.value;
	let problem = problemtextform.value;
    if(ValidateTextForms(make, model, complaint, problem)) {
        let Entry = {
			Make: make,
			Model: model,
			Complaint: complaint,
			Problem: problem
		}
		RetrieveSimilarJobs(Entry,0);
    }
}
function UpButtonClick() {
	/*
	let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let complainttextform = document.getElementById("complaint-text-form");
	let problemtextform = document.getElementById("problem-text-form");
    let make = maketextform.value;
    let model = modeltextform.value;
    let complaint = complainttextform.value;
	let problem = problemtextform.value;
    if(ValidateTextForms(make, model, complaint, problem)) {
        let Entry = {
			Make: make,
			Model: model,
			Complaint: complaint,
			Problem: problem,
		}
		RetrieveSimilarJobs(Entry,1);
    }
	*/
	alert("Currently Unable to Upload");
}
function RetrieveSimilarJobs(Entry,forced) {
    let reqObj = {
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token,
		AuthToken: authCookie.token,
		ContainedEntry: Entry,
		Duplicate: forced
    };
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/repairjob", fetchInit).then(response=>{
        response.text().then(value => {
            if(response.status == 200) {
              alert("Uploaded");
            } else if(response.status==409){
                let respObj=JSON.parse(value);
				let similarTable=document.getElementById("similar-job-table");
				for(let i = 0; i < respObj.length; i++){
                        convertObject(respObj[i], similarTable);
                    }
            } else{
				alert("Error!!"+value)
			}

        })
    })
    
}

function convertObject(job, labelTable) {
    let retStr = "<tr>";
    retStr += "<td>" + job.Make + "</td>";
    retStr += "<td>" + job.Model + "</td>";
    retStr += "<td>" + job.Year + "</td>";
	retStr += "<td>" + job.Complaint + "</td>";
	retStr += "<td>" + job.Problem + "</td>";
    retStr += "</tr>";
    labelTable.innerHTML += retStr;
}

function ValidateTextForms(make, model, complaint, problem) {
    return (make !== "") && (model !== "") && (complaint != "") && (problem != "");
}

function Resize() {
    RelocateButton("submitbutton");
	RelocateButton("uploadbutton");
    //ResizeFooter();
}

function SetCookie(make, model, complaint, companyId) {
    let d = new Date();
    d.setTime(d.getTime() + (7 * 1000 * 60 * 60 * 24));
    let cookieStr = "OMISP_WEB_COOKIE={";
    cookieStr += '"make":"' + make + '",';
    cookieStr += '"model":"' + model + '",';
    cookieStr += '"companyId":"' + companyId + '",';
    cookieStr += '"complaint":"' + complaint + '"}';
    document.cookie = cookieStr + ";expires="+d.toUTCString()+";path=/;";
}

function DeleteCookie() {
    let d = new Date(1970, 0, 1);
    document.cookie = "OMISP_WEB_COOKIE=null;expires=" + d.toUTCString() + ";"
}

function ResizeFooter() {
    let footer = document.getElementsByClassName("footer")[0];
    footer.style.left = "202px";
    let footerWidth = window.innerWidth - 397;
    footer.style.width = footerWidth.toString() + "px";
    let footerTop = window.innerHeight - footer.offsetHeight;
    footer.style.top = footerTop.toString() + "px";
}

function RelocateButton(buttonId) {
    let button = document.getElementById(buttonId);
    let titleLeft = document.getElementsByClassName("upload-title")[0].offsetLeft;
    let buttonPosition = titleLeft;
    button.style.left = buttonPosition.toString() + "px";
}

async function init() {
    await IsUserAuthed().then(val => {authCookie = val});
    if(authCookie == false)
    {
        ConstructRedirectCookie(true, "newpquery.html")
        window.location.replace("auth.html");
        alert("User was not authenticated, redirecting");
    }
	await IsUserLoggedIn().then(val => {loginCookie = val});
    if(loginCookie == false) {
        ConstructRedirectCookie(false, "newpquery.html");
        window.location.replace("login.html");
        alert("User was not logged in, redirecting");
        return;
    }
    let button = document.getElementById("submitbutton");
    button.onclick = SubButtonClick;
	let upbutton = document.getElementById("uploadbutton");
    upbutton.onclick = UpButtonClick;
    let maketextform = document.getElementById("make-text-form");
    let modeltextform = document.getElementById("model-text-form");
    let complainttextform = document.getElementById("complaint-text-form");
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
    yearTextForm.addEventListener("keydown", overrideSubmit);
    DeleteCookie();
    window.addEventListener("resize", Resize);
    Resize();
}
let loginCookie;
let authCookie;
window.onload = init;