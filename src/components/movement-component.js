import Component from "../core/component.js";

class MovementComponent extends Component {
  constructor(movementSpeed = 200, jumpHeight = 600) {
    super();
    this.movementSpeed = movementSpeed;
    this.jumpHeight = jumpHeight;
  }
}

export default MovementComponent;
