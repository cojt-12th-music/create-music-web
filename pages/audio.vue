<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init">init</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>SFZファイル</v-col>
      <player debug-control />
    </v-row>
    <v-row>
      <v-col>音を追加</v-col>
      <v-col>
        <v-btn v-for="key in keys" :key="key" @click="pushSound(key)">{{
          key
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="melodyBlocks">
      <p>{{ melodyBlocks }}</p>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Player from '~/components/Player.vue'
import { Sound, Block } from '@/types/music'

export default Vue.extend({
  components: {
    Player
  },
  computed: {
    melodyBlocks(): Block[] {
      return this.$accessor.music.melodyBlocks
    },
    keys(): number[] {
      return [48, 60, 64, 67, 72]
    }
  },
  methods: {
    init() {
      this.$accessor.player.setContext(new AudioContext())
    },
    pushSound(key: number, blockName = 'init') {
      const delay =
        this.$accessor.music.blocks.melody[blockName].sounds.length * 0.1
      const sound: Sound = { key, delay, duration: 1 }
      this.$accessor.music.addSound({ part: 'melody', blockName, sound })
    }
  }
})
</script>
