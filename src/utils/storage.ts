import { Project, SavedRoom, FurnitureTestRecord, DeliveryPath } from '../types';
import { DEFAULT_DELIVERY_PATH } from '../data/categories';

const STORAGE_KEY = 'cabeai_projects_v1';
const ACTIVE_PROJECT_KEY = 'cabeai_active_project_id';

export const INITIAL_PROJECT: Project = {
  id: 'proj_default_1',
  name: 'Meu Apartamento / Casa',
  description: 'Projeto inicial com as principais medidas dos cômodos e passagens da minha casa.',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  rooms: [
    {
      id: 'room_sala_1',
      name: 'Sala de Estar',
      type: 'Sala',
      dimensions: { width: 230, height: 260, depth: 110 },
      doorWidth: 80,
      notes: 'Ponto do sofá principal entre a janela e o corredor.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room_cozinha_1',
      name: 'Cozinha / Nicho Geladeira',
      type: 'Cozinha',
      dimensions: { width: 85, height: 210, depth: 80 },
      doorWidth: 80,
      notes: 'Nicho com ponto elétrico e tomada 220V para refrigerador.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'room_quarto_1',
      name: 'Quarto de Casal',
      type: 'Quarto',
      dimensions: { width: 320, height: 260, depth: 360 },
      doorWidth: 70,
      notes: 'Espaço planejado para cama box Queen e dois criados-mudos.',
      createdAt: new Date().toISOString(),
    },
  ],
  tests: [
    {
      id: 'test_sofa_1',
      productName: 'Sofá 3 Lugares Confort',
      category: 'sofas',
      productDimensions: { width: 210, height: 92, depth: 95 },
      roomId: 'room_sala_1',
      roomName: 'Sala de Estar',
      spaceDimensions: { width: 230, height: 260, depth: 110 },
      fitResult: {
        status: 'fits',
        statusText: 'Cabe no espaço informado',
        statusDescription: '20 cm de folga lateral total',
        orientation: 'standard',
        isRotated: false,
        canRotateToFit: false,
        productDimensions: { width: 210, height: 92, depth: 95 },
        spaceDimensions: { width: 230, height: 260, depth: 110 },
        effectiveRequiredWidth: 210,
        effectiveRequiredDepth: 95,
        effectiveRequiredHeight: 92,
        lateralClearance: 20,
        depthClearance: 15,
        verticalClearance: 168,
        warnings: [],
        recommendations: [],
        details: [
          { label: 'Folga lateral restante', value: '20 cm (10 cm cada lado)', status: 'ok' },
          { label: 'Folga de profundidade', value: '15 cm livres', status: 'ok' },
          { label: 'Folga vertical (teto)', value: '168 cm até o teto', status: 'ok' },
        ],
      },
      createdAt: new Date().toISOString(),
    },
  ],
  pathData: DEFAULT_DELIVERY_PATH,
};

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProjects([INITIAL_PROJECT]);
      return [INITIAL_PROJECT];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return [INITIAL_PROJECT];
  } catch (e) {
    console.error('Erro ao ler projetos do localStorage:', e);
    return [INITIAL_PROJECT];
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Erro ao salvar projetos no localStorage:', e);
  }
}

export function getActiveProjectId(): string {
  const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
  if (activeId) return activeId;
  const projects = loadProjects();
  const firstId = projects[0]?.id || INITIAL_PROJECT.id;
  setActiveProjectId(firstId);
  return firstId;
}

export function setActiveProjectId(id: string): void {
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function createNewProject(name: string, description: string = ''): Project {
  const projects = loadProjects();
  const newProject: Project = {
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || 'Novo Projeto',
    description: description.trim(),
    rooms: [],
    tests: [],
    pathData: DEFAULT_DELIVERY_PATH,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(newProject);
  saveProjects(projects);
  setActiveProjectId(newProject.id);
  return newProject;
}

export function duplicateProject(id: string): Project | null {
  const projects = loadProjects();
  const source = projects.find((p) => p.id === id);
  if (!source) return null;

  const duplicated: Project = {
    ...JSON.parse(JSON.stringify(source)),
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${source.name} (Cópia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  projects.push(duplicated);
  saveProjects(projects);
  setActiveProjectId(duplicated.id);
  return duplicated;
}

export function deleteProject(id: string): boolean {
  const projects = loadProjects();
  if (projects.length <= 1) {
    return false; // Manter pelo menos um projeto
  }
  const filtered = projects.filter((p) => p.id !== id);
  saveProjects(filtered);
  const activeId = getActiveProjectId();
  if (activeId === id) {
    setActiveProjectId(filtered[0].id);
  }
  return true;
}

export function updateProject(updated: Project): void {
  const projects = loadProjects();
  const index = projects.findIndex((p) => p.id === updated.id);
  if (index >= 0) {
    projects[index] = {
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    saveProjects(projects);
  }
}

export function exportProjectsToJson(): void {
  const projects = loadProjects();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `cabeai_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProjectsFromJson(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { success: false, message: 'O arquivo JSON não contém uma lista válida de projetos.' };
    }

    // Validação básica de integridade
    const valid = parsed.every((p) => typeof p.id === 'string' && typeof p.name === 'string');
    if (!valid) {
      return { success: false, message: 'Formato de projeto inválido no arquivo JSON.' };
    }

    saveProjects(parsed);
    setActiveProjectId(parsed[0].id);
    return { success: true, message: `${parsed.length} projeto(s) importado(s) com sucesso!` };
  } catch (e: any) {
    return { success: false, message: `Erro ao processar JSON: ${e?.message || 'Arquivo corrompido'}` };
  }
}
