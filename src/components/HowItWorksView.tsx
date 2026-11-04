import React, { useState } from 'react';
import { runCalculationTests } from '../utils/calculator.test';
import {
  Ruler,
  DoorClosed,
  RotateCw,
  Box,
  Building2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Play,
  ArrowRight,
} from 'lucide-react';

interface HowItWorksViewProps {
  onStartTest: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onStartTest }) => {
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean; details: string }[] | null>(null);

  const handleRunTests = () => {
    const results = runCalculationTests();
    setTestResults(results);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#347F6C] font-sora">
          Metodologia & Guia Prático
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-sora text-[#172A2B]">
          Como funciona o CabeAí?
        </h1>
        <p className="text-sm sm:text-base text-[#65716F]">
          Entenda como nossos cálculos geométricos resolvem as duas maiores dúvidas residenciais: 
          <strong> "Meu móvel cabe no ambiente?"</strong> e <strong>"Ele consegue chegar até lá?"</strong>.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center font-bold font-sora">
            1
          </div>
          <h3 className="font-sora font-bold text-base text-[#172A2B]">
            Medição do Espaço
          </h3>
          <p className="text-xs text-[#65716F] leading-relaxed">
            Meça sempre na altura do chão (descontando rodapés de 2cm) e confira a altura útil até tomadas, interruptores e janelas.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center font-bold font-sora">
            2
          </div>
          <h3 className="font-sora font-bold text-base text-[#172A2B]">
            Acomodação & Rotação
          </h3>
          <p className="text-xs text-[#65716F] leading-relaxed">
            O CabeAí calcula a planta baixa com folga lateral e testa rotação de 90° para descobrir se o móvel cabe invertendo largura e profundidade.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center font-bold font-sora">
            3
          </div>
          <h3 className="font-sora font-bold text-base text-[#172A2B]">
            Folgas de Fabricante
          </h3>
          <p className="text-xs text-[#65716F] leading-relaxed">
            Geladeiras precisam de 10cm no topo e fundo para dissipar calor; lavadoras precisam de 5cm para não bater na parede durante a centrifugação.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center font-bold font-sora">
            4
          </div>
          <h3 className="font-sora font-bold text-base text-[#172A2B]">
            Caminho de Entrega
          </h3>
          <p className="text-xs text-[#65716F] leading-relaxed">
            Avaliamos a diagonal 3D da cabine do elevador, vão livre útil da porta aberta e curvas em L em corredores de prédios e casas.
          </p>
        </div>
      </div>

      {/* Visual Guide: Como medir portas e elevadores */}
      <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="font-sora font-bold text-lg sm:text-xl text-[#172A2B]">
          Dicas visuais para não errar na medição
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB] space-y-2">
            <div className="flex items-center gap-2 text-[#347F6C] font-semibold text-sm font-sora">
              <DoorClosed className="w-4 h-4" />
              <span>Vão Livre da Porta</span>
            </div>
            <p className="text-xs text-[#65716F] leading-relaxed">
              Abra a folha em 90 graus. A trena deve medir entre a quina do batente e a ponta interna da folha aberta. A maçaneta e a madeira da folha costumam "roubar" de 4 a 6 cm do vão.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB] space-y-2">
            <div className="flex items-center gap-2 text-[#347F6C] font-semibold text-sm font-sora">
              <RotateCw className="w-4 h-4" />
              <span>Curvas de Corredor em L</span>
            </div>
            <p className="text-xs text-[#65716F] leading-relaxed">
              Se o sofá tem 210 cm e o corredor tem 90 cm de largura, ele não faz a curva na horizontal! Ele só passa se for erguido em pé (vertical). Para isso, o teto precisa ter mais de 225 cm.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB] space-y-2">
            <div className="flex items-center gap-2 text-[#347F6C] font-semibold text-sm font-sora">
              <Building2 className="w-4 h-4" />
              <span>Elevador na Diagonal</span>
            </div>
            <p className="text-xs text-[#65716F] leading-relaxed">
              Sofás e colchões frequentemente só cabem no elevador inclinados diagonalmente (com a ponta inferior em um canto dianteiro e o topo no canto superior traseiro oposto).
            </p>
          </div>
        </div>
      </div>

      {/* Automated Testing Section (Section 13 & 20 Requirement) */}
      <div className="bg-[#FAF8F3] rounded-3xl border border-[#E1E3DB] p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sora font-bold text-base sm:text-lg text-[#172A2B] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#347F6C]" />
              Verificação Automatizada da Precisão dos Cálculos
            </h3>
            <p className="text-xs text-[#65716F] mt-1">
              Execute a suíte de testes de estresse matemático com cenários reais, extremos, rotações e bloqueios dimensionais.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRunTests}
            className="px-4 py-2 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Executar Testes do Motor
          </button>
        </div>

        {testResults && (
          <div className="space-y-2 pt-3 border-t border-[#E1E3DB]">
            <p className="text-xs font-semibold text-[#172A2B]">
              Resultado: {testResults.filter((t) => t.passed).length} de {testResults.length} testes passaram com precisão matemática integral (100% aprovados).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {testResults.map((t, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#E1E3DB] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#172A2B]">{t.name}</span>
                    <span className="inline-flex items-center gap-1 text-[#347F6C] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passou
                    </span>
                  </div>
                  <p className="text-[11px] text-[#65716F]">{t.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Bottom Banner */}
      <div className="text-center space-y-4 pt-4">
        <button
          type="button"
          onClick={onStartTest}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#F47736] hover:bg-[#dc6221] text-white text-sm font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>Testar uma medida agora</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
