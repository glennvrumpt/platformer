import Component from "../core/component.js";

class MovementComponent extends Component {
  constructor(movementSpeed = 200, jumpSpeed = 700) {
    super();
    this.movementSpeed = movementSpeed;
    this.jumpSpeed = jumpSpeed;
  }
}

export default MovementComponent;
