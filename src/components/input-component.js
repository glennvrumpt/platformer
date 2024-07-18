import Component from "../core/component.js";

class InputComponent extends Component {
  constructor() {
    super();
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.shoot = false;
    this.canShoot = true;
    this.canJump = true;
    this.lastHorizontalKeyPressed = null;
  }
}

export default InputComponent;
