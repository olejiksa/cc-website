if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    var small = document.querySelector('#warning');
    small.style.display = 'block';
    small.style.margin = '0px 0px 20px 0px';
}

var i = 0;

var data = [
    { title: 'Главная страница', picture: 'app/screenshots/1.png' },
    { title: 'Персонализация', picture: 'app/screenshots/2.jpg' },
    { title: 'Заполнение', picture: 'app/screenshots/3.jpg' },
    { title: 'Редактор списков', picture: 'app/screenshots/4.jpg' },
    { title: 'Справочная система', picture: 'app/screenshots/5.jpg' }
];

document.onload = navigate();

back.onclick = function () {
    if (i > 0 && i < data.length) {
        i--;
        navigate();
    }
}

forward.onclick = function () {
    if (i >= 0 && i < data.length - 1) {
        i++;
        navigate();
    }
}

function navigate() {
    var flipViewContent = document.querySelectorAll('.flip-view-content')[0];
    flipViewContent.innerHTML = '';
    var img = document.createElement('img');
    img.setAttribute('alt', data[i].title);
    img.setAttribute('src', data[i].picture);
    img.setAttribute('title', data[i].title);
    img.onclick = function () {
        document.location.href = data[i].picture;
    }
    flipViewContent.appendChild(img);
}