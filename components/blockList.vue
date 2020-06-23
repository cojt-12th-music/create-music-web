<template>
  <div id="component-frame">
    <v-card class="mx-auto" max-width="400">
      <v-card-title class="headline grey lighten-2">
        <h2 class="display-1">コードの選択</h2>
      </v-card-title>

      <v-chip-group
        v-model="selection"
        active-class="deep-purple--text text--accent-4"
        column
      >
        <v-card-text>
          <v-card-text>王道</v-card-text>
          <v-divider></v-divider>
          <v-chip>王道1</v-chip>
          <v-chip>王道2</v-chip>
          <v-chip>王道3</v-chip>
          <v-chip>王道4</v-chip>

          <v-card-text>邪道</v-card-text>
          <v-divider></v-divider>
          <v-chip>邪道1</v-chip>
          <v-chip>邪道2</v-chip>
          <v-chip>邪道3</v-chip>
          <v-chip>邪道4</v-chip>

          <v-card-text>元気いっぱい</v-card-text>
          <v-divider></v-divider>
          <v-chip>元気いっぱい1</v-chip>
          <v-chip>元気いっぱい2</v-chip>
          <v-chip>元気いっぱい3</v-chip>
          <v-chip>元気いっぱい4</v-chip>
        </v-card-text>
      </v-chip-group>

      <v-card-actions>
        <v-btn block class="white--text" color="deep-purple accent-4">
          Add to Score
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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

  data() {
    return {
      selection: 0
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
  // },
  // methods: {
  //   dragEnd(event) {
  //     console.log(event)
  //     console.log(event.from)
  //     console.log(event.to)
  //   },
  // }
})
</script>
