class AssetManager {
  constructor() {
    this.textures = new Map();
    this.sounds = new Map();
    this.fonts = new Map();
    this.animations = new Map();
  }

  addTexture(name, path) {
    const image = new Image();
    image.src = path;
    this.textures.set(name, image);
  }

  getTexture(name) {
    return this.textures.get(name);
  }

  addSound(name, path) {}

  getSound(name) {}

  addFont(name, path) {}

  getFont(name) {}

  addAnimation(name, animationData) {}

  getAnimation(name) {}
}

export default AssetManager;
