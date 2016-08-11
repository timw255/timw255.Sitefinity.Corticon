using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Telerik.Sitefinity.Frontend.Mvc.Helpers;
using Telerik.Sitefinity.Mvc;
using Telerik.Sitefinity.Services;
using timw255.Sitefinity.Corticon.Mvc.Models;

namespace timw255.Sitefinity.Corticon.Mvc.Controllers
{
    [ControllerToolboxItem(Name = "DynamicQuestionnaireWidget", Title = "Dynamic Questionnaire", SectionName = "Corticon")]
    public class DynamicQuestionnaireController : Controller
    {
        public string ContentSourceEndpoint { get; set; }

        public string ContentIdentifier { get; set; }

        public string ContentTemplate { get; set; }

        public string CorticonServiceEndpoint { get; set; }

        public string CorticonServiceName { get; set; }

        public string CorticonServiceMajorVersion { get; set; }

        public string CorticonServiceMinorVersion { get; set; }

        public Guid ApplyOnlinePageId { get; set; }

        public ActionResult Index()
        {
            if (SystemManager.IsDesignMode || SystemManager.IsPreviewMode)
            {
                return View("DesignMode");
            }

            var model = new DynamicQuestionnaireModel();

            var config = new DQConfiguration();

            config.CorticonServiceEndpoint = CorticonServiceEndpoint;
            config.CorticonServiceName = CorticonServiceName;
            config.CorticonServiceMajorVersion = CorticonServiceMajorVersion;
            config.CorticonServiceMinorVersion = CorticonServiceMinorVersion;

            config.ContentIdentifier = ContentIdentifier;
            config.ContentSourceEndpoint = ContentSourceEndpoint;

            config.ApplyOnlineUrl = HyperLinkHelpers.GetFullPageUrl(ApplyOnlinePageId);

            model.DQConfiguration = JsonConvert.SerializeObject(config);
            model.ContentTemplate = ContentTemplate;

            return View("Default", model);
        }
    }
}
