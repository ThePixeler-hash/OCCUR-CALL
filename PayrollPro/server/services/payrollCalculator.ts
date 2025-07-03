interface PayrollInput {
  baseSalary: number;
  workingDays: number;
  standardWorkingDays: number;
  overtimeHours?: number;
  bonuses?: number;
  deductions?: number;
  dependents?: number;
}

interface TaxCalculation {
  cnssEmployee: number;
  cnssEmployer: number;
  amoEmployee: number;
  amoEmployer: number;
  igrTax: number;
  professionalExpenses: number;
  netSalary: number;
  grossSalary: number;
}

export class PayrollCalculator {
  // Morocco 2025 tax rates and constants
  private static readonly CNSS_EMPLOYEE_RATE = 0.0674; // 6.74%
  private static readonly CNSS_EMPLOYER_RATE = 0.2109; // 21.09%
  private static readonly AMO_EMPLOYEE_RATE = 0.0226; // 2.26%
  private static readonly AMO_EMPLOYER_RATE = 0.0411; // 4.11%
  private static readonly PROFESSIONAL_EXPENSE_RATE = 0.30; // 30%
  private static readonly PROFESSIONAL_EXPENSE_MAX = 30000; // MAD per year
  private static readonly SMIG_MONTHLY = 3266.55; // MAD per month (2025)
  private static readonly DEPENDENT_DEDUCTION = 500; // MAD per dependent (2025)
  private static readonly MAX_DEPENDENT_DEDUCTION = 3000; // MAD maximum

  // IGR Tax brackets for 2025
  private static readonly IGR_BRACKETS = [
    { min: 0, max: 40000, rate: 0.00 }, // 0% up to 40,000 MAD
    { min: 40001, max: 60000, rate: 0.10 }, // 10%
    { min: 60001, max: 80000, rate: 0.20 }, // 20%
    { min: 80001, max: 100000, rate: 0.30 }, // 30%
    { min: 100001, max: 180000, rate: 0.34 }, // 34%
    { min: 180001, max: Infinity, rate: 0.37 }, // 37%
  ];

  static calculatePayroll(input: PayrollInput): TaxCalculation {
    // Calculate gross salary
    const dailySalary = input.baseSalary / input.standardWorkingDays;
    const adjustedSalary = dailySalary * input.workingDays;
    const overtimePay = (input.overtimeHours || 0) * (dailySalary / 8) * 1.25; // 25% overtime premium
    const grossSalary = adjustedSalary + overtimePay + (input.bonuses || 0);

    // Ensure SMIG compliance
    const finalGrossSalary = Math.max(grossSalary, this.SMIG_MONTHLY);

    // Calculate CNSS contributions
    const cnssEmployee = finalGrossSalary * this.CNSS_EMPLOYEE_RATE;
    const cnssEmployer = finalGrossSalary * this.CNSS_EMPLOYER_RATE;

    // Calculate AMO contributions
    const amoEmployee = finalGrossSalary * this.AMO_EMPLOYEE_RATE;
    const amoEmployer = finalGrossSalary * this.AMO_EMPLOYER_RATE;

    // Calculate professional expenses deduction
    const annualSalary = finalGrossSalary * 12;
    const professionalExpenses = Math.min(
      annualSalary * this.PROFESSIONAL_EXPENSE_RATE,
      this.PROFESSIONAL_EXPENSE_MAX
    );
    const monthlyProfessionalExpenses = professionalExpenses / 12;

    // Calculate taxable income for IGR
    const dependentDeduction = Math.min(
      (input.dependents || 0) * this.DEPENDENT_DEDUCTION,
      this.MAX_DEPENDENT_DEDUCTION
    );
    const monthlyDependentDeduction = dependentDeduction / 12;
    
    const taxableIncome = Math.max(0, 
      finalGrossSalary - cnssEmployee - amoEmployee - monthlyProfessionalExpenses - monthlyDependentDeduction
    );

    // Calculate IGR tax using progressive brackets
    const annualTaxableIncome = taxableIncome * 12;
    const igrTax = this.calculateIGR(annualTaxableIncome) / 12;

    // Calculate net salary
    const totalEmployeeDeductions = cnssEmployee + amoEmployee + igrTax + (input.deductions || 0);
    const netSalary = finalGrossSalary - totalEmployeeDeductions;

    return {
      grossSalary: finalGrossSalary,
      cnssEmployee,
      cnssEmployer,
      amoEmployee,
      amoEmployer,
      igrTax,
      professionalExpenses: monthlyProfessionalExpenses,
      netSalary,
    };
  }

  private static calculateIGR(annualIncome: number): number {
    let tax = 0;
    let remainingIncome = annualIncome;

    for (const bracket of this.IGR_BRACKETS) {
      if (remainingIncome <= 0) break;

      const taxableInThisBracket = Math.min(
        remainingIncome,
        bracket.max - bracket.min + 1
      );

      tax += taxableInThisBracket * bracket.rate;
      remainingIncome -= taxableInThisBracket;
    }

    return tax;
  }

  static validateSMIGCompliance(salary: number): boolean {
    return salary >= this.SMIG_MONTHLY;
  }

  static calculateOvertimeRate(hourlyRate: number): number {
    return hourlyRate * 1.25; // 25% premium for overtime
  }

  static getContributionSummary(grossSalary: number) {
    return {
      cnss: {
        employee: grossSalary * this.CNSS_EMPLOYEE_RATE,
        employer: grossSalary * this.CNSS_EMPLOYER_RATE,
        total: grossSalary * (this.CNSS_EMPLOYEE_RATE + this.CNSS_EMPLOYER_RATE),
      },
      amo: {
        employee: grossSalary * this.AMO_EMPLOYEE_RATE,
        employer: grossSalary * this.AMO_EMPLOYER_RATE,
        total: grossSalary * (this.AMO_EMPLOYEE_RATE + this.AMO_EMPLOYER_RATE),
      },
    };
  }
}
