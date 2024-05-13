class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    return mag !== 0 ? this.divide(mag) : new Vector2(0, 0);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  static distance(vec1, vec2) {
    return vec1.subtract(vec2).magnitude();
  }

  static angle(vec1, vec2) {
    const dot = vec1.dot(vec2);
    const mag1 = vec1.magnitude();
    const mag2 = vec2.magnitude();
    return Math.acos(dot / (mag1 * mag2));
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

export default Vector2;
