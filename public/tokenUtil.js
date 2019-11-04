async function IsUserAuthed() {
    let loginTokenObj;
    let loginTokenTest = IsUserLoggedIn();
    loginTokenTest.then(val=> {loginTokenObj=val});
    await loginTokenTest;
    if(loginTokenObj == false) {
        return false;
    }
    let cookieStr = decodeURIComponent(document.cookie);
    let loginCookie = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMIS_AUTH_COOKIE"))
        {
            loginCookie = cookie.split('=')[1];
        }
    })
    if(loginCookie == undefined) {
        return false;
    }
    let tokenObj
    try {
        tokenObj = JSON.parse(loginCookie);
        if(tokenObj.token==undefined) {
            return false;
        }
    } catch (SyntaxError) {
        return false;
    }
    let authState = {}; 
    let resp = AskServerForAuthStatus(tokenObj, loginTokenObj);
    
    resp.then(response => {
        if(response.status != 200)
        {
            authState.status = false;
            return;
        }
        authState.status = true;
    })
    await resp;
    if(authState.status == false){
        return Promise.resolve(false);
    }
    return Promise.resolve(tokenObj);
}

async function IsUserLoggedIn() {
    let tokenObj = RetrieveLoginCookie();
    if(tokenObj == undefined){
        return false;
    }
    let loginStatus = {};
    let resp = AskServerForLoginStatus(tokenObj);
    resp.then(response => {
        if(response.status == 200){
            loginStatus.status = true;
        } else {
            loginStatus.status = false;
        }
    })
    await resp;
    if(!loginStatus.status)
    {
        return Promise.resolve(false);
    }
    return Promise.resolve(tokenObj);
}

function AskServerForAuthStatus(authTokenObj, loginTokenObj, callback) {
    let requestObj = {};
    requestObj.AuthToken = authTokenObj.token;
    requestObj.LoginToken = loginTokenObj.token;
    requestObj.UserId = loginTokenObj.userId;
    let reqInit = {
        method: "PUT",
        body: JSON.stringify(requestObj)
    };
    return fetch("https://jcf-ai.com:16384/user/auth", reqInit);
}

function AskServerForLoginStatus(loginTokenObj) {
    let requestObj = {};
    requestObj.LoginToken = loginTokenObj.token;
    requestObj.UserId = loginTokenObj.userId;
    let reqInit = {
        method: "PUT",
        body: JSON.stringify(requestObj)
    };
    return fetch("https://jcf-ai.com:16384/user", reqInit);
}


function ConstructRedirectCookie(isAuth, url) {
    let cookieStr = undefined;
    let d = new Date();
    d.setTime(d.getTime() + (1000 * 60 * 30));
    if(isAuth){
        cookieStr = "OMIS_AUTH_REDIR={";
        cookieStr += '"url":"'+url+'"';
        cookieStr += "}"
    } else {
        cookieStr = "OMIS_LOGIN_REDIR={";
        cookieStr += '"url":"'+url+'"';
        cookieStr += "}"
    }
    document.cookie = cookieStr + ";expires="+d.toUTCString()+";path=/;";
}

function RetrieveRedirectCookie(isAuth){
    let cookieStr = decodeURIComponent(document.cookie);
    let loginCookie = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(isAuth && cookie.trim().startsWith("OMIS_AUTH_REDIR"))
        {
            loginCookie = cookie.split('=')[1];
        } else if (!isAuth && cookie.trim().startsWith("OMIS_LOGIN_REDIR")){
            loginCookie = cookie.split('=')[1];
        }
    })
    if(loginCookie == undefined)
    {
        return false;
    }
    let cookieObject;
    try {
        cookieObject = JSON.parse(loginCookie);
    } catch (SyntaxError){
        return false;
    }
    if(cookieObject.url == undefined)
    {
        return false;
    }
    return cookieObject;
}

function RetrieveLoginCookie() {
    let cookieStr = decodeURIComponent(document.cookie);
    let loginCookie = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMIS_LOG_COOKIE"))
        {
            loginCookie = cookie.split('=')[1];
        }
    })
    let tokenObj;
    try {
        tokenObj = JSON.parse(loginCookie);
        if(tokenObj.token==undefined) {
            return undefined;
        }
        if(tokenObj.accessLevel ==undefined) {
            return undefined;
        }
        if(tokenObj.userId==undefined) {
            return undefined;
        }
    } catch (SyntaxError) {
        return undefined;
    } 
    return tokenObj;
}

function VerifyLoginTokenResponseObject(loginTokenResponseObject){
    if(loginTokenResponseObject.accessLevel == undefined){
        return false;
    } else if(loginTokenResponseObject.token == undefined){
        return false;
    } else if (loginTokenResponseObject.userId == undefined){
        return false;
    }
    return true;
}

function ConstructLoginTokenCookie(loginTokenResponseObject){
    let d = new Date();
    d.setTime(d.getTime() + (3 * 1000 * 60 * 60));
    let cookieStr = "OMIS_LOG_COOKIE=" + JSON.stringify(loginTokenResponseObject);
    cookieStr += ";expires="+d.toUTCString()+';path=/;';
    document.cookie = cookieStr;
}

function ConstructAuthTokenCookie(authTokenObject){
    let d = new Date();
    d.setTime(d.getTime() + (3 * 1000 * 60 * 60));
    let cookieStr = "OMIS_AUTH_COOKIE=" + JSON.stringify(authTokenObject);
    cookieStr += ";expires="+d.toUTCString()+';path=/;';
    document.cookie = cookieStr;
}

function PerformLogout() {
    let cookieStr = decodeURIComponent(document.cookie);
    let d = new Date();
    d.setTime(d.getTime() - 1000);
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMIS_AUTH_COOKIE")) {
            document.cookie = "OMIS_AUTH_COOKIE={};expires="+d.toUTCString()+';path=/;'
        } else if (cookie.trim().startsWith("OMIS_LOG_COOKIE")) {
            document.cookie = "OMIS_LOG_COOKIE={};expires="+d.toUTCString()+';path=/;'
        }
    })
}