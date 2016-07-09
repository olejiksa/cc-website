$(document).ready((function () {
    "use strict";

    var data = {
        item: null,
        itemIndex: -1
    };

    var itemsList = new WinJS.Binding.List([]);
    var q = $("#question")[0];
    var a = $("#answer")[0];

    // Проверяет поля текущего термина на пустоту.
    function check() {
        if (stringIsNullOrWhiteSpace(q.value) || stringIsNullOrWhiteSpace(a.value))
            $("#addTerm").attr("disabled", true)
        else
            $("#addTerm").attr("disabled", false)

        if (data.itemIndex !== -1) {
            var arrayItem = {
                title: q.value,
                text: a.value.toLowerCase()
            }
            itemsList.splice(data.itemIndex, 1, arrayItem);
        }
    }

    // Инициализирует данные.
    function initialize() {
        $("#file-name").html("Безымянный список");

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();

        $("#addTerm").attr("disabled", true);
        $("#new").attr("disabled", true);
        $("#save").attr("disabled", true);

        q.value = a.value = "";
    }

    // Добавляет термин в коллекцию из формы.
    function addNewTerm() {
        var term = {
            title: q.value.trim(),
            text: a.value.toLowerCase().trim()
        };

        itemsList.push(term);
        q.value = a.value = "";

        allAdd();
    }

    // Добавляет термин в коллекцию, используя готовые параметры.
    function addTerm(answer, question) {
        var term = {
            title: question.trim(),
            text: answer.trim()
        };

        itemsList.push(term);

        allAdd();
    }

    // Общая функция для функций добавления.
    function allAdd() {
        $("#addTerm").attr("disabled", true);
        $("#new").attr("disabled", false);
        $("#save").attr("disabled", false);

        data.itemIndex = -1;
    }

    // Сохраняет файл списка.
    function save() {
        var list = document.getElementById("listView").winControl.itemDataSource.list;
        var j = 1;

        var xml = '<?xml version="1.0" encoding="utf-8"?>';
        xml += "<head>";
        for (var i = 0; i < itemsList.length; i++) {
            xml += "<word><ID>" + j.toString() + "</ID><answer>" + list.getAt(i).text + "</answer><question>" + list.getAt(i).title + "</question></word>";
            j++;
        }
        xml += "</head>";

        var fileName = prompt("Введите название сохраняемого файла.", "List");
        if (fileName !== null) {
            download(xml, fileName + ".cwtf", "text/plain");
            $("#file-name").html(escape(fileName + ".cwtf"));
        }
    }

    // Открывает файл.
    function open() {
        $("#input-b").click();
    }

    // Читает файл, полученный из диалога открытия. 
    function change(e) {
        q.value = a.value = "";

        var file = e.target.files[0];
        if (!file)
            return;
        else if (file.name.split('.').pop() !== "cwtf") {
            alert("Файл с данным расширением не поддерживается. Обратите внимание, что с редактором списков совместимы только *.cwtf-файлы.");
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            parse(contents);
        };

        reader.readAsText(file);
        $("#file-name").html(escape(file.name.split('.')[0]));
        document.getElementById("input-b").value = '';
    }

    // Преобразует XML-коллекцию в её JavaScript-эквивалент. 
    function parse(xml) {
        itemsList.length = 0;
        var xmlDoc = $.parseXML(xml);
        var $xml = $(xmlDoc);

        $xml.find('word').each(function () {
            var id = $(this).find("ID").text();
            var answer = $(this).find("answer").text();
            var question = $(this).find("question").text();

            addTerm(answer, question);
        });
    }

    // Передает данные в поля формы для редактирования.
    function itemClick(eventInfo) {
        data.item = itemsList.getAt(eventInfo.detail.itemIndex);
        data.itemIndex = eventInfo.detail.itemIndex;

        q.value = data.item.title;
        a.value = data.item.text;

        if (!stringIsNullOrWhiteSpace(q.value) && !stringIsNullOrWhiteSpace(a.value))
            $("#addTerm").attr("disabled", false);
    }

    // Удаляет выбранный элемент.
    function remove() {
        itemsList.splice(data.itemIndex, 1);
        data.itemIndex = -1;

        q.value = a.value = '';
        $("#addTerm").attr("disabled", true);

        if (itemsList.length === 0) {
            $("#new").attr("disabled", true);
            $("#save").attr("disabled", true);
        }
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        $("#addTerm").click(addNewTerm);
        listView.addEventListener("iteminvoked", itemClick);
        q.addEventListener("input", check, false);
        a.addEventListener("input", check, false);

        $("#new").click(initialize);
        $("#save").click(save);
        
        document.body.querySelector("#input-b").addEventListener("change", change, false);
        document.body.querySelector("#input-a").addEventListener("click", open, false);
        document.body.querySelector("#input-b").addEventListener("click", open, false);

        $("#delete").click(remove);

        listView.oncontextmenu = function (event) {
            event = event || window.event;
            event.preventDefault ? event.preventDefault() : event.returnValue = false;

            if (data.itemIndex !== -1) {
                var anchor = listView;
                var menu = document.getElementById("menu1").winControl;
                menu.alignment = "center";
                menu.show(anchor, "autovertical");
            }
        };

        initialize();
    });
})());