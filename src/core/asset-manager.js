class AssetManager {
  constructor() {
    this.textures = new Map();
    this.sounds = new Map();
    this.fonts = new Map();
    this.animations = new Map();
  }

  addTexture(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.textures.set(name, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
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
