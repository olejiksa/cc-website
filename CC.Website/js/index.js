var isVisible;

ham.onclick = function () {
    if (!isVisible) {
        document.getElementById('header').style.height = '68px';
        isVisible = true;
    }
    else {
        document.getElementById('header').style.height = '100px';
        isVisible = false;
    }
}