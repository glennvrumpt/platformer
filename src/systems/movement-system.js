import System from "../core/system.js";
import InputComponent from "../components/input-component.js";
import TransformComponent from "../components/transform-component.js";
import GravityComponent from "../components/gravity-component.js";
import Vector2 from "../utilities/vector2.js";

class MovementSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    const entities = this.entityManager.entities;

    entities.forEach((entity) => {
      const inputComponent = entity.getComponent(InputComponent);
      const transformComponent = entity.getComponent(TransformComponent);
      const gravityComponent = entity.getComponent(GravityComponent);

      if (!transformComponent) return;

      if (gravityComponent) {
        this.applyGravity(gravityComponent, transformComponent);
      }

      if (inputComponent) {
        this.handleMovement(
          inputComponent,
          transformComponent,
          gravityComponent
        );
      }

      this.updatePosition(transformComponent, deltaTime);
    });
  }

  applyGravity(gravityComponent, transformComponent) {
    if (gravityComponent && !gravityComponent.isOnGround) {
      transformComponent.velocity.y += gravityComponent.force;
    } else if (gravityComponent) {
      transformComponent.velocity.y = 0;
    }
  }

  handleMovement(inputComponent, transformComponent, gravityComponent) {
    const velocity = transformComponent.velocity;
    const jumpSpeed = 700;
    const speed = 200;

    velocity.x = 0;

    if (inputComponent.left && inputComponent.right) {
      velocity.x = speed * transformComponent.direction;
    } else if (inputComponent.left) {
      velocity.x = -speed;
    } else if (inputComponent.right) {
      velocity.x = speed;
    }

    if (velocity.x !== 0) {
      transformComponent.direction = Math.sign(velocity.x);
    }

    if (
      inputComponent.up &&
      inputComponent.canJump &&
      gravityComponent &&
      gravityComponent.isOnGround
    ) {
      velocity.y = -jumpSpeed;
      inputComponent.canJump = false;
      gravityComponent.isOnGround = false;
    }
  }

  updatePosition(transformComponent, deltaTime) {
    transformComponent.position = transformComponent.position.add(
      transformComponent.velocity.multiply(deltaTime)
    );
  }
}

export default MovementSystem;
