<template>
  <v-container>
    <v-row v-if="context">
      <v-col v-for="s in sfzs" :key="s">
        <instrument :sfz-path="s" :context="context" :node="master" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Instrument from '~/components/Instrument.vue'
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
  mounted() {
    this.master.connect(this.context.destination)
  }
})
</script>

<style></style>
