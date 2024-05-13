import InputSystem from "../systems/input-system.js";
import PlayScene from "../scenes/play-scene.js";
import Asset from "./asset.js";
import Action from "./action.js";

class Engine {
  constructor() {
    this.context = null;
    this.scenes = new Map();
    this.currentScene = null;
    this.running = false;
    this.lastFrameTime = 0;
    this.inputSystem = new InputSystem(this);
    this.assetManager = new Asset();
    this.init();
  }

  async init() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1280;
    this.canvas.height = 720;
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");

    await this.loadAssets();

    this.changeScene("play", new PlayScene(this));

    this.run();
  }

  async loadAssets() {
    await this.loadTextures();
  }

  async loadTextures() {
    this.assetManager.addTexture("player", "path/to/player.png");
  }

  getCurrentScene() {
    return this.scenes.get(this.currentScene);
  }

  run() {
    this.running = true;
    this.update(performance.now());
  }

  update(currentTime) {
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    if (this.running) {
      const scene = this.scenes.get(this.currentScene);
      if (scene) {
        scene.update(deltaTime);
      }
    }

    requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  stop() {
    this.running = false;
  }

  changeScene(name, scene) {
    this.currentScene = name;
    this.scenes.set(name, scene);
  }
}

export default Engine;
