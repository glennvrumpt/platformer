import System from "../core/system.js";

class AnimationSystem extends System {
  constructor() {
    super();
  }

  update(entities, deltaTime) {
    entities.forEach((entity) => {
      const animationComponent = entity.getComponent("AnimationComponent");
      if (animationComponent) {
        this.updateAnimation(entity, animationComponent, deltaTime);
      }
    });
  }

  updateAnimation(entity, animationComponent, deltaTime) {
    const currentAnimation = animationComponent.animations.get(
      animationComponent.currentAnimation
    );
    if (!currentAnimation) return;

    const frameDuration = currentAnimation.frameDuration;
    const frameCount = currentAnimation.frameCount;
    const totalDuration = frameDuration * frameCount;

    animationComponent.elapsedTime += deltaTime;

    if (
      animationComponent.elapsedTime > totalDuration &&
      currentAnimation.loop
    ) {
      animationComponent.elapsedTime %= totalDuration;
    }

    const currentFrameIndex = Math.floor(
      animationComponent.elapsedTime / frameDuration
    );
    const currentFrame = currentAnimation.spritesheet[currentFrameIndex];

    animationComponent.currentFrame = currentFrame;
  }
}

export default AnimationSystem;
