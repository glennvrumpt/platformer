class System {
  constructor() {}
  update(entities) {
    throw new Error("Update method must be implemented in derived class");
  }
}

export default System;
