import System from "../core/system.js";
import StateComponent from "../components/state-component.js";
import MovementComponent from "../components/movement-component.js";
import TransformComponent from "../components/transform-component.js";

class StateSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    this.entityManager.entities.forEach((entity) => {
      const stateComponent = entity.getComponent(StateComponent);
      const movementComponent = entity.getComponent(MovementComponent);
      const transformComponent = entity.getComponent(TransformComponent);

      if (!stateComponent || !movementComponent || !transformComponent) {
        return;
      }

      const newState = this.updateState(
        stateComponent,
        movementComponent,
        transformComponent
      );

      if (newState !== stateComponent.state) {
        stateComponent.state = newState;
      }
    });
  }

  updateState(stateComponent, movementComponent, transformComponent) {
    const STATE_IDLE = "idle";
    const STATE_RUN = "run";
    const STATE_JUMP = "jump";
    const STATE_FALL = "fall";

    if (movementComponent.isOnGround && transformComponent.velocity.x === 0) {
      return STATE_IDLE;
    } else if (
      movementComponent.isOnGround &&
      transformComponent.velocity.x !== 0
    ) {
      return STATE_RUN;
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y < 0
    ) {
      return STATE_JUMP;
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y > 0
    ) {
      return STATE_JUMP;
    }
  }
}

export default StateSystem;
