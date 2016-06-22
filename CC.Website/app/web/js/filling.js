(function () {
    "use strict";

    // Объявление некоторых данных.
    var element = document.body;
    var item, itemIndex, itemsList, g, index;
    var svg, svgNS, a;

    index = 0;

    // Инициализация данных.
    function initialize() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        // Создание SVG.
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("style", "border: 1px solid #A9A9A9");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", 480);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        element.querySelector("#svg-internal-div").appendChild(svg);

        // For to be ready.
        svgNS = svg.namespaceURI;
    }

    // Открывает файл сетки.
    function openList() {
        element.querySelector("#input-listFake").click();
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question,
            text: answer
        };

        itemsList.push(term);
    }

    // Читает файл списка, полученный из диалога открытия.
    function changeList(e) {
        var file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseList(contents);
        };
        reader.readAsText(file);
    }

    // Преобразует XML-данные списка в её JavaScript-эквивалент. 
    function parseList(xml) {
        itemsList.length = 0;
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);

        $xml.find("word").each(function () {
            var id = $(this).find("ID").text();
            var answer = $(this).find("answer").text();
            var question = $(this).find("question").text();

            addTerm(answer, question);
        });
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-listFake").addEventListener("change", changeList, false);
        element.querySelector("#input-list").addEventListener("click", openList, false);
        element.querySelector("#input-listFake").addEventListener("click", openList, false);

        element.querySelector("#check").disabled = true;

        initialize();
    });
})();