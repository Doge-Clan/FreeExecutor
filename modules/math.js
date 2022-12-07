// Misc. Math Additions
export const FEMath = {
  HALF_PI: Math.PI / 2,
  average: function(numArr) {
    let ln = numArr.length;
    if (!ln) { console.error('@math/average: Non-array data passed. Make sure the average data is in an array!'); return null; }
    let sum = 0; // Sum of all numbers
    for (let i = 0; i < ln; i++) {
      sum += numArr[i];
    }
      
    return sum / ln; // The mean, in a function
  }, // Calculate Average

  Vector: class NVector {
    constructor(arr) {
      this.dimensions = arr.length;
      this.v = new Int32Array(arr); // Use generic array
    }
      
    add(num) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] += num;
      }
    }
      
    sub(num) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] -= num;
      }
    }
      
    scale(factor) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] *= factor;
      }
    }
      
    multi(vectorToMultiplyBy) {
      const v2 = vectorToMultiplyBy.v;
      const ln = v2.length;
      for (let i = 0; i < ln; i++) {
        this.v[i] = this.v[i] * v2[i];
      }
    } // Multiply by vector
      
    // Hardcoded cool stuff to provide 4d vector hardcoding in an xyzw spec that many programs use (This is basically PVector sorta)
    get x() {
      return this.v[0];
    }
      
    get y() {
      return this.v[1];
    }
      
    get z() {
      return this.v[2];
    }
      
    get w() {
      return this.v[3];
    }
  },  // NVector

  Vector2: class Vector2 {
    constructor(x, y) {
      return new Math.Vector([x, y]);
    }
  }, // Vector2

  Vector3: class Vector3 {
    constructor(x, y, z) {
      return new Math.Vector([x, y, z]);
    }
  }, // Vector3

  Vector4: class Vector4 {
    constructor(x, y, z, w) {
      return new Math.Vector([x, y, z, w]);
    }
  }, // Vector4
};
  
/*
  window.Math.* are just some common tools that are added on to window.Math for
  an improvement in the developer experience, including some basic linear algebra tools that
  can be used in game development (a standard library).
*/