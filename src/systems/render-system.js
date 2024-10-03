import System from "../core/system.js";
import TileComponent from "../components/tile-component.js";
import AnimationComponent from "../components/animation-component.js";
import TransformComponent from "../components/transform-component.js";
import SizeComponent from "../components/size-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";

class RenderSystem extends System {
  constructor(canvas, assetManager, showBoundingBoxesCallback, camera) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.assetManager = assetManager;
    this.backgroundTexture = this.assetManager.getTexture("background");
    this.farTexture = this.assetManager.getTexture("far");
    this.showBoundingBoxes = showBoundingBoxesCallback;
    this.camera = camera;
  }

  update(entities) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#2c3968";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.position.x, -this.camera.position.y);

    const bgPos = this.camera.worldToScreen(0, 0);
    this.ctx.drawImage(
      this.backgroundTexture,
      bgPos.x,
      bgPos.y,
      this.canvas.width / this.camera.zoom,
      this.canvas.height / this.camera.zoom
    );
    this.ctx.drawImage(
      this.farTexture,
      bgPos.x,
      bgPos.y + 50,
      this.canvas.width / this.camera.zoom,
      this.canvas.height / this.camera.zoom
    );

    entities.forEach((entity) => {
      const transformComponent = entity.getComponent(TransformComponent);
      const sizeComponent = entity.getComponent(SizeComponent);

      if (transformComponent && sizeComponent) {
        this.ctx.save();
        this.ctx.translate(
          transformComponent.position.x,
          transformComponent.position.y
        );
        this.ctx.scale(transformComponent.scale.x, transformComponent.scale.y);

        const tileComponent = entity.getComponent(TileComponent);
        if (tileComponent) {
          this.renderTile(tileComponent, sizeComponent);
        }

        const animationComponent = entity.getComponent(AnimationComponent);
        if (animationComponent) {
          this.renderAnimation(
            animationComponent,
            sizeComponent,
            transformComponent
          );
        }

        this.ctx.restore();
      }

      const boundingBoxComponent = entity.getComponent(BoundingBoxComponent);
      if (this.showBoundingBoxes() && boundingBoxComponent) {
        this.renderBoundingBox(transformComponent, boundingBoxComponent);
      }
    });

    this.ctx.restore();
  }

  renderTile(tileComponent, sizeComponent) {
    const { tileset, tileX, tileY, tileWidth, tileHeight } = tileComponent;
    this.ctx.drawImage(
      tileset,
      tileX,
      tileY,
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

      this.ctx.save();
      if (transformComponent.direction === -1) {
        this.ctx.scale(transformComponent.direction, 1);
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
    const {
      offset: { x: offsetX, y: offsetY },
      size: { width, height },
    } = boundingBoxComponent;

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
