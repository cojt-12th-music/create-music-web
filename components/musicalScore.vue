<template>
  <div id="component-frame">
    <v-container>
      <v-row>
        <v-col cols="4">
          <ul id="rhythm" class="blue darken-1">
            <li>リズム</li>
            <li>
              <draggable element="ul" class="draggable" group="block">
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
              <draggable element="ul" class="draggable">
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
              <draggable element="ul" class="draggable">
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
import draggable from 'vuedraggable'
import block from '~/components/block.vue'
export default {
  components: {
    draggable,
    block
  },
  data() {
    return {
      rhythmBlocks: ['D', 'E', 'F', 'G', 'A', 'B', 'A'],
      codeBlocks: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      melodyBlocks: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    }
  }
}
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