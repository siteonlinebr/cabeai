import React, { useState } from 'react';
import { Project, FurnitureTestRecord } from '../types';
import {
  exportProjectsToJson,
  createNewProject,
  duplicateProject,
  deleteProject,
  updateProject,
} from '../utils/storage';
import {
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  Box,
  Ruler,
  ShieldCheck,
  Edit2,
  Check,
  X,
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onRefreshProjects: () => void;
  onOpenImportModal: () => void;
  onLoadTest: (test: FurnitureTestRecord) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onRefreshProjects,
  onOpenImportModal,
  onLoadTest,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const created = createNewProject(newProjectName, newProjectDesc);
    setNewProjectName('');
    setNewProjectDesc('');
    setIsCreatingNew(false);
    onRefreshProjects();
    onSelectProject(created.id);
  };

  const handleDuplicate = (id: string) => {
    const dup = duplicateProject(id);
    if (dup) {
      onRefreshProjects();
      onSelectProject(dup.id);
    }
  };

  const handleDelete = (id: string) => {
    if (projects.length <= 1) {
      alert('Você precisa ter pelo menos um projeto ativo.');
      return;
    }
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      deleteProject(id);
      onRefreshProjects();
    }
  };

  const handleStartRename = (project: Project) => {
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDesc(project.description || '');
  };

  const handleSaveRename = (project: Project) => {
    if (!editName.trim()) return;
    updateProject({
      ...project,
      name: editName.trim(),
      description: editDesc.trim(),
    });
    setEditingProjectId(null);
    onRefreshProjects();
  };

  const handleDeleteTest = (testId: string) => {
    if (!activeProject) return;
    const updatedTests = activeProject.tests.filter((t) => t.id !== testId);
    updateProject({
      ...activeProject,
      tests: updatedTests,
    });
    onRefreshProjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner / Explanatory notice */}
      <div className="bg-[#E5F0E8] border border-[#347F6C]/20 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#347F6C] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sora font-bold text-base sm:text-lg text-[#172A2B]">
              Armazenamento Local Persistente (Offline & Seguro)
            </h2>
            <p className="text-xs sm:text-sm text-[#475569]">
              Seus ambientes e testes ficam gravados diretamente no navegador deste dispositivo, sem necessidade de cadastro.
              Utilize os botões de <strong>Backup (JSON)</strong> para levar seus dados para outro computador.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={exportProjectsToJson}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F3] text-xs font-bold text-[#172A2B] border border-[#E1E3DB] shadow-2xs inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#347F6C]" />
            Exportar JSON
          </button>
          <button
            type="button"
            onClick={onOpenImportModal}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF8F3] text-xs font-bold text-[#172A2B] border border-[#E1E3DB] shadow-2xs inline-flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#F47736]" />
            Importar JSON
          </button>
        </div>
      </div>

      {/* Projects Tabs / Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E1E3DB] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          {projects.map((proj) => {
            const isActive = proj.id === activeProjectId;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => onSelectProject(proj.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#347F6C] text-white border-[#347F6C] shadow-sm'
                    : 'bg-white text-[#65716F] border-[#E1E3DB] hover:text-[#172A2B]'
                }`}
              >
                {proj.name} ({proj.rooms.length} cômodos • {proj.tests.length} testes)
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsCreatingNew(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF8F3] hover:bg-[#E5F0E8] border border-[#E1E3DB] hover:border-[#347F6C] text-xs font-bold text-[#347F6C] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto
        </button>
      </div>

      {/* Create New Project Modal Form */}
      {isCreatingNew && (
        <form onSubmit={handleCreate} className="bg-white p-5 rounded-3xl border border-[#347F6C] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sora font-bold text-base text-[#172A2B]">Criar Novo Projeto</h3>
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="text-[#65716F] hover:text-[#172A2B]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">Nome do projeto *</label>
              <input
                type="text"
                required
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ex: Reforma Apto 502, Casa de Praia, Mudança 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-xs font-semibold text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172A2B] mb-1">Descrição (opcional)</label>
              <input
                type="text"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Ex: Medidas para compra de móveis planejados"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F3] border border-[#E1E3DB] text-xs font-medium text-[#172A2B] focus:border-[#347F6C] focus:outline-hidden"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingNew(false)}
              className="px-3 py-1.5 rounded-lg border border-[#E1E3DB] text-xs text-[#65716F]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#347F6C] text-white text-xs font-bold"
            >
              Criar Projeto
            </button>
          </div>
        </form>
      )}

      {/* Active Project Details */}
      {activeProject && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E1E3DB] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              {editingProjectId === activeProject.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-lg font-bold font-sora px-2 py-1 rounded-lg border border-[#347F6C] text-[#172A2B]"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="text-xs text-[#65716F] block w-full px-2 py-1 rounded-lg border border-[#E1E3DB]"
                    placeholder="Descrição..."
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveRename(activeProject)}
                      className="px-3 py-1 bg-[#347F6C] text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProjectId(null)}
                      className="px-3 py-1 border border-[#E1E3DB] text-[#65716F] rounded-lg text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold font-sora text-[#172A2B]">
                      {activeProject.name}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleStartRename(activeProject)}
                      className="p-1 text-[#65716F] hover:text-[#347F6C]"
                      title="Renomear projeto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-[#65716F] mt-0.5">
                    {activeProject.description || 'Sem descrição cadastrada.'}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleDuplicate(activeProject.id)}
                className="px-3 py-1.5 rounded-xl border border-[#E1E3DB] hover:border-[#347F6C] bg-[#FAF8F3] text-xs font-semibold text-[#172A2B] inline-flex items-center gap-1.5 transition-colors"
                title="Duplicar este projeto"
              >
                <Copy className="w-3.5 h-3.5 text-[#347F6C]" />
                Duplicar Projeto
              </button>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(activeProject.id)}
                  className="px-3 py-1.5 rounded-xl border border-[#E1E3DB] hover:border-[#DC2626] bg-[#FAF8F3] text-xs font-semibold text-[#DC2626] inline-flex items-center gap-1.5 transition-colors"
                  title="Excluir este projeto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              )}
            </div>
          </div>

          {/* Tested Furniture History in this Project */}
          <div className="space-y-4">
            <h3 className="font-sora font-bold text-base text-[#172A2B] flex items-center gap-2">
              <Box className="w-4 h-4 text-[#347F6C]" />
              Móveis e Eletros Testados Neste Projeto ({activeProject.tests.length})
            </h3>

            {activeProject.tests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E1E3DB] p-8 text-center space-y-2">
                <Box className="w-8 h-8 text-[#A8B3B0] mx-auto" />
                <p className="text-sm font-semibold text-[#172A2B]">Nenhum teste de móvel salvo ainda</p>
                <p className="text-xs text-[#65716F]">
                  Ao testar um móvel na ferramenta, clique em "Salvar Teste em Meus Projetos" para armazenar o histórico aqui.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProject.tests.map((test) => {
                  const status = test.fitResult.status;
                  return (
                    <div
                      key={test.id}
                      className="bg-white rounded-2xl border border-[#E1E3DB] p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#347F6C] uppercase tracking-wider block font-sora">
                              {test.category} • {test.roomName || 'Espaço livre'}
                            </span>
                            <h4 className="font-sora font-bold text-sm text-[#172A2B]">
                              {test.productName}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteTest(test.id)}
                            className="p-1 text-[#A8B3B0] hover:text-[#DC2626]"
                            title="Remover teste"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status banner */}
                        <div
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            status === 'fits'
                              ? 'bg-[#E5F0E8] border-[#347F6C]/30 text-[#235D4F]'
                              : status === 'fits_with_restrictions'
                              ? 'bg-[#FEF3C7] border-[#F59E0B]/30 text-[#92400E]'
                              : 'bg-[#FEE2E2] border-[#DC2626]/30 text-[#991B1B]'
                          }`}
                        >
                          {status === 'fits' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#347F6C]" />
                          ) : status === 'fits_with_restrictions' ? (
                            <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                          )}
                          <span className="font-semibold">{test.fitResult.statusText}</span>
                        </div>

                        {/* Dimension Summary */}
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-[#FAF8F3] p-2.5 rounded-xl">
                          <div>
                            <span className="text-[10px] text-[#65716F] block">Móvel</span>
                            <span className="font-bold text-[#172A2B]">
                              {test.productDimensions.width} × {test.productDimensions.depth} cm
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#65716F] block">Espaço</span>
                            <span className="font-bold text-[#172A2B]">
                              {test.spaceDimensions.width} × {test.spaceDimensions.depth} cm
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onLoadTest(test)}
                        className="w-full py-2 px-3 rounded-xl bg-[#FAF8F3] hover:bg-[#347F6C] hover:text-white text-xs font-semibold text-[#172A2B] transition-colors text-center"
                      >
                        Recarregar na Ferramenta →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
