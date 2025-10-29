import { create } from 'zustand';
import { Project, Scene } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
  currentProject: Project | null;
  activeSceneId: string | null;
  isGenerating: boolean;
  isEditorOpen: boolean;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  createProject: (title: string) => void;
  loadProject: (id: string) => void;
  updateScript: (script: string) => void;
  generateScenes: (script: string) => Promise<void>;
  addScene: () => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  deleteScene: (id: string) => void;
  reorderScenes: (fromIndex: number, toIndex: number) => void;
  setActiveScene: (id: string | null) => void;
  openEditor: () => void;
  closeEditor: () => void;
  saveToLocalStorage: () => void;
  autoGenerateIllustrations: (sceneId: string) => void;
}

const useProjectStore = create<ProjectState>((set, get) => ({
  currentProject: null,
  activeSceneId: null,
  isGenerating: false,
  isEditorOpen: false,
  autoSaveStatus: 'idle',

  createProject: (title) => {
    const newProject: Project = {
      id: uuidv4(),
      title,
      script: '',
      scenes: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set({ currentProject: newProject, activeSceneId: null });
    get().saveToLocalStorage();
  },

  loadProject: (id) => {
    const savedProjects = JSON.parse(localStorage.getItem('storyvid-projects') || '[]');
    const projectToLoad = savedProjects.find((p: Project) => p.id === id);
    if (projectToLoad) {
      set({ currentProject: projectToLoad });
    }
  },

  updateScript: (script) => {
    set((state) => {
      if (state.currentProject) {
        return {
          currentProject: { ...state.currentProject, script, updatedAt: Date.now() },
        };
      }
      return {};
    });
    get().saveToLocalStorage();
  },

  generateScenes: async (script: string) => {
    console.log("generateScenes called with script:", script);
    if (!script || script.trim().length < 10) {
      console.error("Script is too short to generate scenes.");
      return;
    }
    set({ isGenerating: true });
    try {
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate scenes');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullResponse += decoder.decode(value, { stream: true });
      }

      const { scenes: rawScenes } = JSON.parse(fullResponse);

      const newScenes: Scene[] = rawScenes.map((rawScene: any, index: number) => ({
        id: uuidv4(),
        order: index,
        text: rawScene.text,
        keywords: rawScene.keywords,
        duration: rawScene.duration,
        animation: rawScene.animation,
        illustrations: [],
        layout: {
          style: 'horizontal-row',
          illustrationSize: 'medium',
          textPosition: 'overlay-bottom',
        },
      }));

      set((state) => {
        if (state.currentProject) {
          return {
            currentProject: { ...state.currentProject, scenes: newScenes, updatedAt: Date.now() },
            activeSceneId: newScenes.length > 0 ? newScenes[0].id : null,
          };
        }
        return {};
      });
      get().saveToLocalStorage();
    } catch (error) {
      console.error("Error generating scenes:", error);
    } finally {
      set({ isGenerating: false });
    }
  },

  addScene: () => {
    set((state) => {
      if (state.currentProject) {
        const newScene: Scene = {
          id: uuidv4(),
          order: state.currentProject.scenes.length,
          text: 'New Scene',
          keywords: [],
          duration: 5,
          illustrations: [],
          animation: 'fade',
          layout: {
            style: 'horizontal-row',
            illustrationSize: 'medium',
            textPosition: 'overlay-bottom',
          },
        };
        return {
          currentProject: {
            ...state.currentProject,
            scenes: [...state.currentProject.scenes, newScene],
          },
        };
      }
      return {};
    });
    get().saveToLocalStorage();
  },

  updateScene: (id, updates) => {
    set((state) => {
      if (state.currentProject) {
        return {
          currentProject: {
            ...state.currentProject,
            scenes: state.currentProject.scenes.map((scene) =>
              scene.id === id ? { ...scene, ...updates } : scene
            ),
            updatedAt: Date.now(),
          },
        };
      }
      return {};
    });
    get().saveToLocalStorage();
  },

  deleteScene: (id) => {
    set((state) => {
        if (state.currentProject) {
            return {
                currentProject: {
                    ...state.currentProject,
                    scenes: state.currentProject.scenes.filter((scene) => scene.id !== id),
                    updatedAt: Date.now(),
                },
            };
        }
        return {};
    });
    get().saveToLocalStorage();
  },

  reorderScenes: (fromIndex, toIndex) => {
    set((state) => {
        if (state.currentProject) {
            const scenes = [...state.currentProject.scenes];
            const [movedScene] = scenes.splice(fromIndex, 1);
            scenes.splice(toIndex, 0, movedScene);
            return {
                currentProject: {
                    ...state.currentProject,
                    scenes: scenes.map((scene, index) => ({ ...scene, order: index })),
                    updatedAt: Date.now(),
                },
            };
        }
        return {};
    });
    get().saveToLocalStorage();
  },

  setActiveScene: (id) => set({ activeSceneId: id }),
  openEditor: () => set({ isEditorOpen: true }),
  closeEditor: () => set({ isEditorOpen: false }),

  saveToLocalStorage: () => {
    const { currentProject } = get();
    if (currentProject) {
      set({ autoSaveStatus: 'saving' });
      // Debounce saving
      setTimeout(() => {
        try {
          const savedProjects = JSON.parse(localStorage.getItem('storyvid-projects') || '[]');
          const existingProjectIndex = savedProjects.findIndex((p: Project) => p.id === currentProject.id);
          if (existingProjectIndex > -1) {
            savedProjects[existingProjectIndex] = currentProject;
          } else {
            savedProjects.push(currentProject);
          }
          localStorage.setItem('storyvid-projects', JSON.stringify(savedProjects));
          localStorage.setItem(`storyvid-project-${currentProject.id}`, JSON.stringify(currentProject));
          set({ autoSaveStatus: 'saved' });
        } catch (error) {
          set({ autoSaveStatus: 'error' });
        }
      }, 1000);
    }
  },

  autoGenerateIllustrations: (sceneId) => {
    // AI illustration generation logic will be implemented here
    console.log("Auto-generating illustrations for scene:", sceneId);
  },
}));

export default useProjectStore;
