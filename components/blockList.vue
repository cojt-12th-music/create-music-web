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
              class="draggable"
              :list="melodyBlocks"
              :group="{ name: musicType[index], pull: 'clone', put: false }"
              v-bind="dragOptions"
              :clone="disableEvent"
              :move="disableEvent"
              @end="dragEnd"
            >
              <div
                v-for="(name, index) in block"
                :key="index"
                class="block-wrapper"
              >
                <block :text="name" />
              </div>
            </draggable>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- <block text="aaa" /> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import block from './block.vue'

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
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    rhythmBlocks(): string[] {
      return this.$accessor.music.rhythm.blockNames
    },
    chordBlocks(): string[] {
      return this.$accessor.music.chord.blockNames
    },
    melodyBlocks(): string[] {
      return this.$accessor.music.melodyTemplateNames
    },
    blocks(): string[][] {
      const rhythmBlocks = this.rhythmBlocks
      const chordBlocks = this.chordBlocks
      const melodyBlocks = this.melodyBlocks
      return [rhythmBlocks, chordBlocks, melodyBlocks]
    }
  },
  methods: {
    dragEnd(event: { oldIndex: number; newIndex: number; pullMode: string }) {
      if (event.pullMode !== 'clone') {
        return
      }
      this.$accessor.music.cloneBlock({
        blockName: this.melodyBlocks[event.oldIndex],
        index: event.newIndex
      })
    },
    // draggableのイベントをキャンセルするためのメソッド
    disableEvent() {}
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/style/draggable.scss';

div#component-frame {
  height: 100%;
}
.boxContainer {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
</style>
