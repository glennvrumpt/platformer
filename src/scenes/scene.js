import EntityManager from "../core/entity-manager.js";

class Scene {
  constructor(engine) {
    this.engine = engine;
    this.entityManager = new EntityManager();
    this.currentFrame = 0;
    this.actionMap = new Map();
    this.paused = false;
    this.hasEnded = false;
  }

  init() {}

  update(deltaTime) {}

  render(context) {}

  getAction(keyCode) {
    return this.actionMap.get(keyCode);
  }

  doAction(actionName) {}

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  end() {
    this.hasEnded = true;
  }
}

export default Scene;
