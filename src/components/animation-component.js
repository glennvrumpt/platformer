import Component from "../core/component.js";

class AnimationComponent extends Component {
  constructor() {
    super();
    this.animations = new Map();
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.elapsedTime = 0;
  }
}

export default AnimationComponent;
