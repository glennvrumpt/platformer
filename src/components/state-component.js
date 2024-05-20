import Component from "../core/component.js";

class StateComponent extends Component {
  constructor(initialState = "idle") {
    super();
    this.state = initialState;
  }
}

export default StateComponent;
