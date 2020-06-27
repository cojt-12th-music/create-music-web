<template>
  <div id="component-frame">
    <v-card class="mx-auto">
      <v-card-title>
        <p>リズムの選択</p>
      </v-card-title>

      <v-chip-group v-model="selection" column>
        <v-card-text>
          <v-card-text>王道</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(name, index) in rhythmBlocks"
            :key="index"
            label
            large
          >
            <block :text="name" />
          </v-chip>

          <v-card-text>邪道</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(name, index) in rhythmBlocks"
            :key="index"
            label
            large
          >
            <block :text="name" />
          </v-chip>

          <v-card-text>元気いっぱい</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(name, index) in rhythmBlocks"
            :key="index"
            label
            large
          >
            <block :text="name" />
          </v-chip>
        </v-card-text>
      </v-chip-group>

      <v-card-actions>
        <v-btn block class="white--text" color="#F96500">
          Add to Score
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Block from '@/components/block.vue'
export default Vue.extend({
  components: {
    Block
  },
  data() {
    return {
      selection: 0
    }
  },
  computed: {
    rhythmBlocks() {
      return this.$accessor.music.rhythmTemplateNames
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
