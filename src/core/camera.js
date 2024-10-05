import Vector2 from "../utilities/vector2.js";
import TransformComponent from "../components/transform-component.js";

class Camera {
  constructor(width, height, worldWidth, worldHeight) {
    this.width = width;
    this.height = height;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.position = new Vector2(0, 0);
    this.zoom = 1.5;
    this.maxVerticalMovement = 100;
  }

  follow(entity) {
    this.target = entity;
  }

  update() {
    if (this.target) {
      const targetPosition =
        this.target.getComponent(TransformComponent).position;

      const targetX = targetPosition.x - this.width / (2 * this.zoom);
      this.position.x += (targetX - this.position.x) * 0.1;

      const targetY = targetPosition.y - this.height / (2 * this.zoom);
      const clampedTargetY = Math.max(
        targetY - this.maxVerticalMovement,
        Math.min(targetY + this.maxVerticalMovement, this.position.y)
      );
      this.position.y += (clampedTargetY - this.position.y) * 0.05;
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
