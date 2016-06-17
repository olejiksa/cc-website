using System;
using System.Collections;
using System.IO;
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
        private DataInOut GetData(int Id)
        {
            var datainout = new DataInOut();
            datainout.Id = Id;

            datainout.Data1 = "Dat_aa";
            datainout.Data2 = "Dat_bb";
            return datainout;
        }
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

            DataInOut dio = GetData(Convert.ToInt32((ht["Id"]).ToString()));       
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            string serdio = javaScriptSerializer.Serialize(dio);
            context.Response.ContentType = "text/html";
            context.Response.Write(serdio);
        }

        public bool IsReusable { get { return true; } }
    }
}