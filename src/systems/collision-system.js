import System from "../core/system.js";

class CollisionSystem extends System {
  constructor(entityManager) {
    super();
    this.entityManager = entityManager;
  }

  update(deltaTime) {
    const entities = this.entityManager.entities;

    entities.forEach((entityA) => {
      const boundingBoxA = entityA.getComponent("BoundingBoxComponent");
      const transformA = entityA.getComponent("TransformComponent");

      if (!boundingBoxA || !transformA) return;

      entities.forEach((entityB) => {
        if (entityA === entityB) return;

        const boundingBoxB = entityB.getComponent("BoundingBoxComponent");
        const transformB = entityB.getComponent("TransformComponent");

        if (!boundingBoxB || !transformB) return;

        if (
          this.intersects(boundingBoxA, transformA, boundingBoxB, transformB)
        ) {
          console.log(
            `Collision detected between entity ${entityA.id} and ${entityB.id}`
          );
        }
      });
    });
  }

  intersects(boundingBoxA, transformA, boundingBoxB, transformB) {
    const leftA = transformA.position.x + boundingBoxA.offsetX;
    const rightA = leftA + boundingBoxA.width;
    const topA = transformA.position.y + boundingBoxA.offsetY;
    const bottomA = topA + boundingBoxA.height;

    const leftB = transformB.position.x + boundingBoxB.offsetX;
    const rightB = leftB + boundingBoxB.width;
    const topB = transformB.position.y + boundingBoxB.offsetY;
    const bottomB = topB + boundingBoxB.height;

    return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
  }
}

export default CollisionSystem;
