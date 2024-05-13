import System from "../core/system.js";
import Action from "../core/action.js";

class InputSystem extends System {
  constructor(engine) {
    super();
    this.engine = engine;
    window.addEventListener("keydown", (e) => this.handleInput(e, "keydown"));
    window.addEventListener("keyup", (e) => this.handleInput(e, "keyup"));
  }

  update() {}

  handleInput(event, type) {
    const scene = this.engine.getCurrentScene();
    if (!scene) return;
    const actionValue = scene.getAction(event.keyCode);

    if (actionValue) {
      const action = new Action(event.keyCode, type);
      scene.doAction(action);
    }
  }
}

export default InputSystem;
