import React, { useState, useEffect } from 'react';
import { SimulationParams } from '../types';
import { Calculator, DollarSign, Calendar, Percent, ShieldCheck, RefreshCw, X } from 'lucide-react';

interface InputPanelProps {
  onSimulate: (params: SimulationParams) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ onSimulate }) => {
  // State for raw values
  const [amount, setAmount] = useState<number>(300000);
  const [amountDisplay, setAmountDisplay] = useState<string>("300.000,00");
  
  const [months, setMonths] = useState<number>(360);
  const [rate, setRate] = useState<number>(9.5);
  const [correctionRate, setCorrectionRate] = useState<number>(0);
  const [fees, setFees] = useState<number>(150);

  // Rate Converter State
  const [showConverter, setShowConverter] = useState(false);
  const [convAnnual, setConvAnnual] = useState<string>('');
  const [convMonthly, setConvMonthly] = useState<string>('');

  // Update display when raw amount changes initially
  useEffect(() => {
    formatAndSetAmount(amount.toString());
  }, []);

  const formatCurrencyInput = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Convert to number (cents)
    const number = Number(digits) / 100;
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formatAndSetAmount(val);
  };

  const formatAndSetAmount = (val: string) => {
    const formatted = formatCurrencyInput(val);
    setAmountDisplay(formatted);
    
    // Parse back to number for logic
    const rawValue = Number(formatted.replace(/\./g, '').replace(',', '.'));
    setAmount(rawValue);
  };

  const handleRateConversion = (type: 'annualToMonthly' | 'monthlyToAnnual', valueStr: string) => {
     const val = parseFloat(valueStr.replace(',', '.'));
     if (isNaN(val)) return;

     if (type === 'annualToMonthly') {
         setConvAnnual(valueStr);
         // (1 + i_a)^(1/12) - 1
         const monthly = (Math.pow(1 + val/100, 1/12) - 1) * 100;
         setConvMonthly(monthly.toFixed(4).replace('.', ','));
     } else {
         setConvMonthly(valueStr);
         // (1 + i_m)^12 - 1
         const annual = (Math.pow(1 + val/100, 12) - 1) * 100;
         setConvAnnual(annual.toFixed(2).replace('.', ','));
     }
  };

  const applyConvertedRate = () => {
      const annualVal = parseFloat(convAnnual.replace(',', '.'));
      if(!isNaN(annualVal)) {
          setRate(annualVal);
          setShowConverter(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate({
      loanAmount: amount,
      months: months,
      annualInterestRate: rate,
      monthlyCorrectionRate: correctionRate,
      monthlyFees: fees,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-100 no-print relative">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">Parâmetros do Financiamento</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Loan Amount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <DollarSign className="w-4 h-4" /> Valor do Financiamento
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium">R$</span>
            <input
              type="text"
              value={amountDisplay}
              onChange={handleAmountChange}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-900"
              placeholder="0,00"
              required
            />
          </div>
        </div>

        {/* Term */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4" /> Prazo (Meses)
          </label>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-900"
            placeholder="360"
            required
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Percent className="w-4 h-4" /> Taxa de Juros a.a
            </label>
            <button 
                type="button" 
                onClick={() => setShowConverter(!showConverter)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded"
            >
                <RefreshCw size={10} /> Conversor
            </button>
          </div>
          <input
            type="number"
            step="0.01"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-900"
            placeholder="9.5"
            required
          />

            {/* Rate Converter Tool */}
            {showConverter && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-blue-100 rounded-lg shadow-xl z-20 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-slate-700">Conversor de Taxas</h4>
                        <button type="button" onClick={() => setShowConverter(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="text-xs text-slate-500 block mb-1">Anual (%)</label>
                            <input 
                                type="text" 
                                value={convAnnual} 
                                onChange={(e) => handleRateConversion('annualToMonthly', e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded" 
                                placeholder="0.00"
                            />
                        </div>
                         <div>
                            <label className="text-xs text-slate-500 block mb-1">Mensal (%)</label>
                             <input 
                                type="text" 
                                value={convMonthly} 
                                onChange={(e) => handleRateConversion('monthlyToAnnual', e.target.value)}
                                className="w-full px-2 py-1 text-sm border rounded" 
                                placeholder="0.0000"
                            />
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={applyConvertedRate}
                        className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
                    >
                        Usar Taxa Anual
                    </button>
                </div>
            )}
        </div>

        {/* Correction Rate */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <TrendingUpIcon className="w-4 h-4" /> Correção a.m (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={correctionRate}
            onChange={(e) => setCorrectionRate(Number(e.target.value))}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-900"
            placeholder="0,00"
          />
        </div>

        {/* Fees */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <ShieldCheck className="w-4 h-4" /> Encargos Fixos (R$)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium">R$</span>
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-medium text-slate-900"
              placeholder="100"
            />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Simular Financiamento
          </button>
        </div>
      </form>
    </div>
  );
};

// Helper Icon for Correction
function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
    )
}

export default InputPanel;