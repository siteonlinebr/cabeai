import React, { useState } from 'react';
import { EDITORIAL_ARTICLES } from '../data/articles';
import { EditorialArticle, ProductCategory } from '../types';
import {
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';

interface ArticlesViewProps {
  onTestCategory: (category: ProductCategory) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({ onTestCategory }) => {
  const [selectedArticle, setSelectedArticle] = useState<EditorialArticle | null>(null);

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <button
          type="button"
          onClick={() => setSelectedArticle(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#347F6C] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para todos os guias
        </button>

        {/* Article Header */}
        <div className="space-y-4 border-b border-[#E1E3DB] pb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E5F0E8] text-[#347F6C] uppercase tracking-wider font-sora">
              {selectedArticle.category}
            </span>
            <span className="text-xs text-[#65716F] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedArticle.readingTimeMinutes} min de leitura
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-sora text-[#172A2B] leading-tight">
            {selectedArticle.title}
          </h1>

          <p className="text-base sm:text-lg text-[#65716F] font-medium leading-relaxed">
            {selectedArticle.subtitle}
          </p>

          <div className="text-xs text-[#65716F] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Publicado em {selectedArticle.publishedDate}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="space-y-8 text-[#172A2B] leading-relaxed">
          {selectedArticle.content.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              {sec.heading && (
                <h2 className="text-lg sm:text-xl font-bold font-sora text-[#172A2B] pt-2">
                  {sec.heading}
                </h2>
              )}

              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-[#475569] leading-relaxed">
                  {para}
                </p>
              ))}

              {sec.callout && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 my-4 ${
                    sec.callout.type === 'warning'
                      ? 'bg-[#FEF3C7] border-[#F59E0B]/40 text-[#92400E]'
                      : sec.callout.type === 'rule'
                      ? 'bg-[#E5F0E8] border-[#347F6C]/40 text-[#235D4F]'
                      : 'bg-[#FAF8F3] border-[#E1E3DB] text-[#172A2B]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {sec.callout.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-[#D97706]" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-[#347F6C]" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {sec.callout.text}
                  </p>
                </div>
              )}

              {sec.formula && (
                <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E1E3DB] text-center my-3 font-mono text-xs sm:text-sm font-bold text-[#172A2B]">
                  📐 {sec.formula}
                </div>
              )}

              {sec.checklist && (
                <div className="bg-white p-5 rounded-2xl border border-[#E1E3DB] space-y-2.5 my-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#347F6C] font-sora">
                    Checklist de Verificação Prática:
                  </h3>
                  <ul className="space-y-2">
                    {sec.checklist.map((item, cIdx) => (
                      <li key={cIdx} className="text-xs sm:text-sm text-[#475569] flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#347F6C] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA to Test Category */}
        <div className="p-6 rounded-3xl bg-[#E5F0E8] border border-[#347F6C]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-sora font-bold text-base text-[#172A2B]">
              Quer testar suas medidas na prática agora?
            </h3>
            <p className="text-xs text-[#65716F]">
              Abra a ferramenta do CabeAí com os parâmetros recomendados para este produto.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onTestCategory(selectedArticle.relatedCategory)}
            className="px-5 py-2.5 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Simular na ferramenta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#347F6C] font-sora">
          Conteúdo Editorial Especializado
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold font-sora text-[#172A2B]">
          Guias e Manuais de Medição
        </h1>
        <p className="text-sm sm:text-base text-[#65716F]">
          Aprenda os segredos arquitetônicos de como medir sofás, eletros, portas e elevadores sem cometer os erros mais frequentes.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDITORIAL_ARTICLES.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art)}
            className="bg-white rounded-3xl border border-[#E1E3DB] hover:border-[#347F6C]/40 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#65716F] mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F0E8] text-[#347F6C] uppercase font-sora">
                  {art.category}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readingTimeMinutes} min
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold font-sora text-[#172A2B] group-hover:text-[#347F6C] transition-colors leading-snug mb-2">
                {art.title}
              </h2>

              <p className="text-xs text-[#65716F] leading-relaxed line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#E1E3DB] flex items-center justify-between text-xs font-semibold text-[#347F6C]">
              <span>Ler artigo completo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
