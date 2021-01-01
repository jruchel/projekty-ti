<template>
  <div>
    <div v-for="index in height" :key="index">
      <MatrixRow :width="width"/>
      <br>
    </div>
    <button @click="addColumn">Add column</button>
    <button @click="deleteColumn">Delete column</button>
    <button @click="addRow">Add row</button>
    <button @click="deleteRow">Delete row</button>
    <br>
    <button @click="displayDeterminant">Determinant</button>
    <button @click="doTransposition">Transpose</button>
    <button @click="clearMatrix">Clear</button>
    <button @click="randomizeMatrix">Randomize</button>
  </div>
</template>

<script>
import MatrixRow from "@/components/MatrixRow";

export default {
  name: "Matrix",
  components: {MatrixRow},
  mounted() {
    console.log(this.width)
    console.log(this.height)
    if (this.width === null || this.width === 'undefined' || this.width === 0) {
      this.width = 3;
    }
    if (this.height === null || this.height === 'undefined' || this.height === 0) {
      this.height = 3;
    }
  },
  methods: {
    setMatrix(matrix) {
      this.height = matrix.length
      this.width = matrix[0].length
      for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i]
        let cells = []
        for (let n = 0; n < row.length; n++) {
          cells.push({id: n, value: row[n]})
        }
        console.log(JSON.stringify(cells))
        this.$children[i].setCells(cells)
      }
    },
    readMatrix() {
      let matrix = []
      for (let i = 0; i < this.$children.length; i++) {
        let child = this.$children[i]
        matrix.push(child.readRow())
      }
      return matrix
    },
    clearMatrix() {
      this.iterate(this.clearCell)
    },
    randomizeMatrix() {
      this.iterate(this.randomizeCell)
    },
    randomizeCell(cell) {
      cell.value = Math.ceil(Math.random() * 100)
      if (Math.random() * 10 > 5) {
        cell.value *= -1
      }
    },
    clearCell(cell) {
      cell.value = 0;
    },
    iterate(onEach) {
      for (let i = 0; i < this.$children.length; i++) {
        let cells = this.$children[i].getCells()
        for (let n = 0; n < cells.length; n++) {
          onEach(cells[n])
        }
      }
    },
    displayDeterminant() {
      let result = this.determinant(this.readMatrix())
      if (result !== "NaN") {
        alert("Determinant of this matrix is: " + result)
      } else {
        alert("Non square matrices don't have determinants!")
      }
    },
    doTransposition() {
      let matrix = this.readMatrix()
      matrix = this.transpone(matrix)
      for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i]
        let cells = []
        for (let n = 0; n < row.length; n++) {
          cells.push({id: n, value: row[n]})
        }
        console.log(JSON.stringify(cells))
        this.$children[i].setCells(cells)
      }
      let temp = this.width
      this.width = this.height
      this.height = temp
    },
    addColumn() {
      this.width++
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].addCell()
      }
    },
    deleteColumn() {
      for (let i = 0; i < this.$children.length; i++) {
        this.$children[i].deleteCell()
      }
      this.width--
    },
    addRow() {
      this.height++
      console.log(this.width)
    },
    deleteRow() {
      this.height--
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
  ,
  props: {
    width: {
      default: 3
    },
    height: {
      default: 3
    }
  }
}
</script>

<style scoped>

</style>