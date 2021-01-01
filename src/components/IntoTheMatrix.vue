<template>
  <div>
    <h1>Into the matrix!</h1>
    <Matrix/>
    <label for="checkbox">Druga macierz</label>
    <input id="checkbox" type="checkbox" v-on:click="onChecked">
    <Matrix v-if="secondMatrix"/>
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
    onChecked() {
      this.secondMatrix = !this.secondMatrix
    }
  }
}
</script>

<style scoped>

</style>