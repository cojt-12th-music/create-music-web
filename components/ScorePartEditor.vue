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
          <block-item :block="block" @click.native="showEditModal(block)" />
        </div>
      </draggable>
      <div class="button-wrapper">
        <v-icon
          x-large
          class="dialog-button"
          @click.stop="showsBlockList = true"
        >
          mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>

    <v-dialog v-model="showsBlockList" max-width="800">
      <block-list :part="part" @closeDialog="showsBlockList = false" />
    </v-dialog>
    <v-dialog
      v-if="part === 'melody'"
      v-model="showsEditModal"
      fullscreen
      hide-overlay
    >
      <melody-modal
        v-if="currentBlock"
        :block-name="currentBlock.name"
        @dialog="showsEditModal = $event"
      />
    </v-dialog>
    <v-dialog
      v-if="part === 'rhythm'"
      v-model="showsEditModal"
      fullscreen
      hide-overlay
    >
      <rhythm-modal
        v-if="currentBlock"
        :block-name="currentBlock.name"
        @dialog="closeEditModal"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import BlockItem from '@/components/BlockItem.vue'
import BlockList from '@/components/BlockList.vue'
import MelodyModal from '@/components/melodyModal.vue'
import RhythmModal from '@/components/rhythmModal.vue'
import { Block, ScorePart } from '@/types/music'

type DataType = {
  enabled: boolean
  showsBlockList: boolean
  showsEditModal: boolean
  currentBlock: Block | null
}

export default Vue.extend({
  components: {
    draggable,
    BlockItem,
    BlockList,
    MelodyModal,
    RhythmModal
  },
  props: {
    part: {
      required: true,
      type: String as Vue.PropType<ScorePart>
    }
  },
  data(): DataType {
    return {
      enabled: true,
      showsBlockList: false,
      showsEditModal: false,
      currentBlock: null
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
      const RhythmLength: number = this.$accessor.music.rhythmBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      const ChordLength: number = this.$accessor.music.chordBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      const MelodyLength: number = this.$accessor.music.melodyBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      const maxLength: number = Math.max(
        RhythmLength,
        ChordLength,
        MelodyLength
      )
      return Math.floor(maxLength / 2) + 1
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
        return this.$accessor.music.partBlocks(this.part)
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: this.part, blockNames })
      }
    }
  },
  methods: {
    showEditModal(block: Block) {
      // ブロックは編集前の状態を保持できるようdeep copyしておく
      this.currentBlock = JSON.parse(JSON.stringify(block))
      this.showsEditModal = true
    },
    closeEditModal(isEdited: boolean) {
      this.showsEditModal = false

      // 編集していないときや, ブロックがユーザが作成したものなときは何もしない
      if (!isEdited || !this.currentBlock || this.currentBlock.isOriginal) {
        return
      }

      // ブロックをコピー
      this.$accessor.music.copyBlock({
        part: this.part,
        blockName: this.currentBlock.name
      })
      // もとのブロックは編集前に戻す
      this.$accessor.music.updateBlock({
        part: this.part,
        block: this.currentBlock
      })
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

// .open-blocklist {
//   margin-left: 1rem;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   transform: translateY(-0.5rem);
// }

@include pc {
}
</style>
