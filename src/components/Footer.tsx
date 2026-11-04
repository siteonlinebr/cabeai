import React from 'react';
import {
  ExternalLink,
  Shield,
  Download,
  Upload,
  Ruler,
  HelpCircle,
  FileText,
  Heart,
} from 'lucide-react';
import { exportProjectsToJson } from '../utils/storage';

interface FooterProps {
  onNavigate: (tab: 'home' | 'test' | 'rooms' | 'projects' | 'how-it-works' | 'articles') => void;
  onImportBackup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onImportBackup }) => {
  return (
    <footer className="mt-20 border-t border-[#E1E3DB] bg-[#F3EFE6]">
      {/* Institutional FHG Banner from Reference Mockup */}
      <div className="bg-[#173830] text-white py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs sm:text-sm text-center">
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Um projeto independente integrante do Future Horizon Group (FHG).</span>
          </div>

          <span className="hidden sm:inline text-white/40">|</span>

          <a
            href="https://siteonlinebr.github.io/Fhg.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#A3E5C8] hover:text-white font-semibold transition-colors underline decoration-[#A3E5C8]/40 hover:decoration-white"
          >
            <span>Conheça o grupo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E1E3DB] flex items-center justify-center text-[#347F6C]">
                <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-current fill-none stroke-[2]">
                  <path d="M4 3h16v18H4z" />
                  <path d="M8 12h8" />
                  <path d="M10 9l-2 3 2 3" />
                  <path d="M14 9l2 3-2 3" />
                </svg>
              </div>
              <span className="font-sora text-xl font-bold text-[#172A2B]">
                Cabe<span className="text-[#347F6C]">Aí</span>
              </span>
            </div>
            <p className="text-xs text-[#65716F] leading-relaxed">
              Seu móvel cabe. E chega até lá? Verifique com precisão se sofás, geladeiras e colchões cabem nos ambientes e conseguem passar por portas, elevadores e corredores.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#65716F]">
              <Shield className="w-3.5 h-3.5 text-[#347F6C]" />
              <span>Privacidade total: dados armazenados no seu próprio navegador.</span>
            </div>
          </div>

          {/* Ferramentas */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-[#172A2B] mb-3">
              Ferramentas
            </h4>
            <ul className="space-y-2 text-xs text-[#65716F]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('test')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Testar dimensões do móvel
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('rooms')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Cadastrar medidas da casa (Ambientes)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Meus projetos e histórico
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Como medir corretamente
                </button>
              </li>
            </ul>
          </div>

          {/* Conteúdo & Guias */}
          <div>
            <h4 className="font-sora font-semibold text-sm text-[#172A2B] mb-3">
              Guias & Artigos
            </h4>
            <ul className="space-y-2 text-xs text-[#65716F]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('articles')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Como medir espaço para sofá retrátil
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('articles')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Geladeira passa pela porta da cozinha?
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('articles')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Vibração e folgas de máquina de lavar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('articles')}
                  className="hover:text-[#347F6C] transition-colors"
                >
                  Tamanhos de colchão: Queen vs King
                </button>
              </li>
            </ul>
          </div>

          {/* Backup dos Projetos */}
          <div className="space-y-3">
            <h4 className="font-sora font-semibold text-sm text-[#172A2B]">
              Seus Dados & Backup
            </h4>
            <p className="text-xs text-[#65716F] leading-relaxed">
              Faça backup dos seus ambientes e medidas salvas ou restaure dados em outro computador.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={exportProjectsToJson}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E1E3DB] hover:border-[#347F6C] text-xs font-semibold text-[#172A2B] shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#347F6C]" />
                Exportar Backup (JSON)
              </button>
              <button
                type="button"
                onClick={onImportBackup}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E1E3DB] hover:border-[#347F6C] text-xs font-semibold text-[#172A2B] shadow-2xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-[#F47736]" />
                Restaurar Backup (JSON)
              </button>
            </div>
          </div>

        </div>

        {/* Legal & Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#E1E3DB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#65716F]">
          <p>
            © {new Date().getFullYear()} CabeAí — Planejamento dimensional residencial. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-center sm:text-right">
            O CabeAí é uma ferramenta de planejamento e não substitui a vistoria técnica presencial dos entregadores.
          </p>
        </div>
      </div>
    </footer>
  );
};
