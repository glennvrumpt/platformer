import TagSystem from "../systems/tag-system.js";

class EntityManager {
  constructor() {
    this.entities = new Map();
    this.pendingEntities = [];
    this.tagSystem = new TagSystem();
  }

  addEntity(entity) {
    this.pendingEntities.push(entity);
  }

  update() {
    this.pendingEntities.forEach((entity) => {
      this.entities.set(entity.id, entity);
      this.tagSystem.addEntity(entity);
    });

    this.pendingEntities = [];

    this.entities.forEach((entity, id) => {
      if (!entity.active) {
        this.entities.delete(id);
        this.tagSystem.removeEntity(entity);
      }
    });
  }

  getEntityById(id) {
    return this.entities.get(id);
  }
}

export default EntityManager;
