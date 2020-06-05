<template>
  <div id="component-frame">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
div#component-frame {
  background-color: #d81b60;
}
</style>
