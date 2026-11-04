import React from 'react';
import { HeroWidget } from './HeroWidget';
import { Dimensions, FitCalculationResult, ProductCategory } from '../types';
import { CATEGORIES } from '../data/categories';
import {
  Ruler,
  Play,
  ArrowRight,
  Home as HomeIcon,
  DoorClosed,
  Box,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  onStartTest: () => void;
  onNavigateHowItWorks: () => void;
  onNavigateRooms: () => void;
  onNavigateProjects: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenPathChecker: (initialTab?: 'door' | 'hallway' | 'elevator') => void;
  onSaveCurrentTest: (testData: {
    productName: string;
    category: ProductCategory;
    productDim: Dimensions;
    spaceDim: Dimensions;
    fitResult: FitCalculationResult;
  }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartTest,
  onNavigateHowItWorks,
  onNavigateRooms,
  onNavigateProjects,
  onSelectCategory,
  onOpenPathChecker,
  onSaveCurrentTest,
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <h1 className="font-sora text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-tight text-[#172A2B] leading-[1.08]">
                  Seu móvel cabe.
                  <span className="block text-[#347F6C]">E chega até lá?</span>
                </h1>

                <p className="text-base sm:text-lg text-[#65716F] font-medium max-w-xl leading-relaxed pt-1">
                  Confira as medidas do ambiente e do caminho antes de comprar ou receber móveis e eletrodomésticos.
                </p>
              </div>

              {/* Action Buttons (Orange Primary + White Secondary matching Mockup) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onStartTest}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[#F47736] hover:bg-[#dc6221] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 group"
                >
                  <Ruler className="w-4 h-4" />
                  <span>Testar uma medida</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={onNavigateHowItWorks}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-[#FAF8F3] text-[#172A2B] border border-[#E1E3DB] hover:border-[#347F6C] text-sm sm:text-base font-bold shadow-xs hover:shadow-sm transition-all"
                >
                  <Play className="w-4 h-4 text-[#347F6C] fill-current" />
                  <span>Como funciona</span>
                </button>
              </div>
            </div>

            {/* Right Column: Architectural Perspective Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-[#E1E3DB] shadow-lg bg-gradient-to-br from-[#E5F0E8] to-[#FAF8F3] p-1">
                {/* Embedded High-Res Architectural Living Room Perspective */}
                <div className="relative rounded-[22px] overflow-hidden bg-[#24463E] aspect-4/3 flex items-center justify-center">
                  <svg viewBox="0 0 500 360" className="w-full h-full">
                    <defs>
                      <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3B6358" />
                        <stop offset="100%" stopColor="#2A4B42" />
                      </linearGradient>
                      <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B3926F" />
                        <stop offset="100%" stopColor="#967756" />
                      </linearGradient>
                    </defs>

                    {/* Room Wall */}
                    <rect width="500" height="260" fill="url(#wallGrad)" />
                    {/* Hardwood Floor */}
                    <polygon points="0,260 500,260 500,360 0,360" fill="url(#floorGrad)" />
                    {/* Baseboard */}
                    <rect x="0" y="254" width="500" height="6" fill="#F4EFE6" />

                    {/* Doorway in the Background */}
                    <g transform="translate(380, 50)">
                      <rect x="0" y="0" width="75" height="204" fill="#FFFFFF" rx="2" />
                      <rect x="5" y="5" width="65" height="199" fill="#84502E" rx="2" />
                      <circle cx="14" cy="100" r="3" fill="#D4AF37" />
                    </g>

                    {/* Architectural Cutaway Arch on Left Wall */}
                    <path d="M 0,0 L 220,0 A 180,180 0 0,0 40,254 L 0,254 Z" fill="#4E776C" opacity="0.35" />

                    {/* Wall Art Frame */}
                    <rect x="230" y="45" width="40" height="55" fill="#FAF6EE" stroke="#172A2B" strokeWidth="2.5" />
                    <line x1="240" y1="55" x2="260" y2="90" stroke="#347F6C" strokeWidth="2" />

                    {/* Floor Lamp */}
                    <line x1="320" y1="90" x2="320" y2="280" stroke="#D1D5DB" strokeWidth="3" />
                    <path d="M 305 90 L 335 90 L 330 65 L 310 65 Z" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="1" />
                    <ellipse cx="320" cy="280" rx="14" ry="4" fill="#4B5563" />

                    {/* Area Rug */}
                    <ellipse cx="260" cy="305" rx="160" ry="42" fill="#D8CFBD" opacity="0.6" />

                    {/* Modern 3-Seater Sofa Perspective Rendering */}
                    <g transform="translate(140, 120)">
                      {/* Sofa Shadow */}
                      <ellipse cx="110" cy="155" rx="120" ry="16" fill="#000000" opacity="0.25" />

                      {/* Main Sofa Body */}
                      <rect x="10" y="45" width="200" height="75" rx="12" fill="#ECE5D8" stroke="#5E5343" strokeWidth="2" />
                      {/* Back cushions */}
                      <rect x="18" y="22" width="90" height="45" rx="8" fill="#DFD6C7" stroke="#6F6452" strokeWidth="2" />
                      <rect x="112" y="22" width="90" height="45" rx="8" fill="#DFD6C7" stroke="#6F6452" strokeWidth="2" />
                      {/* Accent Cushions */}
                      <rect x="25" y="38" width="24" height="24" rx="4" fill="#F47736" transform="rotate(-10, 25, 38)" />
                      <rect x="175" y="38" width="24" height="24" rx="4" fill="#347F6C" transform="rotate(10, 175, 38)" />
                      {/* Armrests */}
                      <rect x="2" y="36" width="24" height="75" rx="8" fill="#DFD6C7" stroke="#5E5343" strokeWidth="2" />
                      <rect x="194" y="36" width="24" height="75" rx="8" fill="#DFD6C7" stroke="#5E5343" strokeWidth="2" />
                      {/* Seat division */}
                      <line x1="110" y1="65" x2="110" y2="120" stroke="#B8AB96" strokeWidth="2" />
                      {/* Feet */}
                      <line x1="25" y1="120" x2="20" y2="138" stroke="#2B2117" strokeWidth="4.5" strokeLinecap="round" />
                      <line x1="195" y1="120" x2="200" y2="138" stroke="#2B2117" strokeWidth="4.5" strokeLinecap="round" />
                      <line x1="110" y1="120" x2="110" y2="138" stroke="#2B2117" strokeWidth="4" strokeLinecap="round" />

                      {/* Architectural Dimension Callouts on the Sofa */}
                      {/* Width Tag (210 cm) */}
                      <g transform="translate(45, 148)">
                        <line x1="0" y1="0" x2="130" y2="0" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="0" y1="-5" x2="0" y2="5" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="130" y1="-5" x2="130" y2="5" stroke="#FFFFFF" strokeWidth="2" />
                        <rect x="42" y="-9" width="48" height="18" fill="#172A2B" rx="4" />
                        <text x="66" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif">
                          210 cm
                        </text>
                      </g>

                      {/* Depth Tag (95 cm) */}
                      <g transform="translate(198, 95)">
                        <line x1="0" y1="0" x2="25" y2="25" stroke="#FFFFFF" strokeWidth="2" />
                        <rect x="5" y="8" width="42" height="16" fill="#172A2B" rx="4" />
                        <text x="26" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="Inter, sans-serif">
                          95 cm
                        </text>
                      </g>

                      {/* Height Tag (92 cm) */}
                      <g transform="translate(-18, 25)">
                        <line x1="0" y1="0" x2="0" y2="95" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="-4" y1="0" x2="4" y2="0" stroke="#FFFFFF" strokeWidth="2" />
                        <line x1="-4" y1="95" x2="4" y2="95" stroke="#FFFFFF" strokeWidth="2" />
                        <rect x="-35" y="40" width="30" height="26" fill="#172A2B" rx="4" />
                        <text x="-20" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="Inter, sans-serif">
                          92
                        </text>
                        <text x="-20" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="Inter, sans-serif">
                          cm
                        </text>
                      </g>
                    </g>

                    {/* Low Coffee Table */}
                    <g transform="translate(230, 265)">
                      <rect x="0" y="0" width="70" height="24" rx="4" fill="#6B4226" stroke="#452711" strokeWidth="1.5" />
                      <line x1="8" y1="24" x2="6" y2="38" stroke="#261509" strokeWidth="3" />
                      <line x1="62" y1="24" x2="64" y2="38" stroke="#261509" strokeWidth="3" />
                      {/* Books */}
                      <rect x="15" y="-5" width="20" height="5" fill="#172A2B" rx="1" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE MAIN INTERACTIVE HERO WIDGET (Exact Mockup Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroWidget
          onOpenPathChecker={onOpenPathChecker}
          onSaveCurrentTest={onSaveCurrentTest}
          onSelectCategory={onSelectCategory}
        />
      </section>

      {/* 4 FEATURE PILLS BAR (From Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onStartTest}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] hover:border-[#347F6C] shadow-2xs transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center shrink-0 group-hover:bg-[#347F6C] group-hover:text-white transition-colors">
              <HomeIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-sora font-bold text-xs sm:text-sm text-[#172A2B]">
                Cabe no ambiente
              </span>
              <span className="text-[11px] text-[#65716F]">
                Folgas laterais e área livre
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenPathChecker('door')}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] hover:border-[#347F6C] shadow-2xs transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center shrink-0 group-hover:bg-[#347F6C] group-hover:text-white transition-colors">
              <DoorClosed className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-sora font-bold text-xs sm:text-sm text-[#172A2B]">
                Passa pela entrada
              </span>
              <span className="text-[11px] text-[#65716F]">
                Porta, corredor e elevador
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartTest}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] hover:border-[#347F6C] shadow-2xs transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center shrink-0 group-hover:bg-[#347F6C] group-hover:text-white transition-colors">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-sora font-bold text-xs sm:text-sm text-[#172A2B]">
                Visualize a disposição
              </span>
              <span className="text-[11px] text-[#65716F]">
                Planta baixa e rotação 90°
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onNavigateRooms}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white hover:bg-[#FAF8F3] border border-[#E1E3DB] hover:border-[#347F6C] shadow-2xs transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E5F0E8] text-[#347F6C] flex items-center justify-center shrink-0 group-hover:bg-[#347F6C] group-hover:text-white transition-colors">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-sora font-bold text-xs sm:text-sm text-[#172A2B]">
                Salve suas medidas
              </span>
              <span className="text-[11px] text-[#65716F]">
                Cômodos salvos e backup
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* CATEGORIES SECTION: "O que você vai colocar na sua casa?" (From Mockup) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E1E3DB] pb-4">
          <div>
            <h2 className="font-sora text-2xl sm:text-3xl font-bold text-[#172A2B]">
              O que você vai colocar na sua casa?
            </h2>
            <div className="w-16 h-1 bg-[#347F6C] rounded-full mt-2" />
          </div>
          <p className="text-xs sm:text-sm text-[#65716F]">
            Selecione uma categoria para começar com dimensões padrão de mercado.
          </p>
        </div>

        {/* 4 Large Visual Category Cards Matching Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Sofas e poltronas */}
          <div
            onClick={() => onSelectCategory('sofas')}
            className="bg-[#F3EDE2] rounded-3xl p-5 border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-32 flex items-center justify-center">
              <svg viewBox="0 0 160 85" className="w-36 h-20 text-[#6A6150] drop-shadow-xs group-hover:scale-105 transition-transform">
                <rect x="15" y="25" width="130" height="42" rx="8" fill="#ECE5D8" stroke="#6A6150" strokeWidth="2.5" />
                <path d="M 20 25 C 20 12, 140 12, 140 25 Z" fill="#D8CEBE" stroke="#6A6150" strokeWidth="2.5" />
                <rect x="25" y="27" width="52" height="36" rx="5" fill="#FAF6EE" stroke="#A89B84" strokeWidth="1.5" />
                <rect x="83" y="27" width="52" height="36" rx="5" fill="#FAF6EE" stroke="#A89B84" strokeWidth="1.5" />
                <rect x="10" y="20" width="16" height="47" rx="6" fill="#C6BBA8" stroke="#6A6150" strokeWidth="2.5" />
                <rect x="134" y="20" width="16" height="47" rx="6" fill="#C6BBA8" stroke="#6A6150" strokeWidth="2.5" />
                <line x1="20" y1="67" x2="16" y2="78" stroke="#443929" strokeWidth="4" strokeLinecap="round" />
                <line x1="140" y1="67" x2="144" y2="78" stroke="#443929" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#6A6150]/15">
              <span className="font-sora font-bold text-sm text-[#172A2B]">
                Sofás e poltronas
              </span>
              <ArrowRight className="w-4 h-4 text-[#172A2B] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Geladeiras e máquinas */}
          <div
            onClick={() => onSelectCategory('geladeiras')}
            className="bg-[#E7F0EB] rounded-3xl p-5 border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-32 flex items-center justify-center">
              <svg viewBox="0 0 100 110" className="w-24 h-28 text-[#347F6C] drop-shadow-xs group-hover:scale-105 transition-transform">
                {/* Fridge vector */}
                <rect x="20" y="10" width="60" height="90" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2.5" />
                {/* Upper freezer door */}
                <line x1="20" y1="42" x2="80" y2="42" stroke="#475569" strokeWidth="2" />
                {/* Handles */}
                <rect x="25" y="32" width="3" height="8" rx="1" fill="#1E293B" />
                <rect x="25" y="46" width="3" height="18" rx="1" fill="#1E293B" />
                {/* Metallic shine */}
                <line x1="38" y1="12" x2="38" y2="98" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
              </svg>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#347F6C]/15">
              <span className="font-sora font-bold text-sm text-[#172A2B]">
                Geladeiras e máquinas
              </span>
              <ArrowRight className="w-4 h-4 text-[#172A2B] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Camas e colchões */}
          <div
            onClick={() => onSelectCategory('camas')}
            className="bg-[#F2EBE5] rounded-3xl p-5 border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-32 flex items-center justify-center">
              <svg viewBox="0 0 140 90" className="w-32 h-24 text-[#8C7A6B] drop-shadow-xs group-hover:scale-105 transition-transform">
                {/* Headboard */}
                <rect x="20" y="15" width="100" height="35" rx="5" fill="#CBBBAF" stroke="#6F5F53" strokeWidth="2" />
                {/* Mattress & Box */}
                <rect x="15" y="40" width="110" height="30" rx="4" fill="#FAF6F0" stroke="#6F5F53" strokeWidth="2" />
                {/* Pillows */}
                <rect x="26" y="30" width="36" height="16" rx="4" fill="#FFFFFF" stroke="#CBBBAF" strokeWidth="1.5" />
                <rect x="78" y="30" width="36" height="16" rx="4" fill="#FFFFFF" stroke="#CBBBAF" strokeWidth="1.5" />
                {/* Feet */}
                <line x1="22" y1="70" x2="22" y2="82" stroke="#3E342D" strokeWidth="4" />
                <line x1="118" y1="70" x2="118" y2="82" stroke="#3E342D" strokeWidth="4" />
              </svg>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#8C7A6B]/15">
              <span className="font-sora font-bold text-sm text-[#172A2B]">
                Camas e colchões
              </span>
              <ArrowRight className="w-4 h-4 text-[#172A2B] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mesas e armários */}
          <div
            onClick={() => onSelectCategory('mesas')}
            className="bg-[#E4EFE8] rounded-3xl p-5 border border-[#E1E3DB] hover:border-[#347F6C]/40 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="h-32 flex items-center justify-center">
              <svg viewBox="0 0 140 90" className="w-32 h-24 text-[#347F6C] drop-shadow-xs group-hover:scale-105 transition-transform">
                {/* Table top */}
                <rect x="25" y="38" width="90" height="8" rx="2" fill="#D2B48C" stroke="#8B5A2B" strokeWidth="2" />
                {/* Table legs */}
                <line x1="35" y1="46" x2="32" y2="78" stroke="#8B5A2B" strokeWidth="3" />
                <line x1="105" y1="46" x2="108" y2="78" stroke="#8B5A2B" strokeWidth="3" />
                {/* Chairs silhouettes */}
                <rect x="15" y="28" width="14" height="42" rx="3" fill="#B38B6D" opacity="0.8" />
                <rect x="111" y="28" width="14" height="42" rx="3" fill="#B38B6D" opacity="0.8" />
              </svg>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#347F6C]/15">
              <span className="font-sora font-bold text-sm text-[#172A2B]">
                Mesas e armários
              </span>
              <ArrowRight className="w-4 h-4 text-[#172A2B] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
