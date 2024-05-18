import System from "../core/system.js";

class PlayInputSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  handleAction(action) {
    const actionCode = action.code;
    const actionType = action.type;

    const player = this.entityManager.getEntityByTag("player");
    if (!player) {
      console.error("Player entity not found");
      return;
    }

    const inputComponent = player.getComponent("InputComponent");
    if (!inputComponent) {
      console.error("InputComponent not found on player");
      return;
    }

    if (actionType === "keydown") {
      if (actionCode === 87) {
        inputComponent.up = true;
      } else if (actionCode === 65) {
        inputComponent.left = true;
      } else if (actionCode === 68) {
        inputComponent.right = true;
      } else if (actionCode === 32) {
        inputComponent.shoot = true;
      }
    } else if (actionType === "keyup") {
      if (actionCode === 87) {
        inputComponent.up = false;
      } else if (actionCode === 65) {
        inputComponent.left = false;
      } else if (actionCode === 68) {
        inputComponent.right = false;
      } else if (actionCode === 32) {
        inputComponent.shoot = false;
      }
    }
  }
}

export default PlayInputSystem;
