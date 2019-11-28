let requirementsSectionInitialHtml = undefined;

let overrideSubmit = function(e, button) {
    if(e.keyCode == 13) {
        e.preventDefault();
        button.click();
    }
}

function retrieveForumPage(loginCookie) {
    let forumCookie = retrieveForumCookie();
    if(forumCookie == undefined) {
        alert("Failed to load forum entries...")
        window.location.replace("index.html");
        return;
    }
    let dataId = forumCookie.id;
    requestForumPage(loginCookie, dataId, forumCookie.companyId);
}

function requestForumPage(loginCookie, dataId, companyId) {
    let reqBody = {
        "LoginToken": loginCookie.token,
        "UserId": loginCookie.userId,
        "JobEntryId": dataId,
        "CompanyId": companyId
    };
    let fetchInit = {
        'method': "PUT",
        "body": JSON.stringify(reqBody)
    };
    let title = document.getElementById("title");
    let forumData = document.getElementsByClassName("footer-spacer")[0];
    fetch("https://jcf-ai.com:16384/company/forum", fetchInit).then(response=>{
        response.text().then(val =>{
            if(response.status == 200) {
                let forumDataResp = JSON.parse(val);
                forumData.innerHTML += convertRepairJobEntry(forumDataResp[0]);
                for(let i = 1; i < forumDataResp.length; i++)
                    forumData.innerHTML += convertForumEntry(forumDataResp[i]);
                forumData.innerHTML += constructPostEntryForm();
                let postButton = document.getElementById('post-button');
                postButton.addEventListener("click", function() {handlePostButtonClick(loginCookie)});
                forumData.addEventListener("click", handleClick);
                let textArea = document.getElementById('input');
                textArea.addEventListener("keydown", function(e){overrideSubmit(e, postButton)});
                title.innerHTML = "Forum Results";
            } else {
                alert("Request for forum entries failed: " + val);
                title.innerHTML = "Results will not load...";
            }
        })
    })
}

function handlePostButtonClick(loginCookie) {
    let postTextArea = document.getElementById('input');
    let forumCookie = retrieveForumCookie();
    let reqObj = {
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token,
        PostText: postTextArea.value,
        CompanyId: forumCookie.companyId,
        JobEntryId: forumCookie.id
    };
    console.log(loginCookie);
    console.log(retrieveForumCookie());
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(reqObj)
    };

    fetch("https://jcf-ai.com:16384/company/forum", fetchInit).then(response=>{
        response.text().then(val=>{
            if(response.status == 200){

            } else {
                alert("Error occurred posting to the forum: " + val);
            }
        })
    })
    console.log("Would have sent request: " + fetchInit.body);

}

function handleClick(e) {
    let safetyBox = document.getElementsByClassName('safety-req')[0];
    let partsBox = document.getElementsByClassName('part-req')[0];
    let auxBox = document.getElementsByClassName('aux-req')[0];
    let id = e.target.id;
    if(id == undefined || id == ''){
        return;
    }
    if(id == 'aux'){
        safetyBox.style.display="none";
        partsBox.style.display="none";
        auxBox.style.display="block";
    } else if (id == 'parts') {
        safetyBox.style.display="none";
        partsBox.style.display="block";
        auxBox.style.display="none";
    } else if (id == 'safety') {
        safetyBox.style.display="block";
        partsBox.style.display="none";
        auxBox.style.display="none";
    } else if (id == 'aux-add') {
        console.log("would have attempted to add to auxillary requirements");
    } else if (id == 'part-add') {
        console.log("would have attempted to add to part requirements");
    } else if (id == 'safety-add') {
        console.log("would have attempted to add to safety requirements");
    }
}

function constructPostEntryForm() {
    let retStr = '<section class="posting-entry"><form class="posting-area"><textarea class="posting-text-area" placeholder="write a posting here..." id="input">' +
        '</textarea></form><form class="button-area"><button type="button" class="post-button" id="post-button">Post to Forum</button></form></section>';
    return retStr;
}

