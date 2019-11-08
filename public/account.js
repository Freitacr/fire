async function init(){
    let authCookie;
    await IsUserAuthed().then(val => {authCookie = val});
    if(authCookie == false)
    {
        ConstructRedirectCookie(true, "account.html")
        window.location.replace("auth.html");
        alert("User was not authenticated, redirecting");
		return;
    }
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
        if(loginCookie == false)
    {
        ConstructRedirectCookie(true, "account.html")
        window.location.replace("login.html");
        alert("User was not logged in, redirecting");
		return;
    }
	retrieveAccountSettings(authCookie,loginCookie);
}

function retrieveAccountSettings(authCookie, loginCookie) {
    let reqStrObj = {};
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.UserId = loginCookie.userId;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/user/settings", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let respObj = JSON.parse(val);
                    let labelsTable = document.getElementById("settings");
                    for(let i = 0; i < respObj.length; i++){
                        convertUserSettingsObject(respObj[i], labelsTable);
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

function convertUserSettingsObject(AccountSettings, labelTable) {
    console.log(AccountSettings);
	let retStr = "<tr>";
	retStr += "<td>" + AccountSettings.Key + "</td>";
    retStr += "<td><input type=\"text\" id=\""+AccountSettings.Key+"\"value=\"" + AccountSettings.Value + "\"></input></td>";
    retStr += "</tr>";
    labelTable.innerHTML += retStr;
}

function performSettingsUpdate(authCookie, loginCookie, event) {
    let reqStrObj = {};
	console.log(event.target);
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
	reqStrObj.Key=event.target.id;
	reqStrObj.Value = event.target.value;
	console.log(JSON.stringify(reqStrObj));
    let fetchInit = {
        method: "PATCH",
        body: JSON.stringify(reqStrObj)
    };
    fetch("https://jcf-ai.com:16384/user/settings", fetchInit).then(response=>{
        if(response.status == 200){
            window.location.replace("account.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "account.html")
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        } else {
            response.text().then(val=>{alert("Settings update failed: "+ val)});
        }
    });
}
window.addEventListener("load", init);