using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web.UI;

namespace CC.Website
{
    public partial class SendMail : Page
    {
        protected void btn_Click(object sender, EventArgs e)
        {
            string message;

            try
            {
                using (var client = new SmtpClient("smtp-mail.outlook.com")
                {
                    Port = 25,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    EnableSsl = true,
                    Credentials = new NetworkCredential("quillaur@outlook.com", "rhqrefunwikbfnfz")
                })
                {
                    using (var mail = new MailMessage(email.Text, "quillaur@outlook.com")
                    {
                        Subject = subject.Value,
                        Body = body.InnerText
                    })
                    {
                        client.Send(mail);
                    }
                }
                message = "Сообщение успешно отправлено.";
            }
            catch
            {
                message = "Не удалось отправить сообщение.";
            }

            StringBuilder sb = new StringBuilder();
            sb.Append("<script type = 'text/javascript'>");
            sb.Append("window.onload=function(){");
            sb.Append("alert('");
            sb.Append(message);
            sb.Append("')};");
            sb.Append("</script>");
            ClientScript.RegisterClientScriptBlock(GetType(), "alert", sb.ToString());
        }
    }
}