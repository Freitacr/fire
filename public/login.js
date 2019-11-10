function init(){
    let redirectToken = RetrieveRedirectCookie(false);
    let submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function(a) {performLoginAttempt(redirectToken)});
    let emailTextForm = document.getElementById("email-text-form");
    let passwordTextForm = document.getElementById("password-text-form");
    let overrideSubmit = function(e) {
        if(e.keyCode == 13){
            e.preventDefault();
            submitButton.click();
        }
    }
    emailTextForm.addEventListener("keydown", overrideSubmit);
    passwordTextForm.addEventListener("keydown", overrideSubmit);
}

function performLoginAttempt(redirectToken) {
    let emailTextForm = document.getElementById("email-text-form");
    let passwordTextForm = document.getElementById("password-text-form");
    
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            try{
                let loginToken = JSON.parse(this.response);
                if (!VerifyLoginTokenResponseObject(loginToken)){
                    alert("Login attempt failed: Server sent a response, but in an unexpected format");
                }
                ConstructLoginTokenCookie(loginToken);
                if(redirectToken == false){
                    window.location.replace("index.html");
                } else {
                    window.location.replace(redirectToken.url);
                }
            } catch (SyntaxError) {
                alert("Login attempt failed: Server sent a response, but in an unexpected format");
            }
        } else if (this.readyState == 4) {
            alert("Login attempt failed: " + this.response);
        }
    }
    let requestStrObj = {};
    requestStrObj.Email = emailTextForm.value;
    requestStrObj.Password = passwordTextForm.value;
    xhttp.open("PUT", "https://jcf-ai.com:16384/user");
    xhttp.send(JSON.stringify(requestStrObj));
}

window.addEventListener("load",init);