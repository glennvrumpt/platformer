import Scene from "./scene.js";
import EntityManager from "../core/entity-manager.js";
import RenderSystem from "../systems/render-system.js";
import AnimationSystem from "../systems/animation-system.js";
import CollisionSystem from "../systems/collision-system.js";
import MovementSystem from "../systems/movement-system.js";
import PlayInputSystem from "../systems/play-input-system.js";
import LevelLoader from "../utilities/level-loader.js";

class PlayScene extends Scene {
  constructor(engine) {
    super(engine);
    this.entityManager = new EntityManager();
    this.levelLoader = new LevelLoader(this.engine);
    this.systemsInitialized = false;
    this.showBoundingBoxes = false;
  }

  async init() {
    this.actionMap.set(87, "jump");
    this.actionMap.set(65, "left");
    this.actionMap.set(68, "right");
    this.actionMap.set(32, "shoot");
    this.actionMap.set(67, "toggleBoundingBoxes");

    try {
      const entities = await this.levelLoader.loadLevel(
        "../src/assets/levels/level1.json"
      );
      entities.forEach((entity) => this.entityManager.addEntity(entity));

      this.renderSystem = new RenderSystem(
        this.engine.canvas,
        this.engine.assetManager,
        () => this.showBoundingBoxes
      );
      this.animationSystem = new AnimationSystem(this.entityManager);
      this.collisionSystem = new CollisionSystem(this.entityManager);
      this.movementSystem = new MovementSystem(this.entityManager);
      this.playInputSystem = new PlayInputSystem(this.entityManager, this);

      this.entityManager.update();

      this.systemsInitialized = true;
    } catch (error) {
      console.error("Failed to load level:", error);
    }
  }

  doAction(action) {
    this.playInputSystem.handleAction(action);
  }

  update(deltaTime) {
    this.entityManager.update();

    if (this.systemsInitialized) {
      this.renderSystem.update(this.entityManager.entities);
      this.animationSystem.update(deltaTime);
      this.collisionSystem.update();
      this.movementSystem.update(deltaTime);
    }
  }

  onEnd() {}
}

export default PlayScene;
