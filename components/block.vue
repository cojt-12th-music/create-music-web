<template>
  <div id="block-component-frame" @click.stop="melodyDialog = true">
    <p>{{ block.name }}</p>
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
    }
  },
  data() {
    return {
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
