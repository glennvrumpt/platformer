import System from "../core/system.js";
import TransformComponent from "../components/transform-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";
import InputComponent from "../components/input-component.js";
import TagComponent from "../components/tag-component.js";
import GravityComponent from "../components/gravity-component.js";
import Vector2 from "../utilities/vector2.js";

class CollisionSystem extends System {
  constructor(entityManager, cellSize = 64) {
    super();
    this.entityManager = entityManager;
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  addToGrid(entity) {
    const transform = entity.getComponent(TransformComponent);
    const boundingBox = entity.getComponent(BoundingBoxComponent);

    if (!transform || !boundingBox) return;

    const minX = transform.position.x + boundingBox.offsetX;
    const minY = transform.position.y + boundingBox.offsetY;
    const maxX = minX + boundingBox.width;
    const maxY = minY + boundingBox.height;

    const cellMinX = Math.floor(minX / this.cellSize);
    const cellMinY = Math.floor(minY / this.cellSize);
    const cellMaxX = Math.floor(maxX / this.cellSize);
    const cellMaxY = Math.floor(maxY / this.cellSize);

    for (let cellY = cellMinY; cellY <= cellMaxY; cellY++) {
      for (let cellX = cellMinX; cellX <= cellMaxX; cellX++) {
        const key = this.getCellKey(
          cellX * this.cellSize,
          cellY * this.cellSize
        );
        if (!this.grid.has(key)) {
          this.grid.set(key, new Set());
        }
        this.grid.get(key).add(entity);
      }
    }
  }

  clearGrid() {
    this.grid.clear();
  }

  checkCollision(entity1, entity2) {
    const transform1 = entity1.getComponent(TransformComponent);
    const boundingBox1 = entity1.getComponent(BoundingBoxComponent);
    const transform2 = entity2.getComponent(TransformComponent);
    const boundingBox2 = entity2.getComponent(BoundingBoxComponent);

    if (!transform1 || !boundingBox1 || !transform2 || !boundingBox2)
      return false;

    const left1 = transform1.position.x + boundingBox1.offsetX;
    const right1 = left1 + boundingBox1.width;
    const top1 = transform1.position.y + boundingBox1.offsetY;
    const bottom1 = top1 + boundingBox1.height;

    const left2 = transform2.position.x + boundingBox2.offsetX;
    const right2 = left2 + boundingBox2.width;
    const top2 = transform2.position.y + boundingBox2.offsetY;
    const bottom2 = top2 + boundingBox2.height;

    return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
  }

  update(deltaTime) {
    this.clearGrid();

    const entities = this.entityManager.entities;
    entities.forEach((entity) => this.addToGrid(entity));

    entities.forEach((entity) => {
      if (
        entity.getComponent(TransformComponent) &&
        entity.getComponent(BoundingBoxComponent)
      ) {
        const gravityComponent = entity.getComponent(GravityComponent);
        if (gravityComponent) {
          gravityComponent.isOnGround = false;
        }
        this.handleCollisionsForEntity(entity);
      }
    });
  }

  handleCollisionsForEntity(entity) {
    const transform = entity.getComponent(TransformComponent);
    const boundingBox = entity.getComponent(BoundingBoxComponent);

    const minX = transform.position.x + boundingBox.offsetX;
    const minY = transform.position.y + boundingBox.offsetY;
    const maxX = minX + boundingBox.width;
    const maxY = minY + boundingBox.height;

    const cellMinX = Math.floor(minX / this.cellSize);
    const cellMinY = Math.floor(minY / this.cellSize);
    const cellMaxX = Math.floor(maxX / this.cellSize);
    const cellMaxY = Math.floor(maxY / this.cellSize);

    const collidedEntities = new Set();

    for (let cellY = cellMinY; cellY <= cellMaxY; cellY++) {
      for (let cellX = cellMinX; cellX <= cellMaxX; cellX++) {
        const key = this.getCellKey(
          cellX * this.cellSize,
          cellY * this.cellSize
        );
        const cellEntities = this.grid.get(key);

        if (cellEntities) {
          cellEntities.forEach((otherEntity) => {
            if (entity !== otherEntity && !collidedEntities.has(otherEntity)) {
              if (this.checkCollision(entity, otherEntity)) {
                collidedEntities.add(otherEntity);
                this.resolveCollision(entity, otherEntity);
              }
            }
          });
        }
      }
    }
  }

  resolveCollision(entity1, entity2) {
    const transform1 = entity1.getComponent(TransformComponent);
    const boundingBox1 = entity1.getComponent(BoundingBoxComponent);
    const transform2 = entity2.getComponent(TransformComponent);
    const boundingBox2 = entity2.getComponent(BoundingBoxComponent);

    const tagComponent2 = entity2.getComponent(TagComponent);
    const isTile = tagComponent2 && tagComponent2.tags.has("tile");

    if (isTile) {
      const overlapX =
        Math.min(
          transform1.position.x + boundingBox1.offsetX + boundingBox1.width,
          transform2.position.x + boundingBox2.offsetX + boundingBox2.width
        ) -
        Math.max(
          transform1.position.x + boundingBox1.offsetX,
          transform2.position.x + boundingBox2.offsetX
        );

      const overlapY =
        Math.min(
          transform1.position.y + boundingBox1.offsetY + boundingBox1.height,
          transform2.position.y + boundingBox2.offsetY + boundingBox2.height
        ) -
        Math.max(
          transform1.position.y + boundingBox1.offsetY,
          transform2.position.y + boundingBox2.offsetY
        );

      if (overlapX < overlapY) {
        if (transform1.position.x < transform2.position.x) {
          transform1.position.x -= overlapX;
        } else {
          transform1.position.x += overlapX;
        }
        transform1.velocity.x = 0;
      } else {
        if (transform1.position.y < transform2.position.y) {
          transform1.position.y -= overlapY;
          transform1.velocity.y = 0;

          const gravityComponent = entity1.getComponent(GravityComponent);
          if (gravityComponent) {
            gravityComponent.isOnGround = true;
          }

          const inputComponent = entity1.getComponent(InputComponent);
          if (inputComponent) {
            inputComponent.canJump = true;
          }
        } else {
          transform1.position.y += overlapY;
          transform1.velocity.y = 0;
        }
      }
    } else {
      console.log("Collision between entities:", entity1, entity2);
    }
  }
}

export default CollisionSystem;
