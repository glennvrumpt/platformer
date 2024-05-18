import System from "../core/system.js";
import Vector2 from "../utilities/vector2.js";

class MovementSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    const entities = this.entityManager.entities;

    entities.forEach((entity) => {
      const inputComponent = entity.getComponent("InputComponent");
      const transformComponent = entity.getComponent("TransformComponent");
      const gravityComponent = entity.getComponent("GravityComponent");

      if (!inputComponent || !transformComponent) return;

      const speed = 200;
      const velocity = new Vector2(0, 0);

      if (gravityComponent) {
        velocity.y += gravityComponent.force;
      }

      if (inputComponent.up) {
        velocity.y -= speed;
      }
      if (inputComponent.down) {
        velocity.y += speed;
      }
      if (inputComponent.left) {
        velocity.x -= speed;
      }
      if (inputComponent.right) {
        velocity.x += speed;
      }

      transformComponent.position = transformComponent.position.add(
        velocity.multiply(deltaTime)
      );
    });
  }
}

export default MovementSystem;
