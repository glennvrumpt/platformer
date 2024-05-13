import System from "../core/system.js";

class Render extends System {
  constructor(canvas) {
    super();
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  update(entities) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    entities.forEach((entity) => {});
  }
}

export default Render;
