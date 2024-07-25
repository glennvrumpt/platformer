import Component from "../core/component.js";

class GravityComponent extends Component {
  constructor(force) {
    super();
    this.force = force;
    this.isOnGround = false;
  }
}

export default GravityComponent;
