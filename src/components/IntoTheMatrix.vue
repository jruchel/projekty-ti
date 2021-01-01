<template>
  <div>
    <h1>Into the matrix!</h1>
    <Matrix/>
    <label for="checkbox">Druga macierz</label>
    <input id="checkbox" type="checkbox" v-on:click="onChecked">
    <Matrix v-if="secondMatrix" :height="readFirstMatrix()[0]" :width="readFirstMatrix()[1]"/>
  </div>
</template>

<script>
import Matrix from "@/components/Matrix";

export default {
  name: "IntoTheMatrix",
  components: {Matrix},
  data() {
    return {
      secondMatrix: false
    }
  },
  methods: {
    readFirstMatrix() {
      return [this.$children[0].height, this.$children[0].width]
    },
    onChecked() {
      this.secondMatrix = !this.secondMatrix
    },
    isSquareMatrix(matrix) {
      return matrix.length === matrix[0].length;
    },
    matrixWidth(matrix) {
      return matrix[0].length
    },

    matrixHeight(matrix) {
      return matrix.length
    },

    determinant(matrix) {
      if (!this.isSquareMatrix(matrix)) {
        return "NaN"
      }
      let size = this.matrixHeight(matrix);
      if (size > 3) {
        return this.Laplace(matrix);
      }
      if (size === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      }
      if (size === 1) {
        return matrix[0][0];
      }
      let left = 0;
      for (let n = 0; n < size; n++) {
        {
          let temp = 1;
          for (let i = 0; i < size; i++) {
            {
              temp *= matrix[(i + n) % size][i % size];
            }
          }
          left += temp;
        }
      }
      let right = 0;
      for (let n = 0; n < size; n++) {
        {
          let temp = 1;
          for (let i = 0; i < size; i++) {
            {
              temp *= matrix[(i) % size][(size - 1 - i - n + size) % size];
            }
          }
          right += temp;
        }
      }
      return left - right;
    },

    Laplace(matrix) {
      let size = this.matrixWidth(matrix);
      let result = 0;
      for (let i = 0; i < size; i++) {
        {
          let n = matrix[i][0];
          let val = ((n * Math.pow(-1, 2 + i)) | 0);
          let temp = this.removeRowAndColumn(i + 1, 1, matrix);
          result += this.determinant(temp) * val;
        }
      }
      return result;
    },

    removeRowAndColumn(row, column, matrix) {
      let size = this.matrixWidth(matrix) - 1;
      row--;
      column--;
      let rows = ([]);
      for (let i = 0; i < size + 1; i++) {
        {
          if (i !== row) {
            (rows.push(i) > 0);
          }
        }
      }
      let columns = ([]);
      for (let i = 0; i < size + 1; i++) {
        {
          if (i !== column) {
            (columns.push(i) > 0);
          }
        }
      }
      let result = (function (dims) {
        let allocate = function (dims) {
          if (dims.length === 0) {
            return 0;
          } else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
              array.push(allocate(dims.slice(1)));
            }
            return array;
          }
        };
        return allocate(dims);
      })([size, size]);
      for (let i = 0; i < size; i++) {
        {
          for (let n = 0; n < size; n++) {
            {
              result[i][n] = matrix[rows[i]][columns[n]];
            }
          }
        }

      }
      return result;
    },

    sumMatrices(m1, m2) {
      let width = this.matrixWidth(m1);
      let height = this.matrixHeight(m1);
      if (this.matrixWidth(m2) !== width || this.matrixHeight(m2) !== height) {
        return null;
      }
      let result = (function (dims) {
        let allocate = function (dims) {
          if (dims.length === 0) {
            return 0;
          } else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
              array.push(allocate(dims.slice(1)));
            }
            return array;
          }
        };
        return allocate(dims);
      })([height, width]);
      for (let i = 0; i < height; i++) {
        {
          for (let n = 0; n < width; n++) {
            {
              result[i][n] = parseInt(m1[i][n], 10) + parseInt(m2[i][n], 10);
            }
          }
        }
      }
      return result;
    },

    subtractMatrices(m1, m2) {
      return this.sumMatrices(m1, this.multiplyByValue(m2, -1));
    },

    multiplyMatrices(m1, m2) {
      if (!this.canMultiply(m1, m2)) {
        return null;
      }
      let mAsList = ([]);
      for (let i = 0; i < this.matrixHeight(m1); i++) {
        {
          let width = this.matrixWidth(m1);
          let row = (function (s) {
            let a = [];
            while (s-- > 0)
              a.push(0);
            return a;
          })(width);
          for (let n = 0; n < width; n++) {
            {
              row[n] = m1[i][n];
            }
          }
          (mAsList.push(this.multiplyByRow(row, m2)) > 0);
        }

      }
      let result = (function (dims) {
        let allocate = function (dims) {
          if (dims.length === 0) {
            return 0;
          } else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
              array.push(allocate(dims.slice(1)));
            }
            return array;
          }
        };
        return allocate(dims);
      })([mAsList.length, this.matrixWidth(m2)]);
      for (let i = 0; i < mAsList.length; i++) {
        {
          for (let n = 0; n < mAsList[0].length; n++) {
            {
              result[i][n] = mAsList[i][n];
            }


          }
        }
      }
      return result;
    },

    multiplyByRow(row, m) {
      let mWidth = this.matrixWidth(m);
      let rowLength = row.length;
      let result = (function (s) {
        let a = [];
        while (s-- > 0)
          a.push(0);
        return a;
      })(mWidth);
      for (let i = 0; i < mWidth; i++) {
        {
          let temp = 0;
          for (let n = 0; n < rowLength; n++) {
            {
              temp += row[n] * m[n][i];
            }

          }
          result[i] = temp;
        }
      }
      return result;
    },

    canMultiply(m1, m2) {
      return (this.matrixWidth(m1) === this.matrixHeight(m2));
    },

    multiplyByValue(matrix, val) {
      let width = this.matrixWidth(matrix);
      let height = this.matrixHeight(matrix);
      let result = (function (dims) {
        let allocate = function (dims) {
          if (dims.length === 0) {
            return 0;
          } else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
              array.push(allocate(dims.slice(1)));
            }
            return array;
          }
        };
        return allocate(dims);
      })([height, width]);
      for (let i = 0; i < height; i++) {
        {
          for (let n = 0; n < width; n++) {
            {
              result[i][n] = val * matrix[i][n];
            }
          }
        }

      }
      return result;
    },

    transpone(matrix) {
      let size = this.matrixWidth(matrix);
      let result = (function (dims) {
        let allocate = function (dims) {
          if (dims.length === 0) {
            return 0;
          } else {
            let array = [];
            for (let i = 0; i < dims[0]; i++) {
              array.push(allocate(dims.slice(1)));
            }
            return array;
          }
        };
        return allocate(dims);
      })([size, size]);
      for (let i = 0; i < size; i++) {
        {
          for (let n = 0; n < size; n++) {
            {
              result[i][n] = matrix[n][i];
            }
          }
        }
      }
      return result;
    }
  }
}
</script>

<style scoped>

</style>