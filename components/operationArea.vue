<template>
  <div id="component-frame" class="darken-2 background">
    <v-container class="fill-height">
      <v-row justify="center">
        <v-col cols="4">
          <v-btn @click="init">初期化</v-btn>
        </v-col>
        <v-col cols="4" align-self="center">
          <div class="iconCenter">
            <div v-if="isPlaying">
              <v-btn :disabled="!isReady" icon @click="stop">
                <v-icon size="400%" color="#F96500">mdi-stop</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn :disabled="!isReady" icon @click="play">
                <v-icon size="400%" color="#F96500">mdi-play</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col cols="4" align-self="center">
          <div class="iconRight">
            <v-btn icon @click="config">
              <v-icon size="300%" color="#F96500">mdi-cog</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-navigation-drawer v-model="drawer" temporary absolute>
      <v-list>
        <v-list-item>
          <v-row>
            <v-col>
              BPM
              <v-slider
                v-model="bpm"
                class="align-center"
                :max="120"
                :min="60"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="bpm"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-select
            v-model="selectedTimbre"
            :items="timbre"
            label="音色"
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-select
            v-model="selectedColorThema"
            :items="colorThema"
            label="色のテーマ"
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              リズムの音量
              <v-slider
                v-model="rhythmVolume"
                class="align-center"
                :max="100"
                :min="0"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="rhythmVolume"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              コードの音量
              <v-slider
                v-model="codeVolume"
                class="align-center"
                :max="100"
                :min="0"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="codeVolume"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              メロディの音量
              <v-slider
                v-model="melodyVolume"
                class="align-center"
                :max="100"
                :min="0"
                hide-details
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="melodyVolume"
                    class="mt-0 pt-0"
                    hide-details
                    single-line
                    type="number"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type DataType = {
  // ナビゲーションドロワーの展開用
  drawer: boolean
  // 音色選択用
  timbre: string[]
  selectedTimbre: string
  // 色のテーマ用
  colorThema: string[]
  selectedColorThema: string
  // bpmの選択用
  bpm: number
  // 音のバランス
  rhythmVolume: number
  codeVolume: number
  melodyVolume: number
}

export default Vue.extend({
  data(): DataType {
    return {
      drawer: false,
      timbre: ['エレキギター', 'アコースティックギター', 'ピアノ'],
      selectedTimbre: 'エレキギター',
      colorThema: ['明るい', '暗い'],
      selectedColorThema: '明るい',
      bpm: 90,
      rhythmVolume: 80,
      codeVolume: 80,
      melodyVolume: 80
    }
  },
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
    config() {
      this.drawer = true
    },
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
  background-color: $-gray-900;
}
div.iconCenter {
  text-align: center;
}
div.iconRight {
  text-align: right;
}
</style>
