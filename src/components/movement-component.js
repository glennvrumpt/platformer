import Component from "../core/component.js";

class MovementComponent extends Component {
  constructor(movementSpeed, jumpHeight) {
    super();
    this.movementSpeed = movementSpeed;
    this.jumpHeight = jumpHeight;
    this.isOnGround = false;
  }
}

export default MovementComponent;
