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

        <div class="seek-bar" />
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

@include pc {
}
</style>
