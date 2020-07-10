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
          :is-mute="isMelodyMuted"
          :gain-value="gainValue"
          :reverb-path="null"
          :unit-sound-preview="melodyUnitSoundKey"
        />
        <instrument
          :sfz-path="chordInstrument"
          :context="context"
          :node="master"
          :notes="chordNotes"
          :bpm="bpm"
          :is-playing="isChordPlaying"
          :is-ready.sync="isChordReady"
          :is-mute="isChordMuted"
          :gain-value="gainValue"
          :unit-sound-preview="chordUnitSoundKey"
        />
        <instrument
          :sfz-path="rhythmInstrument"
          :context="context"
          :node="master"
          :notes="rhythmNotes"
          :bpm="bpm"
          :is-playing="isRhythmPlaying"
          :is-ready.sync="isRhythmReady"
          :is-mute="isRhythmMuted"
          :gain-value="gainValue"
          :unit-sound-preview="rhythmUnitSoundKey"
        />
      </v-col>
    </v-row>
    <v-btn @click="test">test</v-btn>
    <v-btn @click="testUnit">testUnit</v-btn>
    <v-select v-model="unitKey" :items="keys"> </v-select>
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
  melodyUnitSoundKey: number
  chordUnitSoundKey: number
  rhythmUnitSoundKey: number
  unitKey: number // デバッグ用
  keys: number[] // デバッグ用
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
      isReverb: false,
      melodyUnitSoundKey: 0,
      chordUnitSoundKey: 0,
      rhythmUnitSoundKey: 0,
      unitKey: 0,
      keys: [48, 60, 64, 67, 72]
    }
  },
  computed: {
    unitSoundKey(): number {
      return this.$accessor.player.previewUnitSound.key
    },
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
    isMelodyMuted(): Boolean {
      return this.$accessor.player.isMute.melody
    },
    isChordMuted(): Boolean {
      return this.$accessor.player.isMute.chord
    },
    isRhythmMuted(): Boolean {
      return this.$accessor.player.isMute.rhythm
    },
    context(): AudioContext | null {
      return this.$accessor.player.context
    },
    melodyInstrument(): string {
      return this.$accessor.music.melodyInstrument
    },
    chordInstrument(): string {
      return this.$accessor.music.chordInstrument
    },
    rhythmInstrument(): string {
      return this.$accessor.music.rhythmInstrument
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
    },
    unitSoundKey() {
      if (this.$accessor.player.previewUnitSound.part === 'melody') {
        this.melodyUnitSoundKey = this.unitSoundKey
      } else if (this.$accessor.player.previewUnitSound.part === 'chord') {
        this.chordUnitSoundKey = this.unitSoundKey
      } else if (this.$accessor.player.previewUnitSound.part === 'rhythm') {
        this.rhythmUnitSoundKey = this.unitSoundKey
      }
    }
  },
  mounted() {
    fetch('/instruments/instruments.json')
      .then((res) => res.json())
      .then((res) => {
        this.$accessor.player.setInstruments(res)
        this.$accessor.music.setMelodyInstrument(
          this.$accessor.player.instruments[1].path
        )
        this.$accessor.music.setChordInstrument(
          this.$accessor.player.instruments[2].path
        )
        this.$accessor.music.setRhythmInstrument(
          this.$accessor.player.instruments[0].path
        )
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
    },
    testUnit() {
      this.$accessor.player.playUnitSoundPreview({
        part: 'melody',
        key: this.unitKey
      })
    }
  }
})
</script>

<style></style>
