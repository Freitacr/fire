let companyTableInitialHtml = undefined;
async function init() {
    let authTokenTest = IsUserAuthed();
    let authToken;
    authTokenTest.then(val=> {authToken=val});
    await authTokenTest;
    if(authToken == false){
        alert("User was not authenticated, redirecting to authentication page");
        ConstructRedirectCookie(true, "joinrequest.html");
        window.location.replace("auth.html");
    }
    let loginTokenTest = IsUserLoggedIn();
    let loginToken;
    loginTokenTest.then(val => {loginToken = val});
    let footer = document.getElementsByClassName("footer")[0];
    footer.style.marginTop = "508px";
    let searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", function() {retrieveCompanies(loginToken, authToken)})
}

function retrieveCompanies(loginToken, authToken) {
    let companyForm = document.getElementById("company-results");
    let companyTable = document.getElementById("company-results-table");
    if(companyTableInitialHtml == undefined){
        companyTableInitialHtml = companyTable.innerHTML;
    }
    else {
        companyTable.innerHTML = companyTableInitialHtml;
    }
    let reqStrObj = {
    }
    reqStrObj.LoginToken=loginToken.token,
    reqStrObj.UserId= loginToken.userId
    reqStrObj.NamePortion = companyForm.value;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/list", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val=> {
            try{
                let respObj = JSON.parse(val);
                for(let i = 0; i < respObj.length; i++){
                    let reqRet = convertCompanyObject(respObj[i]);
                    companyTable.innerHTML += reqRet;
                }
                companyTable.addEventListener("click", function(e) {handleButtonClick(e, loginToken, authToken)});
                let companyTableDiv = document.getElementsByClassName("company-results")[0];
                companyTableDiv.style.display="block";
                let footer = document.getElementsByClassName("footer")[0];
                footer.style.marginTop = "10px";
            } catch (SyntaxError) {

            }
        })
        } else if(response.status == 401) {
            alert("User login expired, redirecting to login page");
            ConstructRedirectCookie(false, "joinrequest.html");
            window.location.replace("login.html");
        } else {
            response.text().then(val => {
                alert("Company retrieval failed with error: " + val);
            })
        }
    });

}

function convertCompanyObject(companyObj) {
    let retStr = "<tr>";
    retStr += "<td>"+companyObj.LegalName+"</td>";
    retStr += '<td><form><input type="button" value="Join" id="comp-'+companyObj.Id+'"></form></td>';
    retStr += "</tr>"
    return retStr;
}

function handleButtonClick(e, loginCookie, authCookie) {
    let button = e.target;
    if(button.id == "" || button.id == "company-results-table")
    {
        return;
    }
    let companyId = parseInt(button.id.split('-')[1]);
    performJoinRequest(companyId, loginCookie, authCookie);
}

function performJoinRequest(companyId, loginCookie, authCookie) {
    let reqStrObj = {}
    reqStrObj.UserId = loginCookie.userId;
    reqStrObj.LoginToken = loginCookie.token;
    reqStrObj.AuthToken = authCookie.token;
    reqStrObj.CompanyId = companyId;
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(reqStrObj)
    }
    fetch("https://jcf-ai.com:16384/company/requests", fetchInit).then(response => {
        if(response.status == 200) {
            alert("Request Successful, redirecting to account page");
            window.location.replace("account.html");
        } else if (response.status == 401) {
            ConstructRedirectCookie(true, "joinrequest.html");
            window.location.replace("auth.html");
            alert("User authentication expired, redirecting");
        } else {
            response.text().then(val => {
                alert("Join request creation failed with error: " + val);
            })
        }
    })
}

window.addEventListener("load", init);