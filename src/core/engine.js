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
    this.assetsLoaded = false;
  }

  init() {
    this.createCanvas();
    this.context = this.canvas.getContext("2d");
    this.loadAssets().then(() => {
      this.assetsLoaded = true;
      this.camera = new Camera(
        this.canvas.width,
        this.canvas.height,
        2000,
        2000
      );
      this.sceneManager.changeScene("play", new PlayScene(this));
      this.run();
    });
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
    return this.loadTextures();
  }

  loadTextures() {
    const textures = [
      {
        key: "player_idle",
        path: "../src/assets/images/Characters/Player/spritesheets/player-idle.png",
      },
      {
        key: "player_run",
        path: "../src/assets/images/Characters/Player/spritesheets/player-run.png",
      },
      {
        key: "player_jump",
        path: "../src/assets/images/Characters/Player/spritesheets/player-jump.png",
      },
      {
        key: "tileset",
        path: "../src/assets/images/Environment/Layers/tileset.png",
      },
      {
        key: "background",
        path: "../src/assets/images/Environment/Layers/back.png",
      },
      { key: "far", path: "../src/assets/images/Environment/Layers/far.png" },
    ];

    return Promise.all(
      textures.map(({ key, path }) => this.assetManager.addTexture(key, path))
    );
  }
}

export default Engine;
