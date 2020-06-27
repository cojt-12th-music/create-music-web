<template>
  <v-container v-show="debugControl">
    <v-row v-if="context">
      <v-col>
        <instrument
          :sfz-path="melodyInstrument"
          :context="context"
          :node="master"
          :notes="melodyNotes"
          :bpm="bpm"
          :is-playing="isPlaying"
          :is-ready.sync="isMelodyReady"
          :gain-value="gainValue"
          :reverb-path="null"
        />
        <instrument
          :sfz-path="chordInstrument"
          :context="context"
          :node="master"
          :notes="chordNotes"
          :bpm="bpm"
          :is-playing="isPlaying"
          :is-ready.sync="isChordReady"
          :gain-value="gainValue"
        />
        <instrument
          :sfz-path="rythmInstrument"
          :context="context"
          :node="master"
          :notes="rythmNotes"
          :bpm="bpm"
          :is-playing="isPlaying"
          :is-ready.sync="isRythmReady"
          :gain-value="gainValue"
        />
      </v-col>
    </v-row>
    <v-slider
      v-model="gainValue"
      ticks
      step="0.1"
      max="3"
      lable="Volume"
      :value="gainValue"
    ></v-slider>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'
import { Sound, Block } from '~/types/music'

type DataType = {
  master: AudioNode | null
  isMelodyReady: boolean
  isChordReady: boolean
  isRythmReady: boolean
  isLimiter: boolean
  isReverb: boolean
}
export default Vue.extend({
  components: {
    Instrument
  },
  props: {
    debugControl: {
      required: false,
      type: Boolean
    },
    gainValue: {
      required: false,
      type: Number,
      default: 1.0
    }
  },
  data(): DataType {
    return {
      master: null,
      isMelodyReady: false,
      isChordReady: false,
      isRythmReady: false,
      isLimiter: false,
      isReverb: false
    }
  },
  computed: {
    melodyNotes(): Sound[] {
      if (this.$accessor.player.previewPreset.part === 'melody')
        return this.$accessor.music.chord
      return this.flatBlock(this.$accessor.music.melodyBlocks)
    },
    chordNotes(): Sound[] {
      return this.flatBlock(this.$accessor.music.chordBlocks)
    },
    rythmNotes(): Sound[] {
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
      return this.$accessor.player.instruments[1]
    },
    chordInstrument(): string {
      return this.$accessor.player.instruments[2]
    },
    rythmInstrument(): string {
      return this.$accessor.player.instruments[2]
    },
    reverbPath(): string {
      return '/reverbs/x06y06Base64'
    }
  },
  watch: {
    context() {
      if (this.context) {
        this.master = this.context.createGain()

        // リミッター対応
        const limiter = this.context.createDynamicsCompressor()
        limiter.ratio.value = 20 // 圧縮比率 [1,20] default=12
        this.master.connect(limiter)
        limiter.connect(this.context.destination)
      }
    },
    isMelodyReady() {
      this.updateReadyState()
    },
    isChordReady() {
      this.updateReadyState()
    },
    isRythmReady() {
      this.updateReadyState()
    }
  },
  mounted() {
    fetch('/instruments/instruments.json')
      .then((res) => res.json())
      .then((res) => {
        this.$accessor.player.setInstruments(res)
      })
    fetch('/reverbs/reverbs.json')
      .then((res) => res.json())
      .then((res) => {
        this.$accessor.player.setReverbs(res)
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
    },
    updateReadyState() {
      this.$accessor.player.setIsReady(this.isMelodyReady)
    }
  }
})
</script>

<style></style>
