(function () {
    "use strict";

    // Объявление некоторых данных.
    var element = document.body;
    var item, itemIndex, itemsList, isMoving, g, index;
    var svg, svgNS, a;

    index = 0;

    // Инициализация данных.
    function initializeTerms() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        element.querySelector("#save").disabled = true;

        // Создание SVG.
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("style", "border: 1px solid #A9A9A9");
        svg.setAttribute("width", 528);
        svg.setAttribute("height", 528);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        element.querySelector("#secret-div").appendChild(svg);

        // For to be ready.
        svgNS = svg.namespaceURI;
    }

    // Создает сетку слова.
    function createWord(x, y, orientation, answer) {
        // Создание прямоугольника.
        var rectArray = { "x": x, "y": y, "width": 0, "height": 0, "lines_count": 0 };

        if (orientation == "Vertical") {
            rectArray["width"] = 25;
            rectArray["height"] = answer.length * 25;
        }
        else {
            rectArray["height"] = 25;
            rectArray["width"] = answer.length * 25;
            rectArray["x"] += 25;
            rectArray["y"] -= 25;
        }

        g = document.createElementNS(svgNS, "g");
        g.setAttribute("id", index++);
        svg.appendChild(g);

        g.addEventListener("click", click, false);
        document.onkeydown = function (evt) {
            evt = evt || window.event;

            switch (evt.keyCode) {
                case 37:
                    for (var i = 0; i < a.childNodes.length; i++) {
                        a.childNodes[i].setAttribute("x", Number(a.childNodes[i].getAttribute("x")) - 25);
                        a.childNodes[i].setAttribute("x1", Number(a.childNodes[i].getAttribute("x1")) - 25);
                        a.childNodes[i].setAttribute("x2", Number(a.childNodes[i].getAttribute("x2")) - 25);
                    }
                    break;
                case 38:
                    for (var i = 0; i < a.childNodes.length; i++) {
                        a.childNodes[i].setAttribute("y", Number(a.childNodes[i].getAttribute("y")) - 25);
                        a.childNodes[i].setAttribute("y1", Number(a.childNodes[i].getAttribute("y1")) - 25);
                        a.childNodes[i].setAttribute("y2", Number(a.childNodes[i].getAttribute("y2")) - 25);
                    }
                    break;
                case 39:
                    for (var i = 0; i < a.childNodes.length; i++) {
                        a.childNodes[i].setAttribute("x", 25 + Number(a.childNodes[i].getAttribute("x")));
                        a.childNodes[i].setAttribute("x1", 25 + Number(a.childNodes[i].getAttribute("x1")));
                        a.childNodes[i].setAttribute("x2", 25 + Number(a.childNodes[i].getAttribute("x2")));
                    }
                    break;
                case 40:
                    for (var i = 0; i < a.childNodes.length; i++) {
                        a.childNodes[i].setAttribute("y", 25 + Number(a.childNodes[i].getAttribute("y")));
                        a.childNodes[i].setAttribute("y1", 25 + Number(a.childNodes[i].getAttribute("y1")));
                        a.childNodes[i].setAttribute("y2", 25 + Number(a.childNodes[i].getAttribute("y2")));
                    }
                    break;
                case 46:
                    a.remove();
                    index--;
                    var j = 0;
                    for (var i in svg.childNodes) {
                        var b = svg.childNodes[i];
                        if (i !== "length" && i !== "item") {
                            b.setAttribute("id", j);
                            j++;
                        }
                    }
                    break;
            }
        };

        var rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", rectArray["x"]);
        rect.setAttribute("y", rectArray["y"]);
        rect.setAttribute("width", rectArray["width"]);
        rect.setAttribute("height", rectArray["height"]);
        rect.setAttribute("stroke", "#0071C4");
        rect.setAttribute("stroke-width", 1);
        rect.setAttribute("fill", "transparent");
        g.appendChild(rect);

        // Вычисление кол-ва требуемых линий.
        var length = Math.max(rectArray["width"], rectArray["height"]);
        while (length > 25) {
            length -= 25;
            rectArray["lines_count"]++;
        }

        // Создание линий внутри прямоугольника со словом.
        for (var i = 0; i <= rectArray["lines_count"]; i++) {
            var line = document.createElementNS(svgNS, "line");
            var lineArray = { "x1": 0, "x2": 0, "y1": 0, "y2": 0 };

            if (rectArray["width"] > rectArray["height"]) {
                lineArray["x1"] = lineArray["x2"] = rectArray["x"] + 25 * (i + 1);
                lineArray["y1"] = rectArray["y"];
                lineArray["y2"] = lineArray["y1"] + 25;
                
                var label = document.createElementNS(svgNS, "text");
                label.setAttribute("x", lineArray["x1"] - 25 / 1.5);
                label.setAttribute("y", lineArray["y2"] - 12.5 / 1.5);
                var letter = document.createTextNode(answer[i]);
                label.appendChild(letter);
                g.appendChild(label);

                if (i == rectArray["lines_count"])
                    break;
            }
            else if (rectArray["width"] < rectArray["height"]) {
                lineArray["x1"] = rectArray["x"];
                lineArray["x2"] = lineArray["x1"] + 25;
                lineArray["y1"] = lineArray["y2"] = rectArray["y"] + 25 * (i + 1);

                var label = document.createElementNS(svgNS, "text");
                label.setAttribute("x", lineArray["x1"] + 12.5 / 1.5);
                label.setAttribute("y", lineArray["y2"] - 12.5 / 1.5);
                var letter = document.createTextNode(answer[i]);
                label.appendChild(letter);
                g.appendChild(label);

                if (i == rectArray["lines_count"])
                    break;
            }

            line.setAttribute("x1", lineArray["x1"]);
            line.setAttribute("x2", lineArray["x2"]);
            line.setAttribute("y1", lineArray["y1"]);
            line.setAttribute("y2", lineArray["y2"]);
            line.setAttribute("stroke", "#0071C4");
            line.setAttribute("stroke-width", 1);
            g.appendChild(line);
        }
    }

    function click(e) {
        for (var i = 0; i < index; i++) {
            var b = svg.getElementById(i).childNodes[0];
            b.setAttribute("stroke-width", 1);
        }

        var a1 = svg.getElementById(e.target.parentNode.id).childNodes[0];
        a1.setAttribute("stroke-width", 3);

        a = e.target.parentNode;
    }

    // Открывает файл списка.
    function openList() {
        element.querySelector("#input-listFake").click();
    }

    // Открывает файл сетки.
    function openGrid() {
        element.querySelector("#input-gridFake").click();
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question,
            text: answer
        };

        itemsList.push(term);
    }

    // Добавляет элемент сетки, используя готовые параметры.
    function addElement(id, x, y, orientation, answer, question) {
        createWord(x, y, orientation, answer);
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

    // Читает файл сетки, полученный из диалога открытия. 
    function changeGrid(e) {
        $("svg").empty();
        index = 0;
        var file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseGrid(contents);
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

    // Преобразует XML-данные сетки в её JavaScript-эквивалент. 
    function parseGrid(xml) {
        itemsList.length = 0;
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);

        $xml.find("gridWord").each(function () {
            var id = Number($(this).find("ID").text());
            var x = Number($(this).find("X").text());
            var y = Number($(this).find("Y").text());
            var orientation = $(this).find("orientation").text();
            var answer = $(this).find("answer").text();
            var question = $(this).find("question").text();

            addElement(id, x, y, orientation, answer, question);
        });
    }

    // Передает данные в поля формы для редактирования.
    function itemClick(eventInfo) {
        item = itemsList.getAt(eventInfo.detail.itemIndex);
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-listFake").addEventListener("change", changeList, false);
        element.querySelector("#input-list").addEventListener("click", openList, false);
        element.querySelector("#input-listFake").addEventListener("click", openList, false);

        element.querySelector("#input-gridFake").addEventListener("change", changeGrid, false);
        element.querySelector("#input-grid").addEventListener("click", openGrid, false);
        element.querySelector("#input-gridFake").addEventListener("click", openGrid, false);

        listView.addEventListener("iteminvoked", itemClick);

        initializeTerms();
    });
})();