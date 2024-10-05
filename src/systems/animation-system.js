import System from "../core/system.js";
import AnimationComponent from "../components/animation-component.js";
import InputComponent from "../components/input-component.js";
import TransformComponent from "../components/transform-component.js";
import MovementComponent from "../components/movement-component.js";

class AnimationSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    this.entityManager.entities.forEach((entity) => {
      const animationComponent = entity.getComponent(AnimationComponent);
      const inputComponent = entity.getComponent(InputComponent);
      const transformComponent = entity.getComponent(TransformComponent);
      const movementComponent = entity.getComponent(MovementComponent);

      if (
        animationComponent &&
        inputComponent &&
        transformComponent &&
        movementComponent
      ) {
        this.updateAnimation(
          entity,
          animationComponent,
          inputComponent,
          transformComponent,
          movementComponent,
          deltaTime
        );
      }
    });
  }

  updateAnimation(
    entity,
    animationComponent,
    inputComponent,
    transformComponent,
    movementComponent,
    deltaTime
  ) {
    let newAnimation = null;

    if (movementComponent.isOnGround && transformComponent.velocity.x === 0) {
      newAnimation = "idle";
    } else if (
      movementComponent.isOnGround &&
      transformComponent.velocity.x !== 0
    ) {
      newAnimation = "run";
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y < 0
    ) {
      newAnimation = "jump";
    } else if (
      !movementComponent.isOnGround &&
      transformComponent.velocity.y > 0
    ) {
      newAnimation = "jump";
    }

    if (newAnimation !== animationComponent.currentAnimation) {
      animationComponent.currentAnimation = newAnimation;
      animationComponent.currentFrame = 0;
      animationComponent.elapsedTime = 0;
    }

    const animationData = animationComponent.animations.get(
      animationComponent.currentAnimation
    );
    if (animationData) {
      animationComponent.elapsedTime += deltaTime;

      if (animationComponent.currentAnimation === "jump") {
        if (transformComponent.velocity.y < 0) {
          animationComponent.currentFrame = 0;
        } else if (transformComponent.velocity.y > 0) {
          animationComponent.currentFrame = 1;
        }
      } else {
        const frameDuration = animationData.frameDuration / 1000;
        const frameCount = animationData.frameCount;

        if (animationComponent.elapsedTime >= frameDuration) {
          animationComponent.elapsedTime -= frameDuration;
          animationComponent.currentFrame =
            (animationComponent.currentFrame + 1) % frameCount;
        }
      }
    }
  }
}

export default AnimationSystem;
