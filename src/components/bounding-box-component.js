import Component from "../core/component.js";

class BoundingBoxComponent extends Component {
  constructor(offsetX = 0, offsetY = 0, width, height) {
    super();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
  }
}

export default BoundingBoxComponent;
