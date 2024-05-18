class Entity {
  constructor() {
    this.id = Entity.generateId();
    this.components = new Map();
    this.tags = new Set();
    this.active = true;
  }

  addComponent(component) {
    this.components.set(component.constructor.name, component);
  }

  getComponent(componentClass) {
    return this.components.get(componentClass);
  }

  hasComponent(componentClass) {
    return this.components.has(componentClass);
  }

  addTag(tag) {
    this.tags.add(tag);
  }

  removeTag(tag) {
    this.tags.delete(tag);
  }

  hasTag(tag) {
    return this.tags.has(tag);
  }

  static generateId() {
    if (!this.currentId) this.currentId = 0;
    return this.currentId++;
  }
}

export default Entity;
