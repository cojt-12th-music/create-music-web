<template>
  <div>
    <v-btn @click="demo">demo</v-btn>
    <v-btn @click="demoMelody">demo melody</v-btn>
    <v-btn @click="stop">stop</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SfzRegion } from 'sfz-parser'
import { Sound } from '../types/music'

/**
 * Playerコンポーネント
 * 再生部分を司る一番重要なコンポーネント
 */

/**
 * Playerコンポーネントが保持するデータの型
 */
type DataType = {
  /**
   * この音程の時はこのwavファイルを再生するみたいな対応付を保持
   */
  sampleDefinition: SfzRegion[]
  /**
   * スピーカーに流すための実際の楽器の波形データを保持
   */
  samples: { [key: string]: AudioBuffer }
  /**
   * sfzを読み込み中でtrue
   */
  isLoading: boolean
  /**
   * ログ出力用
   */
  logs: string[]
  /**
   * 再生する音のソースノード
   */
  scheduledSourceNode: AudioScheduledSourceNode[]
}

export default Vue.extend({
  props: {
    sfzPath: {
      required: false,
      default: '',
      type: String
    },
    context: {
      required: true,
      type: Object as Vue.PropType<AudioContext>
    },
    node: {
      required: true,
      type: Object as Vue.PropType<AudioNode>
    },
    notes: {
      required: true,
      type: Array as Vue.PropType<Sound[]>
    },
    bpm: {
      required: true,
      type: Number
    }
  },
  data(): DataType {
    return {
      sampleDefinition: [],
      samples: {},
      isLoading: false,
      logs: [],
      scheduledSourceNode: []
    }
  },
  computed: {
    encodedSfzPath(): string {
      return this.encodePath(this.sfzPath)
    },
    encodedSfzParentPath(): string {
      return this.encodePath(this.parentDir(this.sfzPath))
    }
  },
  watch: {
    /**
     * sfzPathが変化すると呼び出される
     */
    sfzPath() {
      // sfzPathが変更された（楽器が変更された）ら新しいsfzをロード
      this.load()
    }
  },
  mounted() {
    if (this.sfzPath) this.load()
  },
  methods: {
    /**
     * sfzファイルをロードする
     */
    async load() {
      this.isLoading = true

      // sfzファイルを取得
      await fetch(this.encodedSfzPath)
        .then((res) => res.json())
        .then((sfz) => {
          this.sampleDefinition = sfz
        })

      // 楽器の音源データーを取得
      await Promise.all(
        this.sampleDefinition.map((d) =>
          fetch(`${this.encodedSfzParentPath}/${this.encodePath(d.sample)}`)
            .then((res) => res.arrayBuffer()) // arrayBuffer（バイナリデータ）として受け取る
            .then((arr) => this.context.decodeAudioData(arr)) // WebAudioAPIで再生できる形式(AudioBuffer)へ変換
            .then((buf) => {
              this.samples[d.sample] = buf
              /**
               * samplesにはマップのような形で音のデータを格納
               * {
               *  'samples/C4.wav': [音のデータ],
               *  'samples/D4.wav': [音のデータ],
               *  'samples/E4.wav': [音のデータ]
               * }
               */
            })
        )
      )
      this.isLoading = false
    },
    /**
     * 音を鳴らす
     * @param key 鍵盤番号
     * @param delay 再生までの遅延
     */
    playNote(key: number, delay = 0, duration = 0.5) {
      const bpm = this.bpm
      const fixedDelay = (delay * 60) / bpm
      const fixedDuration = (duration * 60) / bpm

      const nodes = this.constructGraph(key, fixedDelay, fixedDuration)
      nodes.forEach((n, i, nodes) =>
        nodes[i + 1] ? n.connect(nodes[i + 1]) : n.connect(this.node)
      )
      ;(nodes[0] as AudioScheduledSourceNode).start(
        this.context.currentTime + fixedDelay
      )
      this.scheduledSourceNode.push(nodes[0] as AudioScheduledSourceNode)
    },
    constructGraph(key: number, delay = 0, duration = 0.5): AudioNode[] {
      // 指定された鍵盤番号の音を鳴らすのに必要な音データを探す
      const target = this.sampleDefinition.find(
        (s) =>
          s.key === key ||
          (s.lokey && s.lokey <= key && s.hikey && key <= s.hikey)
      )
      if (!target) return [] // 対応するものが無ければ何もしない

      const nodes: AudioNode[] = []

      const source = this.context.createBufferSource()
      source.buffer = this.samples[target.sample] // 対応する音データをセット
      /**
       * 再生速度を調整して音階を調整する
       * 例えばレの音はドの音を使って鳴らしてね、という定義だった場合
       * ドの音を((2 ** (1 / 12)) ** 2) 倍速(約1.12倍速)で再生することでレの音を再現する
       * どうして 2^(1/12) が出てくるのかは https://tomari.org/main/java/oto.html を参照
       */
      if (target.pitch_keycenter)
        // pitch_keycenter(基準位置)がセットされている場合
        source.playbackRate.value =
          (2 ** (1 / 12)) ** (key - target.pitch_keycenter)
      else if (target.lokey)
        source.playbackRate.value = (2 ** (1 / 12)) ** (key - target.lokey)

      // ループ対応
      if (target.loop_mode === 'loop_continuous') {
        const samplingFrequency = 44100
        source.loop = true
        source.loopStart =
          target.loop_start === undefined
            ? 0
            : target.loop_start / samplingFrequency
        source.loopEnd =
          target.loop_end === undefined
            ? source.buffer.duration
            : target.loop_end / samplingFrequency
      }

      nodes.push(source)

      // リリース対応
      if (target.ampeg_release) {
        const releaseGain = this.context.createGain()
        releaseGain.gain.linearRampToValueAtTime(
          0,
          this.context.currentTime +
            delay +
            duration +
            Number(target.ampeg_release)
        )
        nodes.push(releaseGain)
      }

      // フィルター
      if (target.fil_type && target.cutoff) {
        const filter = this.context.createBiquadFilter()
        let resonance = 1 / Math.sqrt(2)
        if (target.resonance) resonance = target.resonance

        switch (target.fil_type) {
          case 'lpf_2p': // 2極ローパスフィルター（12dB /オクターブ）
            filter.type = 'lowpass'
            filter.frequency.value = target.cutoff
            filter.Q.value = resonance
            break
          case 'hpf_2p': // 2極ハイパスフィルター（12dB /オクターブ）
            filter.type = 'highpass'
            filter.frequency.value = target.cutoff
            filter.Q.value = resonance
            break
          case 'bpf_2p': // 2極バンドパスフィルター（12dB /オクターブ）
            filter.type = 'bandpass'
            filter.frequency.value = target.cutoff
            filter.Q.value = resonance
            break
          default:
            break
        }

        nodes.push(filter)
      }

      return nodes
    },
    /**
     * デモ再生
     */
    demo() {
      // 和音を下からなめらかに演奏
      this.playNote(48, 0) // すぐ鳴る
      this.playNote(60, 0.1) // 0.1秒後に鳴る
      this.playNote(64, 0.2) // ..
      this.playNote(67, 0.3)
      this.playNote(72, 0.4)
    },
    /**
     * 作ったメロディのデモ再生
     * TODO: 音符が増えても影響が出ないよう並列にする
     */
    demoMelody() {
      this.notes.forEach(({ key, delay, duration }) => {
        this.playNote(key, delay, duration)
      })
    },
    /**
     * 音楽の停止
     */
    stop() {
      this.scheduledSourceNode.forEach((source) => {
        source.stop()
      })
      this.scheduledSourceNode = []
    },
    /**
     * urlに直接指定できない文字列をエンコードするヘルパー関数
     */
    encodePath(path: string) {
      return path
        .split('/')
        .map((p) => encodeURIComponent(p))
        .join('/')
    },
    /**
     * 指定されたファイルの親ディレクトリを返すヘルパー関数
     */
    parentDir(path: string) {
      const tmp = path.split('/')
      return tmp.slice(0, tmp.length - 1).join('/')
    }
  }
})
</script>

<style lang="scss" scoped>
.playground {
  padding: 1rem;
  background: #eee;
}
.playground:focus {
  background: #f98000;
}
.playground:focus::after {
  content: '入力受付中';
}
.logarea {
  height: 150px;
  overflow-y: scroll;
  .log {
    text-align: left;
  }
}
</style>
