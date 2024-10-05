import Vector2 from "../utilities/vector2.js";
import TransformComponent from "../components/transform-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";

class Camera {
  constructor(width, height, worldWidth, worldHeight) {
    this.width = width;
    this.height = height;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.position = new Vector2(0, 0);
    this.zoom = 1;
    this.smoothingFactor = 0.1;
    this.target = null;
    this.maxVerticalMovement = 100;
  }

  follow(entity) {
    this.target = entity;
  }

  update() {
    if (this.target) {
      const transform = this.target.getComponent(TransformComponent);
      const boundingBox = this.target.getComponent(BoundingBoxComponent);

      if (transform && boundingBox) {
        const pivotWorldX =
          transform.position.x + boundingBox.size.width * transform.pivot.x;
        const pivotWorldY =
          transform.position.y + boundingBox.size.height * transform.pivot.y;

        const targetX = pivotWorldX - this.width / (2 * this.zoom);
        const targetY = pivotWorldY - this.height / (2 * this.zoom);

        const clampedTargetY = Math.max(
          targetY - this.maxVerticalMovement,
          Math.min(targetY + this.maxVerticalMovement, this.position.y)
        );

        this.position.x += (targetX - this.position.x) * this.smoothingFactor;
        this.position.y +=
          (clampedTargetY - this.position.y) * this.smoothingFactor;
      }
    }

    this.position.x = Math.max(
      0,
      Math.min(this.position.x, this.worldWidth - this.width / this.zoom)
    );
    this.position.y = Math.max(
      0,
      Math.min(this.position.y, this.worldHeight - this.height / this.zoom)
    );
  }

  setZoom(zoomLevel) {
    this.zoom = zoomLevel;
  }

  screenToWorld(screenX, screenY) {
    return new Vector2(
      screenX / this.zoom + this.position.x,
      screenY / this.zoom + this.position.y
    );
  }

  worldToScreen(worldX, worldY) {
    return new Vector2(
      (worldX - this.position.x) * this.zoom,
      (worldY - this.position.y) * this.zoom
    );
  }
}

export default Camera;
