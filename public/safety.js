async function init(){
    let authCookie;
    await IsUserAuthed().then(val => {authCookie = val});
    if(authCookie == false)
    {
        ConstructRedirectCookie(true, "safety.html")
        window.location.replace("auth.html");
        alert("User was not authenticated, redirecting");
    }
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if((loginCookie.accessLevel & 4) == 0){
        alert("Must be a safety administrator to use this page");
        window.location.replace("index.html");
        return;
    }
    retrieveSafetyRequests(authCookie, loginCookie);
}

function retrieveSafetyRequests(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/safety/request", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let requestsTable = document.getElementById("safety-requests");
                    for(let i = 0; i < respObj.length; i++){
                        let reqRet = convertSafetyRequestObject(respObj[i]);
                        requestsTable.innerHTML += reqRet;
                    }
                    requestsTable.addEventListener("click", function(e) {handleSafetyRequestButtonClick(e, authCookie, loginCookie)});
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Safetry Addition Request retrieval failed: " + val);
            })
        }
    })
}

function convertSafetyRequestObject(req) {
    let acceptButtonStr = 'ac-but-'+req.Id;
    let denyButtonStr = 'deny-but-'+req.Id;
    let retStr = "<tr>";
    retStr += "<td>" + req.JobId + "</td>";
    retStr += "<td>" + req.DisplayName + "</td>";
    retStr += "<td>" + req.RequestedAdditions + "</td>";
    retStr += '<td><form><input type="button" value="Accept" id="'+acceptButtonStr+'"></form></td>';
    retStr += '<td><form><input type="button" value="Deny" id="'+denyButtonStr+'"></form></td>';
    return retStr;
}

function handleSafetyRequestButtonClick(e, authCookie, loginCookie) {
    let button = e.target;
    if(button.id == "" || button.id == 'safety-requests'){
        return;
    }
    if(button.id.startsWith("ac")){
        performSafetyRequestAcceptance(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    } else {
        performSafetyRequestDenial(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    }
}

function performSafetyRequestDenial(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/safety/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("safety.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "safety.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

function performSafetyRequestAcceptance(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/safety/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("safety.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "safety.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

window.addEventListener("load", init);