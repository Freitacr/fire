async function init(){
    let authCookie;
    await IsUserAuthed().then(val => {authCookie = val});
    if(authCookie == false)
    {
        ConstructRedirectCookie(true, "parts.html")
        window.location.replace("auth.html");
        alert("User was not authenticated, redirecting");
		return;
    }
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if((loginCookie.accessLevel & 4) == 0){
        alert("Must be a parts personal to use this page");
        window.location.replace("index.html");
        return;
    }
	retrievePartsRequests(authCookie,loginCookie);
}

//Parts Ordering requests
function retrievePartsRequests(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.UserId = loginCookie.userId;
	reqStrObj.AuthToken=authCookie.token;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/parts/request", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let labelsTable = document.getElementById("parts-request");
                    for(let i = 0; i < respObj.length; i++){
                        convertPartsRequestObject(respObj[i], labelsTable);
                    }
					labelsTable.addEventListener("change", function(e) {performSettingsUpdate(authCookie, loginCookie, e)})
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Account settings retrieval failed: " + val);
            })
        }
    })
}

function convertPartsRequestObject(req) {
    let OrderedButtonStr = 'ord-but-'+req.Id;
    let denyButtonStr = 'deny-but-'+req.Id;
    let retStr = "<tr>";
    retStr += "<td>" + req.DisplayName + "</td>";
    retStr += "<td>" + req.ReferencedParts + "</td>";
	retStr += "<td>"+req.JobId+"</td>";
    retStr += '<td><form><input type="button" value="Accept" id="'+acceptButtonStr+'"></form></td>';
    retStr += '<td><form><input type="button" value="Deny" id="'+denyButtonStr+'"></form></td>';
    return retStr;
}

function handlePartsRequestButtonClick(e, authCookie, loginCookie) {
    let button = e.target;
    if(button.id == "" || button.id == 'Parts-Requests'){
        return;
    }
    if(button.id.startsWith("ord")){
        performPartsRequestAcceptance(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    } else {
        performPartsRequestDenial(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    }
}

function performPartsRequestAcceptance(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/parts/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("parts.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "parts.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

function performPartsRequestDenial(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/parts/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("parts.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "parts.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

//Parts list requests
function retrievePartsAddRequests(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.UserId = loginCookie.userId;
	reqStrObj.AuthToken=authCookie.token;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/partslists/request", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let labelsTable = document.getElementById("parts-add-request");
                    for(let i = 0; i < respObj.length; i++){
                        convertPartsAddRequestObject(respObj[i], labelsTable);
                    }
					labelsTable.addEventListener("change", function(e) {performSettingsUpdate(authCookie, loginCookie, e)})
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Account settings retrieval failed: " + val);
            })
        }
    })
}

function convertPartsAddRequestObject(req) {
    let OrderedButtonStr = 'ac-but-'+req.Id;
    let denyButtonStr = 'deny-but-'+req.Id;
    let retStr = "<tr>";
    retStr += "<td>" + req.DisplayName + "</td>";
    retStr += "<td>" + req.RequestedAdditions + "</td>";
	retStr += "<td>"+req.JobId+"</td>";
    retStr += '<td><form><input type="button" value="Accept" id="'+acceptButtonStr+'"></form></td>';
    retStr += '<td><form><input type="button" value="Deny" id="'+denyButtonStr+'"></form></td>';
    return retStr;
}

function handlePartsAddRequestButtonClick(e, authCookie, loginCookie) {
    let button = e.target;
    if(button.id == "" || button.id == 'Parts-Requests'){
        return;
    }
    if(button.id.startsWith("ac")){
        performPartsAddRequestAcceptance(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    } else {
        performPartsAddRequestDenial(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    }
}

function performPartsAddRequestAcceptance(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/partslists/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("parts.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "parts.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

function performPartsAddRequestDenial(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/partslists/request", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("parts.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "parts.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

//Parts List Display
function retrievePartsAddRequests(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.UserId = loginCookie.userId;
	reqStrObj.AuthToken=authCookie.token;
	reqStrObj.StartRange=0;
	requestObj.EndRange=1;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/parts", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let labelsTable = document.getElementById("parts-cat");
                    for(let i = 0; i < respObj.length; i++){
                        convertPartsObject(respObj[i], labelsTable);
                    }
					labelsTable.addEventListener("change", function(e) {performSettingsUpdate(authCookie, loginCookie, e)})
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Account settings retrieval failed: " + val);
            })
        }
    })
}

function convertPartsAddRequestObject(req) {
    let retStr = "<tr>";
    retStr += "<td>" + req.Year + "</td>"; 
    retStr += "<td>" + req.Make + "</td>";
    retStr += "<td>" + req.Model + "</td>";
	retStr += "<td>" + req.PartId + "</td>";
	retStr += "<td>"+req.PartName+"</td>";
    return retStr;
}






window.addEventListener("load", init);