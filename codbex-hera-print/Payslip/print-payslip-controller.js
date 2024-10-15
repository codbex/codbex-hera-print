const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', function ($scope, $http, ViewParameters) {
    const params = ViewParameters.get();

    const printPayslipUrl = "/services/ts/codbex-hera-print/Payslip/api/PayslipService.ts/" + params.id;

    $http.get(printPayslipUrl)
        .then(function (response) {
            $scope.PayrollEntry = response.data.payrollEntry;
        });
}]);