
import useProjectStore from './useProjectStore';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
}));


describe('useProjectStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useProjectStore.setState({
      currentProject: null,
      activeSceneId: null,
      isGenerating: false,
      isEditorOpen: false,
      autoSaveStatus: 'idle',
    });
    localStorage.clear();
  });

  it('should correctly re-order scenes after one is deleted', () => {
    const { getState } = useProjectStore;

    // 1. Create a project and add some scenes
    getState().createProject('Test Project');
    getState().addScene();
    getState().addScene();
    getState().addScene();

    let project = getState().currentProject;
    expect(project?.scenes.length).toBe(3);
    expect(project?.scenes[0].order).toBe(0);
    expect(project?.scenes[1].order).toBe(1);
    expect(project?.scenes[2].order).toBe(2);

    const sceneToDeleteId = project!.scenes[1].id;

    // 2. Delete a scene
    getState().deleteScene(sceneToDeleteId);

    // 3. Check the order of the remaining scenes
    project = getState().currentProject;
    expect(project?.scenes.length).toBe(2);
    expect(project?.scenes[0].order).toBe(0);
    expect(project?.scenes[1].order).toBe(1);
  });
});
