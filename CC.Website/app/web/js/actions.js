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
        document.getElementById("question").value = "";
        document.getElementById("answer").value = "";
        document.body.querySelector("#addTerm").disabled = true;
    }

    function stringIsNullOrWhiteSpace(string)
    {
        if (typeof string === 'undefined' || string == null) return true;
        return string.replace(/\s/g, '').length < 1;
    }

    function check() {
        var q = document.getElementById("question");
        var a = document.getElementById("answer");

        document.getElementById("addTerm").disabled = (stringIsNullOrWhiteSpace(q.value) || stringIsNullOrWhiteSpace(a.value)) ? true : false;
    }

    WinJS.UI.processAll().then(function () {
        var element = document.body;
        element.querySelector("#addTerm").addEventListener("click", addTerm, false);
        element.querySelector("#question").addEventListener("input", check, false);
        element.querySelector("#answer").addEventListener("input", check, false);
        element.querySelector("#addTerm").disabled = true;

        initializeTerms();
    });
})();