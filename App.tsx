import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import SummaryCards from './components/SummaryCards';
import ChartsSection from './components/ChartsSection';
import DetailedTable from './components/DetailedTable';
import { SimulationParams, SimulationResult } from './types';
import { calculateSimulation } from './services/calculator';
import { Printer } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleSimulate = (params: SimulationParams) => {
    const data = calculateSimulation(params);
    setResult(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Simulador Habitacional Pro</h1>
            <h1 className="text-xl font-bold text-slate-800 sm:hidden">Simulador</h1>
          </div>
          
          {result && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm text-sm font-medium"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
          )}
        </div>
      </header>

      {/* Print Header */}
      <div className="hidden print:block p-8 mb-4 border-b">
        <h1 className="text-3xl font-bold text-slate-900">Relatório de Financiamento Habitacional</h1>
        <p className="text-slate-600 mt-2">Comparativo SAC vs PRICE</p>
        <p className="text-sm text-slate-400 mt-1">Gerado em {new Date().toLocaleDateString()}</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <InputPanel onSimulate={handleSimulate} />

        {result ? (
          <div className="animate-fade-in-up">
            <SummaryCards result={result} />
            <ChartsSection result={result} />
            <DetailedTable result={result} />
            
            <div className="mt-8 text-center text-slate-400 text-xs print:mt-4">
              <p>Os valores apresentados são simulações estimadas e podem variar de acordo com a data de contratação e indexadores.</p>
              <p className="print:hidden">Utilize o modo de impressão do navegador para salvar como PDF.</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-slate-300">
            <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">Comece sua simulação</h3>
            <p className="text-slate-500 mt-1 max-w-sm mx-auto">Preencha os dados acima para comparar os sistemas de amortização SAC e PRICE.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;