import { loadJSON } from "./loader.js";
import Entity from "../core/entity.js";
import Transform from "../components/transform-component.js";
import Size from "../components/size-component.js";
import BoundingBoxComponent from "../components/bounding-box-component.js";
import AnimationComponent from "../components/animation-component.js";
import TileComponent from "../components/tile-component.js";
import Vector2 from "./vector2.js";

class LevelLoader {
  constructor(engine) {
    this.engine = engine;
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
    const scaledTileSize = tileSize * 1.5;
    const tileset = this.engine.assetManager.getTexture(tilesetPath);
    tilemapData.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile !== -1) {
          const tileX = tile % (tileset.width / tileSize);
          const tileY = Math.floor(tile / (tileset.width / tileSize));
          const entity = new Entity();
          entity.addComponent(
            new Transform(new Vector2(x * scaledTileSize, y * scaledTileSize))
          );
          entity.addComponent(new Size(scaledTileSize, scaledTileSize));
          entity.addComponent(
            new TileComponent(tileset, tileX, tileY, tileSize, tileSize)
          );
          entity.addComponent(
            new BoundingBoxComponent(0, 0, scaledTileSize, scaledTileSize)
          );
          tileEntities.push(entity);
        }
      });
    });

    return tileEntities;
  }

  createEntity(data) {
    const entity = new Entity();

    if (data.type) {
      entity.addTag(data.type);
    }

    if (data.transform) {
      const { x, y, rotation } = data.transform;
      entity.addComponent(new Transform({ x, y }, rotation));
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
