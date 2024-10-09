import { loadJSON } from "./loader.js";
import Entity from "../core/entity.js";
import TransformComponent from "../components/transform-component.js";
import Size from "../components/size-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";
import GravityComponent from "../components/gravity-component.js";
import MovementComponent from "../components/movement-component.js";
import AnimationComponent from "../components/animation-component.js";
import TileComponent from "../components/tile-component.js";
import InputComponent from "../components/input-component.js";
import StateComponent from "../components/state-component.js";
import TagComponent from "../components/tag-component.js";

class LevelLoader {
  constructor(assetManager) {
    this.assetManager = assetManager;
  }

  async loadLevel(path) {
    try {
      const levelData = await loadJSON(path);
      const entities = [];

      const tileEntities = this.createTilemap(
        levelData.tilemap,
        levelData.tileset
      );
      entities.push(...tileEntities);

      levelData.entities.forEach((data) => {
        entities.push(this.createEntity(data));
      });

      return entities;
    } catch (error) {
      console.error("Error loading level:", error);
      throw error;
    }
  }

  createTilemap(tilemapData, tilesetPath) {
    const tileEntities = [];
    const tileSize = 32;
    const tileset = this.assetManager.getTexture(tilesetPath);

    tilemapData.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile !== -1) {
          const tileX = (tile % (tileset.width / tileSize)) * tileSize;
          const tileY =
            Math.floor(tile / (tileset.width / tileSize)) * tileSize;
          const entity = new Entity();
          entity.addComponent(
            new TransformComponent(x * tileSize, y * tileSize)
          );
          entity.addComponent(new Size(tileSize, tileSize));
          entity.addComponent(
            new TileComponent(tileset, tileX, tileY, tileSize, tileSize)
          );
          entity.addComponent(
            new BoundingBoxComponent(0, 0, tileSize, tileSize)
          );
          const tagComponent = new TagComponent();
          tagComponent.tags.add("tile");
          entity.addComponent(tagComponent);
          tileEntities.push(entity);
        }
      });
    });

    return tileEntities;
  }

  createEntity(data) {
    const entity = new Entity();

    if (data.transform) {
      const { x, y, velocityX, velocityY, pivotX, pivotY } = data.transform;
      entity.addComponent(
        new TransformComponent(x, y, velocityX, velocityY, pivotX, pivotY)
      );
    }

    if (data.size) {
      const { width, height } = data.size;
      entity.addComponent(new Size(width, height));
    }

    if (data.boundingBox) {
      const { offsetX, offsetY, width, height } = data.boundingBox;
      entity.addComponent(
        new BoundingBoxComponent(offsetX, offsetY, width, height)
      );
    }

    if (data.gravity) {
      entity.addComponent(new GravityComponent(data.gravity.force));
    }

    if (data.movement) {
      entity.addComponent(
        new MovementComponent(
          data.movement.movementSpeed,
          data.movement.jumpHeight
        )
      );
    }

    if (data.animations) {
      const animationComponent = new AnimationComponent();
      for (const [name, animationData] of Object.entries(data.animations)) {
        const texture = this.assetManager.getTexture(animationData.texture);
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

    if (data.type) {
      const tagComponent = new TagComponent();
      tagComponent.tags.add(data.type);
      entity.addComponent(tagComponent);
    }

    if (data.type === "player") {
      entity.addComponent(new InputComponent());
      entity.addComponent(new StateComponent("idle"));
    }

    return entity;
  }
}

export default LevelLoader;
