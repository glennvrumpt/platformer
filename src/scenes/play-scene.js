import Scene from "./scene.js";
import EntityManager from "../core/entity-manager.js";
import RenderSystem from "../systems/render-system.js";
import AnimationSystem from "../systems/animation-system.js";
import Entity from "../core/entity.js";
import TransformComponent from "../components/transform-component.js";
import SizeComponent from "../components/size-component.js";
import AnimationComponent from "../components/animation-component.js";
import Vector2 from "../utilities/vector2.js";

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
    player.addComponent(new TransformComponent(new Vector2(300, 300)));
    player.addComponent(new SizeComponent(128, 128));
    const playerAnimationComponent = new AnimationComponent();
    const idleAnimation = {
      spritesheet: this.engine.assetManager.getTexture("player_idle"),
      frameCount: 6,
      frameDuration: 200,
      loop: true,
    };
    const runningAnimation = {
      spritesheet: this.engine.assetManager.getTexture("player_run"),
      frameCount: 6,
      frameDuration: 100,
      loop: true,
    };
    playerAnimationComponent.animations.set("idle", idleAnimation);
    playerAnimationComponent.animations.set("run", runningAnimation);
    playerAnimationComponent.currentAnimation = "idle";
    player.addComponent(playerAnimationComponent);

    this.entityManager.addEntity(player);
    console.log(this.entityManager.entities);
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
    this.animationSystem.update(deltaTime, this.entityManager.entities);
  }

  onEnd() {}
}

export default PlayScene;
