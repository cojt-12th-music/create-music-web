<template>
  <div class="score-part-container">
    <div class="column-title">
      <div class="part-title-container">
        <v-icon class="icon" :large="true">{{ partIcon }}</v-icon>
        <div class="part-title">{{ partTitle }}</div>
      </div>
    </div>
    <div
      class="block-area-container"
      :style="{ width: 5 * maxDuration + 5 + 'rem' }"
    >
      <div v-for="i in maxDuration" :key="i" class="block-area"></div>
    </div>

    <div class="draggable-wrapper">
      <draggable
        v-model="blocks"
        class="score-draggable"
        group="rhythm"
        v-bind="dragOptions"
      >
        <div
          v-for="(block, index) in blocks"
          :key="index"
          class="block-item-wrapper"
        >
          <block-item :block="block" />
        </div>
      </draggable>
      <div class="button-wrapper">
        <v-icon :large="true" color="#F96500" @click.stop="rythmDialog = true">
          mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import BlockItem from '@/components/block.vue'
import { Block, ScorePart } from '@/types/music'

export default Vue.extend({
  components: {
    draggable,
    BlockItem
  },
  props: {
    part: {
      required: true,
      type: String as Vue.PropType<ScorePart>
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    maxDuration(): number {
      return 10
    },
    partTitle(): string {
      switch (this.part) {
        case 'rhythm':
          return 'リズム'
        case 'chord':
          return 'コード'
        case 'melody':
          return 'メロディ'
        default:
          return ''
      }
    },
    partIcon(): string {
      switch (this.part) {
        case 'rhythm':
          return 'fas fa-drum'
        case 'chord':
          return 'fas fa-guitar'
        case 'melody':
          return 'music_note'
        default:
          return ''
      }
    },
    blocks: {
      get(): Block[] {
        switch (this.part) {
          case 'rhythm':
            return this.$accessor.music.rhythmBlocks
          case 'chord':
            return this.$accessor.music.chordBlocks
          case 'melody':
            return this.$accessor.music.melodyBlocks
          default:
            return []
        }
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: this.part, blockNames })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.score-part-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: left;
  width: max-content;
  height: 7rem;
  box-sizing: border-box;
  border-bottom: 1px solid $-gray-500;
}

.column-title {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $-gray-200;
  height: 100%;
  margin: 0;
  padding: 1rem;
  box-sizing: border-box;
  border-right: 1px solid $-gray-500;

  .part-title-container {
    text-align: center;

    .part-title {
      width: 4rem;
    }
    i.icon {
      color: $-gray-200;
      display: block;
      margin: auto;
      width: 3rem;
    }
  }
}

.block-area-container {
  display: flex;
  height: 100%;

  .block-area {
    border-right: 1px dashed $-gray-500;
    box-sizing: border-box;
    width: 5rem;
    height: 100%;

    &:nth-child(odd) {
      border-color: $-gray-600;
    }
  }
}

.score-draggable {
  display: flex;
  align-items: center;
  margin: 0;

  .block-item-wrapper {
    margin-right: 1rem;
  }
}

.draggable-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  top: 0;
  left: 6.5rem;

  .button-wrapper {
    width: 4rem;
    text-align: center;
    vertical-align: middle;
  }
}

@include pc {
}
</style>
