import System from "../core/system.js";

class AnimationSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    this.entityManager.entities.forEach((entity) => {
      const animationComponent = entity.getComponent("AnimationComponent");
      if (animationComponent) {
        const currentAnimation = animationComponent.currentAnimation;
        const animationData =
          animationComponent.animations.get(currentAnimation);

        if (currentAnimation && animationData) {
          const frameCount = animationData.frameCount;
          const frameDuration = animationData.frameDuration;

          animationComponent.elapsedTime += deltaTime;

          const frameIndex =
            Math.floor(
              animationComponent.elapsedTime / (frameDuration / 1000)
            ) % frameCount;

          if (frameIndex < 0) {
            frameIndex += frameCount;
          }

          animationComponent.currentFrame = frameIndex;
        }
      }
    });
  }
}

export default AnimationSystem;
