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

            char[] c1 = new char[] { '&' }; char[] c2 = new char[] { '=' };
            Hashtable ht = new Hashtable(); string[] buf = null;
            string[] parms = requestFromPost.Split(c1, StringSplitOptions.RemoveEmptyEntries);
            foreach (string s in parms)
            {
                buf = s.Split(c2); if (buf.Length < 2) { continue; }
                if (!ht.ContainsKey(buf[0])) ht.Add(buf[0], buf[1]);
            }

            if (!File.Exists(HttpContext.Current.Server.MapPath("list.log")))
                File.Create(HttpContext.Current.Server.MapPath("list.log"));

            using (StreamWriter sw = new StreamWriter(HttpContext.Current.Server.MapPath("list.log"), true))
            {
                sw.WriteLine("logString");
            }
        }

        public bool IsReusable { get { return true; } }
    }
}