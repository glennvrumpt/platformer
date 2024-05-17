import Component from "../core/component.js";

class TileComponent extends Component {
  constructor(tileset, tileX, tileY, tileWidth, tileHeight) {
    super();
    this.tileset = tileset;
    this.tileX = tileX;
    this.tileY = tileY;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }
}

export default TileComponent;
