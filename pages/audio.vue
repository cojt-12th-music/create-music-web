<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init">init</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="context">
      <v-col v-for="s in sfzs" :key="s">
        <instrument :sfz-path="s" :context="context" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'

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
  mounted() {
    fetch('/sounds/instruments.json')
      .then((res) => res.json())
      .then((res) => {
        this.sfzs = res
      })
  },
  methods: {
    init() {
      this.context = new AudioContext()
    }
  }
})
</script>