function convertForumEntry(forumEntry) {
    let displayName = forumEntry.DisplayName;
    let forumText = forumEntry.PostText.split('\n').join("<br>");
    
    let retStr = '<section class="entry post"><h3>'+displayName+"</h3><p>"+forumText+"</p></section>";
    return retStr;
}

function titleCase(sentence) {
    let words = sentence.split(/[ ]+/);
    words.forEach((word, index) => {
        words[index] = word[0].toUpperCase() + word.substr(1);
    });
    return words.join(" ");
}

function convertRepairJobEntry(repairJobEntry) {
    let make = titleCase(repairJobEntry.Make);
    let model = titleCase(repairJobEntry.Model);
    let year = titleCase(repairJobEntry.Year);
    let complaint = titleCase(repairJobEntry.Complaint);
    let problem = titleCase(repairJobEntry.Problem);
    let auxRequirements = repairJobEntry.AuxillaryRequirements;
    let partRequirements = repairJobEntry.PartRequirements;
    let safetyRequirements = repairJobEntry.SafetyRequirements;

    let retStr = convertJob(make, model, year, complaint, problem);
    retStr += convertAuxillaryRequirements(auxRequirements);
    retStr += convertPartRequirements(partRequirements);
    retStr += convertSafetyRequirements(safetyRequirements);
    return retStr;
}

function convertJob(make, model, year, complaint, problem) {
    let retStr = '<section class="job entry"><h2>Repair Job Data</h2><ol><li><b>Make:</b>';
    retStr += make + "</li><li><b>Model:</b>";
    retStr += model + "</li><li><b>Year:</b>";
    retStr += year + "</li><li><b>Complaint:</b>";
    retStr += complaint + "</li><li><b>Problem:</b>";
    retStr += problem + "</li></ol>";
    retStr += '<span class="requirements" id="requirements"><span id="aux" class="req-link">Auxillary Requirements</span><span id="parts" class="req-link">Part Requirements</span><span id="safety" class="req-link">Safety Requirements</span></span>';
    retStr += "</section>";
    return retStr;
}

function convertAuxillaryRequirements(auxReq) {
    let retStr = '<section class="hide entry aux-req"><ol>';
    if(auxReq.length == 0)
        retStr += "<li>There are no auxillary requirements listed for this repair job</li></ol>";
    else {
        auxReq.forEach(element => {
            retStr+="<li>" + element + "</li>";
        })
        retStr += "</ol>";
    }
    retStr += '<span class="req-link" id="aux-add">Want to add one?</span>';
    return retStr + "</section>";
}

function convertPartRequirements(partReq) {
    let retStr = '<section class="hide entry part-req"><ol>';
    if(partReq.length == 0)
        retStr += "<li>There are no part requirements listed for this repair job</li></ol>";
    else {
        partReq.forEach(element => {
            retStr+="<li>" + element + "</li>";
        })
        retStr += "</ol>";
    }
    retStr += '<span class="req-link" id="part-add">Want to add one?</span>';
    return retStr + "</section>";
}

function convertSafetyRequirements(safetyReq) {
    let retStr = '<section class="hide entry safety-req"><ol>';
    if(safetyReq.length == 0)
        retStr += "<li>There are no safety requirements listed for this repair job</li></ol>";
    else {
        safetyReq.forEach(element => {
            retStr+="<li>" + element + "</li>";
        })
        retStr += "</ol>";
    }
    retStr += '<span class="req-link" id="safety-add">Want to add one?</span>';
    return retStr + "</section>";
}

function retrieveForumCookie() {
    let cookieStr = decodeURIComponent(document.cookie);
    let reqBody = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMISF_WEB_COOKIE"))
            reqBody = cookie.split('=')[1];
    })
    if(reqBody == undefined) {
        alert("Failed to load forum entries...")
        window.location.replace("index.html");
        return undefined;
    }
    try {
        return JSON.parse(reqBody);
    } catch (SyntaxError) {
        return undefined;
    }
}

async function init() {
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if(loginCookie == false) {
        ConstructRedirectCookie(false, "archiveresults.html");
        window.location.replace("login.html");
        alert("User was not logged in, redirecting");
        return;
    }
    retrieveForumPage(loginCookie);
    
}

window.addEventListener("load", init);