import System from "../core/system.js";
import TagComponent from "../components/tag-component.js";

class TagSystem extends System {
  constructor() {
    super();
    this.taggedEntities = new Map();
  }

  addEntity(entity) {
    const tagComponent = entity.getComponent(TagComponent);
    if (tagComponent) {
      tagComponent.tags.forEach((tag) => {
        if (!this.taggedEntities.has(tag)) {
          this.taggedEntities.set(tag, new Map());
        }
        this.taggedEntities.get(tag).set(entity.id, entity);
      });
    }
  }

  removeEntity(entity) {
    const tagComponent = entity.getComponent(TagComponent);
    if (tagComponent) {
      tagComponent.tags.forEach((tag) => {
        const taggedEntities = this.taggedEntities.get(tag);
        if (taggedEntities) {
          taggedEntities.delete(entity.id);
          if (taggedEntities.size === 0) {
            this.taggedEntities.delete(tag);
          }
        }
      });
    }
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

  getEnemies() {
    return this.getEntitiesByTag("enemy");
  }

  updateTags(entity) {
    this.removeEntity(entity);
    this.addEntity(entity);
  }
}

export default TagSystem;
