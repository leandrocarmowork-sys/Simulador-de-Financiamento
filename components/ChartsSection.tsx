import React from 'react';
import { SimulationResult } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface ChartsSectionProps {
  result: SimulationResult;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ result }) => {
  // Prepare Data for Balance Evolution Line Chart
  const sampleRate = result.sac.installments.length > 60 ? Math.ceil(result.sac.installments.length / 40) : 1;
  
  const lineData = result.sac.installments
    .filter((_, idx) => idx % sampleRate === 0 || idx === result.sac.installments.length - 1)
    .map((sacItem, index) => {
      const priceItem = result.price.installments.find(p => p.month === sacItem.month);
      return {
        name: sacItem.month,
        'Saldo SAC': sacItem.balanceEnd,
        'Saldo PRICE': priceItem ? priceItem.balanceEnd : 0,
      };
    });

  // Prepare Data for Total Cost Bar Chart
  const barData = [
    {
      name: 'Amortização (Valor Original)',
      SAC: result.sac.summary.totalAmortization,
      PRICE: result.price.summary.totalAmortization,
    },
    {
      name: 'Total Juros',
      SAC: result.sac.summary.totalInterest,
      PRICE: result.price.summary.totalInterest,
    },
    {
      name: 'Total Correção',
      SAC: result.sac.summary.totalCorrection,
      PRICE: result.price.summary.totalCorrection,
    },
    {
      name: 'Total Taxas',
      SAC: result.sac.summary.totalFees,
      PRICE: result.price.summary.totalFees,
    }
  ];

  const formatCurrencyAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return `${value}`;
  };

  const formatTooltip = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print-break-inside-avoid">
      {/* Balance Evolution Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Evolução do Saldo Devedor</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" label={{ value: 'Mês', position: 'insideBottomRight', offset: -5 }} tick={{fontSize: 12}} />
              <YAxis tickFormatter={formatCurrencyAxis} tick={{fontSize: 12}} width={40} />
              <Tooltip formatter={formatTooltip} />
              <Legend verticalAlign="top" height={36}/>
              <Line type="monotone" dataKey="Saldo SAC" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Saldo PRICE" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Distribution Chart */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Composição do Custo Total</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{fontSize: 11}} />
              <YAxis tickFormatter={formatCurrencyAxis} tick={{fontSize: 12}} width={40} />
              <Tooltip formatter={formatTooltip} cursor={{fill: '#f1f5f9'}} />
              <Legend verticalAlign="top" height={36}/>
              <Bar dataKey="SAC" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="PRICE" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;