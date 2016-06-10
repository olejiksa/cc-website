(function () {
    "use strict";

    var itemsList = {};

    function initializeTerms() {
        var items = [];
        itemsList = new WinJS.Binding.List(items);

        var list = document.getElementById("listView").winControl;
        list.itemDataSource = itemsList.dataSource;
        list.itemTemplate = document.querySelector(".smallListIconTextTemplate");
        list.forceLayout();
    }

    function addTerm() {
        var term = {
            title: document.getElementById("question").value,
            text: document.getElementById("answer").value
        };
        itemsList.push(term);
    }

    WinJS.UI.processAll().then(function () {
        var element = document.body;
        element.querySelector("#addTerm").addEventListener("click", addTerm, false);

        initializeTerms();
    });
})();