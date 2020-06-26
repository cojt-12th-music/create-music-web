<template>
  <div id="rhythm" class="UL">
    <div class="column-title">
      <div class="title-container">
        <v-icon :large="true" color="#C2C2C2">{{ partIcon }}</v-icon>
        <div>{{ partTitle }}</div>
      </div>
    </div>
    <div class="GUIDE" :style="{ width: 5 * maxDuration + 5 + 'rem' }">
      <div v-for="i in maxDuration" :key="i" class="guide"></div>
    </div>

    <div class="HOGE">
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
div#component-frame {
  height: 100%;
}

.score-container {
  box-sizing: border-box;
  width: max-content;
  border-color: $-gray-500;
  border-style: solid solid none solid;
  border-width: 1px;
}

.column-title {
  box-sizing: border-box;
  margin: 0;
  color: $-gray-200;
  padding: 1rem;
  border-right: 1px solid $-gray-500;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .title-container {
    text-align: center;
    div {
      width: 4rem;
    }
    i {
      display: block;
      width: 3rem;
      margin: auto;
    }
  }
}

.GUIDE {
  display: flex;
  height: 100%;
  .guide {
    box-sizing: border-box;
    border-right: 1px dashed $-gray-500;
    width: 5rem;
    height: 100%;
    &:nth-child(odd) {
      border-color: $-gray-700;
    }
  }
}

.score-draggable {
  margin: 0;
  display: flex;
  align-items: center;

  .block-item-wrapper {
    margin-right: 1rem;
  }
}

.UL {
  box-sizing: border-box;
  width: max-content;
  height: 7rem;
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
  list-style: none;
  border-bottom: 1px solid $-gray-500;
}

.open-blocklist {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-0.5rem);
}

.HOGE {
  display: flex;
  position: absolute;
  top: 0;
  left: 6.5rem;
  height: 100%;
  align-items: center;
}

.button-wrapper {
  width: 4rem;
  text-align: center;
  vertical-align: middle;
}

@include pc {
}
</style>
