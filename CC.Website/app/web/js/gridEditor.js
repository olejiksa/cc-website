(function () {
    "use strict";

    var element = document.body;

    var item, itemIndex;
    itemIndex = -1;

    function initializeTerms() {
        var items = [];
        var itemsList = new WinJS.Binding.List(items);

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

    // Читает файл, полученный из диалога открытия. 
    function change(e) {
        q.value = a.value = "";

        var file = e.target.files[0];
        if (!file)
            return;
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parse(contents);
        };
        reader.readAsText(file);
        element.querySelector("#file-name").innerHTML = escape(file.name);
    }

    // Запускает процесс страницы веб-приложения.
    WinJS.UI.processAll().then(function () {
        element.querySelector("#input-listFake").addEventListener("change", change, false);
        element.querySelector("#input-list").addEventListener("click", open, false);
        element.querySelector("#input-listFake").addEventListener("click", open, false);

        initializeTerms();
    });
})();