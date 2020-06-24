<template>
  <div id="block-component-frame">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    text: {
      type: String,
      required: true
    }
  },
  computed: {}
})
</script>

<style lang="scss" scoped>
div#block-component-frame {
  background-color: $-gray-700;
  border-radius: 4px;
  border: 1px solid $-primary-500;
  color: $-primary-500;
  box-sizing: border-box;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
  }
}
</style>
