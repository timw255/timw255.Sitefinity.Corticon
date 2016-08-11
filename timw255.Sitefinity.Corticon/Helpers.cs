using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Telerik.Sitefinity.Data.Metadata;
using Telerik.Sitefinity.DynamicModules.Builder;
using Telerik.Sitefinity.DynamicModules.Builder.Model;

namespace timw255.Sitefinity.Corticon
{
    public static class Helpers
    {
        //public static string SplitCamelCase(this string input)
        //{
        //    var inputWithSpaces = Regex.Replace(input, "([A-Z])", " $1", RegexOptions.Compiled).Trim();
        //    var capitalizeOnlyFirstLater = inputWithSpaces.First().ToString().ToUpper() + inputWithSpaces.Substring(1).ToLower();

        //    return capitalizeOnlyFirstLater;
        //}

        public static List<string> GetContentTypes()
        {
            List<string> names = new List<string>();
            var manager = ModuleBuilderManager.GetManager();

            var dynamicTypes = manager.GetItems(typeof(DynamicModuleType), "", "", 0, 0);
            foreach (DynamicModuleType dynamicType in dynamicTypes)
            {
                names.Add(dynamicType.TypeName);
            }

            return names;
        }
    }
}
