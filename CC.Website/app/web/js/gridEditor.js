(function () {
    "use strict";

    var element = document.body;

    var item, itemIndex, itemsList;

    function initializeTerms() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        element.querySelector("#save").disabled = true;
    }

    // Открывает файл.
    function open() {
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

    // Читает файл, полученный из диалога открытия. 
    function change(e) {
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

    // Преобразует XML-коллекцию в её JavaScript-эквивалент. 
    function parse(xml) {
        itemsList.length = 0;
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);

        $xml.find('word').each(function () {
            var id = $(this).find('ID').text();
            var answer = $(this).find("answer").text();
            var question = $(this).find("question").text();

            addTerm(answer, question);
        });
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-listFake").addEventListener("change", change, false);
        element.querySelector("#input-list").addEventListener("click", open, false);
        element.querySelector("#input-listFake").addEventListener("click", open, false);

        initializeTerms();
    });
})();