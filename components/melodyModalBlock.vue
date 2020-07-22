<template>
  <div>
    <div id="block-component-frame"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {},
  data() {
    return {
      melodyDialog: false,
      isBlock: false,
      isTile: true
    }
  },
  computed: {},
  methods: {}
})
</script>

<style lang="scss" scoped>
div#block-component-frame {
  background-color: $-primary-500;
  border-radius: 4px;
  border: 1px solid $-primary-500;
  box-sizing: border-box;
  width: 64px;
  height: 33.5px;
  display: flex;
  align-items: center;
  margin-left: 1px;
  resize: horizontal;
  overflow: hidden;
}
div#block-drag {
  background-color: $-gray-700;
  border-radius: 4px;
  color: $-primary-500;
  margin: 0 0 0 auto;
  box-sizing: border-box;
  width: 3px;
  height: 17.74px;
}
</style>
