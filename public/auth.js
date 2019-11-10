async function init(){
    let redirectToken = RetrieveRedirectCookie(true);
    let loginTokenTest = IsUserLoggedIn();
    let loginToken;
    loginTokenTest.then(val => {loginToken=val});
    await loginTokenTest;
    if(loginToken == false){
        alert("User was not logged in, redirecting to login page");
        ConstructRedirectCookie(false, "auth.html");
        window.location.replace("login.html");
        return;
    }
    retrieveSecurityQuestion(loginToken);
    let submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function(a){performAuthenticationRequest(loginToken, redirectToken)});
    let answerForm = document.getElementById("answer-text-form");
    answerForm.addEventListener("keydown", function(e) {
        if(e.keyCode == 13) {
            e.preventDefault();
            submitButton.click();
        }
    })
}

function retrieveSecurityQuestion(loginToken){
    let requestStrObj = {};
    requestStrObj.LoginToken = loginToken.token;
    requestStrObj.UserId = loginToken.userId;
    let fetchInit = {
        method: "POST",
        body: JSON.stringify(requestStrObj)
    };
    fetch("https://jcf-ai.com:16384/user/auth", fetchInit).then(response => {
        if(response.status == 200) {
            try{
                let secQuestion = document.getElementById("security-question");
                response.text().then(val => {secQuestion.innerHTML = val});
            } catch (SyntaxError) {
                alert("Authentication attempt failed: Server sent a response, but in an unexpected format");
            }
        } else {
            alert("Login attempt failed: " + response.statusText);
        }
    })
}

function performAuthenticationRequest(loginToken, redirectToken) {
    let xhttp = new XMLHttpRequest();

    let secQuestion = document.getElementById("security-question");
    let answerForm = document.getElementById("answer-text-form");
    let requestStrObj = {};
    requestStrObj.LoginToken = loginToken.token;
    requestStrObj.UserId = loginToken.userId;
    requestStrObj.SecurityQuestion = secQuestion.innerHTML;
    requestStrObj.SecurityAnswer = answerForm.value;
    let fetchInit = {
        method: "PUT",
        body: JSON.stringify(requestStrObj)
    };
    fetch("https://jcf-ai.com:16384/user/auth", fetchInit).then(response => {
        if(response.status == 200) {
            response.text().then(val => {
                try {
                    let authTokenObj = JSON.parse(val);
                    ConstructAuthTokenCookie(authTokenObj);
                    if(redirectToken == false) {
                        window.location.replace("index.html");
                    } else {
                        window.location.replace(redirectToken.url);
                    }
                } catch(SyntaxError){
                    alert("Authentication attempt failed: Server sent a response, but in an unexpected format");
                }
            })
        } else {
            response.text().then(val => {alert("Authentication attempt failed: " + val)});
        }
    })
}

window.addEventListener("load",init);