(function () {
    "use strict";

    var itemsList = {};
    var q = document.getElementById("question");
    var a = document.getElementById("answer");

    function stringIsNullOrWhiteSpace(string) {
        if (typeof string === 'undefined' || string == null) return true;
        return string.replace(/\s/g, '').length < 1;
    }

    function check() {
        document.getElementById("addTerm").disabled = (stringIsNullOrWhiteSpace(q.value) || stringIsNullOrWhiteSpace(a.value)) ? true : false;
    }

    function initializeTerms() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        document.body.querySelector("#new").disabled = document.body.querySelector("#save").disabled = true;

        var NewScript = document.createElement('script');
        NewScript.src = "js/fileSaver.js";
        document.body.appendChild(NewScript);
    }

    // Добавляет термин в коллекцию из формы.
    function addTerm() {
        var term = {
            title: document.getElementById("question").value,
            text: document.getElementById("answer").value.toLowerCase()
        };

        itemsList.push(term);
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";

        document.body.querySelector("#addTerm").disabled = true;
        document.body.querySelector("#new").disabled = document.body.querySelector("#save").disabled = false;
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question,
            text: answer
        };

        itemsList.push(term);

        document.body.querySelector("#addTerm").disabled = true;
        document.body.querySelector("#new").disabled = document.body.querySelector("#save").disabled = false;
    }

    // Сохраняет файл, скоро будет DEPRECATED.
    function save() {
        saveTextAs("Hello, world!", "list.cwtf");
    }

    // Открывает файл.
    function open() {
        document.body.querySelector("#input-b").click();
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
    }

    // Преобразует XML-коллекцию в её JavaScript-эквивалент. 
    function parse(xml) {
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
        var element = document.body;
        element.querySelector("#addTerm").addEventListener("click", addTerm, false);
        element.querySelector("#question").addEventListener("input", check, false);
        element.querySelector("#answer").addEventListener("input", check, false);

        element.querySelector("#new").addEventListener("click", initializeTerms, false);
        element.querySelector("#save").addEventListener("click", save, false);
        
        element.querySelector("#input-b").addEventListener("change", change, false);
        element.querySelector("#input-a").addEventListener("click", open, false);
        element.querySelector("#input-b").addEventListener("click", open, false);

        initializeTerms();
    });
})();