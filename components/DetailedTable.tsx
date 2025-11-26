import React, { useState } from 'react';
import { SimulationResult, Installment } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DetailedTableProps {
  result: SimulationResult;
}

const DetailedTable: React.FC<DetailedTableProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'SAC' | 'PRICE'>('SAC');
  const [isExpanded, setIsExpanded] = useState(true);

  const data = activeTab === 'SAC' ? result.sac.installments : result.price.installments;

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden print-full-width">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Tabela Analítica Mensal</h2>
          <div className="flex bg-slate-200 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('SAC')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'SAC' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              SAC
            </button>
            <button
              onClick={() => setActiveTab('PRICE')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'PRICE' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              PRICE
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-500 hover:text-slate-800 transition-colors"
        >
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {/* Title only visible on print, since tabs are hidden */}
      <div className="hidden print:block p-4 border-b border-black">
        <h2 className="text-xl font-bold">Tabela Analítica - {activeTab}</h2>
      </div>

      {isExpanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-center w-16">Mês</th>
                <th className="px-4 py-3 text-right">Saldo Inicial</th>
                <th className="px-4 py-3 text-right text-amber-600">Correção</th>
                <th className="px-4 py-3 text-right text-red-600">Juros</th>
                <th className="px-4 py-3 text-right text-emerald-600">Amortização</th>
                <th className="px-4 py-3 text-right text-slate-600">Encargos</th>
                <th className="px-4 py-3 text-right font-bold bg-slate-200">Prestação</th>
                <th className="px-4 py-3 text-right">Saldo Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row: Installment) => (
                <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2 text-center font-medium text-slate-500">{row.month}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-600">{formatMoney(row.balanceStart)}</td>
                  <td className="px-4 py-2 text-right font-mono text-amber-600">{formatMoney(row.correction)}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-500">{formatMoney(row.interest)}</td>
                  <td className="px-4 py-2 text-right font-mono text-emerald-600">{formatMoney(row.amortization)}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-500">{formatMoney(row.fees)}</td>
                  <td className="px-4 py-2 text-right font-mono font-bold text-slate-800 bg-slate-50/50">{formatMoney(row.totalPayment)}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-900">{formatMoney(row.balanceEnd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailedTable;