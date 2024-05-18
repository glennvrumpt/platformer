class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scenes = new Map();
    this.currentScene = null;
  }

  addScene(name, scene) {
    this.scenes.set(name, scene);
  }

  changeScene(name, scene) {
    this.currentScene = name;
    this.scenes.set(name, scene);
    this.scenes.get(name).init();
  }

  getCurrentScene() {
    return this.scenes.get(this.currentScene);
  }
}

export default SceneManager;
