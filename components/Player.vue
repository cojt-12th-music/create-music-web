<template>
  <v-container v-show="debugControl">
    <v-row>
      <v-btn>Play</v-btn>
    </v-row>
    <v-row v-if="context">
      <v-col>
        <instrument
          :sfz-path="melodyInstrument"
          :context="context"
          :node="master"
          :notes="melodyNotes"
          :bpm="bpm"
          :is-playing="isPlaying"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'
import { Sound, Block } from '~/types/music'

type DataType = {
  master: AudioNode | null
}
export default Vue.extend({
  components: {
    Instrument
  },
  props: {
    debugControl: {
      required: false,
      type: Boolean
    }
  },
  data(): DataType {
    return {
      master: null
    }
  },
  computed: {
    melodyNotes(): Sound[] {
      return this.flatBlock(this.$accessor.music.melodyBlocks)
    },
    bpm(): number {
      return this.$accessor.music.bpm
    },
    isPlaying(): boolean {
      return this.$accessor.player.isPlaying
    },
    context(): AudioContext | null {
      return this.$accessor.player.context
    },
    instruments(): string[] {
      return this.$accessor.player.instruments
    },
    melodyInstrument(): string {
      return this.$accessor.player.melodyInstrument
    },
    chordInstrument(): string {
      return this.$accessor.player.chordInstrument
    },
    rythmInstrument(): string {
      return this.$accessor.player.rythmInstrument
    }
  },
  watch: {
    context() {
      if (this.context) {
        this.master = this.context.createGain()
        this.master.connect(this.context.destination)
      }
    }
  },
  mounted() {
    fetch('/instruments/instruments.json')
      .then((res) => res.json())
      .then((res) => {
        this.$accessor.player.setInstruments(res)
        this.$accessor.player.setMelodyInstrument(this.instruments[1])
      })
  },
  methods: {
    flatBlock(block: Block[]) {
      let allDelay = 0
      return block
        .map((block) => {
          // 各soundsのdelayに今までのブロックのdurationを足した
          const sounds = block.sounds.map(({ delay, ...e }) => {
            return {
              delay: delay + allDelay,
              ...e
            }
          })
          allDelay += block.duration
          return sounds
        })
        .flat()
    }
  }
})
</script>

<style></style>
