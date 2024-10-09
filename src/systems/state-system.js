import System from "../core/system.js";
import StateComponent from "../components/state-component.js";
import MovementComponent from "../components/movement-component.js";
import TransformComponent from "../components/transform-component.js";

const STATES = {
  IDLE: "idle",
  RUN: "run",
  JUMP: "jump",
  FALL: "fall",
};

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

      const newState = this.determineState(
        stateComponent,
        movementComponent,
        transformComponent
      );

      if (newState !== stateComponent.state) {
        stateComponent.state = newState;
      }
    });
  }

  determineState(stateComponent, movementComponent, transformComponent) {
    if (movementComponent.isOnGround && transformComponent.velocity.x === 0) {
      return STATES.IDLE;
    } else if (
      movementComponent.isOnGround &&
      transformComponent.velocity.x !== 0
    ) {
      return STATES.RUN;
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y < 0
    ) {
      return STATES.JUMP;
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y > 0
    ) {
      return STATES.FALL;
    }
  }
}

export default StateSystem;
