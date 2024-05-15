import Component from "../core/component.js";

class AnimationComponent extends Component {
  constructor(animations = new Map(), currentAnimation = null) {
    super();
    this.animations = animations;
    this.currentAnimation = currentAnimation;
    this.elapsedTime = 0;
  }
}

export default AnimationComponent;
