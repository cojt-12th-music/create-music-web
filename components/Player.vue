<template>
  <v-container>
    <v-row>
      <v-btn @click="play">Play</v-btn>
    </v-row>
    <v-row v-if="context">
      <v-col v-for="s in sfzs" :key="s">
        <instrument
          :ref="`inst-${s}`"
          :sfz-path="s"
          :context="context"
          :node="master"
          :notes="melodyNotes"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'
import { Sound } from '~/types/music'

type InstRef = {
  demoMelody: () => void
}

type DataType = {
  master: AudioNode
}
export default Vue.extend({
  components: {
    Instrument
  },
  props: {
    context: {
      required: true,
      type: Object as Vue.PropType<AudioContext>
    },
    sfzs: {
      required: true,
      type: Array as Vue.PropType<string[]>
    }
  },
  data(): DataType {
    return {
      master: this.context.createGain()
    }
  },
  computed: {
    melodyNotes(): Sound[] {
      let allDelay = 0
      return this.$accessor.music.melodyBlocks
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
    instRefs(): InstRef[] {
      return this.sfzs.map((s) => this.$refs[`inst-${s}`]).flat()
    }
  },
  mounted() {
    this.master.connect(this.context.destination)
  },
  methods: {
    play() {
      this.instRefs.forEach((i) => {
        i.demoMelody()
      })
    }
  }
})
</script>

<style></style>
