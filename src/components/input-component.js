import Component from "../core/component.js";

class InputComponent extends Component {
  constructor() {
    super();
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    this.jumpPressed = false;
    this.canJump = true;
  }
}

export default InputComponent;
