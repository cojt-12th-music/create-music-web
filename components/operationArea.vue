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
              <v-btn :disabled="isNotReady" icon @click="stop">
                <v-icon size="400%" color="#F96500">mdi-stop</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn :disabled="isNotReady" icon @click="play">
                <v-icon size="400%" color="#F96500">mdi-play</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col align-self="center">
          <div class="iconRight">
            <a
              id="shareTag"
              href="https://twitter.com/intent/tweet?url=https://us-central1-create-music-web.cloudfunctions.net/returnDynamicOGP
 &text=音楽を作ってみました♪"
              target="blank_"
              style="text-decoration: none;"
            >
              <v-btn icon @click="share">
                <v-icon size="300%" color="#F96500">
                  mdi-share-variant
                </v-icon>
              </v-btn>
            </a>
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
              :items="rhythmInstruments"
              label="リズムの楽器"
              dark
              @change="selectRhythmInst"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedChordInst"
              :items="chordInstruments"
              label="コードの楽器"
              dark
              @change="selectChordInst"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedMelodyInst"
              :items="melodyInstruments"
              label="メロディの楽器"
              dark
              @change="selectMelodyInst"
            ></v-select>
          </v-list-item>
          <v-list-item>
            <v-select
              v-model="selectedColorTheme"
              :items="colorTheme"
              label="色のテーマ"
              dark
              @change="selectColorTheme"
            ></v-select>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isNotReady" persistent>
      <v-card color="#0A0A0A">
        <v-card-title class="justify-center">
          <div class="textColoring">音楽を作ってみましょう♪</div>
        </v-card-title>
        <div v-if="isLoading" style="text-align: center;">
          <v-progress-circular
            indeterminate
            color="white"
            class="ma-2"
          ></v-progress-circular>
        </div>
        <div v-else>
          <div class="iconCenter pa-2">
            <v-btn @click="init">始める！</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { firebaseAuth } from '@/plugins/firebase'

type DataType = {
  // 初めのinitモーダル
  isLoading: boolean
  // ナビゲーションドロワーの展開用
  configDialog: boolean
  // リズムの楽器選択用
  rhythmInstruments: string[]
  selectedRhythmInst: string
  // コードの楽器選択用
  chordInstruments: string[]
  selectedChordInst: string
  // メロディの楽器選択用
  melodyInstruments: string[]
  selectedMelodyInst: string
  // 色のテーマ用
  colorTheme: string[]
  selectedColorTheme: string
}

export default Vue.extend({
  data(): DataType {
    return {
      isLoading: false,
      configDialog: false,
      rhythmInstruments: ['ドラム', 'パーカッション'],
      selectedRhythmInst: 'ドラム',
      chordInstruments: [
        'エレキ',
        'ギター',
        'ピアノ',
        'オルガン',
        'クラリネット',
        'シンセベース',
        '木琴',
        'ハープ'
      ],
      selectedChordInst: 'ギター',
      melodyInstruments: [
        'エレキ',
        'ギター',
        'ピアノ',
        'オルガン',
        'クラリネット',
        'シンセベース',
        '木琴',
        'ハープ'
      ],
      selectedMelodyInst: 'ピアノ',
      colorTheme: ['ダークモード', 'ライトモード'],
      selectedColorTheme: 'ダークモード'
    }
  },
  computed: {
    isPlaying() {
      return this.$accessor.player.isPlaying
    },
    isNotReady() {
      return !this.$accessor.player.isReady
    },
    rhythmVolume: {
      get(): number {
        return this.$accessor.music.rhythm.gain * 80
      },
      set(volume: number) {
        this.$accessor.music.setGain({ part: 'rhythm', gain: volume / 80 })
      }
    },
    chordVolume: {
      get(): number {
        return this.$accessor.music.chord.gain * 80
      },
      set(volume: number) {
        this.$accessor.music.setGain({ part: 'chord', gain: volume / 80 })
      }
    },
    melodyVolume: {
      get(): number {
        return this.$accessor.music.melody.gain * 80
      },
      set(volume: number) {
        this.$accessor.music.setGain({ part: 'melody', gain: volume / 80 })
      }
    },
    bpm: {
      get(): number {
        return this.$accessor.music.bpm
      },
      set(bpm: number) {
        this.$accessor.music.setBpm(bpm)
      }
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
    async share() {
      // 楽譜がFirestoreに保存されており, userIdが自身と一致する場合はupdate
      const userId = firebaseAuth().currentUser?.uid || ''
      if (this.$accessor.music.id && userId === this.$accessor.music.userId) {
        await this.$accessor.music.updateScore()
      } else {
        this.$accessor.music.setUserId(userId)
        await this.$accessor.music.addScore()
      }
      const scoreUrl = `${location.origin}/ogp/?id=${this.$accessor.music.id}`
      const text = '音楽を作ってみました♪'
      location.href = `https://twitter.com/intent/tweet?url=${scoreUrl}&text=${text}`
    },
    // 初めの初期化（コンテキスト生成）
    // 各パートの楽器を初期化
    init() {
      this.isLoading = true
      // @ts-ignore
      const Ctx = (window.webkitAudioContext || window.AudioContext) as {
        new (contextOptions?: AudioContextOptions | undefined): AudioContext
      }
      this.$accessor.player.setContext(new Ctx())

      // 各パートの楽器を初期化
      this.$accessor.music.setInstrument({
        part: 'rhythm',
        inst:
          'instruments/ColomboADK-FreePats-SFZ-20200530/ColomboADK-FreePats-20200530.jsfz'
      })
      this.$accessor.music.setInstrument({
        part: 'chord',
        inst:
          'instruments/SpanishClassicalGuitar-SFZ-20190618/SpanishClassicalGuitar-20190618.jsfz'
      })
      this.$accessor.music.setInstrument({
        part: 'melody',
        inst:
          'instruments/UprightPianoKW-SFZ-20190703/UprightPianoKW-20190703.jsfz'
      })
    },
    // 楽器名から音ファイルのパスを返す
    nameToPath(instrumentName: string) {
      return new Promise<string>((resolve) => {
        fetch('/instruments/instruments.json')
          .then((res) => res.json())
          .then((res) => {
            const instPath = res.find(
              (item: any) => item.name === instrumentName
            ).path
            resolve(instPath)
          })
      })
    },
    // リズムの楽器選択
    async selectRhythmInst() {
      const path: string = await this.nameToPath(this.selectedRhythmInst)

      this.$accessor.music.setInstrument({ part: 'rhythm', inst: path })
    },
    // コードの楽器選択
    async selectChordInst() {
      const path: string = await this.nameToPath(this.selectedChordInst)

      this.$accessor.music.setInstrument({ part: 'chord', inst: path })
    },
    // メロディの楽器選択
    async selectMelodyInst() {
      const path: string = await this.nameToPath(this.selectedMelodyInst)

      this.$accessor.music.setInstrument({ part: 'melody', inst: path })
    },
    // カラーモード選択
    selectColorTheme() {}
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
