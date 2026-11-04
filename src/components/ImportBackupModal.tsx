import React, { useState } from 'react';
import { importProjectsFromJson } from '../utils/storage';
import { Upload, X, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ImportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImportBackupModal: React.FC<ImportBackupModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJsonText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!jsonText.trim()) {
      setStatusMessage({ type: 'error', text: 'Cole o conteúdo do backup ou selecione um arquivo JSON.' });
      return;
    }

    const res = importProjectsFromJson(jsonText);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F7F5EF] w-full max-w-lg rounded-3xl border border-[#E1E3DB] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E1E3DB] pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#F47736]" />
            <h3 className="font-sora font-bold text-base text-[#172A2B]">
              Restaurar Backup de Projetos
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#65716F] hover:text-[#172A2B] rounded-full hover:bg-white/80"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#65716F] leading-relaxed">
          Selecione o arquivo <code>cabeai_backup.json</code> gerado anteriormente para restaurar todos os seus cômodos e testes de móveis neste navegador.
        </p>

        {/* File picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#172A2B]">
            Arquivo de backup (.json):
          </label>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="w-full text-xs text-[#65716F] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#347F6C] file:text-white hover:file:bg-[#296857] file:cursor-pointer"
          />
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#172A2B]">
            Ou cole o código JSON aqui:
          </label>
          <textarea
            rows={5}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='[{"id": "proj_1", "name": "Meu Apto", ...}]'
            className="w-full p-3 rounded-xl bg-white border border-[#E1E3DB] font-mono text-[11px] text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
          />
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-[#E5F0E8] text-[#246152] border border-[#347F6C]/30'
                : 'bg-[#FEE2E2] text-[#991B1B] border border-[#EF4444]/30'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E1E3DB] text-xs font-semibold text-[#65716F] hover:bg-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="px-5 py-2 rounded-xl bg-[#347F6C] hover:bg-[#296857] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Restaurar Dados
          </button>
        </div>
      </div>
    </div>
  );
};
