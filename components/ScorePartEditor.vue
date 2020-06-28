<template>
  <div class="score-part-container">
    <div class="column-title">
      <div class="part-title-container" @click="enabled = !enabled">
        <v-icon large class="icon" :class="{ disabled: !enabled }">{{
          partIcon
        }}</v-icon>
        <div class="part-title" :class="{ disabled: !enabled }">
          {{ partTitle }}
        </div>
      </div>
    </div>

    <div
      class="block-area-container"
      :style="{ width: 5 * (maxLength + 1) + 'rem' }"
    >
      <div v-for="i in maxLength" :key="i" class="block-area"></div>
    </div>

    <div class="draggable-wrapper">
      <draggable
        v-model="blocks"
        class="score-draggable"
        :group="part"
        v-bind="dragOptions"
      >
        <div
          v-for="(block, index) in blocks"
          :key="index"
          class="block-item-wrapper"
        >
          <block-item :block="block" @click.native="clickBlock(block.name)" />
        </div>
      </draggable>
      <div class="button-wrapper">
        <v-icon x-large class="dialog-button" @click.stop="showDialog()">
          mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>
    <!-- ブロックが押されたら編集画面表示 -->
    <v-dialog
      v-if="part === 'melody'"
      v-model="editModal"
      fullscreen
      hide-overlay
    >
      <melody-modal :block-name="blockName" @dialog="editModal = $event" />
    </v-dialog>
    <v-dialog
      v-if="part === 'rhythm'"
      v-model="editModal"
      fullscreen
      hide-overlay
    >
      <rhythm-modal @dialog="editModal = $event" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import BlockItem from '@/components/BlockItem.vue'
import { Block, ScorePart } from '@/types/music'
import MelodyModal from '@/components/melodyModal.vue'
import RhythmModal from '@/components/rhythmModal.vue'

export default Vue.extend({
  components: {
    draggable,
    BlockItem,
    MelodyModal,
    RhythmModal
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
      enabled: true,
      editModal: false,
      blockName: ''
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    maxLength(): number {
      // 各partにおけるdurationの合計の最大値 / 2 + 1 (追加ボタン分)
      // TODO: fetch from store
      return Math.floor(13 / 2) + 1
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
    },
    clickBlock(name: string) {
      this.editModal = true
      this.blockName = name
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
