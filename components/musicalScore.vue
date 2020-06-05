<template>
  <div id="component-frame">
    <v-container>
      <v-row>
        <v-col cols="4">
          <ul id="rhythm" class="blue lighten-3">
            <li>リズム</li>
            <li>
              <draggable element="ul" class="draggable">
                <li v-for="block in rhythmBlocks" :key="block">{{ block }}</li>
              </draggable>
            </li>
          </ul>
        </v-col>
        <v-col cols="4">
          <ul id="code" class="green lighten-3">
            <li>コード</li>
            <li>
              <draggable element="ul" class="draggable">
                <li v-for="block in codeBlocks" :key="block">{{ block }}</li>
              </draggable>
            </li>
          </ul>
        </v-col>
        <v-col cols="4">
          <ul id="melody" class="pink lighten-3">
            <li>メロディ</li>
            <li>
              <draggable element="ul" class="draggable">
                <li v-for="block in melodyBlocks" :key="block">{{ block }}</li>
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
export default {
  components: {
    draggable
  },
  data() {
    return {
      rhythmBlocks: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      codeBlocks: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      melodyBlocks: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
    }
  }
}
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
  overflow: scroll;
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
    background: #c0c0c0;
    height: 5rem;
  }
}
</style>
