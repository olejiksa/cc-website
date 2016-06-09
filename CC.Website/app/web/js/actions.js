var itemArray = [
    { title: "Самое глубокое озеро в мире", text: "байкал" },
    { title: "Самая большая пустыня в мире", text: "сахара" },
    { title: "Вторая от Солнца планета", text: "венера" }
];

var items = [];

itemArray.forEach(function (item) {
    items.push(item);
});

WinJS.Namespace.define("Sample.ListView", {
    data: new WinJS.Binding.List(items)
});
WinJS.UI.processAll();