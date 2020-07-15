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

        <div
          v-for="i in scoreLength + 1"
          :key="i"
          class="play-time"
          :style="playTimeStyle(i)"
          @mousedown="mouseDown(i)"
        />

        <div class="seek-bar" :style="seekBarStyle" />
      </div>

      <transition name="trash">
        <div v-if="!isPlaying && trashPart" class="score-trash-wrapper">
          <draggable class="score-draggable-trash" :group="trashPart" />
          <v-icon class="icon">fa-trash</v-icon>
        </div>
      </transition>
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
        transform: `translateX(${(this.$accessor.player.playTime * 5) / 2}rem)`
      }
      if (this.$accessor.player.isPlaying) {
        Object.assign(style, {
          transform: `translateX(${(this.scoreLength + 1) * 5}rem)`,
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
      this.trashPart = trashPart
    },
    playTimeStyle(key: number): Object {
      const style = {
        transform: `translateX(${(key - 1) * 5}rem)`
      }
      return style
    },
    mouseDown(playTime: number) {
      this.$accessor.player.setPlayTime(playTime * 2 - 2)
      console.log(this.$accessor.player.playTime)
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

  .play-time {
    position: absolute;
    left: calc(6rem - 11px);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid $-gray-500;
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
    height: 4rem;
    width: 4rem;
    opacity: 0.5;
  }

  .icon {
    position: absolute;
    color: $-gray-50;
  }
}

.trash-enter-active,
.trash-leave-active {
  transform: translateY(0) translateZ(0);
  transition: transform 100ms linear 100ms;
}

.trash-enter,
.trash-leave-to {
  transform: translateY(10vh) translateZ(0);
}

@include pc {
}
</style>
