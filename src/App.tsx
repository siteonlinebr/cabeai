import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { FullTestView } from './components/FullTestView';
import { RoomManagerView } from './components/RoomManagerView';
import { ProjectsView } from './components/ProjectsView';
import { HowItWorksView } from './components/HowItWorksView';
import { ArticlesView } from './components/ArticlesView';
import { PathCheckerModal } from './components/PathCheckerModal';
import { ImportBackupModal } from './components/ImportBackupModal';
import {
  Project,
  SavedRoom,
  FurnitureTestRecord,
  ProductCategory,
  Dimensions,
  FitCalculationResult,
  DeliveryPath,
} from './types';
import {
  loadProjects,
  saveProjects,
  getActiveProjectId,
  setActiveProjectId,
  updateProject,
} from './utils/storage';
import { DEFAULT_DELIVERY_PATH } from './data/categories';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'test' | 'rooms' | 'projects' | 'how-it-works' | 'articles'>('home');
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveId] = useState<string>(() => getActiveProjectId());

  // Modal states
  const [isPathCheckerOpen, setIsPathCheckerOpen] = useState(false);
  const [pathCheckerInitialTab, setPathCheckerInitialTab] = useState<'all' | 'door' | 'hallway' | 'elevator' | 'stairs'>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Active product test state for path checking
  const [activeTestProduct, setActiveTestProduct] = useState<{
    name: string;
    dim: Dimensions;
    pkgDim?: Dimensions;
    category: ProductCategory;
  }>({
    name: 'Sofá 3 Lugares Confort',
    dim: { width: 210, height: 92, depth: 95 },
    pkgDim: { width: 215, height: 96, depth: 100 },
    category: 'sofas',
  });

  // Category and room triggers for FullTestView
  const [testViewCategory, setTestViewCategory] = useState<ProductCategory>('sofas');
  const [testViewRoomId, setTestViewRoomId] = useState<string | undefined>(undefined);

  // Active project helper
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const refreshProjectsList = () => {
    const list = loadProjects();
    setProjects(list);
  };

  // Scroll to top upon tab navigation
  const handleNavigate = (tab: 'home' | 'test' | 'rooms' | 'projects' | 'how-it-works' | 'articles') => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPathChecker = (initialSubTab?: 'door' | 'hallway' | 'elevator' | 'stairs') => {
    setPathCheckerInitialTab(initialSubTab || 'all');
    setIsPathCheckerOpen(true);
  };

  const handleUpdateDeliveryPath = (newPath: DeliveryPath) => {
    if (!activeProject) return;
    const updated = {
      ...activeProject,
      pathData: newPath,
    };
    updateProject(updated);
    refreshProjectsList();
  };

  // Save furniture test into active project
  const handleSaveFurnitureTest = (testData: {
    productName: string;
    category: ProductCategory;
    productDim: Dimensions;
    spaceDim: Dimensions;
    roomId?: string;
    roomName?: string;
    fitResult: FitCalculationResult;
  }) => {
    if (!activeProject) return;

    const newRecord: FurnitureTestRecord = {
      id: `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      productName: testData.productName,
      category: testData.category,
      productDimensions: testData.productDim,
      spaceDimensions: testData.spaceDim,
      roomId: testData.roomId,
      roomName: testData.roomName,
      fitResult: testData.fitResult,
      createdAt: new Date().toISOString(),
    };

    const updated: Project = {
      ...activeProject,
      tests: [newRecord, ...activeProject.tests],
      updatedAt: new Date().toISOString(),
    };

    updateProject(updated);
    refreshProjectsList();
  };

  // Rooms management
  const handleAddRoom = (roomData: Omit<SavedRoom, 'id' | 'createdAt'>) => {
    if (!activeProject) return;
    const newRoom: SavedRoom = {
      id: `room_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...roomData,
      createdAt: new Date().toISOString(),
    };
    const updated: Project = {
      ...activeProject,
      rooms: [...activeProject.rooms, newRoom],
      updatedAt: new Date().toISOString(),
    };
    updateProject(updated);
    refreshProjectsList();
  };

  const handleUpdateRoom = (room: SavedRoom) => {
    if (!activeProject) return;
    const updatedRooms = activeProject.rooms.map((r) => (r.id === room.id ? room : r));
    const updated: Project = {
      ...activeProject,
      rooms: updatedRooms,
      updatedAt: new Date().toISOString(),
    };
    updateProject(updated);
    refreshProjectsList();
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!activeProject) return;
    if (window.confirm('Tem certeza que deseja remover este cômodo do projeto?')) {
      const updatedRooms = activeProject.rooms.filter((r) => r.id !== roomId);
      const updated: Project = {
        ...activeProject,
        rooms: updatedRooms,
        updatedAt: new Date().toISOString(),
      };
      updateProject(updated);
      refreshProjectsList();
    }
  };

  // Quick 1-click test load for a room
  const handleTestInRoom = (room: SavedRoom) => {
    setTestViewRoomId(room.id);
    handleNavigate('test');
  };

  // Quick load test from projects history
  const handleLoadSavedTest = (test: FurnitureTestRecord) => {
    setTestViewCategory(test.category);
    setTestViewRoomId(test.roomId);
    setActiveTestProduct({
      name: test.productName,
      dim: test.productDimensions,
      category: test.category,
    });
    handleNavigate('test');
  };

  const handleSelectCategoryFromHome = (cat: ProductCategory) => {
    setTestViewCategory(cat);
    handleNavigate('test');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5EF] text-[#172A2B]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        savedProjectsCount={projects.length}
      />

      {/* Main Body per Tab */}
      <main className="grow">
        {currentTab === 'home' && (
          <HomeView
            onStartTest={() => handleNavigate('test')}
            onNavigateHowItWorks={() => handleNavigate('how-it-works')}
            onNavigateRooms={() => handleNavigate('rooms')}
            onNavigateProjects={() => handleNavigate('projects')}
            onSelectCategory={handleSelectCategoryFromHome}
            onOpenPathChecker={handleOpenPathChecker}
            onSaveCurrentTest={(data) => {
              handleSaveFurnitureTest(data);
              alert('Teste salvo com sucesso em Meus Projetos!');
            }}
          />
        )}

        {currentTab === 'test' && (
          <FullTestView
            savedRooms={activeProject?.rooms || []}
            initialCategory={testViewCategory}
            initialRoomId={testViewRoomId}
            onOpenPathChecker={handleOpenPathChecker}
            onSaveTest={handleSaveFurnitureTest}
          />
        )}

        {currentTab === 'rooms' && (
          <RoomManagerView
            rooms={activeProject?.rooms || []}
            onAddRoom={handleAddRoom}
            onUpdateRoom={handleUpdateRoom}
            onDeleteRoom={handleDeleteRoom}
            onTestInRoom={handleTestInRoom}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={(id) => {
              setActiveId(id);
              setActiveProjectId(id);
            }}
            onRefreshProjects={refreshProjectsList}
            onOpenImportModal={() => setIsImportModalOpen(true)}
            onLoadTest={handleLoadSavedTest}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksView onStartTest={() => handleNavigate('test')} />
        )}

        {currentTab === 'articles' && (
          <ArticlesView onTestCategory={handleSelectCategoryFromHome} />
        )}
      </main>

      {/* Institutional FHG Footer */}
      <Footer
        onNavigate={handleNavigate}
        onImportBackup={() => setIsImportModalOpen(true)}
      />

      {/* Path Checker Modal */}
      <PathCheckerModal
        isOpen={isPathCheckerOpen}
        onClose={() => setIsPathCheckerOpen(false)}
        productDim={activeTestProduct.dim}
        packagingDim={activeTestProduct.pkgDim}
        productName={activeTestProduct.name}
        pathData={activeProject?.pathData || DEFAULT_DELIVERY_PATH}
        onUpdatePathData={handleUpdateDeliveryPath}
        initialTab={pathCheckerInitialTab}
      />

      {/* Import Backup Modal */}
      <ImportBackupModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={refreshProjectsList}
      />
    </div>
  );
}
