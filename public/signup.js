function init(){
    let submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", function(a) {performSignupAttempt()});
    let emailTextForm = document.getElementById("email-text-form");
    let passwordTextForm = document.getElementById("password-text-form");
    let questionTextForm = document.getElementById("question-text-form");
    let answerTextForm = document.getElementById("answer-text-form");
    let overrideSubmit = function(e) {
        if(e.keyCode == 13){
            e.preventDefault();
            submitButton.click();
        }
    }
    emailTextForm.addEventListener("keydown", overrideSubmit);
    passwordTextForm.addEventListener("keydown", overrideSubmit);
    questionTextForm.addEventListener("keydown", overrideSubmit);
    answerTextForm.addEventListener("keydown", overrideSubmit);
}

function performSignupAttempt() {
    let emailTextForm = document.getElementById("email-text-form");
    let passwordTextForm = document.getElementById("password-text-form");
    let questionTextForm = document.getElementById("question-text-form");
    let answerTextForm = document.getElementById("answer-text-form");
    if(!verifyForms([emailTextForm, passwordTextForm, questionTextForm, answerTextForm])){
        alert("Not all forms were filled");
        return;
    }
    let requestStrObj = {};
    requestStrObj.Email = emailTextForm.value;
    requestStrObj.Password = passwordTextForm.value;
    requestStrObj.SecurityQuestion = questionTextForm.value;
    requestStrObj.SecurityAnswer = answerTextForm.value;

    let fetchInit = {
        method: "POST",
        body: JSON.stringify(requestStrObj)
    };
    fetch("https://jcf-ai.com:16384/user", fetchInit).then(response => {
        if(response.status == 200){
            window.location.replace("index.html");
        } else {
            response.text(val => {
                alert("sign up attempt failed: " + val);
            })
        }
    })
}

function verifyForms(forms) {
    ret = true;
    forms.forEach(form => {
        if(form.value == ""){
            form.style.borderStyle = "solid";
            form.style.borderColor = "#ff0000";
            form.style.borderWidth = "2px";
            ret = false;
        } else {
            form.style.borderStyle = "solid";
            form.style.borderColor = "#808080";
            form.style.borderWidth = "1px";
        }
    })
    return ret;
}

window.addEventListener("load",init);