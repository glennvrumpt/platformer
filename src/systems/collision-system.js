import System from "../core/system.js";
import TransformComponent from "../components/transform-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";
import GravityComponent from "../components/gravity-component.js";
import StateComponent from "../components/state-component.js";
import Vector2 from "../utilities/vector2.js";

class CollisionSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    const entities = this.entityManager.entities;
    const player = this.entityManager.tagSystem.getEntityByTag("player");

    if (!player) return;

    const playerTransform = player.getComponent(TransformComponent);
    const playerBoundingBox = player.getComponent(BoundingBoxComponent);
    const playerVelocity = playerTransform.velocity;

    let isOnGround = false;

    const entitiesInRadius = this.getEntitiesInRadius(
      playerTransform.position,
      100
    );

    entitiesInRadius.forEach((entity) => {
      if (entity === player) return;

      const transform = entity.getComponent(TransformComponent);
      const boundingBox = entity.getComponent(BoundingBoxComponent);

      if (
        this.isColliding(
          playerTransform,
          playerBoundingBox,
          transform,
          boundingBox
        )
      ) {
        const collisionNormal = this.resolveCollision(
          playerTransform,
          playerBoundingBox,
          transform,
          boundingBox,
          playerVelocity
        );

        if (collisionNormal.y < 0) {
          isOnGround = true;
        }

        if (collisionNormal.x !== 0) {
          playerVelocity.x = 0;
        }
        if (collisionNormal.y !== 0) {
          playerVelocity.y = 0;
        }
      }
    });

    entitiesInRadius.forEach((tileEntity) => {
      const tileTransform = tileEntity.getComponent(TransformComponent);
      const tileBoundingBox = tileEntity.getComponent(BoundingBoxComponent);

      if (
        this.isStandingOnTop(
          playerTransform.position,
          playerBoundingBox,
          tileTransform.position,
          tileBoundingBox
        )
      ) {
        isOnGround = true;
      }
    });

    const gravityComponent = player.getComponent(GravityComponent);
    if (gravityComponent) {
      gravityComponent.force = isOnGround ? 0 : 9.8;
    }

    const stateComponent = player.getComponent(StateComponent);
    if (stateComponent) {
      stateComponent.state = isOnGround ? "idle" : "fall";
    }
  }

  getEntitiesInRadius(position, radius) {
    const result = [];
    this.entityManager.entities.forEach((entity) => {
      const transform = entity.getComponent(TransformComponent);
      if (transform) {
        const entityPosition = new Vector2(
          transform.position.x,
          transform.position.y
        );
        if (Vector2.distance(position, entityPosition) <= radius) {
          result.push(entity);
        }
      }
    });
    return result;
  }

  isColliding(transformA, boundingBoxA, transformB, boundingBoxB) {
    const ax = transformA.position.x + boundingBoxA.offsetX;
    const ay = transformA.position.y + boundingBoxA.offsetY;
    const aw = boundingBoxA.width;
    const ah = boundingBoxA.height;

    const bx = transformB.position.x + boundingBoxB.offsetX;
    const by = transformB.position.y + boundingBoxB.offsetY;
    const bw = boundingBoxB.width;
    const bh = boundingBoxB.height;

    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  resolveCollision(
    transformA,
    boundingBoxA,
    transformB,
    boundingBoxB,
    velocityA
  ) {
    const ax = transformA.position.x + boundingBoxA.offsetX;
    const ay = transformA.position.y + boundingBoxA.offsetY;
    const aw = boundingBoxA.width;
    const ah = boundingBoxA.height;

    const bx = transformB.position.x + boundingBoxB.offsetX;
    const by = transformB.position.y + boundingBoxB.offsetY;
    const bw = boundingBoxB.width;
    const bh = boundingBoxB.height;

    const dx = ax + aw / 2 - (bx + bw / 2);
    const dy = ay + ah / 2 - (by + bh / 2);
    const width = (aw + bw) / 2;
    const height = (ah + bh) / 2;
    const crossWidth = width * dy;
    const crossHeight = height * dx;
    let collisionNormal = { x: 0, y: 0 };

    if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      if (crossWidth > crossHeight) {
        if (crossWidth > -crossHeight) {
          collisionNormal = { x: 0, y: 1 };
          transformA.position.y = by + bh - boundingBoxA.offsetY;
        } else {
          collisionNormal = { x: -1, y: 0 };
          transformA.position.x = bx - aw - boundingBoxA.offsetX;
        }
      } else {
        if (crossWidth > -crossHeight) {
          collisionNormal = { x: 1, y: 0 };
          transformA.position.x = bx + bw - boundingBoxA.offsetX;
        } else {
          collisionNormal = { x: 0, y: -1 };
          transformA.position.y = by - ah - boundingBoxA.offsetY;
        }
      }
    }

    return collisionNormal;
  }

  isStandingOnTop(
    playerPosition,
    playerBoundingBox,
    tilePosition,
    tileBoundingBox
  ) {
    return (
      playerPosition.y + playerBoundingBox.offsetY + playerBoundingBox.height <=
        tilePosition.y + 1 &&
      playerPosition.y + playerBoundingBox.offsetY + playerBoundingBox.height >=
        tilePosition.y - 1 &&
      playerPosition.x + playerBoundingBox.offsetX + playerBoundingBox.width >
        tilePosition.x &&
      playerPosition.x + playerBoundingBox.offsetX <
        tilePosition.x + tileBoundingBox.width
    );
  }
}

export default CollisionSystem;
