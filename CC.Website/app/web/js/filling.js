(function () {
    "use strict";

    // Объявление некоторых данных.
    var element = document.body;
    var itemIndex, itemsList, g, index;
    var svg, svgNS, a;
    var arrayList = [];
    index = 0;

    var fillData = {
        errorCount: 0,
        errorIndexes: []
    };

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
        $("#question").text("Вопрос");
        $("#answer").text('');
        index = 0;
        arrayList = [];
        $("svg").empty();
        // Отключение ряда элементов UI.
        $("#check").attr("disabled", true);
        $("#answer").attr("readOnly", true);

        var file = e.target.files[0];
        if (!file)
            return;
        else if (file.name.split('.').pop() !== "cwgf") {
            alert("Файл с данным расширением не поддерживается. Обратите внимание, что файлами сетки являются только файлы с расширением *.cwgf.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            parse(e.target.result);
        };
        reader.readAsText(file);
        document.getElementById("input-fake").value = '';
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

        if (orientation === "Vertical") {
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

        // Обрабатывает обычный клик на блоке со словом.
        g.onclick = function (e) {
            for (var i = 0; i < index; i++)
                svg.getElementById(i).firstChild.setAttribute("stroke-width", 1);

            a = e.target.parentNode;
            svg.getElementById(a.id).childNodes[0].setAttribute("stroke-width", 3);

            itemIndex = Number(e.target.parentNode.id);
            document.getElementById("listView").winControl.selection.set(itemIndex);

            checkAnswer(a.firstChild.getAttribute("answer"));
        }

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

                if (i === rectArray["lines_count"])
                    break;
            }
            else if (rectArray["width"] < rectArray["height"]) {
                lineArray["x1"] = rectArray["x"];
                lineArray["x2"] = lineArray["x1"] + 25;
                lineArray["y1"] = lineArray["y2"] = rectArray["y"] + 25 * (i + 1);

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

    // Передает данные в поля формы для редактирования.
    function itemClick(eventInfo) {
        element.querySelector("#answer").focus();
        itemIndex = eventInfo.detail.itemIndex;

        for (var i = 0; i < index; i++)
            svg.getElementById(i).firstChild.setAttribute("stroke-width", 1);

        a = svg.getElementById(itemIndex);
        svg.getElementById(itemIndex).childNodes[0].setAttribute("stroke-width", 3);

        checkAnswer(a.firstChild.getAttribute("answer"));
    }

    // Переводит фокус на поле ответа.
    function checkAnswer(answer) {
        if (stringIsNullOrWhiteSpace(arrayList[itemIndex])) {
            $(a).find("*").not("rect, g, line").remove();
            element.querySelector("#answer").value = '';
        }
        else
            element.querySelector("#answer").value = arrayList[itemIndex];

        $("#question").text(itemsList.getAt(itemIndex).title);
        element.querySelector("#answer").readOnly = false;
        element.querySelector("#answer").maxLength = answer.length;
        element.querySelector("#answer").focus();
    }

    // Осуществляет перенос слов побуквенно в блок в сетке (заполнение).
    function inputCheck() {
        element.querySelector("#check").disabled = false;
        var el = element.querySelector("#answer").value;

        if (el !== '')
            createLetter(svg.getElementById(itemIndex), el);
        else
            createLetter(svg.getElementById(itemIndex), '');
    }

    // Добавляет символ в блок слова в сетке.
    function createLetter(block, el) {
        $(block).find("*").not("rect, g, line").remove();

        for (var i in block.childNodes)
            if (a.childNodes[i].nodeType === 3)
                svg.removeChild(i);

        if (block.firstChild.getAttribute("orientation") === "Horizontal") {
            for (var i = 0; i < el.length; i++) {
                var label = document.createElementNS(svgNS, "text");
                label.setAttribute("x", Number(block.firstChild.getAttribute("x")) + 12.5 / 1.5 + 25 * i);
                label.setAttribute("y", Number(block.firstChild.getAttribute("y")) + 25 / 1.5);
                var letter = document.createTextNode(el[i].toLowerCase());
                label.appendChild(letter);
                block.appendChild(label);
            }
        }
        else {
            for (var i = 0; i < el.length; i++) {
                var label = document.createElementNS(svgNS, "text");
                label.setAttribute("x", Number(block.firstChild.getAttribute("x")) + 12.5 / 1.5);
                label.setAttribute("y", Number(block.firstChild.getAttribute("y")) + 25 / 1.5 + 25 * i);
                var letter = document.createTextNode(el[i].toLowerCase());
                label.appendChild(letter);
                block.appendChild(label);
            }
        }

        arrayList[itemIndex] = el.toLowerCase();
    }

    // Проверяет поле на пустоту.
    function stringIsNullOrWhiteSpace(string) {
        if (typeof string === "undefined" || string == null) return true;
        return string.replace(/\s/g, '').length < 1;
    }

    // Проверяет кроссворд на правильность заполнения.
    function checkFinal() {
        for (var i = 0; i < itemsList.length; i++) {
            if (itemsList.getAt(i).text === arrayList[i]) {
                if (i + 1 !== itemsList.length)
                    continue;
                else if (fillData.errorCount === 0)
                    alert("Замечательно! Вы заполнили кроссворд абсолютно верно!");
                else {
                    if (confirm("При заполнении кроссворда были допущены ошибки. Вы хотите увидеть их?")) {
                        for (var j = 0; j < index; j++)
                            svg.getElementById(j).firstChild.setAttribute("stroke-width", 1);

                        for (var z in fillData.errorIndexes)
                            svg.getElementById(fillData.errorIndexes[z]).firstChild.setAttribute("stroke-width", 3);
                    }
                    break;
                }
            }
            else {
                fillData.errorCount++;
                fillData.errorIndexes.push(i);
                if (i + 1 !== itemsList.length)
                    continue;
                else {
                    document.getElementById("listView").winControl.selection.clear();
                    for (var j = 0; j < index; j++)
                        svg.getElementById(j).firstChild.setAttribute("stroke-width", 1);

                    if (confirm("При заполнении кроссворда были допущены ошибки. Вы хотите увидеть их?")) {
                        for (var z in fillData.errorIndexes)
                            svg.getElementById(fillData.errorIndexes[z]).firstChild.setAttribute("stroke-width", 3);
                    }
                    break;
                }
            }
        }
        index = itemIndex = -1;
        fillData.errorCount = 0;
        fillData.errorIndexes = [];
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-fake").addEventListener("change", change, false);
        element.querySelector("#input").addEventListener("click", open, false);
        element.querySelector("#input-fake").addEventListener("click", open, false);
        element.querySelector("#answer").addEventListener("input", inputCheck, false);
        // Очистка поля ответа и отключение ряда элементов UI.
        $("#answer").attr("value", '');
        $("#check").attr("disabled", true);
        $("#answer").attr("readOnly", true);
        $("#check").click(checkFinal);

        listView.addEventListener("iteminvoked", itemClick);

        initialize();
    });
})();