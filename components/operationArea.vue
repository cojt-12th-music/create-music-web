<template>
  <div id="component-frame" class="darken-2 background">
    <v-container>
      <v-row justify="center">
        <v-col>
          <v-btn @click="init">初期化</v-btn>
        </v-col>
        <v-col>
          <v-btn icon @click="config">
            <v-icon size="300%" color="#F96500">mdi-menu</v-icon>
          </v-btn>
        </v-col>
        <v-col align-self="center">
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
        <v-col align-self="center">
          <div class="iconRight">
            <v-btn icon @click="share">
              <v-icon size="300%" color="#F96500">mdi-share-variant</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="configDialog" max-width="80%">
      <v-card color="#0A0A0A">
        <v-card-title class="justify-center">
          <div class="textColoring" style="text-align: center;">
            設定
          </div>
        </v-card-title>

        <v-list color="#333333">
          <v-list-item>
            <v-row>
              <v-col>
                <div class="textColoring">BPM</div>
                <v-slider
                  v-model="bpm"
                  class="align-center"
                  :max="180"
                  :min="60"
                  hide-details
                  dark
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="bpm"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      dark
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
              dark
              @change="selectTimbre"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedColorThema"
              :items="colorThema"
              label="色のテーマ"
              dark
              @change="selectColorThema"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-row>
              <v-col>
                <div class="textColoring">リズムの音量</div>
                <v-slider
                  v-model="rhythmVolume"
                  class="align-center"
                  :max="100"
                  :min="0"
                  hide-details
                  dark
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="rhythmVolume"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      dark
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-list-item>
          <v-list-item>
            <v-row>
              <v-col>
                <div class="textColoring">コードの音量</div>
                <v-slider
                  v-model="chordVolume"
                  class="align-center"
                  :max="100"
                  :min="0"
                  hide-details
                  dark
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="chordVolume"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      dark
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-list-item>
          <v-list-item>
            <v-row>
              <v-col>
                <div class="textColoring">メロディの音量</div>
                <v-slider
                  v-model="melodyVolume"
                  class="align-center"
                  :max="100"
                  :min="0"
                  hide-details
                  dark
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="melodyVolume"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      dark
                    ></v-text-field>
                  </template>
                </v-slider>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <!-- <v-card-actions>
          <v-btn @click="configDialog = false">
            閉じる
          </v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type DataType = {
  // ナビゲーションドロワーの展開用
  configDialog: boolean
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
  chordVolume: number
  melodyVolume: number
}

export default Vue.extend({
  data(): DataType {
    return {
      configDialog: false,
      timbre: ['クラシックギター', 'エレキギター', 'ピアノ'],
      selectedTimbre: 'クラシックギター',
      colorThema: ['ダークモード', 'ライトモード'],
      selectedColorThema: 'ダークモード',
      bpm: 100,
      rhythmVolume: 80,
      chordVolume: 80,
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
  watch: {
    // BPMの値が変更されたとき
    bpm() {
      this.bpmChanged()
    },
    // リズムの音量値が変更されたとき
    rhythmVolume() {
      this.rhythmVolumeChanged()
    },
    // コードの音量値が変更されたとき
    chordVolume() {
      this.chordVolumeChanged()
    },
    // メロディの音量値が変更されたとき
    melodyVolume() {
      this.melodhyVolumeChanged()
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
      this.configDialog = true
    },
    share() {
      alert('仮')
    },
    init() {
      this.$accessor.player.setContext(new AudioContext())
    },
    // 音色選択
    selectTimbre() {
      // 現在はメロディのみ変更可能
      // storeの引数はstring[],[1]はメロディ，[2]はコードとリズム(player.vue参照)
      let timbres = ['']

      switch (this.selectedTimbre) {
        case 'クラシックギター':
          timbres = [
            '',
            'instruments/SpanishClassicalGuitar-SFZ-20190618/SpanishClassicalGuitar-20190618.jsfz',
            ''
          ]
          break
        case 'エレキギター':
          timbres = [
            '',
            'instruments/FSFT-EGuitarDistorted-SFZ-20200321/FSFT-EGuitarDistorted-20200321.jsfz',
            ''
          ]
          break
        case 'ピアノ':
          timbres = [
            '',
            'instruments/UprightPianoKW-SFZ-20190703/UprightPianoKW-20190703.jsfz',
            ''
          ]
          break
      }

      this.$accessor.player.setInstruments(timbres)
    },
    // カラーモード選択
    selectColorThema() {},
    // BPM変更時
    bpmChanged() {
      this.$accessor.music.setBpm(this.bpm)
    },
    // リズムの音量変更時
    rhythmVolumeChanged() {
      this.$accessor.music.setRhythmGain(this.rhythmVolume / 80)
    },
    // コードの音量変更時
    chordVolumeChanged() {
      this.$accessor.music.setChordGain(this.chordVolume / 80)
    },
    // メロディの音量変更時
    melodhyVolumeChanged() {
      this.$accessor.music.setMelodyGain(this.melodyVolume / 80)
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
div.textColoring {
  color: #f0f0f0;
}
</style>
