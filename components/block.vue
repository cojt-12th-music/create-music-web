<template>
  <div
    id="block-component-frame"
    :style="{
      width: block.duration * baseWidth + (block.duration - 1) * 1 + 'rem'
    }"
    :class="{ highlight: isHighlighted }"
    @click.stop="melodyDialog = true"
  >
    {{ block.name }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '@/types/music'

export default Vue.extend({
  components: {},
  props: {
    block: {
      type: Object as Vue.PropType<Block>,
      required: true
    },
    isHighlighted: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseWidth: 4,
      melodyDialog: false
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
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &.highlight {
    -webkit-filter: drop-shadow(0px 0px 5px $-primary-500);
    -filter: drop-shadow(0px 0px 5px $-primary-500);
  }
}
</style>
