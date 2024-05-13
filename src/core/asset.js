class Asset {
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

  addSound(name, path) {}

  addFont(name, path) {}

  addAnimation(name, animationData) {}

  getTexture(name) {
    return this.textures.get(name);
  }

  getSound(name) {}

  getFont(name) {}

  getAnimation(name) {}
}

export default Asset;
