import Component from "../core/component.js";

class AnimationComponent extends Component {
  constructor(animations = new Map(), currentAnimation = null) {
    this.animations = animations;
    this.currentAnimation = currentAnimation;
  }
}

export default AnimationComponent;
