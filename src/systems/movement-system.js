import System from "../core/system.js";
import InputComponent from "../components/input-component.js";
import TransformComponent from "../components/transform-component.js";
import GravityComponent from "../components/gravity-component.js";
import MovementComponent from "../components/movement-component.js";

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
      const movementComponent = entity.getComponent(MovementComponent);

      if (!transformComponent || !movementComponent) return;

      if (gravityComponent) {
        this.applyGravity(gravityComponent, transformComponent, deltaTime);
      }

      if (inputComponent) {
        this.handleMovement(
          inputComponent,
          transformComponent,
          gravityComponent,
          movementComponent,
          deltaTime
        );
      }

      this.updatePosition(transformComponent, deltaTime);
    });
  }

  applyGravity(gravityComponent, transformComponent, deltaTime) {
    transformComponent.velocity.y += gravityComponent.force * deltaTime;
  }

  handleMovement(
    inputComponent,
    transformComponent,
    gravityComponent,
    movementComponent,
    deltaTime
  ) {
    const velocity = transformComponent.velocity;
    const { movementSpeed, jumpHeight } = movementComponent;

    velocity.x = 0;

    if (inputComponent.keys.left) velocity.x -= movementSpeed;
    if (inputComponent.keys.right) velocity.x += movementSpeed;

    if (velocity.x !== 0) {
      transformComponent.direction = Math.sign(velocity.x);
    }

    inputComponent.jumpBufferTime = Math.max(
      0,
      inputComponent.jumpBufferTime - deltaTime
    );

    if (inputComponent.jumpBufferTime > 0 && gravityComponent.isOnGround) {
      inputComponent.canJump = true;
    }

    if (
      inputComponent.jumpPressed &&
      inputComponent.canJump &&
      gravityComponent.isOnGround
    ) {
      velocity.y = -jumpHeight;
      gravityComponent.isOnGround = false;
      inputComponent.canJump = false;
      inputComponent.jumpBufferTime = 0;
    }
  }

  updatePosition(transformComponent, deltaTime) {
    transformComponent.position = transformComponent.position.add(
      transformComponent.velocity.multiply(deltaTime)
    );
  }
}

export default MovementSystem;
