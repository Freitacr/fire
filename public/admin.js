async function init(){
    let authCookie;
    await IsUserAuthed().then(val => {authCookie = val});
    if(authCookie == false)
    {
        ConstructRedirectCookie(true, "admin.html")
        window.location.replace("auth.html");
        alert("User was not authenticated, redirecting");
    }
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if((loginCookie.accessLevel & 8) == 0){
        alert("Must be an administrator to use this page");
        window.location.replace("index.html");
        return;
    }
    retrieveCompanyUsers(authCookie, loginCookie);
    retrieveTestingAccuracy(loginCookie);
    retrieveJoinRequests(authCookie, loginCookie);
    retrieveCompanySettings(authCookie, loginCookie);
}

function retrieveCompanyUsers(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/users", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let labelsTable = document.getElementById("user-labels");
                    for(let i = 0; i < respObj.length; i++){
                        convertCompanyUserObject(respObj[i], labelsTable);
                    }
                    labelsTable.addEventListener("change", function(e) {performUserAccessUpdate(authCookie, loginCookie, e)})
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Company User retrieval failed: " + val);
            })
        }
    })
}

let accLevelFormStr = '<form><select name="access-levels" id="%id%">';
accLevelFormStr += '<option value="1">Mechanic</option>';
accLevelFormStr += '<option value="3">Safety User</option>';
accLevelFormStr += '<option value="5">Parts User</option>';
accLevelFormStr += '<option value="7">Requirements Manager</option>';
accLevelFormStr += '<option value="9">Administrative User</option>';
accLevelFormStr += '<option value="11">Safety Administrator</option>';
accLevelFormStr += '<option value="13">Parts Administrator</option>';
accLevelFormStr += '<option value="15">Full Administrator</option>';
accLevelFormStr += '</input></select>';

function convertCompanyUserObject(companyUser, labelTable) {
    let retStr = "<tr>";
    retStr += "<td>" + companyUser.Email + "</td>";
    retStr += "<td>" + companyUser["Display Name"] + "</td>";
    let reqRet = convertAccessLevel(companyUser);
    let idStr = "acc-lev-"+companyUser.DatabaseId;
    let formStr = accLevelFormStr.replace(">"+reqRet, " selected>"+reqRet)
    formStr = formStr.replace("%id%", idStr);
    retStr += "<td>" + formStr + "</td>";
    retStr += "</tr>";
    labelTable.innerHTML += retStr;
}

function convertAccessLevel(companyUser) {
    let valStr;
    switch(companyUser["Access Level"]) {
        case 1:
            valStr = "Mechanic";
            break;
        case 3:
            valStr = "Safety User";
            break;
        case 5:
            valStr = "Parts User";
            break;
        case 7:
            valStr = "Requirements Manager";
            break;
        case 9:
            valStr = "Administrative User";
            break;
        case 11:
            valStr = "Safety Administrator";
            break;
        case 13:
            valStr = "Parts Administrator";
            break;
        case 15:
            valStr = "Full Administrator";
            break;
        default:
            return "Unknown Access Level";
    }
    return valStr;
}

function performUserAccessUpdate(authCookie, loginCookie, event) {
    let reqStrObj = {};
    reqStrObj.CompanyUserId = parseInt(event.target.id.split('-')[2]);
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.AccessLevel = parseInt(event.target.options[event.target.selectedIndex].value);
    let fetchInit = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/users", fetchInit).then(response=>{
        if(response.status == 200){
            window.location.replace("admin.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "admin.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        } else {
            response.text().then(val=>{alert("Access Level update failed: "+ val)});
        }
    });
}

function retrieveTestingAccuracy(loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/accuracy", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                let table = document.getElementById("test-results");
                table.innerHTML += '<tr><td>'+val+'</td></tr>';
            })
        } else {
            response.text().then(val => {
                alert("Company User retrieval failed: " + val);
            })
        }
    })
}

function retrieveCompanySettings(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/settings", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let settingsTable = document.getElementById("settings-table");
                    for(let i = 0; i < respObj.length; i++){
                        convertSettingEntryObject(respObj[i], settingsTable);
                    }
                    settingsTable.addEventListener("change", function(e) {performSettingsChangeRequest(e, authCookie, loginCookie)});
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Company User retrieval failed: " + val);
            })
        }
    })
}

function convertSettingEntryObject(setting, settingsTable) {
    let retStr = "<tr>";
    retStr += "<td>" + setting.SettingKey + "</td>";
    retStr += "<td>" + constructSettingEntrySelection(setting) + "</td>";
    settingsTable.innerHTML += retStr;
}

function constructSettingEntrySelection(setting) {
    let id = setting.SettingKey;
    let currValue = setting.SettingValue;
    let options = setting.Options;
    let retStr = '<form><select id="setting-'+id+'" name="settings">';
    options.forEach(val=> {
        if(val == currValue){
            retStr += '<option value="%" selected>'.replace("%", val) + val + '</option>';
        } else {
            retStr += '<option value="%">'.replace("%", val) + val + '</option>';
        }
    })
    return retStr;
}

function performSettingsChangeRequest(e, authCookie, loginCookie) {
    let selectObj = e.target;
    let reqObj = {};
    reqObj.SettingsKey = selectObj.id.split('-')[1]; 
    reqObj.SettingsValue = event.target.options[event.target.selectedIndex].value; 
    reqObj.UserId = loginCookie.userId;
    reqObj.AuthToken = authCookie.token;
    reqObj.LoginToken = loginCookie.token;
    let fetchInit = {
        method: "PATCH",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/company/settings", fetchInit).then(response=>{
        if(response.status == 200){
            window.location.replace("admin.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "admin.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        } else {
            response.text().then(val=>{alert("Settings update failed: "+ val)});
        }
    });
}

function retrieveJoinRequests(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/company/requests", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let requestsTable = document.getElementById("join-requests");
                    for(let i = 0; i < respObj.length; i++){
                        let reqRet = convertJoinRequestObject(respObj[i]);
                        requestsTable.innerHTML += reqRet;
                    }
                    requestsTable.addEventListener("click", function(e) {handleJoinRequestButtonClick(e, authCookie, loginCookie)});
                } catch(SyntaxError){
                    
                }
            })
        } else {
            response.text().then(val => {
                alert("Company User retrieval failed: " + val);
            })
        }
    })
}

function convertJoinRequestObject(req) {
    let acceptButtonStr = 'ac-but-'+req.Id;
    let denyButtonStr = 'deny-but-'+req.Id;
    let retStr = "<tr>";
    retStr += "<td>" + req.Email + "</td>";
    retStr += "<td>" + req.DisplayName + "</td>";
    retStr += '<td><form><input type="button" value="Accept" id="'+acceptButtonStr+'"></form></td>';
    retStr += '<td><form><input type="button" value="Deny" id="'+denyButtonStr+'"></form></td>';
    return retStr;
}

function handleJoinRequestButtonClick(e, authCookie, loginCookie) {
    let button = e.target;
    if(button.id == "" || button.id == 'join-requests'){
        return;
    }
    if(button.id.startsWith("ac")){
        performJoinRequestAcceptance(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    } else {
        performJoinRequestDenial(parseInt(button.id.split('-')[2]), authCookie, loginCookie);
    }
}

function performJoinRequestDenial(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/requests", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("admin.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "admin.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

function performJoinRequestAcceptance(reqId, authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.RequestId = reqId;
    let requestObj = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/requests", requestObj).then(response => {
        if(response.status == 200) {
            window.location.replace("admin.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "admin.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        }
    })
}

window.addEventListener("load", init);