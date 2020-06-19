<template>
  <div id="component-frame">
    <v-container>
      <div id="wrapper">
        <ul id="rhythm" class="blue darken-1">
          <li class="column-title">リズム</li>
          <li>
            <draggable
              v-model="rhythmBlocks"
              class="score-draggable"
              group="rhythm"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in rhythmBlocks"
                :key="index"
                class="block-wrapper"
              >
                <block :text="block" block-type="#4FC3F7" />
              </div>
            </draggable>
          </li>
        </ul>
        <ul id="code" class="green lighten-1">
          <li class="column-title">コード</li>
          <li>
            <draggable
              v-model="chordBlocks"
              class="score-draggable"
              group="chord"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in chordBlocks"
                :key="index"
                class="block-wrapper"
              >
                <block :text="block" block-type="#81C784" />
              </div>
            </draggable>
          </li>
        </ul>
        <ul id="melody" class="pink lighten-1">
          <li class="column-title">メロディ</li>
          <li>
            <draggable
              v-model="melodyBlocks"
              class="score-draggable"
              group="melody"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in melodyBlocks"
                :key="index"
                class="block-wrapper"
              >
                <block :text="block" block-type="#F06292" />
              </div>
            </draggable>
          </li>
        </ul>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'

import block from '~/components/block.vue'
export default Vue.extend({
  components: {
    draggable,
    block
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    rhythmBlocks: {
      get(): string[] {
        return this.$accessor.music.rhythm.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'rhythm', blockNames })
      }
    },
    chordBlocks: {
      get(): string[] {
        return this.$accessor.music.chord.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'chord', blockNames })
      }
    },
    melodyBlocks: {
      get(): string[] {
        return this.$accessor.music.melody.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'melody', blockNames })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/style/draggable.scss';

div#component-frame {
  height: 100%;
}

#wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1em;
}

ul {
  display: block;
  list-style: none;
  text-align: center;
  padding: 0;
}

@include pc {
  #wrapper {
    display: block;
  }
  ul {
    text-align: left;
    li {
      display: inline-block;
    }
  }
  .column-title {
    width: 5rem;
  }
}
</style>
