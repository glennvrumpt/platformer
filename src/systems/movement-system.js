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

      const velocity = transformComponent.velocity;

      if (gravityComponent) {
        velocity.y += gravityComponent.force;
      }

      if (inputComponent) {
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
          gravityComponent.force === 0
        ) {
          velocity.y = -jumpSpeed;
          inputComponent.canJump = false;
        }

        if (!inputComponent.up) {
          inputComponent.canJump = true;
        }
      }

      transformComponent.position = transformComponent.position.add(
        velocity.multiply(deltaTime)
      );
    });
  }
}

export default MovementSystem;
