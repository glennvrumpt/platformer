import Component from "../core/component.js";

class BoundingBoxComponent extends Component {
  constructor(x = 0, y = 0, width, height) {
    super();
    this.offset = { x, y };
    this.size = { width, height };
  }
}

export default BoundingBoxComponent;
