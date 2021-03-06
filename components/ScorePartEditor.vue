<template>
  <div class="score-part-container">
    <div class="column-title">
      <div class="part-title-container" @click="switchMute">
        <v-icon large class="icon" :class="{ disabled: isMute }">{{
          partIcon
        }}</v-icon>
        <div class="part-title" :class="{ disabled: isMute }">
          {{ partTitle }}
        </div>
      </div>
    </div>

    <div
      class="block-area-container"
      :style="{ width: 5 * (scoreLength + 2) + 'rem' }"
    >
      <div v-for="i in scoreLength + 1" :key="i" class="block-area"></div>
    </div>

    <div class="draggable-wrapper">
      <draggable
        v-model="blocks"
        class="score-draggable"
        :group="part"
        v-bind="dragOptions"
        :disabled="!editEnabled || isPlaying"
        @choose="onChooseItem"
        @unchoose="onUnchooseItem"
      >
        <div
          v-for="(block, index) in blocks"
          :key="index"
          class="block-item-wrapper"
        >
          <block-item
            :block="block"
            :is-highlighted="isPlaying && !isMute && index === highlightedIndex"
            @click.native="showEditModal(block)"
          />
        </div>
      </draggable>

      <div class="button-wrapper">
        <v-icon x-large class="dialog-button" @click.stop="openBlockList">
          mdi-plus-circle-outline
        </v-icon>
      </div>
    </div>

    <v-dialog v-model="showsBlockList" max-width="800" scrollable>
      <block-list :part="part" @close-block-list="closeBlockList" />
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
        @dialog="closeEditModal"
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
    },
    scoreLength: {
      required: true,
      type: Number
    }
  },
  data(): DataType {
    return {
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
    editEnabled(): boolean {
      return this.$accessor.player.editEnabled
    },
    isMute: {
      get(): boolean {
        return this.$accessor.player.isMute[this.part]
      },
      set(isMute: boolean) {
        this.$accessor.player.setMute({ part: this.part, isMute })
      }
    },
    blocks: {
      get(): Block[] {
        return this.$accessor.music.partBlocks(this.part)
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: this.part, blockNames })
      }
    },
    isPlaying(): boolean {
      return this.$accessor.player.isPlaying
    },
    highlightedIndex(): number {
      return this.$accessor.player.highlightedBlockIndex[this.part]
    }
  },
  watch: {
    showsBlockList(value: boolean) {
      if (!value) this.$accessor.player.stopPresetPreview()
    },
    showsEditModal(value: boolean) {
      if (!value) this.$accessor.player.stopPresetPreview()
    }
  },
  methods: {
    switchMute() {
      // 再生中のときはしれっと無視する
      if (!this.isPlaying) {
        this.isMute = !this.isMute
      }
    },
    openBlockList() {
      // 再生中のときはしれっと無視する
      if (!this.isPlaying) {
        this.showsBlockList = true
      }
    },
    showEditModal(block: Block) {
      // 再生中のときは(ry
      if (this.isPlaying) {
        return
      }
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
    },
    // ブロックが渡された場合は編集モーダルを開く
    closeBlockList(block: Block | null = null) {
      this.showsBlockList = false
      if (block) {
        this.showEditModal(block)
      }
    },
    // ダイアログが閉じたときはプレビューを止める
    onCloseDialog() {
      this.$accessor.player.stopPresetPreview()
    },
    onChooseItem() {
      this.$emit('draggable-trash', this.part)
    },
    onUnchooseItem() {
      this.$emit('draggable-trash', null)
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
    z-index: 1;
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
