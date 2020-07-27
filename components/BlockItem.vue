<template>
  <div
    id="block-component-frame"
    :style="{
      width: baseWidth * blockLength + blockInterval * (blockLength - 1) + 'rem'
    }"
    :class="{ highlight: isHighlighted }"
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
      blockInterval: 1
    }
  },
  computed: {
    // 半小節を1つ分の長さに
    blockLength(): number {
      return this.block.duration / 4
    }
  }
})
</script>

<style lang="scss" scoped>
div#block-component-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 4rem;
  background-color: $-gray-700;
  border: 1px solid $-primary-500;
  border-radius: 4px;
  color: $-primary-500;
  font-size: 15px;

  &.highlight {
    -webkit-filter: drop-shadow(0px 0px 5px $-primary-500);
    -filter: drop-shadow(0px 0px 5px $-primary-500);
  }
}
</style>
