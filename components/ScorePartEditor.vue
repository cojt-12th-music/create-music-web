<template>
  <div class="score-part-container">
    <div class="column-title">
      <div class="part-title-container" @click="enabled = !enabled">
        <v-icon class="icon" :class="{ disabled: !enabled }" :large="true">{{
          partIcon
        }}</v-icon>
        <div class="part-title" :class="{ disabled: !enabled }">
          {{ partTitle }}
        </div>
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
        <v-icon x-large class="dialog-button" @click.stop="showDialog()">
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
    },
    showsDialog: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      // TODO: store setting
      enabled: true
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
      // TODO: fetch from store
      return 10
    },
    partTitle(): string {
      return {
        rhythm: 'リズム',
        chord: 'コード',
        melody: 'メロディ'
      }[this.part]
    },
    partIcon(): string {
      return {
        rhythm: 'fas fa-drum',
        chord: 'fas fa-guitar',
        melody: 'music_note'
      }[this.part]
    },
    blocks: {
      get(): Block[] {
        return {
          rhythm: this.$accessor.music.rhythmBlocks,
          chord: this.$accessor.music.chordBlocks,
          melody: this.$accessor.music.melodyBlocks
        }[this.part]
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: this.part, blockNames })
      }
    }
  },
  methods: {
    showDialog() {
      this.$emit('update:showsDialog', true)
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
  height: calc(100% / 3);
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
  width: 6rem;

  .part-title-container {
    text-align: center;

    .part-title {
      width: 4rem;
      &.disabled {
        color: $-gray-500;
      }
    }
    i.icon {
      color: $-gray-200;
      display: block;
      margin: auto;
      width: 3rem;
      &.disabled {
        color: $-gray-500;
      }
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

  .dialog-button {
    color: $-primary-500;
  }
}

@include pc {
}
</style>
