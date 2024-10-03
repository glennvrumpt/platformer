import InputSystem from "../systems/input-system.js";
import PlayScene from "../scenes/play-scene.js";
import AssetManager from "./asset-manager.js";
import SceneManager from "./scene-manager.js";
import Camera from "./camera.js";

class Engine {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.running = false;
    this.lastFrameTime = 0;
    this.inputSystem = new InputSystem(this);
    this.assetManager = new AssetManager();
    this.sceneManager = new SceneManager(this);
    this.camera = null;
  }

  init() {
    this.createCanvas();
    this.context = this.canvas.getContext("2d");
    this.loadAssets();
    this.camera = new Camera(this.canvas.width, this.canvas.height, 2000, 2000);
    this.sceneManager.changeScene("play", new PlayScene(this));
    this.run();
  }

  run() {
    this.running = true;
    this.update(performance.now());
  }

  update(currentTime) {
    let deltaTime = (currentTime - this.lastFrameTime) / 1000;

    const maxDeltaTime = 0.1;
    deltaTime = Math.min(deltaTime, maxDeltaTime);

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
      "player_jump",
      "../src/assets/images/Characters/Player/spritesheets/player-jump.png"
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
}

export default Engine;
