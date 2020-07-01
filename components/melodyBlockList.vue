<template>
  <div id="component-frame">
    <v-card class="mx-auto">
      <v-card-title>
        <p>メロディの選択</p>
      </v-card-title>

      <v-chip-group v-model="selection" column>
        <v-card-text
          v-for="(blocks, category, categoryIndex) in melodyBlocks"
          :key="categoryIndex"
        >
          <v-card-text>{{ category }}</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(block, index) in blocks"
            :key="category + index"
            label
            large
          >
            <block-item :block="block" />
          </v-chip>
        </v-card-text>
      </v-chip-group>

      <v-card-actions>
        <v-btn block class="white--text " color="#F96500">
          Add to Score
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BlockItem from '@/components/BlockItem.vue'
import { Block } from '@/types/music'

type BlockGroup = { [category: string]: Block[] }

export default Vue.extend({
  components: {
    BlockItem
  },
  data() {
    return {
      selection: null
    }
  },
  computed: {
    melodyBlocks(): BlockGroup {
      return this.$accessor.music.melodyTemplates.reduce((acc, cur) => {
        if (!acc[cur.category]) {
          acc[cur.category] = []
        }
        acc[cur.category].push(cur)
        return acc
      }, {} as BlockGroup)
    }
  },
  watch: {
    async selection(newIndex: number) {
      if (newIndex === undefined) return
      this.$accessor.player.stopPresetPreview()
      await this.$nextTick()
      this.$accessor.player.playPresetPreview({
        part: 'melody',
        name: 'メロ1'
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.v-card__title {
  background-color: $-gray-900;
  color: $-gray-50;
  p {
    margin: 0;
  }
}
div#component-frame {
  height: 100%;
}
.v-card__text {
  color: $-gray-50;
  padding: 0;
  margin: 5px 5px 5px 10px;
}
.v-item-group {
  background-color: $-gray-700;
}
.v-chip.v-size--large {
  padding: 0;
  height: 64px;
}
.v-card__actions {
  background-color: $-gray-900;
  padding: 10px;
}
.v-chip-group .v-chip--active {
  color: $-gray-300;
}
.theme--light.v-chip--active:hover::before,
.theme--light.v-chip--active::before {
  opacity: 0.2;
}
.v-divider {
  background-color: $-gray-500;
  margin-bottom: 5px;
}
</style>
