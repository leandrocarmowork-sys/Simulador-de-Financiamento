export interface SimulationParams {
  loanAmount: number;
  months: number;
  annualInterestRate: number;
  monthlyCorrectionRate: number; // New field for monetary correction (TR/Inflation)
  monthlyFees: number; // MIP + DFI + Admin
}

export interface Installment {
  month: number;
  balanceStart: number;
  correction: number; // Monetary correction amount
  interest: number;
  amortization: number;
  fees: number;
  totalPayment: number;
  balanceEnd: number;
}

export interface SystemResult {
  systemName: 'SAC' | 'PRICE';
  installments: Installment[];
  summary: {
    firstInstallment: number;
    lastInstallment: number;
    totalInterest: number;
    totalAmortization: number;
    totalCorrection: number; // Total correction paid/accrued
    totalFees: number;
    totalPaid: number;
    cetMonthly: number;
    cetAnnual: number;
  };
}

export interface SimulationResult {
  sac: SystemResult;
  price: SystemResult;
}