<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init">init</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="context">
      <v-col>SFZファイル</v-col>
      <v-col v-for="s in sfzs" :key="s">
        <instrument :sfz-path="s" :context="context" />
      </v-col>
    </v-row>
    <v-row v-if="context">
      <v-col>音を追加</v-col>
      <v-col>
        <v-btn v-for="key in keys" :key="key" @click="pushSound(key)">{{
          key
        }}</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="melody">
      <p>{{ melody }}</p>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'
import { Sound } from '@/types/music'

type DataType = {
  sfzs: string[]
  context: AudioContext | null
}

export default Vue.extend({
  components: {
    Instrument
  },
  data(): DataType {
    return {
      sfzs: [],
      context: null
    }
  },
  computed: {
    melody(): Sound[] {
      return this.$accessor.music.melodySounds
    },
    keys(): number[] {
      return [48, 60, 64, 67, 72]
    }
  },
  mounted() {
    fetch('/instruments/instruments.json')
      .then((res) => res.json())
      .then((res: string[]) => {
        this.sfzs = res.map((s) => `/${s}`)
      })
  },
  methods: {
    init() {
      this.context = new AudioContext()
    },
    pushSound(key: number) {
      const delay = this.$accessor.music.melodySounds.length * 0.1
      const sound: Sound = { key, delay }
      this.$accessor.music.pushSound({ blockLabel: 'init', sound })
    }
  }
})
</script>
