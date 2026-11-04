import React, { useState } from 'react';
import { Dimensions, DeliveryPath, DeliveryPathDiagnosis, PassageStatus } from '../types';
import { calculateDeliveryPath } from '../utils/calculator';
import {
  DoorClosed,
  Columns3,
  Building2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Box,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
  RotateCw,
} from 'lucide-react';

const StairsIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 3v4h-4v4h-4v4H7v4H3v2h18V3z" />
  </svg>
);

interface PathCheckerModalProps {
  productDim: Dimensions;
  packagingDim?: Dimensions;
  productName: string;
  pathData: DeliveryPath;
  onUpdatePathData: (newPath: DeliveryPath) => void;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'all' | 'door' | 'hallway' | 'elevator' | 'stairs';
}

export const PathCheckerModal: React.FC<PathCheckerModalProps> = ({
  productDim,
  packagingDim,
  productName,
  pathData,
  onUpdatePathData,
  isOpen,
  onClose,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'door' | 'hallway' | 'elevator' | 'stairs'>(initialTab);
  const [usePackaging, setUsePackaging] = useState<boolean>(!!packagingDim && packagingDim.width > 0);
  const [customPkgDim, setCustomPkgDim] = useState<Dimensions>(
    packagingDim || {
      width: Math.round(productDim.width + 10),
      height: Math.round(productDim.height + 8),
      depth: Math.round(productDim.depth + 10),
    }
  );

  // Editable path parameters
  const [path, setPath] = useState<DeliveryPath>(pathData);

  if (!isOpen) return null;

  const diagnosis: DeliveryPathDiagnosis = calculateDeliveryPath(
    productDim,
    usePackaging ? customPkgDim : undefined,
    path,
    usePackaging
  );

  const activeDim = usePackaging ? customPkgDim : productDim;

  const handleUpdate = (updated: DeliveryPath) => {
    setPath(updated);
    onUpdatePathData(updated);
  };

  const getStatusBadge = (status: PassageStatus) => {
    switch (status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E5F0E8] text-[#246152] border border-[#347F6C]/30">
            <CheckCircle className="w-4 h-4 text-[#347F6C]" />
            Passagem Liberada
          </span>
        );
      case 'pass_with_technique':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/30">
            <AlertTriangle className="w-4 h-4 text-[#D97706]" />
            Passa com Manobra / Rotação
          </span>
        );
      case 'requires_onsite_inspection':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#C2410C] border border-[#F47736]/30">
            <HelpCircle className="w-4 h-4 text-[#F47736]" />
            Verificação no Local Recomendada
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444]/30">
            <XCircle className="w-4 h-4 text-[#DC2626]" />
            Bloqueio Dimensional
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#F7F5EF] w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-[#E1E3DB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 bg-white border-b border-[#E1E3DB]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E8] flex items-center justify-center text-[#347F6C]">
              <DoorClosed className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-sora text-[#172A2B]">
                Agora confira o caminho até o cômodo
              </h2>
              <p className="text-xs sm:text-sm text-[#65716F]">
                Análise geométrica de portas, corredores, elevadores e escadas para <strong className="text-[#172A2B]">{productName}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#65716F] hover:text-[#172A2B] hover:bg-[#F0EDE3] rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluation Mode Bar: Montado vs Embalagem */}
        <div className="bg-[#FAF8F3] px-5 sm:px-7 py-3 border-b border-[#E1E3DB] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#65716F] font-medium">Dimensão avaliada no trajeto:</span>
            <div className="inline-flex bg-white p-1 rounded-xl border border-[#E1E3DB] shadow-2xs">
              <button
                type="button"
                onClick={() => setUsePackaging(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  !usePackaging
                    ? 'bg-[#347F6C] text-white shadow-xs'
                    : 'text-[#65716F] hover:text-[#172A2B]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Produto Montado ({productDim.width} × {productDim.height} × {productDim.depth} cm)
              </button>
              <button
                type="button"
                onClick={() => setUsePackaging(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  usePackaging
                    ? 'bg-[#347F6C] text-white shadow-xs'
                    : 'text-[#65716F] hover:text-[#172A2B]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                Caixa / Embalagem de Entrega
              </button>
            </div>
          </div>

          {usePackaging && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#65716F]">Embalagem:</span>
              <input
                type="number"
                value={customPkgDim.width}
                onChange={(e) => setCustomPkgDim({ ...customPkgDim, width: Number(e.target.value) || 0 })}
                className="w-16 px-2 py-1 rounded-md bg-white border border-[#E1E3DB] text-center font-bold text-[#172A2B]"
                title="Largura da caixa"
              />
              <span className="text-[#65716F]">×</span>
              <input
                type="number"
                value={customPkgDim.height}
                onChange={(e) => setCustomPkgDim({ ...customPkgDim, height: Number(e.target.value) || 0 })}
                className="w-16 px-2 py-1 rounded-md bg-white border border-[#E1E3DB] text-center font-bold text-[#172A2B]"
                title="Altura da caixa"
              />
              <span className="text-[#65716F]">×</span>
              <input
                type="number"
                value={customPkgDim.depth}
                onChange={(e) => setCustomPkgDim({ ...customPkgDim, depth: Number(e.target.value) || 0 })}
                className="w-16 px-2 py-1 rounded-md bg-white border border-[#E1E3DB] text-center font-bold text-[#172A2B]"
                title="Profundidade da caixa"
              />
              <span className="text-[#65716F]">cm</span>
            </div>
          )}
        </div>

        {/* Global Diagnostic Summary Box */}
        <div className="p-4 sm:p-6 pb-2">
          <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              diagnosis.overallStatus === 'pass'
                ? 'bg-[#E5F0E8]/70 border-[#347F6C]/30 text-[#172A2B]'
                : diagnosis.overallStatus === 'pass_with_technique'
                ? 'bg-[#FFFBEB] border-[#F59E0B]/40 text-[#172A2B]'
                : diagnosis.overallStatus === 'requires_onsite_inspection'
                ? 'bg-[#FFF7ED] border-[#F47736]/40 text-[#172A2B]'
                : 'bg-[#FEF2F2] border-[#EF4444]/40 text-[#172A2B]'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-bold font-sora">
                    {diagnosis.overallLabel}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {diagnosis.overallDescription}
                </p>
              </div>
              <div className="shrink-0">{getStatusBadge(diagnosis.overallStatus)}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 sm:px-7 pt-2 pb-0 flex border-b border-[#E1E3DB] gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'Visão Geral', icon: ShieldCheck },
            { id: 'door', label: '1. Porta de Entrada', icon: DoorClosed },
            { id: 'hallway', label: '2. Corredor & Curvas', icon: Columns3 },
            { id: 'elevator', label: '3. Elevador', icon: Building2 },
            { id: 'stairs', label: '4. Escadas & Patamares', icon: StairsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#347F6C] text-[#347F6C]'
                    : 'border-transparent text-[#65716F] hover:text-[#172A2B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* OVERVIEW TAB */}
          {activeTab === 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Door Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-colors shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4 text-[#347F6C]" />
                    <h4 className="font-sora font-semibold text-sm text-[#172A2B]">1. Porta de Entrada</h4>
                  </div>
                  {getStatusBadge(diagnosis.doorDiagnosis.status)}
                </div>
                <p className="text-xs text-[#65716F] mb-3 leading-relaxed">
                  {diagnosis.doorDiagnosis.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E1E3DB]">
                  <span className="text-[#65716F]">Vão cadastrado: {path.door.width} × {path.door.height} cm</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('door')}
                    className="text-[#347F6C] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Ajustar medida <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Hallway Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-colors shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Columns3 className="w-4 h-4 text-[#347F6C]" />
                    <h4 className="font-sora font-semibold text-sm text-[#172A2B]">2. Corredores & Curvas</h4>
                  </div>
                  {getStatusBadge(diagnosis.hallwayDiagnosis.status)}
                </div>
                <p className="text-xs text-[#65716F] mb-3 leading-relaxed">
                  {diagnosis.hallwayDiagnosis.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E1E3DB]">
                  <span className="text-[#65716F]">Largura: {path.hallway.width} cm {path.hallway.hasCorner ? '(com curva 90°)' : ''}</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hallway')}
                    className="text-[#347F6C] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Ajustar medida <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Elevator Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-colors shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#347F6C]" />
                    <h4 className="font-sora font-semibold text-sm text-[#172A2B]">3. Elevador</h4>
                  </div>
                  {getStatusBadge(diagnosis.elevatorDiagnosis.status)}
                </div>
                <p className="text-xs text-[#65716F] mb-3 leading-relaxed">
                  {diagnosis.elevatorDiagnosis.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E1E3DB]">
                  <span className="text-[#65716F]">Cabine: {path.elevator.cabinWidth} × {path.elevator.cabinDepth} × {path.elevator.cabinHeight} cm</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('elevator')}
                    className="text-[#347F6C] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Ajustar medida <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stairs Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-colors shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StairsIcon className="w-4 h-4 text-[#347F6C]" />
                    <h4 className="font-sora font-semibold text-sm text-[#172A2B]">4. Escadas & Patamares</h4>
                  </div>
                  {getStatusBadge(diagnosis.stairsDiagnosis.status)}
                </div>
                <p className="text-xs text-[#65716F] mb-3 leading-relaxed">
                  {diagnosis.stairsDiagnosis.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E1E3DB]">
                  <span className="text-[#65716F]">Largura da escada: {path.stairs.stairWidth} cm</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('stairs')}
                    className="text-[#347F6C] font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    Ajustar medida <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DOORWAY TAB */}
          {activeTab === 'door' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E1E3DB]">
                <h3 className="font-sora font-bold text-base text-[#172A2B] mb-2 flex items-center gap-2">
                  <DoorClosed className="w-5 h-5 text-[#347F6C]" />
                  Configurar medidas da porta de entrada
                </h3>
                <p className="text-xs text-[#65716F] mb-4">
                  Lembre-se de medir o vão livre (entre batentes internos), com a porta totalmente aberta em 90 graus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Largura do vão da porta (cm)
                    </label>
                    <input
                      type="number"
                      value={path.door.width}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          door: { ...path.door, width: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                    <span className="text-[11px] text-[#65716F]">Padrão Brasil: 80 ou 70 cm</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Altura do vão (cm)
                    </label>
                    <input
                      type="number"
                      value={path.door.height}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          door: { ...path.door, height: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                    <span className="text-[11px] text-[#65716F]">Padrão Brasil: 210 cm</span>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#FAF8F3] rounded-xl border border-[#E1E3DB]">
                      <input
                        type="checkbox"
                        checked={path.door.removeDoorTrim || false}
                        onChange={(e) =>
                          handleUpdate({
                            ...path,
                            door: { ...path.door, removeDoorTrim: e.target.checked },
                          })
                        }
                        className="rounded text-[#347F6C] focus:ring-[#347F6C]"
                      />
                      <span className="text-xs text-[#172A2B] font-medium">
                        Posso retirar a folha da porta (-4cm livres)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Diagnostic Result Box */}
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sora font-semibold text-sm text-[#172A2B]">
                      Diagnóstico da porta:
                    </span>
                    {getStatusBadge(diagnosis.doorDiagnosis.status)}
                  </div>
                  <p className="text-xs text-[#475569] mb-2">{diagnosis.doorDiagnosis.description}</p>
                  {diagnosis.doorDiagnosis.tips.length > 0 && (
                    <ul className="text-xs text-[#347F6C] space-y-1 list-disc list-inside">
                      {diagnosis.doorDiagnosis.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HALLWAY TAB */}
          {activeTab === 'hallway' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E1E3DB]">
                <h3 className="font-sora font-bold text-base text-[#172A2B] mb-2 flex items-center gap-2">
                  <Columns3 className="w-5 h-5 text-[#347F6C]" />
                  Corredores e Curvas de 90 Graus
                </h3>
                <p className="text-xs text-[#65716F] mb-4">
                  Móveis compridos (como sofás de 210cm) não conseguem fazer curvas em corredores estreitos deitados no chão; eles precisam ser girados na vertical se o pé-direito permitir.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Largura do corredor (cm)
                    </label>
                    <input
                      type="number"
                      value={path.hallway.width}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          hallway: { ...path.hallway, width: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                    <span className="text-[11px] text-[#65716F]">Padrão: 90 cm a 100 cm</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Pé-direito / Altura livre (cm)
                    </label>
                    <input
                      type="number"
                      value={path.hallway.ceilingHeight}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          hallway: { ...path.hallway, ceilingHeight: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                    <span className="text-[11px] text-[#65716F]">Importante para girar em pé</span>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#FAF8F3] rounded-xl border border-[#E1E3DB]">
                      <input
                        type="checkbox"
                        checked={path.hallway.hasCorner}
                        onChange={(e) =>
                          handleUpdate({
                            ...path,
                            hallway: { ...path.hallway, hasCorner: e.target.checked },
                          })
                        }
                        className="rounded text-[#347F6C] focus:ring-[#347F6C]"
                      />
                      <span className="text-xs text-[#172A2B] font-medium">
                        O trajeto possui curva em L (90°)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Diagnostic Result */}
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sora font-semibold text-sm text-[#172A2B]">
                      Diagnóstico do corredor:
                    </span>
                    {getStatusBadge(diagnosis.hallwayDiagnosis.status)}
                  </div>
                  <p className="text-xs text-[#475569] mb-2">{diagnosis.hallwayDiagnosis.description}</p>
                  {diagnosis.hallwayDiagnosis.tips.length > 0 && (
                    <ul className="text-xs text-[#347F6C] space-y-1 list-disc list-inside">
                      {diagnosis.hallwayDiagnosis.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ELEVATOR TAB */}
          {activeTab === 'elevator' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E1E3DB]">
                <h3 className="font-sora font-bold text-base text-[#172A2B] mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#347F6C]" />
                  Elevador de Serviço / Social
                </h3>
                <p className="text-xs text-[#65716F] mb-4">
                  O CabeAí calcula a diagonal tridimensional da cabine (da base dianteira ao teto traseiro) para verificar se o produto cabe inclinado.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Largura da porta (cm)
                    </label>
                    <input
                      type="number"
                      value={path.elevator.doorWidth}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          elevator: { ...path.elevator, doorWidth: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Largura interna (cm)
                    </label>
                    <input
                      type="number"
                      value={path.elevator.cabinWidth}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          elevator: { ...path.elevator, cabinWidth: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Profundidade interna (cm)
                    </label>
                    <input
                      type="number"
                      value={path.elevator.cabinDepth}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          elevator: { ...path.elevator, cabinDepth: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Altura interna (cm)
                    </label>
                    <input
                      type="number"
                      value={path.elevator.cabinHeight}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          elevator: { ...path.elevator, cabinHeight: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                  </div>
                </div>

                {/* Diagnostic Result */}
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sora font-semibold text-sm text-[#172A2B]">
                      Diagnóstico do elevador:
                    </span>
                    {getStatusBadge(diagnosis.elevatorDiagnosis.status)}
                  </div>
                  <p className="text-xs text-[#475569] mb-2">{diagnosis.elevatorDiagnosis.description}</p>
                  {diagnosis.elevatorDiagnosis.tips.length > 0 && (
                    <ul className="text-xs text-[#347F6C] space-y-1 list-disc list-inside">
                      {diagnosis.elevatorDiagnosis.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAIRS TAB */}
          {activeTab === 'stairs' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E1E3DB]">
                <h3 className="font-sora font-bold text-base text-[#172A2B] mb-2 flex items-center gap-2">
                  <StairsIcon className="w-5 h-5 text-[#347F6C]" />
                  Escadas e Patamares de Giro
                </h3>
                <p className="text-xs text-[#65716F] mb-4">
                  Se o produto não couber no elevador ou a entrega for em casa de dois andares, a escada é a rota crítica.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Largura livre da escada (cm)
                    </label>
                    <input
                      type="number"
                      value={path.stairs.stairWidth}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          stairs: { ...path.stairs, stairWidth: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                    <span className="text-[11px] text-[#65716F]">Desconte corrimãos fixos</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                      Pé-direito na inclinação (cm)
                    </label>
                    <input
                      type="number"
                      value={path.stairs.ceilingClearance}
                      onChange={(e) =>
                        handleUpdate({
                          ...path,
                          stairs: { ...path.stairs, ceilingClearance: Number(e.target.value) || 0 },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-semibold text-[#172A2B] text-sm"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-[#FAF8F3] rounded-xl border border-[#E1E3DB]">
                      <input
                        type="checkbox"
                        checked={path.stairs.hasTurn}
                        onChange={(e) =>
                          handleUpdate({
                            ...path,
                            stairs: { ...path.stairs, hasTurn: e.target.checked },
                          })
                        }
                        className="rounded text-[#347F6C] focus:ring-[#347F6C]"
                      />
                      <span className="text-xs text-[#172A2B] font-medium">
                        Escada tem curva / patamar intermediário
                      </span>
                    </label>
                  </div>
                </div>

                {/* Diagnostic Result */}
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-sora font-semibold text-sm text-[#172A2B]">
                      Diagnóstico das escadas:
                    </span>
                    {getStatusBadge(diagnosis.stairsDiagnosis.status)}
                  </div>
                  <p className="text-xs text-[#475569] mb-2">{diagnosis.stairsDiagnosis.description}</p>
                  {diagnosis.stairsDiagnosis.tips.length > 0 && (
                    <ul className="text-xs text-[#347F6C] space-y-1 list-disc list-inside">
                      {diagnosis.stairsDiagnosis.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3 bg-[#FAF8F3] border-t border-[#E1E3DB] flex items-center justify-between">
          <span className="text-xs text-[#65716F]">
            * O CabeAí é uma ferramenta de planejamento dimensional. Condições físicas reais podem variar.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white font-semibold text-xs sm:text-sm transition-colors"
          >
            Concluir Verificação
          </button>
        </div>

      </div>
    </div>
  );
};
