var array = [
    { type: "item", title: "Главная страница", picture: "assets/1.png" },
    { type: "item", title: "Персонализация", picture: "assets/2.jpg" },
    { type: "item", title: "Заполнение", picture: "assets/3.jpg" },
    { type: "item", title: "Редактор списков", picture: "assets/4.jpg" },
    { type: "item", title: "Справочная система", picture: "assets/5.jpg" }
];
var bindingList = new WinJS.Binding.List(array);

WinJS.Namespace.define("DefaultData", {
    bindingList: bindingList,
    array: array
});
WinJS.UI.processAll();