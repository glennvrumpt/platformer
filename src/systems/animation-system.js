import System from "../core/system.js";
import AnimationComponent from "../components/animation-component.js";
import StateComponent from "../components/state-component.js";
import TransformComponent from "../components/transform-component.js";

class AnimationSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    this.entityManager.entities.forEach((entity) => {
      const animationComponent = entity.getComponent(AnimationComponent);
      const stateComponent = entity.getComponent(StateComponent);
      const transformComponent = entity.getComponent(TransformComponent);

      if (!animationComponent || !stateComponent || !transformComponent) {
        return;
      }

      this.updateAnimation(
        entity,
        animationComponent,
        stateComponent,
        transformComponent,
        deltaTime
      );
    });
  }

  updateAnimation(
    entity,
    animationComponent,
    stateComponent,
    transformComponent,
    deltaTime
  ) {
    const newAnimation = stateComponent.state;

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
