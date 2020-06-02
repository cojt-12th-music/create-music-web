<template>
  <div>
    <v-btn @click="demo">demo</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import parseSFZ, { SfzRegion } from 'sfz-parser'

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
    }
  },
  data(): DataType {
    return {
      sampleDefinition: [],
      samples: {},
      isLoading: false,
      logs: []
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
        .then((res) => res.text())
        .then((sfz) => {
          this.sampleDefinition = parseSFZ(sfz)
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
      const nodes = this.constructGraph(key, delay, duration)
      nodes.forEach((n, i, nodes) =>
        nodes[i + 1] ? n.connect(nodes[i + 1]) : n.connect(this.node)
      )
      ;(nodes[0] as AudioScheduledSourceNode).start(
        this.context.currentTime + delay
      )
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
