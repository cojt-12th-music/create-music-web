<template>
  <div id="component-frame">
    <v-container>
      <div class="score-header">
        <h2 class="score-header-title">
          <input v-model="scoreTitle" placeholder="Add Music Name" />
        </h2>
        <div class="score-header-creator">
          <input v-model="scoreComposer" placeholder="Add Your Name" />
        </div>
      </div>

      <div class="score-container">
        <score-part-editor
          part="rhythm"
          :score-length="scoreLength"
          @draggable-trash="draggableTrash"
        />
        <score-part-editor
          part="chord"
          :score-length="scoreLength"
          @draggable-trash="draggableTrash"
        />
        <score-part-editor
          part="melody"
          :score-length="scoreLength"
          @draggable-trash="draggableTrash"
        />

        <div class="seek-bar" :style="seekBarStyle" />
      </div>

      <div class="score-trash-wrapper">
        <draggable
          v-if="trashPart"
          class="score-draggable-trash"
          :group="trashPart"
        >
          <v-icon class="icon">fa-trash</v-icon>
        </draggable>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import ScorePartEditor from '@/components/ScorePartEditor.vue'
import { Block, ScorePart } from '@/types/music'

type DataType = {
  trashPart: ScorePart | null
}

export default Vue.extend({
  components: {
    draggable,
    ScorePartEditor
  },
  data(): DataType {
    return {
      trashPart: null
    }
  },
  computed: {
    scoreTitle: {
      get() {
        return this.$accessor.music.title
      },
      set(input: string) {
        this.$accessor.music.setTitle(input)
      }
    },
    scoreComposer: {
      get() {
        return this.$accessor.music.composer
      },
      set(input: string) {
        this.$accessor.music.setComposer(input)
      }
    },
    musicDuration(): number {
      const RhythmDuration: number = this.$accessor.music.rhythmBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      const ChordDuration: number = this.$accessor.music.chordBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      const MelodyDuration: number = this.$accessor.music.melodyBlocks.reduce(
        (p: number, x: Block) => p + x.duration,
        0
      )
      return Math.max(RhythmDuration, ChordDuration, MelodyDuration)
    },
    scoreLength(): number {
      return Math.floor(this.musicDuration / 2)
    },
    seekBarStyle(): Object {
      const style = {
        transform: `translateX(${this.$accessor.player.playTime}rem)`
      }
      if (this.$accessor.player.isPlaying) {
        Object.assign(style, {
          transform: `translateX(${this.scoreLength * 5}rem)`,
          transitionProperty: 'transform',
          transitionDuration: `${(this.musicDuration * 60) /
            this.$accessor.music.bpm}s`,
          transitionTimingFunction: 'linear'
        })
      }
      return style
    }
  },
  methods: {
    draggableTrash(trashPart: ScorePart | null) {
      this.trashPart = trashPart
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
  position: relative;
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
    left: calc(6rem - 2px);
    width: 2px;
    height: 100%;
    background-color: red;
    opacity: 0.5;
  }
}

.score-trash-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  width: 100%;

  .score-draggable-trash {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $-gray-500;
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    opacity: 0.5;

    .icon {
      color: $-gray-100;
    }
  }
}

@include pc {
}
</style>
