import { PayrollEntryRepository as PayrollEntryDao } from "codbex-payrolls/gen/codbex-payrolls/dao/Payrolls/PayrollEntryRepository";
import { PayrollEntryItemRepository as PayrollEntryItemDao } from "codbex-payrolls/gen/codbex-payrolls/dao/Payrolls/PayrollEntryItemRepository";
import { PayrollEntryItemTypeRepository as PayrollEntryItemTypeDao } from "codbex-payrolls/gen/codbex-payrolls/dao/entities/PayrollEntryItemTypeRepository";
import { EmployeeRepository as EmployeeDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeRepository";
import { EmployeeAssignmentRepository as EmployeeAssignmentDao } from "codbex-employees/gen/codbex-employees/dao/Employees/EmployeeAssignmentRepository";
import { JobAssignmentRepository as JobAssignmentDao } from "codbex-jobs/gen/codbex-jobs/dao/JobAssignment/JobAssignmentRepository";
import { JobPositionRepository as JobPositionDao } from "codbex-jobs/gen/codbex-jobs/dao/Teams/JobPositionRepository";
import { DepartmentRepository as DepartmentDao } from "codbex-organizations/gen/codbex-organizations/dao/Organizations/DepartmentRepository";
import { JobRoleRepository as JobRoleDao } from "codbex-companies/gen/codbex-companies/dao/Companies/JobRoleRepository";
import { SalaryRepository as SalaryDao } from "codbex-salaries/gen/codbex-salaries/dao/Salaries/SalaryRepository";
import { CurrencyRepository as CurrencyDao } from "codbex-currencies/gen/codbex-currencies/dao/Currencies/CurrencyRepository";

import { Controller, Get } from "sdk/http";

@Controller
class PayslipService {

    private readonly payrollEntryDao;
    private readonly employeeDao;
    private readonly jobAssignmentDao;
    private readonly employeeAssignmentDao;
    private readonly departmentDao;
    private readonly jobPositionDao;
    private readonly jobRoleDao;
    private readonly salaryDao;
    private readonly currencyDao;
    private readonly payrollEntryItemDao;
    private readonly payrollEntryItemTypeDao;


    constructor() {
        this.payrollEntryDao = new PayrollEntryDao();
        this.employeeDao = new EmployeeDao();
        this.jobAssignmentDao = new JobAssignmentDao();
        this.employeeAssignmentDao = new EmployeeAssignmentDao();
        this.departmentDao = new DepartmentDao();
        this.jobPositionDao = new JobPositionDao();
        this.jobRoleDao = new JobRoleDao();
        this.salaryDao = new SalaryDao();
        this.currencyDao = new CurrencyDao();
        this.payrollEntryItemDao = new PayrollEntryItemDao();
        this.payrollEntryItemTypeDao = new PayrollEntryItemTypeDao();
    }

    @Get("/:payrollId")
    public payrollData(_: any, ctx: any) {
        const payrollId = ctx.pathParameters.payrollId;

        const payrollEntry = this.payrollEntryDao.findById(payrollId);

        const employees = this.employeeDao.findAll({
            $filter: {
                equals: {
                    Id: payrollEntry.Employee
                }
            }
        });

        const employeeAssignment = this.employeeAssignmentDao.findAll({
            $filter: {
                equals: {
                    Employee: employees[0].Id
                }
            }
        });

        const jobAssignment = this.jobAssignmentDao.findAll({
            $filter: {
                equals: {
                    Id: employeeAssignment[0].JobAssignment
                }
            }
        });

        const department = this.departmentDao.findAll({
            $filter: {
                equals: {
                    Id: jobAssignment[0].Department
                }
            }
        });

        const jobPosition = this.jobPositionDao.findAll({
            $filter: {
                equals: {
                    Id: jobAssignment[0].JobPosition
                }
            }
        });

        const jobRole = this.jobRoleDao.findAll({
            $filter: {
                equals: {
                    Id: jobPosition[0].Role
                }
            }
        });

        const salary = this.salaryDao.findAll({
            $filter: {
                equals: {
                    Employee: payrollEntry.Employee
                }
            }
        });

        const currency = this.currencyDao.findAll({
            $filter: {
                equals: {
                    Id: salary[0].Currency
                }
            }
        });

        const deductions = this.payrollEntryItemDao.findAll({
            $filter: {
                equals: {
                    PayrollEntry: payrollEntry.Id
                },
                notEquals: {
                    Type: 1
                }
            }
        });

        let deductionsArr = [];

        deductions.forEach((deduction) => {

            const payrollItemType = this.payrollEntryItemTypeDao.findById(deduction.Type);

            const currentDeduction = {
                "Name": payrollItemType.Name,
                "Amount": deduction.Amount
            }

            deductionsArr.push(currentDeduction);

        });

        return {
            payrollEntry: payrollEntry,
            employee: employees[0],
            department: department[0],
            jobRole: jobRole[0],
            salary: salary[0],
            currency: currency[0],
            deductions: deductionsArr,
        }

    }
}