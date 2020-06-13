<template>
  <div id="component-frame" class="darken-2 background">
    <v-container>
      <v-row justify="center">
        <v-col cols="4">
          <v-btn @click="init">初期化</v-btn>
        </v-col>
        <v-col cols="4" align-self="center">
          <div class="iconCenter">
            <div v-if="isPlaying">
              <v-btn :disabled="!isReady" icon @click="stop">
                <v-icon size="400%" color="#c4c4c4">mdi-stop</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn :disabled="!isReady" icon @click="play">
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

export default Vue.extend({
  computed: {
    isPlaying() {
      return this.$accessor.player.isPlaying
    },
    isReady() {
      return this.$accessor.player.isReady
    }
  },
  methods: {
    // 音楽を再生
    play() {
      this.$accessor.player.play()
    },
    // 音楽再生をストップ
    stop() {
      this.$accessor.player.stop()
    },
    // 設定変更画面(ポップアップ)を表示
    config() {},
    init() {
      this.$accessor.player.setContext(new AudioContext())
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
