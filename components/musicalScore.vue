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

        <div class="seek-bar" />

        <div class="open-blocklist">
          <v-dialog v-model="rhythmDialog">
            <RhythmBlockList />
          </v-dialog>
          <v-dialog v-model="chordDialog">
            <ChordBlockList />
          </v-dialog>
          <v-dialog v-model="melodyDialog">
            <MelodyBlockList />
          </v-dialog>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScorePartEditor from '@/components/ScorePartEditor.vue'
import RhythmBlockList from '@/components/rhythmBlockList.vue'
import ChordBlockList from '@/components/chordBlockList.vue'
import MelodyBlockList from '@/components/melodyBlockList.vue'

export default Vue.extend({
  components: {
    ScorePartEditor,
    RhythmBlockList,
    ChordBlockList,
    MelodyBlockList
  },
  data() {
    return {
      rhythmDialog: false,
      chordDialog: false,
      melodyDialog: false,
      melodyEditModal: false
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
  position: relative;
  box-sizing: border-box;
  width: max-content;
  border-color: $-gray-500;
  border-style: solid solid none solid;
  border-width: 1px;
  height: 21rem;

  .seek-bar {
    position: absolute;
    top: 0;
    left: calc(6rem + 1px);
    width: 2px;
    height: 100%;
    background-color: red;
    opacity: 0.5;
  }
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
