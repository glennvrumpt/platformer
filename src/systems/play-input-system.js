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

    const isKeyDown = action.type === "keydown";

    switch (action.value) {
      case 87:
        if (isKeyDown && !inputComponent.keys.up) {
          inputComponent.jumpPressed = true;
        }
        inputComponent.keys.up = isKeyDown;
        break;
      case 65:
        inputComponent.keys.left = isKeyDown;
        break;
      case 68:
        inputComponent.keys.right = isKeyDown;
        break;
      case 67:
        if (isKeyDown) {
          this.playScene.showBoundingBoxes = !this.playScene.showBoundingBoxes;
        }
        break;
      default:
        break;
    }
  }
}

export default PlayInputSystem;
