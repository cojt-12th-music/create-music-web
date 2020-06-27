<template>
  <div id="component-frame" class="darken-2 background">
    <v-container>
      <v-row justify="center">
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
                <div class="textColoring">BPM (60 ~ 180)</div>
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
            <v-row>
              <v-col>
                <div class="textColoring">リズムの音量 (0 ~ 100)</div>
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
                <div class="textColoring">コードの音量 (0 ~ 100)</div>
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
          <v-list-item>
            <v-select
              v-model="selectedRhythmInst"
              :items="rhythmInstruments[0]"
              label="リズムの楽器"
              dark
              @change="selectRhythmInst"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedChordInst"
              :items="chordInstruments[0]"
              label="コードの楽器"
              dark
              @change="selectChordInst"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedMelodyInst"
              :items="melodyInstruments[0]"
              label="メロディの楽器"
              dark
              @change="selectMelodyInst"
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
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog v-model="initialized" persistent>
      <v-card color="#0A0A0A">
        <v-card-title class="justify-center">
          <div class="textColoring">音楽を作ってみましょう♪</div>
        </v-card-title>
        <div class="iconCenter pa-2">
          <v-btn @click="init">始める！</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

type DataType = {
  // 初めのinitモーダル
  initialized: boolean
  // ナビゲーションドロワーの展開用
  configDialog: boolean
  // リズムの楽器選択用
  rhythmInstruments: string[][]
  selectedRhythmInst: string
  // コードの楽器選択用
  chordInstruments: string[][]
  selectedChordInst: string
  // メロディの楽器選択用
  melodyInstruments: string[][]
  selectedMelodyInst: string
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
      initialized: true,
      configDialog: false,
      rhythmInstruments: [
        ['ドラム1', 'ドラム2', 'ドラム3'],
        ['dram1path', 'drum2path', 'drum3path']
      ],
      selectedRhythmInst: 'ドラム1',
      chordInstruments: [
        ['ベース1', 'ベース2', 'ベース3'],
        ['base1path', 'base2path', 'base3path']
      ],
      selectedChordInst: 'ベース1',
      melodyInstruments: [
        ['クラシックギター', 'エレキギター', 'ピアノ'],
        [
          'instruments/SpanishClassicalGuitar-SFZ-20190618/SpanishClassicalGuitar-20190618.jsfz',
          'instruments/FSFT-EGuitarDistorted-SFZ-20200321/FSFT-EGuitarDistorted-20200321.jsfz',
          'instruments/UprightPianoKW-SFZ-20190703/UprightPianoKW-20190703.jsfz'
        ]
      ],
      selectedMelodyInst: 'クラシックギター',
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
    // シェアボタンの動作
    share() {
      alert('仮')
    },
    // 初めの初期化（コンテキスト生成）
    init() {
      this.initialized = false
      this.$accessor.player.setContext(new AudioContext())
    },
    // リズムの楽器選択
    selectRhythmInst() {
      let inst = ''

      for (let i = 0; i < this.rhythmInstruments[0].length; i++) {
        if (this.rhythmInstruments[0][i] === this.selectedRhythmInst) {
          inst = this.rhythmInstruments[1][i]
        }
      }

      alert(inst)
      this.$accessor.music.setRhythmInstrument(inst)
    },
    // コードの楽器選択
    selectChordInst() {
      let inst = ''

      for (let i = 0; i < this.chordInstruments[0].length; i++) {
        if (this.chordInstruments[0][i] === this.selectedChordInst) {
          inst = this.chordInstruments[1][i]
        }
      }

      this.$accessor.music.setChordInstrument(inst)
    },
    // メロディの楽器選択
    selectMelodyInst() {
      let inst = ''

      for (let i = 0; i < this.melodyInstruments[0].length; i++) {
        if (this.melodyInstruments[0][i] === this.selectedMelodyInst) {
          inst = this.melodyInstruments[1][i]
        }
      }

      this.$accessor.music.setMelodyInstrument(inst)
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
    },
    upload() {
      this.$accessor.music.addScore()
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
