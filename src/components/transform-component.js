import Component from "../core/component.js";
import Vector2 from "../utilities/vector2.js";

class TransformComponent extends Component {
  constructor(
    x = 0,
    y = 0,
    velocityX = 0,
    velocityY = 0,
    pivotX = 0.5,
    pivotY = 0.5,
    rotation = 0,
    direction = 1
  ) {
    super();
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(velocityX, velocityY);
    this.pivot = new Vector2(pivotX, pivotY);
    this.scale = new Vector2(1, 1);
    this.rotation = rotation;
    this.direction = direction;
  }
}

export default TransformComponent;
