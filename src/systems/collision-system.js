import System from "../core/system.js";
import TransformComponent from "../components/transform-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";
import InputComponent from "../components/input-component.js";
import TagComponent from "../components/tag-component.js";
import MovementComponent from "../components/movement-component.js";
import SpatialHashGrid from "../utilities/spatial-hash-grid.js";

class CollisionSystem extends System {
  constructor(entityManager, cellSize = 64) {
    super();
    this.entityManager = entityManager;
    this.spatialGrid = new SpatialHashGrid(cellSize);
  }

  checkCollision(entity1, entity2) {
    const transform1 = entity1.getComponent(TransformComponent);
    const boundingBox1 = entity1.getComponent(BoundingBoxComponent);
    const transform2 = entity2.getComponent(TransformComponent);
    const boundingBox2 = entity2.getComponent(BoundingBoxComponent);

    if (!transform1 || !boundingBox1 || !transform2 || !boundingBox2)
      return false;

    const left1 = transform1.position.x + boundingBox1.offset.x;
    const right1 = left1 + boundingBox1.size.width;
    const top1 = transform1.position.y + boundingBox1.offset.y;
    const bottom1 = top1 + boundingBox1.size.height;

    const left2 = transform2.position.x + boundingBox2.offset.x;
    const right2 = left2 + boundingBox2.size.width;
    const top2 = transform2.position.y + boundingBox2.offset.y;
    const bottom2 = top2 + boundingBox2.size.height;

    return left1 < right2 && right1 > left2 && top1 < bottom2 && bottom1 > top2;
  }

  update(deltaTime) {
    this.spatialGrid.clear();

    const entities = this.entityManager.entities;
    entities.forEach((entity) => {
      const transform = entity.getComponent(TransformComponent);
      const boundingBox = entity.getComponent(BoundingBoxComponent);
      if (transform && boundingBox) {
        this.spatialGrid.addEntity(entity, transform, boundingBox);
      }
    });

    entities.forEach((entity) => {
      if (
        entity.getComponent(TransformComponent) &&
        entity.getComponent(BoundingBoxComponent)
      ) {
        const movementComponent = entity.getComponent(MovementComponent);
        if (movementComponent) {
          movementComponent.isOnGround = false;
        }
        this.handleCollisionsForEntity(entity);
      }
    });
  }

  handleCollisionsForEntity(entity) {
    const transform = entity.getComponent(TransformComponent);
    const boundingBox = entity.getComponent(BoundingBoxComponent);

    const minX = transform.position.x + boundingBox.offset.x;
    const minY = transform.position.y + boundingBox.offset.y;
    const maxX = minX + boundingBox.size.width;
    const maxY = minY + boundingBox.size.height;

    const collidedEntities = new Set();
    const nearbyEntities = this.spatialGrid.getEntitiesInArea(
      minX,
      minY,
      maxX,
      maxY
    );

    nearbyEntities.forEach((otherEntity) => {
      if (entity !== otherEntity && !collidedEntities.has(otherEntity)) {
        if (this.checkCollision(entity, otherEntity)) {
          collidedEntities.add(otherEntity);
          this.resolveCollision(entity, otherEntity);
        }
      }
    });
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
          transform1.position.x +
            boundingBox1.offset.x +
            boundingBox1.size.width,
          transform2.position.x +
            boundingBox2.offset.x +
            boundingBox2.size.width
        ) -
        Math.max(
          transform1.position.x + boundingBox1.offset.x,
          transform2.position.x + boundingBox2.offset.x
        );

      const overlapY =
        Math.min(
          transform1.position.y +
            boundingBox1.offset.y +
            boundingBox1.size.height,
          transform2.position.y +
            boundingBox2.offset.y +
            boundingBox2.size.height
        ) -
        Math.max(
          transform1.position.y + boundingBox1.offset.y,
          transform2.position.y + boundingBox2.offset.y
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

          const movementComponent = entity1.getComponent(MovementComponent);
          if (movementComponent) {
            movementComponent.isOnGround = true;
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
