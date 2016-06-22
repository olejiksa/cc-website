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

    // Открывает файл.
    function open() {
        element.querySelector("#input-fake").click();
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question,
            text: answer
        };

        itemsList.push(term);
    }

    // Читает файл, полученный из диалога открытия.
    function change(e) {
        $("svg").empty();
        var file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parse(contents);
        };
        reader.readAsText(file);
    }

    // Преобразует XML-данные в JavaScript-эквивалент. 
    function parse(xml) {
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

            addTerm(answer, question);
            createWord(x, y, orientation, answer, question);
        });
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

                if (i == rectArray["lines_count"])
                    break;
            }
            else if (rectArray["width"] < rectArray["height"]) {
                lineArray["x1"] = rectArray["x"];
                lineArray["x2"] = lineArray["x1"] + 25;
                lineArray["y1"] = lineArray["y2"] = rectArray["y"] + 25 * (i + 1);

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

    // Обрабатывает обычный клик на блоке со словом.
    function click(e) {
        for (var i = 0; i < index; i++) {
            var b = svg.getElementById(i).firstChild;
            b.setAttribute("stroke-width", 1);
        }

        a = e.target.parentNode;
        var a1 = svg.getElementById(a.id).childNodes[0];
        a1.setAttribute("stroke-width", 3);

        document.getElementById("listView").winControl.selection.set(Number(e.target.parentNode.id));
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-fake").addEventListener("change", change, false);
        element.querySelector("#input").addEventListener("click", open, false);
        element.querySelector("#input-fake").addEventListener("click", open, false);

        element.querySelector("#check").disabled = true;

        initialize();
    });
})();