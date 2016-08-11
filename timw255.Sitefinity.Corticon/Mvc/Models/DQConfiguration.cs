using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace timw255.Sitefinity.Corticon.Mvc.Models
{
    public class DQConfiguration
    {
        public string CorticonServiceEndpoint { get; set; }

        public string CorticonServiceName { get; set; }

        public string CorticonServiceMajorVersion { get; set; }

        public string CorticonServiceMinorVersion { get; set; }

        public string ContentIdentifier { get; set; }

        public string ContentSourceEndpoint { get; set; }

        public string ApplyOnlineUrl { get; set; }
    }
}
