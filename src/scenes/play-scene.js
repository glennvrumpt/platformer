import Scene from "./scene.js";
import EntityManager from "../core/entity-manager.js";
import AnimationSystem from "../systems/animation-system.js";
import RenderSystem from "../systems/render-system.jsjs";

class PlayScene extends Scene {
  constructor(engine) {
    super(engine);
    this.init();
  }

  init() {
    this.actionMap.set(87, "jump");
    this.actionMap.set(65, "moveLeft");
    this.actionMap.set(68, "moveRight");
    this.actionMap.set(32, "shoot");

    this.loadLevel();
  }

  loadLevel() {
    this.entityManager = new EntityManager();

    this.renderSystem = new RenderSystem(this.engine.canvas);
    this.animationSystem = new AnimationSystem(this.entityManager);

    const player = new Entity();
    const playerAnimationComponent = new AnimationComponent();
    const idleAnimation = {
      spritesheet: "player_idle_spritesheet.png",
      frameCount: 5,
      frameDuration: 100,
      loop: true,
    };
    const runningAnimation = {
      spritesheet: "player_running_spritesheet.png",
      frameCount: 5,
      frameDuration: 80,
      loop: true,
    };
    playerAnimationComponent.animations.set("idle", idleAnimation);
    playerAnimationComponent.animations.set("running", runningAnimation);
    playerAnimationComponent.currentAnimation = "idle";
    player.addComponent(playerAnimationComponent);

    this.entityManager.addEntity(player);
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
        console.log("Jump action released!");
      }
    }
  }

  update(deltaTime) {
    this.animationSystem.update(this.entityManager.entities, deltaTime);
    this.renderSystem.update(this.entityManager.entities);
  }

  onEnd() {}
}

export default PlayScene;
