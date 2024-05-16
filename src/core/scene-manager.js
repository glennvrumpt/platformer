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
    if (this.scenes.has(name)) {
      this.scenes.get(name);
    } else {
      this.scenes.set(name, scene);
    }
  }

  getCurrentScene() {
    return this.scenes.get(this.currentScene);
  }
}

export default SceneManager;
