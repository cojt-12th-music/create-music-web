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
        <score-part-editor part="rhythm" />
        <score-part-editor part="chord" />
        <score-part-editor part="melody" />

        <div class="seek-bar" :style="seekBarStyle" />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ScorePartEditor from '@/components/ScorePartEditor.vue'

export default Vue.extend({
  components: {
    ScorePartEditor
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
    seekBarStyle(): Object {
      const style = {
        transform: `translateX(${this.$accessor.player.playTime}rem)`
      }
      if (this.$accessor.player.isPlaying) {
        const duration = this.$accessor.music.musicDuration + 1
        const len = Math.floor(duration / 2)
        Object.assign(style, {
          transform: `translateX(${len * 5}rem)`,
          transitionProperty: 'transform',
          transitionDuration: `${(duration * 60) / this.$accessor.music.bpm}s`,
          transitionTimingFunction: 'linear'
        })
      }
      return style
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
    left: calc(6rem - 2px);
    width: 2px;
    height: 100%;
    background-color: red;
    opacity: 0.5;
  }
}

.open-blocklist {
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-0.5rem);
}

@include pc {
}
</style>
