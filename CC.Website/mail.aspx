<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="mail.aspx.cs" Inherits="CC.Website.SendMail"%>
<!DOCTYPE html>
<html lang="ru">
<head runat="server">
    <meta charset="utf-8">
    <meta name="application-name" content="Помощь | Crossword Creator">
    <meta name="author" content="Роман Гладких">
    <meta name="keywords" content="Crossword Creator,составление,заполнение,кроссворды,crossword,creator">
    <meta name="msapplication-square70x70logo" content="small.jpg">
    <meta name="msapplication-square150x150logo" content="medium.jpg">
    <meta name="msapplication-wide310x150logo" content="wide.png">
    <meta name="msapplication-TileColor" content="#0071C4">
    <meta name="viewport" content="width=device-width">
    <link type="text/css" rel="stylesheet" href="css/styles.css">
    <link type="text/css" rel="stylesheet" href="css/desktop.css" media="(min-width:1024px)">
    <link type="text/css" rel="prefetch" href="css/styles.css">
    <link rel="dns-prefetch" href="http://quillaur.azurewebsites.net/">
    <!--[if lt IE 9]>
        <link type="text/css" rel="stylesheet" href="css/ie8styles.css" media="screen">
        <script src="js/html5shiv.js"></script>
    <![endif]-->
    <title>Помощь | Crossword Creator</title>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
    <header>
        <div>
            <img id="logo" src="assets/svg/logo.svg" alt="Crossword Creator">
            <h1>Crossword Creator</h1>
            <nav>
                <ul id="menu">
                    <li><a href="index.html">Главная</a></li>
                    <li><a href="download.html">Загрузить</a></li>
                    <li><a href="help.html" class="selected">Помощь</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <article>
        <h2>Поддержка</h2>
        <p>Требуется помощь? Заполните форму ниже, и мы обязательно вам ответим!</p>
        <form id="rsvpform" runat="server">
            <p>
                <span>Адрес электронной почты</span>
                <asp:TextBox id="email" type="email" runat="server" required="true"
                    aria-required="true"></asp:TextBox>
            </p>
            <p>
                <span>Тема</span>
                <input id="subject" type="text" runat="server" required
                    aria-required="true">
            </p>
            <p>
            <p>
                <span>Текст письма</span>
                <textarea id="body" cols="50" rows="5" runat="server" required
                    aria-required="true"></textarea>
            </p>
            <asp:Button aria-required="true" CssClass="button" runat="server" Text="Отправить" OnClick="btn_Click"></asp:Button>
        </form>
    </article>
    <article>
        <h2>Мы в социальных сетях</h2>
        <a href="http://facebook.com/crosswordcreator" target="_blank"><img alt="Facebook" class="socialIcon" src="assets/svg/facebook.svg"></a>
        <a href="http://vk.com/crosswordcreator" target="_blank"><img alt="VK" class="socialIcon" src="assets/svg/vk.svg"></a>
    </article>
    <footer>
        <small>Copyright &copy; Роман Гладких и Олег Самойлов, 2016</small>
    </footer>
</body>
</html>