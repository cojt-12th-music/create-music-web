<template>
  <div id="component-frame" class="darken-2 background">
    <v-container>
      <v-row justify="center">
        <v-col cols="4"></v-col>
        <v-col cols="4" align-self="center">
          <div class="iconCenter">
            <div v-if="isPlaying">
              <v-btn icon @click="stop">
                <v-icon size="400%" color="#c4c4c4">mdi-stop</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn icon @click="play">
                <v-icon size="400%" color="#c4c4c4">mdi-play</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="4" align-self="center">
          <div class="iconRight">
            <v-btn icon @click="config">
              <v-icon size="300%" color="#c4c4c4">mdi-cog</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type DataType = {
  // 再生中かどうか（ボタンの切り替えに使用）
  isPlaying: boolean
}

export default Vue.extend({
  data(): DataType {
    return {
      isPlaying: false
    }
  },
  methods: {
    // 音楽を再生
    play() {
      this.isPlaying = true
    },
    // 音楽再生をストップ
    stop() {
      this.isPlaying = false
    },
    // 設定変更画面(ポップアップ)を表示
    config() {}
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
