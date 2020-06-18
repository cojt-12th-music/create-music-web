<template>
  <div id="component-frame">
    <v-container>
      <div id="wrapper">
        <ul id="rhythm" class="blue darken-1">
          <li class="column-title">リズム</li>
          <li>
            <draggable element="ul" class="draggable" group="rhythm">
              <li v-for="block in rhythmBlocks" :key="block">
                <block :text="block" block-type="#4FC3F7" />
              </li>
            </draggable>
          </li>
        </ul>
        <ul id="code" class="green lighten-1">
          <li class="column-title">コード</li>
          <li>
            <draggable element="ul" class="draggable" group="chord">
              <li v-for="block in codeBlocks" :key="block">
                <block :text="block" block-type="#81C784" />
              </li>
            </draggable>
          </li>
        </ul>
        <ul id="melody" class="pink lighten-1">
          <li class="column-title">メロディ</li>
          <li>
            <draggable
              v-model="melodyBlocks"
              element="ul"
              class="draggable"
              group="melody"
            >
              <li v-for="block in melodyBlocks" :key="block">
                <block :text="block" block-type="#F06292" />
              </li>
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
ul.draggable {
  li {
    margin: 1rem;
    display: block;
    height: 5rem;
  }
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
  ul.draggable {
    text-align: center;
    li {
      margin: 1rem;
      display: inline-block;
      height: 5rem;
      width: 5rem;
    }
  }
}
</style>
