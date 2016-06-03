document.getElementById("iframe").onload = function () {
    style.height = contentWindow.document.body.offsetHeight + "px";
}

function download() {
    document.location.href = "app/last_version/Crossword%20Creator%20Setup.zip";
}