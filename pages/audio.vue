<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="init">init</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="context">
      <player :context="context" :sfzs="sfzs" />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import Player from '~/components/Player.vue'

type DataType = {
  sfzs: string[]
  context: AudioContext | null
}

export default Vue.extend({
  components: {
    Player
  },
  data(): DataType {
    return {
      sfzs: [],
      context: null
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
    }
  }
})
</script>
