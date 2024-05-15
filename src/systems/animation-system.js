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
          const loop = animationData.loop;

          animationComponent.elapsedTime += deltaTime;

          const frameIndex =
            Math.floor(animationComponent.elapsedTime / frameDuration) %
            frameCount;

          animationComponent.currentFrame = frameIndex;
        }
      }
    });
  }
}

export default AnimationSystem;
