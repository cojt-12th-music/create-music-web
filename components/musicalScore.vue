<template>
  <div id="component-frame">
    <v-container>
      <v-row>
        <v-col cols="4">
          <ul id="rhythm" class="blue darken-1">
            <li>リズム</li>
            <li>
              <draggable element="ul" class="draggable" group="rhythm">
                <li v-for="block in rhythmBlocks" :key="block">
                  <block :text="block" />
                </li>
              </draggable>
            </li>
          </ul>
        </v-col>
        <v-col cols="4">
          <ul id="code" class="green lighten-1">
            <li>コード</li>
            <li>
              <draggable element="ul" class="draggable" group="chord">
                <li v-for="block in codeBlocks" :key="block">
                  <block :text="block" />
                </li>
              </draggable>
            </li>
          </ul>
        </v-col>
        <v-col cols="4">
          <ul id="melody" class="pink lighten-1">
            <li>メロディ</li>
            <li>
              <draggable
                element="ul"
                class="draggable"
                group="melody"
                @end="dragEnd"
              >
                <li v-for="block in melodyBlocks" :key="block">
                  <block :text="block" />
                </li>
              </draggable>
            </li>
          </ul>
        </v-col>
      </v-row>
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
    melodyBlocks(): Array<string> {
      return this.$accessor.music.melody.blockNames
    }
  },
  methods: {
    dragEnd(event: { oldIndex: number; newIndex: number }) {
      const oldIndex = event.oldIndex
      const newIndex = event.newIndex
      this.$accessor.music.moveBlock({ oldIndex, newIndex })
      console.log(this.$accessor.music.melody.blockNames)
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}

ul {
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
</style>
