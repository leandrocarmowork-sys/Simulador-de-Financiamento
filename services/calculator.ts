import { Installment, SimulationParams, SystemResult, SimulationResult } from '../types';

const calculateCET = (loanAmount: number, installments: Installment[]): { monthly: number; annual: number } => {
  // Newton-Raphson approximation for IRR (Internal Rate of Return)
  // Cash flow: -LoanAmount, +Pmt1, +Pmt2, ..., +PmtN
  
  const cashFlows = [-loanAmount, ...installments.map(i => i.totalPayment)];
  let rate = 0.01; // Initial guess (1% per month)
  
  for (let i = 0; i < 20; i++) { // Max iterations
    let npv = 0;
    let d_npv = 0;
    
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + rate, t);
      npv += cashFlows[t] / denom;
      d_npv -= (t * cashFlows[t]) / (denom * (1 + rate));
    }
    
    const newRate = rate - npv / d_npv;
    if (Math.abs(newRate - rate) < 0.0000001) {
      rate = newRate;
      break;
    }
    rate = newRate;
  }

  return {
    monthly: rate * 100,
    annual: (Math.pow(1 + rate, 12) - 1) * 100
  };
};

const calculateSAC = (params: SimulationParams): SystemResult => {
  const { loanAmount, months, annualInterestRate, monthlyCorrectionRate, monthlyFees } = params;
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const correctionRate = monthlyCorrectionRate / 100;
  
  const installments: Installment[] = [];
  let currentBalance = loanAmount;
  let totalInterest = 0;
  let totalCorrection = 0;
  let totalPaid = 0;
  let totalAmortization = 0;

  for (let m = 1; m <= months; m++) {
    // 1. Apply Monetary Correction to Balance
    const correction = currentBalance * correctionRate;
    currentBalance += correction;
    totalCorrection += correction;

    // 2. Calculate Interest on corrected balance
    const interest = currentBalance * monthlyInterestRate;

    // 3. Calculate Amortization (Recalculated on remaining months to handle correction increase)
    // Standard SAC with correction usually divides current balance by remaining months
    const remainingMonths = months - m + 1;
    let amortization = currentBalance / remainingMonths;

    // Fix for very last installment rounding
    if (m === months) {
        amortization = currentBalance; 
    }

    const totalPayment = amortization + interest + monthlyFees;
    const balanceEnd = currentBalance - amortization;

    installments.push({
      month: m,
      balanceStart: currentBalance - correction, // Show balance before this month's correction for clarity, or with? Usually standard is before.
      correction,
      interest,
      amortization,
      fees: monthlyFees,
      totalPayment,
      balanceEnd: Math.max(0, balanceEnd),
    });

    totalInterest += interest;
    totalPaid += totalPayment;
    totalAmortization += amortization;
    currentBalance = balanceEnd;
  }

  const cet = calculateCET(loanAmount, installments);

  return {
    systemName: 'SAC',
    installments,
    summary: {
      loanAmount,
      firstInstallment: installments[0].totalPayment,
      lastInstallment: installments[installments.length - 1].totalPayment,
      totalInterest,
      totalAmortization,
      totalCorrection,
      totalFees: monthlyFees * months,
      totalPaid,
      cetMonthly: cet.monthly,
      cetAnnual: cet.annual,
    }
  };
};

const calculatePRICE = (params: SimulationParams): SystemResult => {
  const { loanAmount, months, annualInterestRate, monthlyCorrectionRate, monthlyFees } = params;
  const i = annualInterestRate / 12 / 100;
  const correctionRate = monthlyCorrectionRate / 100;

  const installments: Installment[] = [];
  let currentBalance = loanAmount;
  let totalInterest = 0;
  let totalCorrection = 0;
  let totalPaid = 0;
  let totalAmortization = 0;

  for (let m = 1; m <= months; m++) {
    // 1. Apply Monetary Correction
    const correction = currentBalance * correctionRate;
    currentBalance += correction;
    totalCorrection += correction;

    const remainingMonths = months - m + 1;

    // 2. Recalculate PMT based on new balance (to absorb correction)
    // Formula: P * [ i(1+i)^n ] / [ (1+i)^n – 1 ]
    let pmt = 0;
    if (remainingMonths > 0) {
        pmt = currentBalance * ( (i * Math.pow(1 + i, remainingMonths)) / (Math.pow(1 + i, remainingMonths) - 1) );
    }

    // 3. Interest
    const interest = currentBalance * i;
    
    // 4. Amortization
    let amortization = pmt - interest;
    
    // Adjust last installment
    if (m === months || amortization > currentBalance) {
      amortization = currentBalance;
      pmt = amortization + interest;
    }

    const totalPayment = pmt + monthlyFees;
    const balanceEnd = currentBalance - amortization;

    installments.push({
      month: m,
      balanceStart: currentBalance - correction,
      correction,
      interest,
      amortization,
      fees: monthlyFees,
      totalPayment,
      balanceEnd: Math.max(0, balanceEnd),
    });

    totalInterest += interest;
    totalPaid += totalPayment;
    totalAmortization += amortization;
    currentBalance = balanceEnd;
  }

  const cet = calculateCET(loanAmount, installments);

  return {
    systemName: 'PRICE',
    installments,
    summary: {
      loanAmount,
      firstInstallment: installments[0].totalPayment,
      lastInstallment: installments[installments.length - 1].totalPayment,
      totalInterest,
      totalAmortization,
      totalCorrection,
      totalFees: monthlyFees * months,
      totalPaid,
      cetMonthly: cet.monthly,
      cetAnnual: cet.annual,
    }
  };
};

export const calculateSimulation = (params: SimulationParams): SimulationResult => {
  return {
    sac: calculateSAC(params),
    price: calculatePRICE(params),
  };
};