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
    <Player v-if="context" ref="player" :context="context" :sfzs="sfzs" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Player from '@/components/Player.vue'

type DataType = {
  // 再生中かどうか（ボタンの切り替えに使用）
  isPlaying: boolean
  context: AudioContext | null
  sfzs: string[]
}

export default Vue.extend({
  components: {
    Player
  },
  data(): DataType {
    return {
      isPlaying: false,
      context: null,
      sfzs: []
    }
  },
  mounted() {
    fetch('/instruments/instruments.json')
      .then((res) => res.json())
      .then((res) => (this.sfzs = res))
  },
  methods: {
    // 音楽を再生
    async play() {
      this.context = new AudioContext()
      this.isPlaying = true
      await this.$nextTick()
      ;(this.$refs.player as any).play()
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
