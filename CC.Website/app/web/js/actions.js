(function () {
    "use strict";

    var itemsList = {};
    var element = document.body;

    var q = element.querySelector("#question");
    var a = element.querySelector("#answer");

    function stringIsNullOrWhiteSpace(string) {
        if (typeof string === 'undefined' || string == null) return true;
        return string.replace(/\s/g, '').length < 1;
    }

    // Проверяет поля текущего термина на пустоту.
    function check() {
        element.querySelector("#addTerm").disabled = (stringIsNullOrWhiteSpace(q.value) || stringIsNullOrWhiteSpace(a.value)) ? true : false;
    }

    function initializeTerms() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        element.querySelector("#file-name").innerHTML = "Безымянный список";

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        element.querySelector("#new").disabled = element.querySelector("#save").disabled = true;
    }

    // Добавляет термин в коллекцию из формы.
    function addNewTerm() {
        var term = {
            title: q.value,
            text: a.value.toLowerCase()
        };

        itemsList.push(term);
        q.value = "";
        a.value = "";

        element.querySelector("#addTerm").disabled = true;
        element.querySelector("#new").disabled = document.body.querySelector("#save").disabled = false;
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question,
            text: answer
        };

        itemsList.push(term);

        element.querySelector("#addTerm").disabled = true;
        element.querySelector("#new").disabled = document.body.querySelector("#save").disabled = false;
    }

    // Сохраняет файл, скоро будет DEPRECATED.
    function save() {
        alert("Not yet implemented.");
    }

    // Открывает файл.
    function open() {
        element.querySelector("#input-b").click();
    }

    // Читает файл, полученный из диалога открытия. 
    function change(e) {
        var file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            parse(contents);
        };
        reader.readAsText(file);
        element.querySelector("#file-name").innerHTML = escape(file.name);
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

    WinJS.UI.processAll().then(function () {
        element.querySelector("#addTerm").addEventListener("click", addNewTerm, false);
        q.addEventListener("input", check, false);
        a.addEventListener("input", check, false);

        element.querySelector("#new").addEventListener("click", initializeTerms, false);
        element.querySelector("#save").addEventListener("click", save, false);
        
        element.querySelector("#input-b").addEventListener("change", change, false);
        element.querySelector("#input-a").addEventListener("click", open, false);
        element.querySelector("#input-b").addEventListener("click", open, false);

        initializeTerms();
    });
})();