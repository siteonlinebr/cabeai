import React, { useState } from 'react';
import { Dimensions, FitCalculationResult, ProductCategory } from '../types';
import { calculateSpaceFit } from '../utils/calculator';
import { InteractiveDiagram } from './InteractiveDiagram';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DoorClosed,
  Columns3,
  Building2,
  ArrowRight,
  RotateCw,
  SlidersHorizontal,
  BookmarkPlus,
} from 'lucide-react';

interface HeroWidgetProps {
  onOpenPathChecker: (initialTab?: 'door' | 'hallway' | 'elevator') => void;
  onSaveCurrentTest?: (testData: {
    productName: string;
    category: ProductCategory;
    productDim: Dimensions;
    spaceDim: Dimensions;
    fitResult: FitCalculationResult;
  }) => void;
  onSelectCategory?: (category: ProductCategory) => void;
}

export const HeroWidget: React.FC<HeroWidgetProps> = ({
  onOpenPathChecker,
  onSaveCurrentTest,
  onSelectCategory,
}) => {
  // Initial default values matching the exact mockup scenario:
  // Product: Sofa (Width 210, Height 92, Depth 95)
  // Space: Width 230, Depth 110 (Height 260)
  const [productDim, setProductDim] = useState<Dimensions>({
    width: 210,
    height: 92,
    depth: 95,
  });

  const [spaceDim, setSpaceDim] = useState<Dimensions>({
    width: 230,
    height: 260,
    depth: 110,
  });

  const [productName, setProductName] = useState<string>('Sofá Confort 3 Lugares');
  const [category, setCategory] = useState<ProductCategory>('sofas');
  const [isRotated, setIsRotated] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'top' | 'front'>('top');
  const [unit, setUnit] = useState<'cm' | 'm'>('cm');

  // Calculation
  const fitResult = calculateSpaceFit(
    productDim,
    spaceDim,
    { minSideClearance: 0, circulationSpace: 0, ventilationClearance: 0 },
    isRotated
  );

  const handleUnitToggle = (newUnit: 'cm' | 'm') => {
    if (newUnit === unit) return;
    setUnit(newUnit);
  };

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

  return (
    <div className="w-full">
      {/* The Main Elevated Architectural Card */}
      <div className="bg-white rounded-3xl border border-[#E1E3DB] shadow-xl p-5 sm:p-7 transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* STEP 1: Medidas do móvel (Cols 1-3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#347F6C] text-white text-xs font-bold flex items-center justify-center font-sora">
                  1
                </span>
                <h3 className="font-sora font-bold text-sm sm:text-base text-[#172A2B]">
                  Medidas do móvel
                </h3>
              </div>

              {/* cm / m switcher */}
              <div className="flex items-center bg-[#FAF8F3] rounded-lg p-0.5 border border-[#E1E3DB] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => handleUnitToggle('cm')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unit === 'cm' ? 'bg-[#347F6C] text-white shadow-2xs' : 'text-[#65716F]'
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle('m')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    unit === 'm' ? 'bg-[#347F6C] text-white shadow-2xs' : 'text-[#65716F]'
                  }`}
                >
                  m
                </button>
              </div>
            </div>

            {/* Furniture Visual Representation */}
            <div className="relative bg-[#FAF8F3] rounded-2xl p-3 border border-[#E1E3DB] flex items-center justify-center group">
              <svg viewBox="0 0 160 85" className="w-36 h-20 text-[#347F6C] drop-shadow-xs">
                {/* Clean Sofa Outline Vector */}
                <rect x="15" y="25" width="130" height="42" rx="8" fill="#ECE5D8" stroke="#6A6150" strokeWidth="2.5" />
                {/* Backrest */}
                <path d="M 20 25 C 20 12, 140 12, 140 25 Z" fill="#D8CEBE" stroke="#6A6150" strokeWidth="2.5" />
                {/* Cushions */}
                <rect x="25" y="27" width="52" height="36" rx="5" fill="#FAF6EE" stroke="#A89B84" strokeWidth="1.5" />
                <rect x="83" y="27" width="52" height="36" rx="5" fill="#FAF6EE" stroke="#A89B84" strokeWidth="1.5" />
                {/* Armrests */}
                <rect x="10" y="20" width="16" height="47" rx="6" fill="#C6BBA8" stroke="#6A6150" strokeWidth="2.5" />
                <rect x="134" y="20" width="16" height="47" rx="6" fill="#C6BBA8" stroke="#6A6150" strokeWidth="2.5" />
                {/* Feet */}
                <line x1="20" y1="67" x2="16" y2="78" stroke="#443929" strokeWidth="4" strokeLinecap="round" />
                <line x1="140" y1="67" x2="144" y2="78" stroke="#443929" strokeWidth="4" strokeLinecap="round" />
                <line x1="80" y1="67" x2="80" y2="78" stroke="#443929" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Dimension Inputs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#172A2B]">Largura</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.width)}
                    onChange={(e) => handleProductChange('width', e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-center font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden transition-all"
                  />
                  <span className="text-xs font-semibold text-[#65716F] w-6">{unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#172A2B]">Altura</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.height)}
                    onChange={(e) => handleProductChange('height', e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-center font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden transition-all"
                  />
                  <span className="text-xs font-semibold text-[#65716F] w-6">{unit}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[#172A2B]">Profundidade</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={unit === 'm' ? '0.01' : '1'}
                    value={toDisplayValue(productDim.depth)}
                    onChange={(e) => handleProductChange('depth', e.target.value)}
                    className="w-20 px-2.5 py-1.5 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-center font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:bg-white focus:outline-hidden transition-all"
                  />
                  <span className="text-xs font-semibold text-[#65716F] w-6">{unit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Architectural Dynamic Blueprint (Cols 4-8) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <InteractiveDiagram
              productDim={productDim}
              spaceDim={spaceDim}
              fitResult={fitResult}
              category={category}
              productName={productName}
              isRotated={isRotated}
              onToggleRotation={() => setIsRotated(!isRotated)}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />
          </div>

          {/* STEP 2: Seu espaço & Resultado (Cols 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Step 2 Header & Room Inputs */}
            <div className="space-y-3 bg-[#FAF8F3] p-4 rounded-2xl border border-[#E1E3DB]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#347F6C] text-white text-xs font-bold flex items-center justify-center font-sora">
                  2
                </span>
                <h3 className="font-sora font-bold text-sm sm:text-base text-[#172A2B]">
                  Seu espaço
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#172A2B]">Largura disponível</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step={unit === 'm' ? '0.01' : '1'}
                      value={toDisplayValue(spaceDim.width)}
                      onChange={(e) => handleSpaceChange('width', e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E3DB] text-center font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden transition-all"
                    />
                    <span className="text-xs font-semibold text-[#65716F] w-6">{unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#172A2B]">Profundidade disponível</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step={unit === 'm' ? '0.01' : '1'}
                      value={toDisplayValue(spaceDim.depth)}
                      onChange={(e) => handleSpaceChange('depth', e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-[#E1E3DB] text-center font-bold text-sm text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden transition-all"
                    />
                    <span className="text-xs font-semibold text-[#65716F] w-6">{unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Status Badge (Matches green checkmark badge in Mockup!) */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                fitResult.status === 'fits'
                  ? 'bg-[#E5F0E8] border-[#347F6C]/30 text-[#172A2B]'
                  : fitResult.status === 'fits_with_restrictions'
                  ? 'bg-[#FFFBEB] border-[#F59E0B]/40 text-[#172A2B]'
                  : 'bg-[#FEF2F2] border-[#EF4444]/40 text-[#172A2B]'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {fitResult.status === 'fits' ? (
                  <div className="w-8 h-8 rounded-full bg-[#347F6C] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : fitResult.status === 'fits_with_restrictions' ? (
                  <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center shadow-xs">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-sora font-bold text-sm sm:text-base leading-tight">
                  {fitResult.statusText}
                </h4>
                <p className="text-xs text-[#475569] mt-0.5 font-medium">
                  {fitResult.statusDescription}
                </p>
                {fitResult.canRotateToFit && (
                  <button
                    type="button"
                    onClick={() => setIsRotated(!isRotated)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#347F6C] hover:underline"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Testar rotação de 90° para caber
                  </button>
                )}
              </div>
            </div>

            {/* Path Checking Action Banner (Green banner from Mockup!) */}
            <div className="bg-[#E5F0E8] rounded-2xl border border-[#347F6C]/20 p-3 sm:p-4 space-y-3">
              <button
                type="button"
                onClick={() => onOpenPathChecker()}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/80 text-[#347F6C] flex items-center justify-center shadow-2xs">
                    <DoorClosed className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold font-sora text-[#172A2B] group-hover:text-[#347F6C] transition-colors">
                      Agora confira o caminho até o cômodo
                    </span>
                    <p className="text-[11px] text-[#65716F]">
                      Portas, elevadores e curvas de entrega
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#347F6C] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* 3 Shortcut Buttons for Door, Hallway, Elevator */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#347F6C]/15">
                <button
                  type="button"
                  onClick={() => onOpenPathChecker('door')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] text-[#172A2B] transition-colors shadow-2xs text-center"
                >
                  <DoorClosed className="w-4 h-4 text-[#347F6C] mb-1" />
                  <span className="text-[11px] font-semibold">Porta</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenPathChecker('hallway')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] text-[#172A2B] transition-colors shadow-2xs text-center"
                >
                  <Columns3 className="w-4 h-4 text-[#347F6C] mb-1" />
                  <span className="text-[11px] font-semibold">Corredor</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenPathChecker('elevator')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] text-[#172A2B] transition-colors shadow-2xs text-center"
                >
                  <Building2 className="w-4 h-4 text-[#347F6C] mb-1" />
                  <span className="text-[11px] font-semibold">Elevador</span>
                </button>
              </div>
            </div>

            {/* Quick Save Test Button */}
            {onSaveCurrentTest && (
              <button
                type="button"
                onClick={() =>
                  onSaveCurrentTest({
                    productName,
                    category,
                    productDim,
                    spaceDim,
                    fitResult,
                  })
                }
                className="w-full py-2 px-3 rounded-xl border border-[#E1E3DB] hover:border-[#347F6C] bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#172A2B] transition-colors inline-flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#347F6C]" />
                Salvar este teste nos Meus Projetos
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
