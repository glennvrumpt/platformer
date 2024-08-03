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
    this.jumpBufferTime = 0;
    this.jumpBufferDuration = 0.1;
  }
}

export default InputComponent;
