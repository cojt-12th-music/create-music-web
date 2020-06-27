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
          :is-playing="isMelodyPlaying"
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
          :is-playing="isChordPlaying"
          :is-ready.sync="isChordReady"
          :gain-value="gainValue"
        />
        <instrument
          :sfz-path="rhythmInstrument"
          :context="context"
          :node="master"
          :notes="rhythmNotes"
          :bpm="bpm"
          :is-playing="isRhythmPlaying"
          :is-ready.sync="isRhythmReady"
          :gain-value="gainValue"
        />
      </v-col>
    </v-row>
    <v-btn @click="test">test</v-btn>
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
  isRhythmReady: boolean
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
      isRhythmReady: false,
      isLimiter: false,
      isReverb: false
    }
  },
  computed: {
    melodyNotes(): Sound[] {
      // プレビュー用
      if (this.$accessor.player.previewPreset.part === 'melody') {
        const targetTemplate = this.$accessor.music.melodyTemplates.find(
          (t) => t.name === this.$accessor.player.previewPreset.name
        )
        if (targetTemplate) return this.flatBlock([targetTemplate])
        else return []
      }
      return this.flatBlock(this.$accessor.music.melodyBlocks)
    },
    chordNotes(): Sound[] {
      // プレビュー用
      if (this.$accessor.player.previewPreset.part === 'chord') {
        const targetTemplate = this.$accessor.music.chordTemplates.find(
          (t) => t.name === this.$accessor.player.previewPreset.name
        )
        if (targetTemplate) return this.flatBlock([targetTemplate])
        else return []
      }
      return this.flatBlock(this.$accessor.music.chordBlocks)
    },
    rhythmNotes(): Sound[] {
      // プレビュー用
      if (this.$accessor.player.previewPreset.part === 'rhythm') {
        const targetTemplate = this.$accessor.music.rhythmTemplates.find(
          (t) => t.name === this.$accessor.player.previewPreset.name
        )
        if (targetTemplate) return this.flatBlock([targetTemplate])
        else return []
      }
      return this.flatBlock(this.$accessor.music.rhythmBlocks)
    },
    bpm(): number {
      return this.$accessor.music.bpm
    },
    isMelodyPlaying(): Boolean {
      return (
        this.$accessor.player.isPlaying ||
        this.$accessor.player.previewPreset.part === 'melody'
      )
    },
    isChordPlaying(): Boolean {
      return (
        this.$accessor.player.isPlaying ||
        this.$accessor.player.previewPreset.part === 'chord'
      )
    },
    isRhythmPlaying(): Boolean {
      return (
        this.$accessor.player.isPlaying ||
        this.$accessor.player.previewPreset.part === 'rhythm'
      )
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
    rhythmInstrument(): string {
      return this.$accessor.player.instruments[2]
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
    isRhythmReady() {
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
      this.$accessor.player.setIsReady(
        this.isMelodyReady && this.isChordReady && this.isRhythmReady
      )
    },
    async test() {
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

<style></style>
