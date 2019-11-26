let queryResultsTableInitialHtml = undefined;

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i < sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence;
}

function retrieveArchiveCookie() {
    let cookieStr = decodeURIComponent(document.cookie);
    let reqBody = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMISA_WEB_COOKIE"))
            reqBody = cookie.split('=')[1];
    })
    return reqBody;
}

function retrieveQueryResults(loginCookie) {
    let table = document.getElementById("table-main");
    let uploadLink = document.getElementById("link");
    if(queryResultsTableInitialHtml == undefined) {
        queryResultsTableInitialHtml = table.innerHTML;
    } else {
        table.innerHTML = queryResultsTableInitialHtml;
    }
    table.style.display = "table";
    uploadLink.style.display = "block";
    let reqBody = retrieveArchiveCookie();
    if(reqBody == undefined) {
        window.location.replace("newaquery.html");
        return;
    }
    let bodyObj = JSON.parse(reqBody);

    let reqObj = {
        Entry: {},
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token,
        CompanyId: parseInt(bodyObj.companyId)
    };
    if(bodyObj.make != undefined)
        reqObj.Entry.Make = bodyObj.make.toLowerCase();
    if(bodyObj.model != undefined)
        reqObj.Entry.Model = bodyObj.model.toLowerCase();
    if(bodyObj.problem != undefined)
        reqObj.Entry.Problem= bodyObj.problem.toLowerCase();
    if(bodyObj.complaint != undefined)
        reqObj.Entry.Complaint= bodyObj.complaint.toLowerCase();
    if(bodyObj.year != undefined)
        reqObj.Entry.Year = bodyObj.year; 
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/archive", fetchInit).then(response=>{
        if(response.status == 200) {
            response.text().then(value=>{
                let respJson = JSON.parse(value);
                respJson.forEach(queryObject => {
                    let objStr = convertSimilarQueryObject(queryObject);
                    table.innerHTML += objStr;
                })
                table.addEventListener("click", handleTableClick);
            })
        } else {
            response.text().then(value =>{
                alert("Error occurred during retrieval of queries from complaint group: " + value);
            })
        }
    })
}

function convertSimilarQueryObject(queryObject) {
    let retStr = '<tr class="clickme">';
    retStr += ('<td id="%">' + titleCase(queryObject.Make) + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + titleCase(queryObject.Model) + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + queryObject.Year + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + queryObject.Complaint + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + queryObject.Problem + "</td></tr>").replace('%', queryObject.Id.toString());
    return retStr;
}

function constructForumCookie(id){
    let d = new Date();
    d.setTime(d.getTime() + (7 * 1000 * 60 * 60 * 24));
    let archiveCookie = JSON.parse(retrieveArchiveCookie());
    let cookieStr = 'OMISF_WEB_COOKIE={"id":'+id+',"companyId":'+parseInt(archiveCookie.companyId)+'}';
    document.cookie = cookieStr + ";expires="+d.toUTCString()+";path=/;";
}

function handleTableClick(e) {
    let id = e.target.id;
    if(id == "" || id == "table-main")
        return;
    constructForumCookie(id);
    window.location.href = "queryforum.html";
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
    retrieveQueryResults(loginCookie);
}

window.onload=init;