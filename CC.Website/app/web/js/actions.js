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

    function save() {
        saveTextAs("Hello, world!", "list.cwtf");
    }

    function open() {
        document.body.querySelector("#input-b").click();
    }

    function displayContents(contents) {
        alert(contents);
    }

    function change(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var contents = e.target.result;
            displayContents(contents);
        };
        reader.readAsText(file);
    }

    WinJS.UI.processAll().then(function () {
        var element = document.body;
        element.querySelector("#addTerm").addEventListener("click", addTerm, false);
        element.querySelector("#question").addEventListener("input", check, false);
        element.querySelector("#answer").addEventListener("input", check, false);

        element.querySelector("#new").addEventListener("click", initializeTerms, false);
        element.querySelector("#save").addEventListener("click", save, false);

        element.querySelector("#input-a").addEventListener("click", open, false);
        element.querySelector("#input-b").addEventListener("click", open, false);
        element.querySelector("#input-a").addEventListener("change", change, false);
        element.querySelector("#input-b").addEventListener("click", change, false);

        initializeTerms();
    });
})();