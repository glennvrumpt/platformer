import System from "../core/system.js";
import TileComponent from "../components/tile-component.js";
import AnimationComponent from "../components/animation-component.js";
import TransformComponent from "../components/transform-component.js";
import SizeComponent from "../components/size-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";

class RenderSystem extends System {
  constructor(canvas, assetManager, showBoundingBoxesCallback) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.assetManager = assetManager;
    this.backgroundTexture = this.assetManager.getTexture("background");
    this.farTexture = this.assetManager.getTexture("far");
    this.showBoundingBoxes = showBoundingBoxesCallback;
  }

  update(entities) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#2c3968";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(this.backgroundTexture, 0, 0, 1280, 720);
    this.ctx.drawImage(this.farTexture, 0, 50, 1280, 720);

    entities.forEach((entity) => {
      const tileComponent = entity.getComponent(TileComponent);
      const animationComponent = entity.getComponent(AnimationComponent);
      const transformComponent = entity.getComponent(TransformComponent);
      const sizeComponent = entity.getComponent(SizeComponent);
      const boundingBoxComponent = entity.getComponent(BoundingBoxComponent);

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
        this.renderAnimation(
          animationComponent,
          sizeComponent,
          transformComponent
        );
      }

      this.ctx.restore();

      if (this.showBoundingBoxes() && boundingBoxComponent) {
        this.renderBoundingBox(transformComponent, boundingBoxComponent);
      }
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

  renderAnimation(animationComponent, sizeComponent, transformComponent) {
    const currentAnimation = animationComponent.currentAnimation;
    const animationData = animationComponent.animations.get(currentAnimation);

    if (currentAnimation && animationData) {
      const { spritesheet, frameCount, frameDuration } = animationData;
      const frameWidth = spritesheet.width / frameCount;
      const frameHeight = spritesheet.height;
      const currentFrame = animationComponent.currentFrame;
      const sourceX = currentFrame * frameWidth;
      console.log(transformComponent.direction);
      this.ctx.save();
      if (transformComponent.direction === "left") {
        this.ctx.scale(-1, 1);
        this.ctx.translate(-sizeComponent.width, 0);
      }
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

  renderBoundingBox(transformComponent, boundingBoxComponent) {
    const { offsetX, offsetY, width, height } = boundingBoxComponent;

    this.ctx.save();
    this.ctx.strokeStyle = "#ffffff";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      transformComponent.position.x + offsetX,
      transformComponent.position.y + offsetY,
      width,
      height
    );
    this.ctx.restore();
  }
}

export default RenderSystem;
