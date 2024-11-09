const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', function ($scope, $http, ViewParameters) {
    const params = ViewParameters.get();

    const printPayslipUrl = "/services/ts/codbex-hera-print/Payslip/api/PayslipService.ts/" + params.id;

    $http.get(printPayslipUrl)
        .then(function (response) {
            $scope.PayrollEntry = response.data.payrollEntry;
            $scope.Date = new Date();
            $scope.Employee = response.data.employee;
            $scope.Department = response.data.department;
            $scope.JobRole = response.data.jobRole;
            $scope.Salary = response.data.salary;
            $scope.Currency = response.data.currency;
            $scope.Amount = $scope.PayrollEntry.Amount;
            $scope.Deductions = response.data.deductions;
        });
}]);