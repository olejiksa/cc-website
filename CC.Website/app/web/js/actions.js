(function () {

    var item, itemIndex;
    itemIndex = -1;

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

        if (itemIndex !== -1)
        {
            var arrayItem = {
                title: q.value,
                text: a.value.toLowerCase()
            }
            itemsList.splice(itemIndex, 1, arrayItem);
        }
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

        q.value = a.value = "";
    }

    // Добавляет термин в коллекцию из формы.
    function addNewTerm() {
        var term = {
            title: q.value,
            text: a.value.toLowerCase()
        };

        itemsList.push(term);
        q.value = a.value = "";

        element.querySelector("#addTerm").disabled = true;
        element.querySelector("#new").disabled = document.body.querySelector("#save").disabled = false;

        itemIndex = -1;
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

        itemIndex = -1;
    }

    // Сохраняет файл.
    function save() {
        $.ajax({
            type: "POST",
            cache: false,   //параметр запрета кэширования нужно установить
            async: true,
            url: "/save.ashx", //Handler(папка)/MyHandler.ashx(файл)
            contentType: "text/xml; charset=utf-8",
            dataType: "xml",
            data: itemsList.toString, //Данные, передаваемые на серверную сторону
            responseType: "text",
            success: function (data) //
            {
                //Отображаем принятые данные
                window.location = '../../list.cwtf';
            },
            error: function () //
            {
                alert("Status Error");
            }
        });
    }

    // Открывает файл.
    function open() {
        element.querySelector("#input-b").click();
    }

    // Читает файл, полученный из диалога открытия. 
    function change(e) {
        q.value = a.value = "";

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

    // Передает данные в поля формы для редактирования.
    function itemClick(eventInfo) {
        item = itemsList.getAt(eventInfo.detail.itemIndex);
        itemIndex = eventInfo.detail.itemIndex;

        q.value = item.title;
        a.value = item.text;

        if (!stringIsNullOrWhiteSpace(q.value) && !stringIsNullOrWhiteSpace(a.value))
            element.querySelector("#addTerm").disabled = false;
    }

    WinJS.UI.processAll().then(function () {
        element.querySelector("#addTerm").addEventListener("click", addNewTerm, false);
        listView.addEventListener("iteminvoked", itemClick);
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