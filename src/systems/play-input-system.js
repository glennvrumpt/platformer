import System from "../core/system.js";
import InputComponent from "../components/input-component.js";
import TransformComponent from "../components/transform-component.js";

class PlayInputSystem extends System {
  constructor(entityManager, playScene) {
    super();
    this.entityManager = entityManager;
    this.playScene = playScene;
  }

  handleAction(action) {
    const actionCode = action.code;
    const actionType = action.type;

    const player = this.entityManager.tagSystem.getEntityByTag("player");
    if (!player) {
      console.error("Player entity not found");
      return;
    }

    const inputComponent = player.getComponent(InputComponent);
    if (!inputComponent) {
      console.error("InputComponent not found on player");
      return;
    }

    const transformComponent = player.getComponent(TransformComponent);
    if (!transformComponent) {
      console.error("TransformComponent not found on player");
      return;
    }

    if (actionType === "keydown") {
      if (actionCode === 87) {
        inputComponent.up = true;
      } else if (actionCode === 65) {
        inputComponent.left = true;
        transformComponent.direction = "left";
      } else if (actionCode === 68) {
        inputComponent.right = true;
        transformComponent.direction = "right";
      } else if (actionCode === 32) {
      } else if (actionCode === 67) {
        this.playScene.showBoundingBoxes = !this.playScene.showBoundingBoxes;
      }
    } else if (actionType === "keyup") {
      if (actionCode === 87) {
        inputComponent.up = false;
      } else if (actionCode === 65) {
        inputComponent.left = false;
      } else if (actionCode === 68) {
        inputComponent.right = false;
      } else if (actionCode === 32) {
      }
    }
  }
}

export default PlayInputSystem;
