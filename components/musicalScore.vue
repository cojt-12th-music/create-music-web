<template>
  <div id="component-frame">
    <v-container>
      <div id="wrapper">
        <ul id="rhythm" class="blue darken-1">
          <li class="column-title">リズム</li>
          <li>
            <draggable
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
              class="score-draggable"
              group="chord"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in codeBlocks"
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
  data() {
    return {
      rhythmBlocks: [
        '16ビート',
        '16ビート',
        '8ビート',
        '8ビート',
        '2ビート',
        '2ビート'
      ],
      codeBlocks: ['王道', '王道', '小室', '小室', 'カノン', 'かノン']
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    melodyBlocks: {
      get(): string[] {
        return this.$accessor.music.melody.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.SET_BLOCK_NAMES(blockNames)
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
