import { PayrollEntryRepository as PayrollEntryDao } from "codbex-payrolls/gen/codbex-payrolls/dao/Payrolls/PayrollEntryRepository";


import { Controller, Get } from "sdk/http";

@Controller
class PayslipService {

    private readonly payrollEntryDao;


    constructor() {
        this.payrollEntryDao = new PayrollEntryDao();
    }

    @Get("/:payrollId")
    public payrollData(_: any, ctx: any) {
        const payrollId = ctx.pathParameters.payrollId;

        let payrollEntry = this.payrollEntryDao.findById(payrollId);

        return {
            payrollEntry: payrollEntry
        }

    }
}