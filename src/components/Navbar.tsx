import React, { useState } from 'react';
import {
  Home,
  Ruler,
  Box,
  HelpCircle,
  Star,
  Play,
  Menu,
  X,
  FolderOpen,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: 'home' | 'test' | 'rooms' | 'projects' | 'how-it-works' | 'articles') => void;
  savedProjectsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  savedProjectsCount = 1,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'rooms', label: 'Medir meu espaço', icon: Ruler },
    { id: 'test', label: 'Testar um móvel', icon: Box },
    { id: 'how-it-works', label: 'Como funciona', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: any) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#E1E3DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 focus:outline-hidden group"
            >
              {/* Door/Dimension Vector Logo matching Mockup */}
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E3DB] flex items-center justify-center text-[#347F6C] shadow-2xs group-hover:border-[#347F6C] transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round">
                  <path d="M4 3h16v18H4z" />
                  <path d="M8 12h8" />
                  <path d="M10 9l-2 3 2 3" />
                  <path d="M14 9l2 3-2 3" />
                </svg>
              </div>

              <div className="flex items-baseline">
                <span className="font-sora text-2xl font-extrabold tracking-tight text-[#172A2B]">
                  Cabe
                </span>
                <span className="font-sora text-2xl font-extrabold tracking-tight text-[#347F6C]">
                  Aí
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 pl-4 border-l border-[#E1E3DB]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'text-[#347F6C] bg-[#E5F0E8]/70 shadow-2xs'
                        : 'text-[#65716F] hover:text-[#172A2B] hover:bg-white/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Actions: Meus Projetos & Começar Agora */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('projects')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentTab === 'projects'
                  ? 'text-[#347F6C] bg-[#E5F0E8]'
                  : 'text-[#65716F] hover:text-[#172A2B] hover:bg-white/60'
              }`}
            >
              <Star className="w-4 h-4 text-[#F47736]" />
              <span>Meus projetos</span>
              {savedProjectsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E5F0E8] text-[#347F6C] text-[11px] font-bold flex items-center justify-center">
                  {savedProjectsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('test')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F47736] hover:bg-[#dc6221] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Começar agora</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('test')}
              className="px-3.5 py-1.5 rounded-full bg-[#F47736] text-white text-xs font-bold"
            >
              Começar
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#172A2B] hover:bg-white/80 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E1E3DB] px-4 pt-2 pb-6 space-y-1.5 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#E5F0E8] text-[#347F6C]' : 'text-[#65716F] hover:bg-[#F7F5EF]'
                }`}
              >
                <Icon className="w-5 h-5 text-[#347F6C]" />
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => handleNavClick('projects')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'projects' ? 'bg-[#E5F0E8] text-[#347F6C]' : 'text-[#65716F] hover:bg-[#F7F5EF]'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-[#F47736]" />
              Meus projetos salvos
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#E5F0E8] text-[#347F6C] text-xs font-bold">
              {savedProjectsCount}
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
