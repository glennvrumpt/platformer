class AssetManager {
  constructor() {
    this.textures = new Map();
    this.sounds = new Map();
    this.fonts = new Map();
    this.animations = new Map();
  }

  addTexture(key, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.textures.set(key, img);
        resolve();
      };
      img.onerror = (err) => {
        console.error(`Failed to load texture: ${path}`);
        reject(new Error(`Error loading texture: ${path}`));
      };
      img.src = path;
    });
  }

  getTexture(name) {
    return this.textures.get(name);
  }

  addSound(key, path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.oncanplaythrough = () => {
        this.sounds.set(key, audio);
        resolve();
      };
      audio.onerror = (err) => {
        console.error(`Failed to load sound: ${path}`);
        reject(new Error(`Error loading sound: ${path}`));
      };
    });
  }

  getSound(key) {
    return this.sounds.get(key);
  }

  addFont(name, url) {
    return new Promise((resolve, reject) => {
      const newFont = new FontFace(name, `url(${url})`);
      newFont
        .load()
        .then((loadedFont) => {
          document.fonts.add(loadedFont);
          this.fonts.set(name, loadedFont);
          resolve();
        })
        .catch((err) => {
          console.error(`Failed to load font: ${url}`);
          reject(new Error(`Error loading font: ${url}`));
        });
    });
  }

  getFont(name) {
    return this.fonts.get(name);
  }

  addAnimation(name, animationData) {}

  getAnimation(name) {}
}

export default AssetManager;
