// Проверяет строку на пустоту или пустые пробельные символы.
function stringIsNullOrWhiteSpace(string) {
    if (typeof string === "undefined" || string == null) return true;
    return string.replace(/\s/g, '').length < 1;
}