(function () {
    "use strict";

    // Объявление некоторых данных.
    var element = document.body;
    var item, itemsList, g, index;
    var svg, svgNS, a;
    index = 0;

    // Инициализация данных.
    function initialize() {
        itemsList = new WinJS.Binding.List([]);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        // Создание SVG.
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("style", "border: 1px solid #A9A9A9");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", 528);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        element.querySelector("#svg-internal-div").appendChild(svg);
        svgNS = svg.namespaceURI;

        disable(true);
    }

    // Управляет свойством disabled у элементов управления блоком слова в сетке.
    function disable(bool) {
        element.querySelector("#up").disabled =
        element.querySelector("#right").disabled =
        element.querySelector("#down").disabled =
        element.querySelector("#left").disabled =
        element.querySelector("#rotate").disabled =
        element.querySelector("#delete").disabled =
            bool;
    }

    // Создает сетку слова.
    function createWord(x, y, orientation, answer, question) {
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
                    left();
                    break;
                case 38:
                    up();
                    break;
                case 39:
                    right();
                    break;
                case 40:
                    down();
                    break;
                case 46:
                    remove();
                    break;
                case 32:
                    doubleclick();
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
        rect.setAttribute("answer", answer);
        rect.setAttribute("question", question);
        rect.setAttribute("orientation", orientation);
        g.appendChild(rect);

        var title = document.createElementNS(svgNS, "title");
        var titleText = document.createTextNode(question);
        title.appendChild(titleText);
        g.appendChild(title);

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

                if (i === rectArray["lines_count"])
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

                if (i === rectArray["lines_count"])
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

    // Обрабатывает обычный клик на блоке со словом.
    function click(e) {
        for (var i = 0; i < index; i++) {
            var b = svg.getElementById(i).childNodes[0];
            b.setAttribute("stroke-width", 1);
        }

        disable(false);

        var a1 = svg.getElementById(e.target.parentNode.id).childNodes[0];
        a1.setAttribute("stroke-width", 3);

        a = e.target.parentNode;
    }

    // Обрабатывает двойной клик на блоке со словом.
    function doubleclick() {
        var a1 = svg.getElementById(a.id);
        var b1 = a1.childNodes[0];
        
        if (b1.getAttribute("orientation") === "Horizontal")
            b1.setAttribute("orientation", "Vertical");
        else
            b1.setAttribute("orientation", "Horizontal");

        svg.removeChild(a1);
        index--;
        
        var j = 0;
        for (var i in svg.childNodes) {
            var b = svg.childNodes[i];
            if (i !== "length" && i !== "item") {
                b["id"] = j;
                b["stroke-width"] = 1;
                j++;
            }
        }

        createWord(Number(b1.getAttribute("x")),
            Number(b1.getAttribute("y")),
            b1.getAttribute("orientation"), b1.getAttribute("answer"), b1.getAttribute("question"));

        var a2 = svg.getElementById(index - 1).childNodes[0];
        a2.setAttribute("stroke-width", 3);
        a = svg.getElementById(index - 1);
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
        createWord(x, y, orientation, answer, question);
    }

    // Читает файл списка, полученный из диалога открытия.
    function changeList(e) {
        var file = e.target.files[0];
        if (!file)
            return;
        else if (file.name.split('.').pop() !== "cwtf") {
            alert("Файл с данным расширением не поддерживается. Обратите внимание, что файлами списка являются только файлы с расширением *.cwtf.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseList(contents);
        };
        reader.readAsText(file);
        document.getElementById("input-listFake").value = '';
    }

    // Читает файл сетки, полученный из диалога открытия. 
    function changeGrid(e) {
        disable(true);
        $("svg").empty();
        index = 0;
        var file = e.target.files[0];
        if (!file)
            return;
        else if (file.name.split('.').pop() !== "cwgf") {
            alert("Файл с данным расширением не поддерживается. Обратите внимание, что файлами сетки являются только файлы с расширением *.cwgf.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseGrid(contents);
        };
        reader.readAsText(file);
        document.getElementById("input-gridFake").value = '';
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

    // Сохраняет файл сетки. 
    function saveGrid(xml) {
        var answers = {};
        var questions = {};
        var orientations = {};
        var x = {};
        var y = {};

        for (var i in svg.childNodes) {
            answers[i] = questions[i] = orientations[i] = x[i] = y[i] = '';
            var b = svg.childNodes[i];

            if (i !== "length" && i !== "item" && i !== "keys" && i !== "values" && i !== "entries" && i !== "forEach") {
                answers[i] += b.firstChild.attributes["answer"].nodeValue;
                questions[i] += b.firstChild.attributes["question"].nodeValue;
                orientations[i] += b.firstChild.attributes["orientation"].nodeValue;

                if (orientations[i] == "Horizontal") {
                    x[i] += Number(b.firstChild.getAttribute("x")) - 25;
                    y[i] += Number(b.firstChild.getAttribute("y")) + 25;
                }
                else {
                    x[i] += b.firstChild.getAttribute("x");
                    y[i] += b.firstChild.getAttribute("y");
                }
            }
        }

        var xml = '<?xml version="1.0" encoding="utf-8"?>';
        xml += "<head>";
        var j = 0;
        for (var i in svg.childNodes) {
            if (i !== "length" && i !== "item" && i !== "keys" && i !== "values" && i !== "entries" && i !== "forEach") {
                xml += "<gridWord><ID>" + j.toString() + "</ID><X>" + x[j]
                    + "</X><Y>" + y[j] + "</Y><orientation>" + orientations[j]
                    + "</orientation><answer>" + answers[j] + "</answer><question>" + questions[j] + "</question></gridWord>";
                j++;
            }
        }
        xml += "</head>";

        var fileName = prompt("Введите название сохраняемого файла.", "Grid");
        if (fileName !== null) {
            download(xml, fileName + ".cwgf", "text/plain");
            element.querySelector("#file-name").innerHTML = escape(fileName + ".cwgf");
        }

        download(xml, "grid.cwgf", "text/plain");
    }

    // Передает данные в поля формы для редактирования.
    function itemClick(eventInfo) {
        item = itemsList.getAt(eventInfo.detail.itemIndex);
        element.querySelector("#add").disabled = false;
    }

    // Передает элемент из списка в сетку.
    function add() {
        createWord(0, 50, "Horizontal", item.text, item.title);
    }

    function up() {
        for (var i = 0; i < a.childNodes.length; i++) {
            a.childNodes[i].setAttribute("y", Number(a.childNodes[i].getAttribute("y")) - 25);
            a.childNodes[i].setAttribute("y1", Number(a.childNodes[i].getAttribute("y1")) - 25);
            a.childNodes[i].setAttribute("y2", Number(a.childNodes[i].getAttribute("y2")) - 25);
        }
    }

    function right() {
        for (var i = 0; i < a.childNodes.length; i++) {
            a.childNodes[i].setAttribute("x", 25 + Number(a.childNodes[i].getAttribute("x")));
            a.childNodes[i].setAttribute("x1", 25 + Number(a.childNodes[i].getAttribute("x1")));
            a.childNodes[i].setAttribute("x2", 25 + Number(a.childNodes[i].getAttribute("x2")));
        }
    }

    function down() {
        for (var i = 0; i < a.childNodes.length; i++) {
            a.childNodes[i].setAttribute("y", 25 + Number(a.childNodes[i].getAttribute("y")));
            a.childNodes[i].setAttribute("y1", 25 + Number(a.childNodes[i].getAttribute("y1")));
            a.childNodes[i].setAttribute("y2", 25 + Number(a.childNodes[i].getAttribute("y2")));
        }
    }

    function left() {
        for (var i = 0; i < a.childNodes.length; i++) {
            a.childNodes[i].setAttribute("x", Number(a.childNodes[i].getAttribute("x")) - 25);
            a.childNodes[i].setAttribute("x1", Number(a.childNodes[i].getAttribute("x1")) - 25);
            a.childNodes[i].setAttribute("x2", Number(a.childNodes[i].getAttribute("x2")) - 25);
        }
    }

    function remove() {
        svg.removeChild(a);
        disable(true);
        index--;
        var j = 0;
        for (var i in svg.childNodes) {
            var b = svg.childNodes[i];
            if (i !== "length" && i !== "item") {
                b["id"] = j;
                j++;
            }
        }
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
        element.querySelector("#add").disabled = true;
        element.querySelector("#add").addEventListener("click", add, false);

        element.querySelector("#save").addEventListener("click", saveGrid, false);

        element.querySelector("#up").addEventListener("click", up, false);
        element.querySelector("#down").addEventListener("click", down, false);
        element.querySelector("#left").addEventListener("click", left, false);
        element.querySelector("#right").addEventListener("click", right, false);
        element.querySelector("#rotate").addEventListener("click", doubleclick, false);
        element.querySelector("#delete").addEventListener("click", remove, false);

        initialize();
    });
})();