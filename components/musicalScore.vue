<template>
  <div id="component-frame">
    <v-container>
      <div class="score-header">
        <h2 class="score-header-title">{{ scoreTitle }}</h2>
        <div class="score-header-creator">{{ scoreComposer }}</div>
      </div>

      <div class="score-container">
        <score-part-editor part="rhythm" :shows-dialog.sync="rhythmDialog" />
        <score-part-editor part="chord" :shows-dialog.sync="chordDialog" />
        <score-part-editor part="melody" :shows-dialog.sync="melodyDialog" />

        <div class="open-blocklist">
          <v-dialog v-model="rhythmDialog">
            <block-list />
          </v-dialog>
          <v-dialog v-model="chordDialog" max-width="290">
            <block-list />
          </v-dialog>
          <v-dialog v-model="melodyDialog" max-width="290">
            <block-list />
          </v-dialog>
        </div>
      </div>
    </v-container>
    <!-- ブロックが押されたら編集画面表示 -->
    <v-dialog v-model="melodyEditModal" fullscreen hide-overlay>
      <melody-modal @dialog="melodyEditModal = $event" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import RhythmBlockList from '@/components/rhythmBlockList.vue'
import ChordBlockList from '@/components/chordBlockList.vue'
import MelodyBlockList from '@/components/melodyBlockList.vue'
import MelodyModal from '@/components/melodyModal.vue'
import BlockItem from '@/components/block.vue'
import BlockList from '@/components/blockList.vue'
import ScorePartEditor from '@/components/ScorePartEditor.vue'
import { Block } from '@/types/music'

export default Vue.extend({
  components: {
    draggable,
    RhythmBlockList,
    ChordBlockList,
    MelodyBlockList,
    MelodyModal,
    BlockItem,
    ScorePartEditor,
    BlockList
  },
  data() {
    return {
      rhythmDialog: false,
      chordDialog: false,
      melodyDialog: false,
      melodyEditModal: false,
      maxDuration: 10
    }
  },
  computed: {
    scoreTitle(): string {
      return this.$accessor.music.title
    },
    scoreComposer(): string {
      return this.$accessor.music.composer
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}

.score-header {
  padding: 1rem;
  display: flex;
  align-items: center;

  .score-header-title {
    color: $-gray-50;
    margin-right: 1rem;
  }
  .score-header-creator {
    color: $-gray-100;
  }
}

.score-container {
  box-sizing: border-box;
  width: max-content;
  border-color: $-gray-500;
  border-style: solid solid none solid;
  border-width: 1px;
}

.open-blocklist {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-0.5rem);
}

@include pc {
}
</style>
