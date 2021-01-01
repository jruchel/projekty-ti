<template>
  <div>
    <h4>
      <router-link to="/matrix">Step into the matrix!</router-link> |
      <router-link to="/temp">Into the temp.</router-link>
    </h4>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "Navigation"
}
</script>

<style scoped>

</style>