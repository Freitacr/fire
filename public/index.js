let predictSection = undefined;
let predictBlurb = undefined;
let predictInfo = undefined;
let archiveSection = undefined;
let archiveBlurb = undefined;
let archiveInfo = undefined;
let forumSection = undefined;
let forumBlurb = undefined;
let forumInfo = undefined;
function Init() {
    predictSection = document.getElementsByClassName("predict-section")[0];
    predictBlurb = document.getElementsByClassName("predict-blurb")[0];
    predictInfo = document.getElementsByClassName("predict-info")[0];
    archiveSection = document.getElementsByClassName("archive-section")[0];
    archiveBlurb = document.getElementsByClassName("archive-blurb")[0];
    archiveInfo = document.getElementsByClassName("archive-info")[0];
    forumSection = document.getElementsByClassName("forum-section")[0];
    forumBlurb = document.getElementsByClassName("forum-blurb")[0];
    forumInfo = document.getElementsByClassName("forum-info")[0];
    window.onresize = OnResize;
    OnResize();
}

function OnResize() {
    if(predictSection.offsetWidth - (predictSection.offsetWidth * .995) <= 4) {
        predictSection.style.height = "600px";
        predictBlurb.style.width = predictSection.offsetWidth.toString() +"px";
        predictInfo.style.width = predictSection.offsetWidth.toString() +"px";
    }
    else {
        predictSection.style.height = "300px";
        predictBlurb.style.width = (predictSection.offsetWidth * .4975).toString() +"px";
        predictInfo.style.width = (predictSection.offsetWidth * .4975).toString() +"px";
    }

    if(archiveSection.offsetWidth - (archiveSection.offsetWidth * .995) <= 4) {
        archiveSection.style.height = "600px";
        archiveBlurb.style.width = archiveSection.offsetWidth.toString() +"px";
        archiveInfo.style.width = archiveSection.offsetWidth.toString() +"px";
    }
    else {
        archiveSection.style.height = "300px";
        archiveBlurb.style.width = (archiveSection.offsetWidth * .4975).toString() +"px";
        archiveInfo.style.width = (archiveSection.offsetWidth * .4975).toString() +"px";
    }

    if(forumSection.offsetWidth - (forumSection.offsetWidth * .995) <= 4) {
        forumSection.style.height = "600px";
        forumBlurb.style.width = forumSection.offsetWidth.toString() +"px";
        forumInfo.style.width = forumSection.offsetWidth.toString() +"px";
    }
    else {
        forumSection.style.height = "300px";
        forumBlurb.style.width = (forumSection.offsetWidth * .4975).toString() +"px";
        forumInfo.style.width = (forumSection.offsetWidth * .4975).toString() +"px";
    }
}

window.onload = Init;