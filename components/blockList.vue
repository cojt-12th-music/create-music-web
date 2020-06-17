<template>
  <div id="component-frame">
    <v-card>
      <v-tabs v-model="tab" background-color="indigo" dark>
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" :touchless="true">
        <v-tab-item v-for="(block, index) in blocks" :key="index">
          <div class="boxContainer">
            <draggable
              element="ul"
              :group="{ name: musicType[index], pull: 'clone', put: false }"
              v-bind="dragOptions"
              @end="dragEnd"
            >
              <li v-for="(name, index) in block" :key="index" class="child">
                <block :text="name" />
              </li>
            </draggable>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- <block text="aaa" /> -->
  </div>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import block from './block'
export default Vue.extend({
  components: {
    draggable,
    block
  },
  data() {
    return {
      tab: null,
      items: [
        {
          tab: 'リズム',
          group: 'rythm',
          list: [
            { name: '8ビート', id: 0 },
            { name: '16ビート', id: 1 },
            { name: '2ビート', id: 2 }
          ]
        },
        {
          tab: 'コード',
          group: 'chord',
          list: [
            { name: '王道', id: 0 },
            { name: 'カノン', id: 1 },
            { name: '小室', id: 2 },
            { name: 'Let it be', id: 3 },
            { name: '下降転調', id: 4 }
          ]
        },
        {
          tab: 'メロディ',
          group: 'melody',
          list: [
            { name: 'メロ1', id: 0 },
            { name: 'メロ2', id: 1 },
            { name: 'メロ3', id: 2 },
            { name: 'メロ4', id: 3 }
          ]
        }
      ],
      enabled: true,
      dragging: false,
      musicType: ['rhythm', 'chord', 'melody'],
      rhythm: 'rhythm'
    }
  },
  computed: {
    rhythmBlocks() {
      return this.$accessor.music.rhythm.blockNames
    },
    chordBlocks() {
      return this.$accessor.music.chord.blockNames
    },
    melodyBlocks() {
      return this.$accessor.music.melody.blockNames
    },
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    blocks() {
      const rhythmBlocks = this.rhythmBlocks
      const chordBlocks = this.chordBlocks
      const melodyBlocks = this.melodyBlocks
      return [rhythmBlocks, chordBlocks, melodyBlocks]
    }
  },
  methods: {
    dragEnd(event) {
      console.log(event)
      console.log(event.from)
      console.log(event.to)
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}
.boxContainer {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.child {
  display: inline-block;
  height: $smartphone-block-size !important;
  width: $smartphone-block-size;
  text-align: center;
}
ul {
  padding-top: 1rem;
  padding-left: 0;
  li {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>
