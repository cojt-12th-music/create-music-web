<template>
  <div id="component-frame" class="darken-2 background">
    <v-container>
      <v-row justify="center">
        <v-col cols="4"></v-col>
        <v-col cols="4" align-self="center">
          <div class="iconCenter">
            <v-icon size="400%" color="#c4c4c4" @click="play">mdi-play</v-icon>
          </div>
        </v-col>
        <v-col cols="4" align-self="center">
          <div class="iconRight">
            <v-icon size="300%" color="#c4c4c4" @click="config">mdi-cog</v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
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
div.iconCenter {
  text-align: center;
}
div.iconRight {
  text-align: right;
}
</style>
