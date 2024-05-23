class Entity {
  constructor() {
    this.id = Entity.generateId();
    this.components = new Map();
    this.active = true;
  }

  addComponent(component) {
    this.components.set(component.constructor, component);
  }

  getComponent(componentClass) {
    return this.components.get(componentClass);
  }

  hasComponent(componentClass) {
    return this.components.has(componentClass);
  }

  static generateId() {
    if (!this.currentId) this.currentId = 0;
    return this.currentId++;
  }
}

export default Entity;
