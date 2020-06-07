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
                  <block :text="block.name" />
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
                  <block :text="block.name" />
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
                  <block :text="block.name" />
                </li>
              </draggable>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import block from '~/components/block.vue'
export default {
  components: {
    draggable,
    block
  },
  data() {
    return {
      rhythmBlocks: [
        { name: 'C', type: '', id: 1 },
        { name: 'D', type: '', id: 2 },
        { name: 'E', type: '', id: 3 },
        { name: 'F', type: '', id: 4 },
        { name: 'G', type: '', id: 5 },
        { name: 'A', type: '', id: 6 },
        { name: 'B', type: '', id: 7 }
      ],
      codeBlocks: [
        { name: 'Am', type: '', id: 1 },
        { name: 'F', type: '', id: 2 },
        { name: 'G', type: '', id: 3 },
        { name: 'C', type: '', id: 4 },
        { name: 'Am', type: '', id: 5 },
        { name: 'F', type: '', id: 6 },
        { name: 'G', type: '', id: 7 }
      ],
      melodyBlocks: [
        { name: 'C', type: '', id: 1 },
        { name: 'D', type: '', id: 2 },
        { name: 'E', type: '', id: 3 },
        { name: 'F', type: '', id: 4 },
        { name: 'G', type: '', id: 5 },
        { name: 'A', type: '', id: 6 },
        { name: 'B', type: '', id: 7 }
      ]
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
