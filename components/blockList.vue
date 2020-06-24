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
        <v-btn block class="white--text " color="#333333">
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
  // data() {
  //   return {
  //     tab: null,
  //     items: [
  //       {
  //         tab: 'リズム',
  //         group: 'rythm',
  //         list: [
  //           { name: '8ビート', id: 0 },
  //           { name: '16ビート', id: 1 },
  //           { name: '2ビート', id: 2 }
  //         ]
  //       },
  //       {
  //         tab: 'コード',
  //         group: 'chord',
  //         list: [
  //           { name: '王道', id: 0 },
  //           { name: 'カノン', id: 1 },
  //           { name: '小室', id: 2 },
  //           { name: 'Let it be', id: 3 },
  //           { name: '下降転調', id: 4 }
  //         ]
  //       },
  //       {
  //         tab: 'メロディ',
  //         group: 'melody',
  //         list: [
  //           { name: 'メロ1', id: 0 },
  //           { name: 'メロ2', id: 1 },
  //           { name: 'メロ3', id: 2 },
  //           { name: 'メロ4', id: 3 }
  //         ]
  //       }
  //     ],
  //     enabled: true,
  //     dragging: false,
  //     musicType: ['rhythm', 'chord', 'melody'],
  //     rhythm: 'rhythm'
  //   }
  // },
  components: {
    Block
  },
  data() {
    return {
      selection: 0,
      text: 'aaa'
    }
  },
  computed: {
    rhythmBlocks() {
      return this.$accessor.music.rhythmTemplateNames
    }
  }
  // computed: {
  //   rhythmBlocks() {
  //     return this.$accessor.music.rhythm.blockNames
  //   },
  //   chordBlocks() {
  //     return this.$accessor.music.chord.blockNames
  //   },
  //   melodyBlocks() {
  //     return this.$accessor.music.melody.blockNames
  //   },
  //   dragOptions() {
  //     return {
  //       animation: 300,
  //       disabled: false
  //     }
  //   },
  //   blocks() {
  //     const rhythmBlocks = this.rhythmBlocks
  //     const chordBlocks = this.chordBlocks
  //     const melodyBlocks = this.melodyBlocks
  //     return [rhythmBlocks, chordBlocks, melodyBlocks]
  //   }
  // }
  // }
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
