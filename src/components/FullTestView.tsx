import React, { useState } from 'react';
import {
  Dimensions,
  FitCalculationResult,
  ProductCategory,
  RoomClearances,
  SavedRoom,
} from '../types';
import { calculateSpaceFit } from '../utils/calculator';
import { CATEGORIES, PRODUCT_PRESETS } from '../data/categories';
import { InteractiveDiagram } from './InteractiveDiagram';
import {
  Box,
  RotateCw,
  DoorClosed,
  BookmarkPlus,
  Sliders,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface FullTestViewProps {
  savedRooms: SavedRoom[];
  initialCategory?: ProductCategory;
  initialRoomId?: string;
  onOpenPathChecker: (initialTab?: 'door' | 'hallway' | 'elevator') => void;
  onSaveTest: (testData: {
    productName: string;
    category: ProductCategory;
    productDim: Dimensions;
    spaceDim: Dimensions;
    roomId?: string;
    roomName?: string;
    fitResult: FitCalculationResult;
  }) => void;
}

export const FullTestView: React.FC<FullTestViewProps> = ({
  savedRooms,
  initialCategory = 'sofas',
  initialRoomId,
  onOpenPathChecker,
  onSaveTest,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sofa-3-lugares-padrao');
  const [productName, setProductName] = useState<string>('Sofá 3 Lugares Confort');
  const [unit, setUnit] = useState<'cm' | 'm'>('cm');

  // Product dimensions
  const [productDim, setProductDim] = useState<Dimensions>({
    width: 210,
    height: 92,
    depth: 95,
  });

  // Packaging dimensions (optional)
  const [hasPackagingDim, setHasPackagingDim] = useState<boolean>(false);
  const [packagingDim, setPackagingDim] = useState<Dimensions>({
    width: 215,
    height: 96,
    depth: 100,
  });

  // Space dimensions
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId || '');
  const [spaceDim, setSpaceDim] = useState<Dimensions>(() => {
    if (initialRoomId) {
      const room = savedRooms.find((r) => r.id === initialRoomId);
      if (room) return { ...room.dimensions };
    }
    return { width: 230, height: 260, depth: 110 };
  });

  // Clearances
  const [clearances, setClearances] = useState<RoomClearances>({
    minSideClearance: 0,
    circulationSpace: 0,
    ventilationClearance: 0,
  });

  const [showAdvancedClearance, setShowAdvancedClearance] = useState<boolean>(false);
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'top' | 'front'>('top');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRODUCT_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setProductName(preset.name);
      setProductDim({ ...preset.dimensions });
      if (preset.packagingDimensions) {
        setPackagingDim({ ...preset.packagingDimensions });
      }
      if (preset.requiredClearance) {
        setClearances((prev) => ({
          ...prev,
          ventilationClearance: preset.requiredClearance?.lateral || 0,
        }));
      }
    }
  };

  // Handle Room selection
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    if (!roomId) return;
    const room = savedRooms.find((r) => r.id === roomId);
    if (room) {
      setSpaceDim({ ...room.dimensions });
    }
  };

  // Unit conversion helpers
  const toDisplayValue = (cmVal: number) => {
    return unit === 'm' ? (cmVal / 100).toFixed(2) : Math.round(cmVal).toString();
  };

  const handleProductChange = (field: keyof Dimensions, rawVal: string) => {
    const num = parseFloat(rawVal) || 0;
    const cm = unit === 'm' ? num * 100 : num;
    setProductDim((prev) => ({ ...prev, [field]: cm }));
  };

  const handleSpaceChange = (field: keyof Dimensions, rawVal: string) => {
    const num = parseFloat(rawVal) || 0;
    const cm = unit === 'm' ? num * 100 : num;
    setSpaceDim((prev) => ({ ...prev, [field]: cm }));
  };

  // Calculation
  const fitResult = calculateSpaceFit(productDim, spaceDim, clearances, isRotated);

  const handleSave = () => {
    const room = savedRooms.find((r) => r.id === selectedRoomId);
    onSaveTest({
      productName,
      category: selectedCategory,
      productDim,
      spaceDim,
      roomId: selectedRoomId || undefined,
      roomName: room?.name,
      fitResult,
    });
    setSaveSuccessMessage('Teste salvo com sucesso em Meus Projetos!');
    setTimeout(() => setSaveSuccessMessage(''), 4000);
  };

  const currentCategoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);
  const presetsForCategory = PRODUCT_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold font-sora text-[#172A2B]">
          Testar dimensões do móvel
        </h1>
        <p className="text-sm sm:text-base text-[#65716F]">
          Insira as medidas do objeto e do seu ambiente para calcular acomodação, folgas de ventilação e rotação de 90°.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                const firstPreset = PRODUCT_PRESETS.find((p) => p.category === cat.id);
                if (firstPreset) handleSelectPreset(firstPreset.id);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#347F6C] text-white border-[#347F6C] shadow-sm'
                  : 'bg-white text-[#65716F] border-[#E1E3DB] hover:text-[#172A2B] hover:border-[#347F6C]/40'
              }`}
            >
              {cat.title}
            </button>
          );
        })}
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Forms (Product & Room) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Dados do Produto */}
          <div className="bg-white rounded-3xl border border-[#E1E3DB] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E3DB] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#347F6C] text-white text-xs font-bold flex items-center justify-center font-sora">
                  1
                </span>
                <h2 className="font-sora font-bold text-base text-[#172A2B]">
                  Dados do produto
                </h2>
              </div>

              {/* Unit switcher */}
              <div className="flex items-center bg-[#FAF8F3] rounded-lg p-0.5 border border-[#E1E3DB] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    unit === 'cm' ? 'bg-[#347F6C] text-white' : 'text-[#65716F]'
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('m')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    unit === 'm' ? 'bg-[#347F6C] text-white' : 'text-[#65716F]'
                  }`}
                >
                  m
                </button>
              </div>
            </div>

            {/* Presets dropdown if available */}
            {presetsForCategory.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                  Modelos de referência sugeridos:
                </label>
                <select
                  value={selectedPresetId}
                  onChange={(e) => handleSelectPreset(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-xs font-medium text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
                >
                  {presetsForCategory.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} ({preset.dimensions.width}×{preset.dimensions.height}×{preset.dimensions.depth} cm)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                Nome do produto / marca
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Sofá Retrátil 3 Lugares, Geladeira Frost Free 400L"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-sm font-semibold text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            {/* 3 Dimensions Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">Largura</label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.width)}
                    onChange={(e) => handleProductChange('width', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">Altura</label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.height)}
                    onChange={(e) => handleProductChange('height', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">Profundidade</label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.depth)}
                    onChange={(e) => handleProductChange('depth', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Category advice box */}
            {currentCategoryInfo && (
              <div className="p-3 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-xs text-[#65716F] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#347F6C] shrink-0 mt-0.5" />
                <span>{currentCategoryInfo.typicalClearanceNotes}</span>
              </div>
            )}
          </div>

          {/* Card: Dados do Ambiente */}
          <div className="bg-white rounded-3xl border border-[#E1E3DB] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E1E3DB] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#347F6C] text-white text-xs font-bold flex items-center justify-center font-sora">
                  2
                </span>
                <h2 className="font-sora font-bold text-base text-[#172A2B]">
                  Dados do ambiente / espaço
                </h2>
              </div>

              {savedRooms.length > 0 && (
                <div className="text-xs">
                  <select
                    value={selectedRoomId}
                    onChange={(e) => handleSelectRoom(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-[#FAF8F3] border border-[#E1E3DB] text-xs font-medium text-[#347F6C]"
                  >
                    <option value="">Carregar cômodo salvo...</option>
                    {savedRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.dimensions.width}×{r.dimensions.depth} cm)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Space dimensions */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                  Largura disponível
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(spaceDim.width)}
                    onChange={(e) => handleSpaceChange('width', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                  Pé-direito (altura)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(spaceDim.height || 260)}
                    onChange={(e) => handleSpaceChange('height', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172A2B] mb-1">
                  Profundidade disponível
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(spaceDim.depth)}
                    onChange={(e) => handleSpaceChange('depth', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden"
                  />
                  <span className="absolute right-2.5 top-2 text-xs font-semibold text-[#65716F]">
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Advanced Clearances toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedClearance(!showAdvancedClearance)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#347F6C] hover:underline"
              >
                <Sliders className="w-3.5 h-3.5" />
                {showAdvancedClearance ? 'Ocultar folgas e circulação' : '+ Informar folgas mínimas e ventilação do fabricante'}
              </button>

              {showAdvancedClearance && (
                <div className="mt-3 p-4 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB] space-y-3">
                  <p className="text-[11px] text-[#65716F]">
                    Defina distâncias recomendadas pelo fabricante ou necessárias para passagem de pessoas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#172A2B] mb-1">
                        Folga lateral mínima (cm)
                      </label>
                      <input
                        type="number"
                        value={clearances.minSideClearance}
                        onChange={(e) =>
                          setClearances({ ...clearances, minSideClearance: Number(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E1E3DB] text-xs font-semibold text-[#172A2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#172A2B] mb-1">
                        Circulação frontal (cm)
                      </label>
                      <input
                        type="number"
                        value={clearances.circulationSpace}
                        onChange={(e) =>
                          setClearances({ ...clearances, circulationSpace: Number(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E1E3DB] text-xs font-semibold text-[#172A2B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#172A2B] mb-1">
                        Ventilação fabricante (cm)
                      </label>
                      <input
                        type="number"
                        value={clearances.ventilationClearance}
                        onChange={(e) =>
                          setClearances({ ...clearances, ventilationClearance: Number(e.target.value) || 0 })
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E1E3DB] text-xs font-semibold text-[#172A2B]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Architectural Diagram & Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SVG Diagram Card */}
          <InteractiveDiagram
            productDim={productDim}
            spaceDim={spaceDim}
            fitResult={fitResult}
            category={selectedCategory}
            productName={productName}
            isRotated={isRotated}
            onToggleRotation={() => setIsRotated(!isRotated)}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
          />

          {/* Result & Diagnosis Report Card */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              fitResult.status === 'fits'
                ? 'bg-white border-[#347F6C]/40 shadow-xs'
                : fitResult.status === 'fits_with_restrictions'
                ? 'bg-white border-[#F59E0B]/50 shadow-xs'
                : 'bg-white border-[#DC2626]/40 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E1E3DB]">
              <div className="flex items-center gap-3">
                {fitResult.status === 'fits' ? (
                  <div className="w-10 h-10 rounded-2xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : fitResult.status === 'fits_with_restrictions' ? (
                  <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold font-sora text-[#172A2B]">
                    {fitResult.statusText}
                  </h3>
                  <p className="text-xs text-[#65716F]">
                    {fitResult.statusDescription}
                  </p>
                </div>
              </div>

              {/* Rotate button in result if applicable */}
              {fitResult.canRotateToFit && (
                <button
                  type="button"
                  onClick={() => setIsRotated(!isRotated)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E5F0E8] text-[#347F6C] hover:bg-[#347F6C] hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-[#347F6C]/30"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Girar 90° para caber
                </button>
              )}
            </div>

            {/* Detail Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4">
              {fitResult.details.map((detail, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB]">
                  <span className="text-[11px] font-medium text-[#65716F] block">
                    {detail.label}
                  </span>
                  <span className={`text-sm font-bold font-sora ${
                    detail.status === 'ok' ? 'text-[#347F6C]' : detail.status === 'warning' ? 'text-[#F47736]' : 'text-[#DC2626]'
                  }`}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Warnings and Recommendations */}
            {(fitResult.warnings.length > 0 || fitResult.recommendations.length > 0) && (
              <div className="pt-2 space-y-2 border-t border-[#E1E3DB]">
                {fitResult.warnings.map((warn, i) => (
                  <p key={i} className="text-xs text-[#C2410C] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{warn}</span>
                  </p>
                ))}
                {fitResult.recommendations.map((rec, i) => (
                  <p key={i} className="text-xs text-[#347F6C] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{rec}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Delivery Path CTA Box */}
            <div className="mt-5 p-4 rounded-2xl bg-[#E5F0E8] border border-[#347F6C]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-sora font-bold text-sm text-[#172A2B] block">
                  O móvel cabe no cômodo. Mas consegue chegar até lá?
                </span>
                <span className="text-xs text-[#65716F]">
                  Verifique a porta de entrada, o corredor, curvas e a cabine do elevador.
                </span>
              </div>
              <button
                type="button"
                onClick={() => onOpenPathChecker()}
                className="shrink-0 px-4 py-2 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <DoorClosed className="w-4 h-4" />
                Verificar Caminho
              </button>
            </div>

            {/* Save Test Action Bar */}
            <div className="mt-4 flex items-center justify-between pt-2">
              <span className="text-xs text-[#347F6C] font-semibold">
                {saveSuccessMessage}
              </span>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl border border-[#E1E3DB] hover:border-[#347F6C] bg-white text-xs font-bold text-[#172A2B] transition-colors inline-flex items-center gap-1.5"
              >
                <BookmarkPlus className="w-4 h-4 text-[#347F6C]" />
                Salvar Teste em Meus Projetos
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
