import { loadJSON } from "./loader.js";
import Entity from "../core/entity.js";
import Transform from "../components/transform-component.js";
import Size from "../components/size-component.js";
import AnimationComponent from "../components/animation-component.js";

class LevelLoader {
  constructor(engine) {
    this.engine = engine;
  }

  async loadLevel(path) {
    try {
      const levelData = await loadJSON(path);
      return levelData.entities.map((data) => this.createEntity(data));
    } catch (error) {
      console.error("Error loading level:", error);
      throw error;
    }
  }

  createEntity(data) {
    const entity = new Entity();

    if (data.transform) {
      const { x, y, rotation } = data.transform;
      entity.addComponent(new Transform(x, y, rotation));
    }

    if (data.size) {
      const { width, height } = data.size;
      entity.addComponent(new Size(width, height));
    }

    if (data.animations) {
      const animationComponent = new AnimationComponent();
      for (const [name, animationData] of Object.entries(data.animations)) {
        const texture = this.engine.assetManager.getTexture(
          animationData.texture
        );
        animationComponent.animations.set(name, {
          spritesheet: texture,
          frameCount: animationData.frameCount,
          frameDuration: animationData.frameDuration,
          loop: animationData.loop,
        });
      }
      animationComponent.currentAnimation = Object.keys(data.animations)[0];
      entity.addComponent(animationComponent);
    }

    return entity;
  }
}

export default LevelLoader;
