<template>
  <div id="component-frame">
    <v-container>
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

        <div
          v-for="i in scoreLength + 1"
          :key="i"
          class="play-time"
          :style="playTimeStyle(i - 1)"
          @mousedown="mouseDown(i - 1)"
        />

        <div class="seek-bar" :style="seekBarStyle" />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScorePartEditor from '@/components/ScorePartEditor.vue'
import { Block, ScorePart } from '@/types/music'

type DataType = {
  trashPart: ScorePart | null
  blockLength: number
}

export default Vue.extend({
  components: {
    ScorePartEditor
  },
  data(): DataType {
    return {
      trashPart: null,
      blockLength: 4
    }
  },
  computed: {
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
      return Math.floor(this.musicDuration / 4)
    },
    seekBarStyle(): Object {
      const style = {
        transform: `translateX(${(this.$accessor.player.playTime * 5) /
          this.blockLength}rem)`
      }
      if (this.$accessor.player.isPlaying) {
        Object.assign(style, {
          transform: `translateX(${this.scoreLength * 5}rem)`,
          transitionProperty: 'transform',
          transitionDuration: `${((this.musicDuration -
            this.$accessor.player.playTime) *
            60) /
            this.$accessor.music.bpm}s`,
          transitionTimingFunction: 'linear'
        })
      }
      return style
    },
    isPlaying(): boolean {
      return this.$accessor.player.isPlaying
    }
  },
  methods: {
    draggableTrash(trashPart: ScorePart | null) {
      this.$emit('update:trash-part', trashPart)
    },
    playTimeStyle(playTime: number): Object {
      const style = {
        transform: `translateX(${playTime * 5}rem)`
      }
      return style
    },
    mouseDown(playTime: number) {
      if (!this.$accessor.player.isPlaying)
        this.$accessor.player.setPlayTime(playTime * this.blockLength)
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
  position: relative;
}

.score-container {
  position: relative;
  box-sizing: border-box;
  width: max-content;
  border-color: $-gray-500;
  border-style: solid solid none solid;
  border-width: 1px;
  height: 21rem;

  .play-time {
    position: absolute;
    left: calc(6rem - 11px);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 15px solid $-gray-300;
  }

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

@include pc {
}
</style>
