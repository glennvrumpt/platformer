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

      const jumpSpeed = 800;
      const speed = 200;
      const velocity = transformComponent.velocity;

      if (gravityComponent) {
        velocity.y += gravityComponent.force;
      }

      if (inputComponent.left) {
        velocity.x = -speed;
      }
      if (inputComponent.right) {
        velocity.x = speed;
      }

      if (
        inputComponent.up &&
        gravityComponent &&
        gravityComponent.force === 0
      ) {
        velocity.y = -jumpSpeed;
      }

      transformComponent.position = transformComponent.position.add(
        velocity.multiply(deltaTime)
      );

      velocity.x = 0;
    });
  }
}

export default MovementSystem;
