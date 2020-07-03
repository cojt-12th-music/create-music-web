<template>
  <div id="melody-modal">
    <v-app-bar extension-height="64px" dark>
      <v-toolbar-title>メロディ編集</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('dialog', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-select
          class="mt-4"
          :items="guidelines"
          label="ガイドライン"
          solo
        ></v-select>
      </template>
    </v-app-bar>
    <div class="edit-area">
      <div class="inner">
        <div v-for="(a, i) in keys" :key="i" class="row" :style="rowStyle()" />
        <div
          v-for="gridIndex in blockDuration"
          :key="gridIndex"
          class="grid"
          :style="gridStyle(gridIndex - 1)"
        />
        <div
          v-for="(sound, i) in sounds"
          :key="i"
          class="block"
          :style="blockStyle(sound)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Sound, Block } from '../types/music'
export default Vue.extend({
  props: {
    blockName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      heightPerBlock: 25,
      widthPerNote: 50,
      keys: [...Array(100).keys()].map((_) => true),
      guidelines: ['明るい', '暗い']
    }
  },
  computed: {
    sounds(): Sound[] {
      return this.soundBlock.sounds
    },
    soundBlock(): Block {
      return this.$accessor.music.blocks.melody[this.blockName]
    },
    blockDuration(): number {
      return this.soundBlock.duration
    }
  },
  methods: {
    calcTopFromKey(key: number) {
      return this.heightPerBlock * key
    },
    rowStyle() {
      return {
        height: `${this.heightPerBlock}px`
      }
    },
    blockStyle(sound: Sound) {
      return {
        height: `${this.heightPerBlock}px`,
        top: `${this.calcTopFromKey(sound.key)}px`,
        width: `${this.widthPerNote * sound.duration}px`,
        left: `${this.widthPerNote * sound.delay}px`
      }
    },
    gridStyle(delay: number) {
      return {
        left: `${this.widthPerNote * delay}px`,
        width: `${this.widthPerNote}px`
      }
    }
  }
})
</script>

<style scoped lang="scss">
#melody-modal {
  width: 100%;
  height: 100%;
  background: $-gray-900;
}
.edit-area {
  overflow: auto;
  width: 100%;
  height: 100%;
  .inner {
    position: relative;
  }
}
.row {
  width: 100%;
  border-bottom: 1px solid $-gray-500;
}
.grid {
  top: 0;
  position: absolute;
  border-right: 1px dashed $-gray-500;
  height: 100%;
}
.block {
  background: $-primary-500;
  position: absolute;
}
</style>
