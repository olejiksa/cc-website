using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace CC.Website
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        [System.Web.Services.WebMethod]
        public static string GetSome(string param1, string param2) //принимающий, обрабатывающий и отправляющий обратно данные метод
        {
            return "S= " + param1 + " " + param2 + " =S";
        }
    }
}