import React from 'react';
import { SimulationResult, SystemResult } from '../types';
import { TrendingDown, TrendingUp, DollarSign, Wallet, ArrowUpRight, Landmark } from 'lucide-react';

interface SummaryCardsProps {
  result: SimulationResult;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const SystemSummary: React.FC<{ data: SystemResult; color: string }> = ({ data, color }) => {
  const isSac = data.systemName === 'SAC';
  const borderColor = isSac ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500';

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${borderColor} print-break-inside-avoid`}>
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex justify-between items-center border-b pb-2">
        Sistema {data.systemName}
        <span className={`text-xs px-2 py-1 rounded-full ${isSac ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
          {isSac ? 'Amortização Constante' : 'Parcela "Fixa"'}
        </span>
      </h3>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
        <div className="col-span-2 pb-3 mb-3 border-b border-slate-100">
             <p className="text-slate-500 mb-1 flex items-center gap-1 text-xs uppercase tracking-wider font-semibold"><Landmark size={14}/> Valor Financiado</p>
             <p className="font-bold text-2xl text-slate-800">{formatCurrency(data.summary.loanAmount)}</p>
        </div>

        <div className="col-span-1">
            <p className="text-slate-500 mb-1 flex items-center gap-1"><TrendingUp size={14}/> 1ª Parcela</p>
            <p className="font-bold text-lg text-slate-800">{formatCurrency(data.summary.firstInstallment)}</p>
        </div>
        <div className="col-span-1">
            <p className="text-slate-500 mb-1 flex items-center gap-1"><TrendingDown size={14}/> Última Parcela</p>
            <p className="font-bold text-lg text-slate-800">{formatCurrency(data.summary.lastInstallment)}</p>
        </div>
        
        <div className="col-span-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
             <div className="col-span-1">
                <p className="text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={14}/> Total Juros</p>
                <p className="font-semibold text-red-600">{formatCurrency(data.summary.totalInterest)}</p>
             </div>
             <div className="col-span-1">
                <p className="text-slate-500 mb-1 flex items-center gap-1"><ArrowUpRight size={14}/> Total Correção</p>
                <p className="font-semibold text-amber-600">{formatCurrency(data.summary.totalCorrection)}</p>
             </div>
        </div>
        
        <div className="col-span-2 mt-2">
            <p className="text-slate-500 mb-1 flex items-center gap-1"><Wallet size={14}/> Total Pago (Custo Final)</p>
            <p className="font-bold text-xl text-slate-900">{formatCurrency(data.summary.totalPaid)}</p>
        </div>

        <div className="col-span-2 bg-slate-50 p-2 rounded mt-2">
            <p className="text-xs text-slate-500 text-center uppercase tracking-wide">Custo Efetivo Total (CET)</p>
            <div className="flex justify-between items-center px-4 mt-1">
                <span className="font-medium">{data.summary.cetMonthly.toFixed(2)}% a.m.</span>
                <span className="font-bold text-blue-700">{data.summary.cetAnnual.toFixed(2)}% a.a.</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <SystemSummary data={result.sac} color="green" />
      <SystemSummary data={result.price} color="blue" />
    </div>
  );
};

export default SummaryCards;