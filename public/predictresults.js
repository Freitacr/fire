function retrieveResults() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            console.log("ready and waiting");
            let table = document.getElementById("table-main");
            table.innerHTML = this.responseText;
        } else if (this.readyState == 4) {
            alert("Query failed with status" + this.status);
        }
    }
    let cookieStr = decodeURIComponent(document.cookie);
    let reqBody = undefined;
    cookieStr.split(';').forEach(function(cookie) {
        if(cookie.trim().startsWith("OMISP_WEB_COOKIE"))
            reqBody = cookie.split('=')[1];
    })
    if(reqBody == undefined) {
        window.location.replace("newpquery.html");
    }
    else{
        xhttp.open("PUT", "https://jcf-ai.com:16384/query", true);
        xhttp.setRequestHeader("Accept", "text/html");
        xhttp.send(reqBody);
    }
}

function init() {
    window.addEventListener("resize", Resize);
    Resize();
    retrieveResults();
}

function Resize() {
    ResizeFooter();
}

function ResizeFooter() {
    let footer = document.getElementsByClassName("footer")[0];
    footer.style.left = "202px";
    let footerWidth = window.innerWidth - 397;
    footer.style.width = footerWidth.toString() + "px";
    let footerTop = window.innerHeight - footer.offsetHeight;
    footer.style.top = footerTop.toString() + "px";
}

window.onload=init;