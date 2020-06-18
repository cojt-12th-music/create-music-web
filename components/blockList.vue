<template>
  <div id="component-frame">
    <v-card>
      <v-tabs v-model="currentTab" background-color="indigo" dark>
        <v-tab v-for="(tab, index) in tabs" :key="index">
          {{ tab.name }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="currentTab" :touchless="true">
        <v-tab-item v-for="(tab, tabIndex) in tabs" :key="tabIndex">
          <div class="boxContainer">
            <draggable
              class="draggable"
              :list="blockNames[tab.category]"
              :group="{ name: tab.category, pull: 'clone', put: false }"
              v-bind="dragOptions"
            >
              <div
                v-for="(blockName, blockIndex) in blockNames[tab.category]"
                :key="blockIndex"
                class="block-wrapper"
              >
                <block :text="blockName" />
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

type MusicCategory = 'rhythm' | 'chord' | 'melody'

type DataType = {
  currentTab: number
  tabs: { name: string; category: MusicCategory }[]
  enabled: boolean
  dragging: boolean
}

export default Vue.extend({
  components: {
    draggable,
    block
  },
  data(): DataType {
    return {
      currentTab: 0,
      tabs: [
        { name: 'リズム', category: 'rhythm' },
        { name: 'コード', category: 'chord' },
        { name: 'メロディ', category: 'melody' }
      ],
      enabled: true,
      dragging: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    blockNames(): { [category in MusicCategory]: string[] } {
      return {
        rhythm: this.$accessor.music.rhythm.blockNames,
        chord: this.$accessor.music.chord.blockNames,
        melody: this.$accessor.music.melodyTemplateNames
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

.boxContainer {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
</style>
