const viewData = {
    id: 'payslip-print',
    label: 'Print',
    link: '/services/web/codbex-hera-print/Payslip/print-payslip.html',
    perspective: 'Payrolls',
    view: 'PayrollEntry',
    type: 'entity',
    order: 13
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}