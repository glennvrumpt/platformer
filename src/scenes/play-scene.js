import Scene from "./scene.js";
import EntityManager from "../core/entity-manager.js";
import RenderSystem from "../systems/render-system.js";
import AnimationSystem from "../systems/animation-system.js";
import CollisionSystem from "../systems/collision-system.js";
import LevelLoader from "../utilities/level-loader.js";

class PlayScene extends Scene {
  constructor(engine) {
    super(engine);
    this.entityManager = new EntityManager();
    this.renderSystem = new RenderSystem(
      this.engine.canvas,
      this.engine.assetManager
    );
    this.animationSystem = new AnimationSystem(this.entityManager);
    this.collisionSystem = new CollisionSystem(this.entityManager);
    this.levelLoader = new LevelLoader(this.engine);
    this.init();
  }

  async init() {
    this.actionMap.set(87, "jump");
    this.actionMap.set(65, "left");
    this.actionMap.set(68, "right");
    this.actionMap.set(32, "shoot");

    try {
      const entities = await this.levelLoader.loadLevel(
        "../src/assets/levels/level1.json"
      );
      entities.forEach((entity) => this.entityManager.addEntity(entity));
    } catch (error) {
      console.error("Failed to load level:", error);
    }
  }

  doAction(action) {
    const actionCode = action.code;
    const actionType = action.type;

    if (actionType === "keydown") {
      if (actionCode === 87) {
        console.log("Jump action triggered!");
      } else if (actionCode === 65) {
        console.log("Move left action triggered!");
      } else if (actionCode === 68) {
        console.log("Move right action triggered!");
      }
    }

    if (actionType === "keydown") {
      if (actionCode === 87) {
      } else if (actionCode === 65) {
      } else if (actionCode === 68) {
      }
    }
  }

  update(deltaTime) {
    this.entityManager.update();
    this.renderSystem.update(this.entityManager.entities);
    this.animationSystem.update(deltaTime);
    this.collisionSystem.update();
  }

  onEnd() {}
}

export default PlayScene;
