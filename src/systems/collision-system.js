import System from "../core/system.js";
import Vector2 from "../utilities/vector2.js";

class CollisionSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update() {
    const player = this.entityManager.getEntityByTag("player");
    if (!player) return;

    const playerTransform = player.getComponent("TransformComponent");
    const playerBoundingBox = player.getComponent("BoundingBoxComponent");
    const playerGravity = player.getComponent("GravityComponent");

    if (!playerTransform || !playerBoundingBox || !playerGravity) return;

    let onGround = false;

    const entitiesInRadius = this.entityManager.getEntitiesInRadius(
      playerTransform.position,
      100
    );

    entitiesInRadius.forEach((entity) => {
      if (entity.hasTag("tile")) {
        const tileTransform = entity.getComponent("TransformComponent");
        const tileBoundingBox = entity.getComponent("BoundingBoxComponent");

        if (!tileTransform || !tileBoundingBox) return;

        const playerBox = {
          x: playerTransform.position.x + playerBoundingBox.offsetX,
          y: playerTransform.position.y + playerBoundingBox.offsetY,
          width: playerBoundingBox.width,
          height: playerBoundingBox.height,
        };

        const tileBox = {
          x: tileTransform.position.x + tileBoundingBox.offsetX,
          y: tileTransform.position.y + tileBoundingBox.offsetY,
          width: tileBoundingBox.width,
          height: tileBoundingBox.height,
        };

        if (this.isColliding(playerBox, tileBox)) {
          this.resolveCollision(player, playerBox, tileBox);
        }

        if (this.isStandingOnTop(playerBox, tileBox)) {
          onGround = true;
        }
      }
    });

    if (onGround) {
      playerGravity.force = 0;
    } else {
      playerGravity.force = 9.8;
    }
  }

  isColliding(boxA, boxB) {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  }

  isStandingOnTop(playerBox, tileBox) {
    return (
      playerBox.y + playerBox.height <= tileBox.y + 1 &&
      playerBox.y + playerBox.height >= tileBox.y - 1 &&
      playerBox.x + playerBox.width > tileBox.x &&
      playerBox.x < tileBox.x + tileBox.width
    );
  }

  resolveCollision(player, playerBox, tileBox) {
    const dx =
      playerBox.x + playerBox.width / 2 - (tileBox.x + tileBox.width / 2);
    const dy =
      playerBox.y + playerBox.height / 2 - (tileBox.y + tileBox.height / 2);

    const absDX = Math.abs(dx);
    const absDY = Math.abs(dy);

    const playerTransform = player.getComponent("TransformComponent");
    const playerBoundingBox = player.getComponent("BoundingBoxComponent");
    const playerVelocity = playerTransform.velocity;

    if (absDX > absDY) {
      if (dx > 0) {
        playerTransform.position.x =
          tileBox.x + tileBox.width - playerBoundingBox.offsetX;
      } else {
        playerTransform.position.x =
          tileBox.x - playerBox.width - playerBoundingBox.offsetX;
      }
    } else {
      if (dy > 0) {
        playerTransform.position.y =
          tileBox.y + tileBox.height - playerBoundingBox.offsetY;
        playerVelocity.y = 0;
      } else {
        playerTransform.position.y =
          tileBox.y - playerBox.height - playerBoundingBox.offsetY;
        playerVelocity.y = 0;
      }
    }
  }
}

export default CollisionSystem;
