import System from "../core/system.js";

class RenderSystem extends System {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }

  update(entities) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    entities.forEach((entity) => {
      const animationComponent = entity.getComponent("AnimationComponent");
      const transformComponent = entity.getComponent("Transform");
      const sizeComponent = entity.getComponent("Size");

      if (animationComponent && transformComponent && sizeComponent) {
        const currentAnimation = animationComponent.currentAnimation;
        const animationData =
          animationComponent.animations.get(currentAnimation);

        if (currentAnimation && animationData) {
          const spritesheet = animationData.spritesheet;
          const frameCount = animationData.frameCount;
          const frameWidth = spritesheet.width / frameCount;
          const frameHeight = spritesheet.height;
          const currentFrame = animationComponent.currentFrame;

          const sourceX = currentFrame * frameWidth;

          this.ctx.save();

          this.ctx.translate(
            transformComponent.position.x,
            transformComponent.position.y
          );
          this.ctx.scale(
            transformComponent.scale.x,
            transformComponent.scale.y
          );

          this.ctx.drawImage(
            spritesheet,
            sourceX,
            0,
            frameWidth,
            frameHeight,
            0,
            0,
            sizeComponent.width,
            sizeComponent.height
          );

          this.ctx.restore();
        }
      }
    });
  }
}

export default RenderSystem;
