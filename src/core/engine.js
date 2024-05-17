import InputSystem from "../systems/input-system.js";
import PlayScene from "../scenes/play-scene.js";
import AssetManager from "./asset-manager.js";
import SceneManager from "./scene-manager.js";

class Engine {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.running = false;
    this.lastFrameTime = 0;
    this.inputSystem = new InputSystem(this);
    this.assetManager = new AssetManager();
    this.sceneManager = new SceneManager(this);
  }

  init() {
    this.createCanvas();
    this.context = this.canvas.getContext("2d");
    this.loadAssets();
    this.sceneManager.changeScene("play", new PlayScene(this));
    this.run();
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1280;
    this.canvas.height = 720;
    document.body.append(this.canvas);
  }

  loadAssets() {
    this.loadTextures();
  }

  loadTextures() {
    this.assetManager.addTexture(
      "player_idle",
      "../src/assets/images/Characters/Player/spritesheets/player-idle.png"
    );
    this.assetManager.addTexture(
      "player_run",
      "../src/assets/images/Characters/Player/spritesheets/player-run.png"
    );
    this.assetManager.addTexture(
      "tileset",
      "../src/assets/images/Environment/Layers/tileset.png"
    );
    this.assetManager.addTexture(
      "background",
      "../src/assets/images/Environment/Layers/back.png"
    );
    this.assetManager.addTexture(
      "far",
      "../src/assets/images/Environment/Layers/far.png"
    );
  }

  run() {
    this.running = true;
    this.update(performance.now());
  }

  update(currentTime) {
    const deltaTime = (currentTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = currentTime;

    if (this.running) {
      const scene = this.sceneManager.getCurrentScene();
      if (scene) {
        scene.update(deltaTime);
      }
    }

    requestAnimationFrame((timestamp) => this.update(timestamp));
  }

  stop() {
    this.running = false;
  }
}

export default Engine;
