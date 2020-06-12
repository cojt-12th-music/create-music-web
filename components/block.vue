<template>
  <div id="component-frame" :style="{ 'background-color': styleObject }">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    blockType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // styleObject: {
      //   'backgroundColor': '#' + this.blockType
      // }
      // styleObject: "background-color:skyblue"
    }
  },
  computed: {
    styleObject() {
      return this.blockType
    }
  }
}
</script>

<style lang="scss" scoped>
div#component-frame {
  // background-color: background;
  color: white;
  border-radius: 0.2rem;
  -webkit-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  -moz-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  -ms-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
}
</style>
