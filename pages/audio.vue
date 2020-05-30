<template>
  <div>
    <div v-for="s in sfzs" :key="s">{{ s }}</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
type DataType = {
  sfzs: string[]
}

export default Vue.extend({
  data(): DataType {
    return {
      sfzs: []
    }
  },
  mounted() {
    fetch('/sounds/instruments.json')
      .then((res) => res.json())
      .then((res) => {
        this.sfzs = res
      })
  }
})
</script>
