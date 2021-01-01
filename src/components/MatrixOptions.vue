<template>
  <button @click="addColumn">Add column</button>
  <button @click="deleteColumn">Delete column</button>
  <button @click="addRow">Add row</button>
  <button @click="deleteRow">Delete row</button>
  <br>
  <button @click="displayDeterminant">Determinant</button>
  <button @click="doTransposition">Transpose</button>
  <button @click="clearMatrix">Clear</button>
  <button @click="randomizeMatrix">Randomize</button>
</template>

<script>
export default {
name: "MatrixOptions"
}
</script>

<style scoped>

</style>