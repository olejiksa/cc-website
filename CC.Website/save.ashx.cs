using System;
using System.Collections;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;

namespace ServerSide
{
    public class DataInOut
    {
        public int Id { get; set; }
        public string Data1 { get; set; }
        public string Data2 { get; set; }
    }

    public class Handler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            System.IO.StreamReader reader = new System.IO.StreamReader(context.Request.InputStream);
            string requestFromPost = reader.ReadToEnd();

            if (!File.Exists(HttpContext.Current.Server.MapPath("list.cwtf")))
                File.Create(HttpContext.Current.Server.MapPath("list.cwtf"));

            using (StreamWriter sw = new StreamWriter(HttpContext.Current.Server.MapPath("list.cwtf"), true))
            {
                sw.WriteLine(requestFromPost);
            }
        }

        public bool IsReusable { get { return true; } }
    }
}