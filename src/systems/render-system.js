import System from "../core/system.js";

class RenderSystem extends System {
  constructor(canvas, assetManager) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.assetManager = assetManager;
  }

  update(entities) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#2c3968";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const background = this.assetManager.getTexture("background");
    this.ctx.drawImage(background, 0, 0, 1280, 720);

    const far = this.assetManager.getTexture("far");
    this.ctx.drawImage(far, 0, 50, 1280, 720);

    entities.forEach((entity) => {
      const tileComponent = entity.getComponent("TileComponent");
      const animationComponent = entity.getComponent("AnimationComponent");
      const transformComponent = entity.getComponent("TransformComponent");
      const sizeComponent = entity.getComponent("SizeComponent");

      this.ctx.save();
      this.ctx.translate(
        transformComponent.position.x,
        transformComponent.position.y
      );
      this.ctx.scale(transformComponent.scale.x, transformComponent.scale.y);

      if (tileComponent) {
        this.renderTile(tileComponent, sizeComponent);
      }

      if (animationComponent) {
        this.renderAnimation(animationComponent, sizeComponent);
      }

      this.ctx.restore();
    });
  }

  renderTile(tileComponent, sizeComponent) {
    const { tileset, tileX, tileY, tileWidth, tileHeight } = tileComponent;
    this.ctx.drawImage(
      tileset,
      tileX * tileWidth,
      tileY * tileHeight,
      tileWidth,
      tileHeight,
      0,
      0,
      sizeComponent.width,
      sizeComponent.height
    );
  }

  renderAnimation(animationComponent, sizeComponent) {
    const currentAnimation = animationComponent.currentAnimation;
    const animationData = animationComponent.animations.get(currentAnimation);

    if (currentAnimation && animationData) {
      const { spritesheet, frameCount, frameDuration } = animationData;
      const frameWidth = spritesheet.width / frameCount;
      const frameHeight = spritesheet.height;
      const currentFrame = animationComponent.currentFrame;

      const sourceX = currentFrame * frameWidth;

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
    }
  }
}

export default RenderSystem;
