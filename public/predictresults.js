let queryResultsTableInitialHtml = undefined;

function retrieveComplaintGroupResults(loginCookie) {
    let cookieStr = decodeURIComponent(document.cookie);
    let reqBody = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMISP_WEB_COOKIE"))
            reqBody = cookie.split('=')[1];
    })
    if(reqBody == undefined) {
        window.location.replace("newpquery.html");
        return;
    }
    let bodyObj = JSON.parse(reqBody);

    let reqObj = {
        Entry: {
            Make: bodyObj.make.toLowerCase(),
            Model: bodyObj.model.toLowerCase(),
            Complaint: bodyObj.complaint.toLowerCase()
        },
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token,
        CompanyId: parseInt(bodyObj.companyId)
    };

    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/predict", fetchInit).then(response=> {
        if(response.status == 200) {
            response.text().then(value=> {
                let complaintGroupTable = document.getElementById('complaint-group-table');
                let respJson = JSON.parse(value);
                respJson.forEach(complaintGroupJson => {
                    complaintGroupTable.innerHTML += convertComplaintGroup(complaintGroupJson);
                });
                complaintGroupTable.addEventListener("click", function(e) { handleComplaintGroupTableClick(e, loginCookie)});
                let resultTable = document.getElementById("table-main");
                resultTable.addEventListener("click", function(e) {handleTableClick(e)});
            })
        } else {
            response.text().then(value =>{
                alert("Error occurred during retrieval of complaint groups: " + value);
            })
        }
    })
}

function handleComplaintGroupTableClick(e, loginCookie){
    let id = e.target.id;
    if(id == "" || id == "complaint-group-table")
        return;
    let complaintGroupId = parseInt(id);
    retrieveQueryResults(loginCookie, complaintGroupId);
}

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ");
    for(var i = 0; i < sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence;
}

function convertComplaintGroup(complaintGroupJson) {
    retStr = '<tr><td class="cgroup" id="%">';
    retStr += titleCase(complaintGroupJson.GroupDefinition);
    retStr += '</td></tr>';
    retStr = retStr.replace('%', complaintGroupJson.Id.toString())
    return retStr;
}

function retrievePredictionCookie() {
    let cookieStr = decodeURIComponent(document.cookie);
    let reqBody = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMISP_WEB_COOKIE"))
            reqBody = cookie.split('=')[1];
    })
    return reqBody;
}

function retrieveQueryResults(loginCookie, complaintGroupId) {
    let table = document.getElementById("table-main");
    let uploadLink = document.getElementById("link");
    if(queryResultsTableInitialHtml == undefined) {
        queryResultsTableInitialHtml = table.innerHTML;
    } else {
        table.innerHTML = queryResultsTableInitialHtml;
    }
    table.style.display = "table";
    uploadLink.style.display = "block";
    let reqBody = retrievePredictionCookie();
    if(reqBody == undefined) {
        window.location.replace("newpquery.html");
        return;
    }
    let bodyObj = JSON.parse(reqBody);

    let reqObj = {
        Entry: {
            Make: bodyObj.make.toLowerCase(),
            Model: bodyObj.model.toLowerCase(),
            Complaint: bodyObj.complaint.toLowerCase()
        },
        UserId: loginCookie.userId,
        LoginToken: loginCookie.token,
        CompanyId: parseInt(bodyObj.companyId),
        ComplaintGroupId: complaintGroupId
    };
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(reqObj)
    };
    fetch("https://jcf-ai.com:16384/predict", fetchInit).then(response=>{
        if(response.status == 200) {
            response.text().then(value=>{
                let respJson = JSON.parse(value);
                respJson.forEach(queryObject => {
                    let objStr = convertSimilarQueryObject(queryObject);
                    table.innerHTML += objStr;
                })
            })
        } else {
            response.text().then(value =>{
                alert("Error occurred during retrieval of queries from complaint group: " + value);
            })
        }
    })
}

function constructForumCookie(id){
    let d = new Date();
    d.setTime(d.getTime() + (7 * 1000 * 60 * 60 * 24));
    let archiveCookie = JSON.parse(retrievePredictionCookie());
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

function convertSimilarQueryObject(queryObject) {
    let retStr = '<tr class="clickme">';
    retStr += ('<td id="%">' + titleCase(queryObject.Make) + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + titleCase(queryObject.Model) + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + queryObject.Year + "</td>").replace('%', queryObject.Id.toString());
    retStr += ('<td id="%">' + queryObject.Problem + "</td>").replace('%', queryObject.Id.toString());
    let similarity = 100-queryObject.Difference + "%";
    retStr += ('<td id="%">' + similarity + "</td></tr>").replace('%', queryObject.Id.toString());
    return retStr;
}

async function init() {
    let loginCookie;
    await IsUserLoggedIn().then(val => {loginCookie = val});
    if(loginCookie == false) {
        ConstructRedirectCookie(false, "predictresults.html");
        window.location.replace("login.html");
        alert("User was not logged in, redirecting");
        return;
    }
    retrieveComplaintGroupResults(loginCookie);
}

window.onload=init;