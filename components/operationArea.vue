<template>
  <div id="component-frame" class="darken-2 background">
    <!-- <div class="tmp1">
      <v-row justify="center">
        <v-icon size="400%" color="#c4c4c4" @click="play">mdi-play</v-icon>
      </v-row>
    </div>
    <div class="tmp2">
      <v-icon size="300%" color="#c4c4c4" @click="config">mdi-cog</v-icon>
    </div> -->
    <v-row justify="center">
      <v-icon size="400%" color="#c4c4c4" @click="play">mdi-play</v-icon>
    </v-row>
    <v-icon size="300%" color="#c4c4c4" @click="config">mdi-cog</v-icon>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    // 音楽を再生
    play() {
      // console.log('音楽再生')
    },
    // 設定変更画面(ポップアップ)を表示
    config() {
      // console.log('設定変更')
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
  display: flex;
  align-items: center;
}
div.background {
  background-color: #424242;
}
// div.tyuou{
//   //justify-content: center;
//   text-align: center;
// }
// div.tmp1{
//   position: absolute;
//   right: 50%;
// }
// div.tmp2{
//   position: absolute;
//   right: 100%;
// }
</style>
