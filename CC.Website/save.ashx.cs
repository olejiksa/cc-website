using System.IO;
using System.Web;

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
            StreamReader reader = new StreamReader(context.Request.InputStream);
            string requestFromPost = reader.ReadToEnd();

            if (!File.Exists(HttpContext.Current.Server.MapPath("list.cwtf")))
            {
                File.CreateText(HttpContext.Current.Server.MapPath("list.cwtf"));
                File.WriteAllText(HttpContext.Current.Server.MapPath("list.cwtf"), requestFromPost);
            }
            else
            {
                File.Delete(HttpContext.Current.Server.MapPath("list.cwtf"));
                File.WriteAllText(HttpContext.Current.Server.MapPath("list.cwtf"), requestFromPost);
            }
        }

        public bool IsReusable { get { return true; } }
    }
}