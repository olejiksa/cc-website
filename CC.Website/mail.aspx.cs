using System;
using System.Net;
using System.Net.Mail;
using System.Web.UI;

namespace CC.Website
{
    public partial class SendMail : Page
    {
        protected void Btn_SendMail_Click(object sender, EventArgs e)
        {
            MailMessage o = new MailMessage("quillaur@outlook.com", "quillaur@outlook.com", "Subject", "Body");
            NetworkCredential netCred = new NetworkCredential("quillaur@outlook.com", "Yb0kHw81x%2@6{0{");
            SmtpClient smtpobj = new SmtpClient("smtp-mail.live.com", 587);
            smtpobj.EnableSsl = true;
            smtpobj.Credentials = netCred;
            smtpobj.Send(o);
        }
    }
}