class SpatialHashGrid {
  constructor(cellSize = 64) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  addEntity(entity, transform, boundingBox) {
    const minX = transform.position.x + boundingBox.offset.x;
    const minY = transform.position.y + boundingBox.offset.y;
    const maxX = minX + boundingBox.size.width;
    const maxY = minY + boundingBox.size.height;

    const cellMinX = Math.floor(minX / this.cellSize);
    const cellMinY = Math.floor(minY / this.cellSize);
    const cellMaxX = Math.floor(maxX / this.cellSize);
    const cellMaxY = Math.floor(maxY / this.cellSize);

    for (let cellY = cellMinY; cellY <= cellMaxY; cellY++) {
      for (let cellX = cellMinX; cellX <= cellMaxX; cellX++) {
        const key = this.getCellKey(
          cellX * this.cellSize,
          cellY * this.cellSize
        );
        if (!this.grid.has(key)) {
          this.grid.set(key, new Set());
        }
        this.grid.get(key).add(entity);
      }
    }
  }

  clear() {
    this.grid.clear();
  }

  getEntitiesInArea(minX, minY, maxX, maxY) {
    const cellMinX = Math.floor(minX / this.cellSize);
    const cellMinY = Math.floor(minY / this.cellSize);
    const cellMaxX = Math.floor(maxX / this.cellSize);
    const cellMaxY = Math.floor(maxY / this.cellSize);

    const entities = new Set();

    for (let cellY = cellMinY; cellY <= cellMaxY; cellY++) {
      for (let cellX = cellMinX; cellX <= cellMaxX; cellX++) {
        const key = this.getCellKey(
          cellX * this.cellSize,
          cellY * this.cellSize
        );
        const cellEntities = this.grid.get(key);
        if (cellEntities) {
          cellEntities.forEach((entity) => entities.add(entity));
        }
      }
    }

    return entities;
  }
}

export default SpatialHashGrid;
