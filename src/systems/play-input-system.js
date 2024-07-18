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
    const actionValue = action.value;
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

    switch (actionType) {
      case "keydown":
        switch (actionValue) {
          case 87:
            inputComponent.up = true;
            break;
          case 65:
            inputComponent.left = true;
            inputComponent.lastHorizontalKeyPressed = "left";
            break;
          case 68:
            inputComponent.right = true;
            inputComponent.lastHorizontalKeyPressed = "right";
            break;
          case 67:
            this.playScene.showBoundingBoxes =
              !this.playScene.showBoundingBoxes;
            break;
          default:
            break;
        }
        break;

      case "keyup":
        switch (actionValue) {
          case 87:
            inputComponent.up = false;
            break;
          case 65:
            inputComponent.left = false;
            break;
          case 68:
            inputComponent.right = false;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  }
}

export default PlayInputSystem;
