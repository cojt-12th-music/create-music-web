<template>
  <div id="component-frame">
    <v-card class="mx-auto">
      <v-card-title>
        <h2>コードの選択</h2>
      </v-card-title>

      <v-chip-group v-model="selection" column>
        <v-card-text>
          <v-card-text>王道</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(block, index) in rhythmBlocks"
            :key="index"
            label
            large
            class="block-wrapper"
          >
            <block-item :block="block" />
          </v-chip>

          <v-card-text>邪道</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(block, index) in rhythmBlocks"
            :key="index"
            label
            large
            class="block-wrapper"
          >
            <block-item :block="block" />
          </v-chip>

          <v-card-text>元気いっぱい</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(block, index) in rhythmBlocks"
            :key="index"
            label
            large
            class="block-wrapper"
          >
            <block-item :block="block" />
          </v-chip>
        </v-card-text>
      </v-chip-group>

      <v-card-actions>
        <v-btn block class="white--text " color="#333333">
          Add to Score
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BlockItem from '@/components/BlockItem.vue'
import { Block, ScorePart } from '@/types/music'

type DataType = {
  currentTab: number
  tabs: { name: string; part: ScorePart }[]
  enabled: boolean
  dragging: boolean
}

export default Vue.extend({
  components: {
    BlockItem
  },
  data() {
    return {
      selection: 0,
      text: 'aaa'
    }
  },
  computed: {
    rhythmBlocks(): Block[] {
      return this.$accessor.music.rhythmTemplates
    },
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.v-card__title {
  background-color: #0a0a0a;
  color: #f0f0f0;
}
div#component-frame {
  height: 100%;
}
.v-card__text {
  color: #f0f0f0;
}
.v-item-group {
  background-color: #333333;
}
.v-chip.v-size--large {
  padding: 0;
  height: 70px;
}
.v-card__actions {
  background-color: #0a0a0a;
}
</style>
