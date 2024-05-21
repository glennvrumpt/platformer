import Vector2 from "../utilities/vector2.js";
import TransformComponent from "../components/transform-component.js";

class EntityManager {
  constructor() {
    this.entities = new Map();
    this.taggedEntities = new Map();
    this.pendingEntities = [];
  }

  addEntity(entity) {
    this.pendingEntities.push(entity);
  }

  update() {
    this.pendingEntities.forEach((entity) => {
      this.entities.set(entity.id, entity);

      entity.tags.forEach((tag) => {
        if (!this.taggedEntities.has(tag)) {
          this.taggedEntities.set(tag, new Map());
        }
        this.taggedEntities.get(tag).set(entity.id, entity);
      });
    });

    this.pendingEntities = [];

    this.entities.forEach((entity, id) => {
      if (!entity.active) {
        this.entities.delete(id);

        entity.tags.forEach((tag) => {
          this.taggedEntities.get(tag).delete(id);
          if (this.taggedEntities.get(tag).size === 0) {
            this.taggedEntities.delete(tag);
          }
        });
      }
    });
  }

  getEntitiesByTag(tag) {
    return this.taggedEntities.get(tag) || new Map();
  }

  getEntityByTag(tag) {
    const entities = this.getEntitiesByTag(tag);
    if (entities.size > 0) {
      return entities.values().next().value;
    }
    return null;
  }

  getEntityById(id) {
    return this.entities.get(id);
  }

  getEntitiesInRadius(position, radius) {
    const result = [];
    this.entities.forEach((entity) => {
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
}

export default EntityManager;
