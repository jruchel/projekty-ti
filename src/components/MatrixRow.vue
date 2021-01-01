<template>
  <div>
    <form>
      <div class="table-input" v-bind:key="cell.id" v-for="cell in cells">
        <input class="table-input" type="number" v-model="cell.value">
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "MatrixRow",
  props: ["width"],
  mounted() {
    console.log(this.width)
    while (this.cells.length < this.width) {
      this.addCell()
    }
  },
  methods: {
    setCells(cells) {
      console.log("old cells: " + this.cells)
      console.log("new cells: " + cells)
      this.cells = cells
    },
    readRow() {
      let row = []
      for (let i = 0; i < this.cells.length; i++) {
        row.push(this.cells[i].value)
      }
      return row
    },
    addCell() {
      this.cells.push({id: this.cells.length, value: 0})
    },
    deleteCell() {
      if (this.cells.length > 1) {
        this.cells.splice(this.cells.length - 1)
      }
    }
  },
  data() {
    return {
      cells: [{id: 0, value: 0}]
    }
  }
}
</script>

<style scoped>
form {
  display: flex; /* 2. display flex to the rescue */
  flex-direction: row;
  left: 50%;
  bottom: 50%;
}

input {
  width: 30px;
}
</style>