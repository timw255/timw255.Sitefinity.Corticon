# timw255.Sitefinity.Corticon

This demonstrates how to create dynamic questionnaires using Sitefinity and Corticon.

[See this in action on YouTube (1:57)](https://youtu.be/8C2TMPsbxN4)

## Notes:

The implementation details of the dynamic questionnaire itself are generic. It's based solely on the Corticon rules being used.

This specific implementation makes an AJAX call back to Sitefinity in order to gather the additional information about the recommended product. If that's not required in your implementation, you'll need to modify the [handleResults](https://github.com/timw255/timw255.Sitefinity.Corticon/blob/master/timw255.Sitefinity.Corticon/Resources/dynamicQuestionnaire.js#L225) function (located in dynamicQuestionnaire.js) to behave differently.

Actually, if you don't need to pull information from Sitefinity (or any other source), you can move the templating code to the [Default view of the widget](https://github.com/timw255/timw255.Sitefinity.Corticon/blob/master/timw255.Sitefinity.Corticon/Mvc/Views/DynamicQuestionnaire/Default.cshtml#L75).

The "Apply Online" section of the Dynamic Questionnaire widget designer is another implementation specific piece that was added on for the demo use case. It allows backend users to assign a specific page where visitors will be redirected to if they click the "Apply Now" button. If this isn't necessary...it's [another piece](https://github.com/timw255/timw255.Sitefinity.Corticon/blob/master/timw255.Sitefinity.Corticon/Resources/dynamicQuestionnaire.js#L128) you can freely remove.

If none of these notes make any sense, please watch the demo on YouTube. :)