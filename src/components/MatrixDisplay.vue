<template>
  <div>
    <h4>{{ title }}</h4>
    <Matrix :editable="editable"/>
    <div v-if="editable">
      <button @click="doAddColumn">Add column</button>
      <button @click="doDeleteColumn">Delete column</button>
      <button @click="doAddRow">Add row</button>
      <button @click="doDeleteRow">Delete row</button>
      <br>
      <button @click="doDeterminant">Determinant</button>
      <button @click="doTransposition">Transpose</button>
      <button @click="doClearMatrix">Clear</button>
      <button @click="doRandomizeMatrix">Randomize</button>
    </div>
  </div>
</template>

<script>
import Matrix from "@/components/Matrix";

export default {
  name: "MatrixDisplay",
  methods: {
    getMatrix() {
      return this.$children[0]
    },
    doAddColumn() {
      this.getMatrix().addColumn()
    },
    doDeleteColumn() {
      this.getMatrix().deleteColumn()
    },
    doAddRow() {
      this.getMatrix().addRow()
    },
    doDeleteRow() {
      this.getMatrix().deleteRow()
    },
    doDeterminant() {
      let result = this.getMatrix().determinant(this.getMatrix().readMatrix())
      if (result !== "NaN") {
        alert("Determinant of this matrix is: " + result)
      } else {
        alert("Non square matrices don't have determinants!")
      }
    },
    doTransposition() {
      let matrixComponent = this.getMatrix()
      let matrix = matrixComponent.readMatrix()
      matrix = matrixComponent.transpone(matrix)
      for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i]
        let cells = []
        for (let n = 0; n < row.length; n++) {
          cells.push({id: n, value: row[n]})
        }
        console.log(JSON.stringify(cells))
        matrixComponent.$children[i].setCells(cells)
      }
      let temp = matrixComponent.width
      matrixComponent.width = matrixComponent.height
      matrixComponent.height = temp
    }
    ,
    doClearMatrix() {
      this.getMatrix().clearMatrix()
    },
    doRandomizeMatrix() {
      this.getMatrix().randomizeMatrix()
    }
  },
  components: {Matrix},
  props: {
    title: {
      default: "Matrix"
    },
    editable: {
      default: true
    }
  }
}
</script>

<style scoped>

</style>