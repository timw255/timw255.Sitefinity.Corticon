var simpleModule = angular.module('simpleModule', ['pageEditorServices', 'breadcrumb']);
angular.module('designer').requires.push('simpleModule');

simpleModule.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    delete $httpProvider.defaults.headers.get['Cache-Control'];
    delete $httpProvider.defaults.headers.get["Pragma"];
}]);

simpleModule.controller('SimpleCtrl', ['$scope', '$http', 'propertyService', function ($scope, $http, propertyService) {
    $scope.feedback.showLoadingIndicator = true;

    $scope.testCorticonService = function () {
        var vocbURL = $scope.properties.CorticonServiceEndpoint.PropertyValue + "/corticon/getVocabulary/" + $scope.properties.CorticonServiceName.PropertyValue + "/" + $scope.properties.CorticonServiceMajorVersion.PropertyValue + "/" + $scope.properties.CorticonServiceMinorVersion.PropertyValue;
        $http.get(vocbURL)
            .then(function mySucces(response) {
                if (response.data.length > 0) {
                    $scope.fail = false;
                    $scope.success = true;
                } else {
                    $scope.success = false;
                    $scope.fail = true;
                }

            }, function myError(response) {
                $scope.success = false;
                $scope.fail = true;
            });
    };

    $scope.getDecisionServiceNames = function () {
        var corticonUrl = $scope.properties.CorticonServiceEndpoint.PropertyValue + "/services/CorticonAdmin";
        $http({
            method: 'POST',
            url: corticonUrl,
            data: '<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.eclipse.corticon.com"><soapenv:Header/><soapenv:Body><soap:getDecisionServiceNames soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/></soapenv:Body></soapenv:Envelope>',
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'SOAPAction': ''
            }
        }).success(function (data, status, headers, config) {
            $scope.serviceNames = $(data).find('getDecisionServiceNamesReturn').text().split(';').filter(n => n.startsWith('DynamicQuestionnaire-'));
        }).error(function (data, status, headers, config) {
            console.log('error: ' + status);     
        })
    };

    propertyService.get()
        .then(function (data) {
            if (data) {
                $scope.properties = propertyService.toAssociativeArray(data.Items);
            }
        },
        function (data) {
            $scope.feedback.showError = true;
            if (data) {
                $scope.feedback.errorMessage = data.Detail;
            }
        })
        .finally(function () {
            if ($scope.properties.CorticonServiceEndpoint.PropertyValue != '') {
                $scope.getDecisionServiceNames();
            }

            $scope.feedback.showLoadingIndicator = false;
        });
}]);