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
  samples: {
    [key: string]: { data: AudioBuffer; offset: number }
  }
  /**
   * ログ出力用
   */
  logs: string[]
  /**
   * 再生する音のソースノード
   */
  scheduledSourceNode: AudioScheduledSourceNode[]
  /**
   * 再生する音の全てのソースノード
   */
  allSourceNode: AudioNode[][]
  /**
   * 音量調節用のgainNode
   */
  gainNode: GainNode
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
    },
    isPlaying: {
      required: true,
      type: Boolean
    },
    isReady: {
      required: true,
      type: Boolean
    },
    gainValue: {
      required: false,
      default: 1.0,
      type: Number
    },
    isLimiter: {
      required: true,
      type: Boolean
    }
  },
  data(): DataType {
    return {
      sampleDefinition: [],
      samples: {},
      logs: [],
      scheduledSourceNode: [],
      allSourceNode: [],
      gainNode: this.context.createGain()
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
    },
    isPlaying() {
      if (!this.isPlaying) {
        this.stop()
      } else {
        this.demoMelody()
      }
    },
    gainValue() {
      this.gainNode.gain.value = this.gainValue
    }
  },
  mounted() {
    if (this.sfzPath) this.load()
    this.gainNode.gain.value = this.gainValue
    this.gainNode.connect(this.node)
  },
  methods: {
    /**
     * sfzファイルをロードする
     */
    async load() {
      this.$emit('update:isLoading', false)

      // sfzファイルを取得
      await fetch(this.encodedSfzPath)
        .then((res) => res.json())
        .then((sfz) => {
          this.sampleDefinition = sfz.sfz
          return Promise.all(
            Object.keys(sfz.samples).map((key) =>
              this.context
                .decodeAudioData(
                  this.base64ToArrayBuffer(sfz.samples[key].data)
                )
                .then((buf) => {
                  const offsetInSamples = buf
                    .getChannelData(0)
                    .findIndex((f) => f !== 0)

                  this.samples[key] = {
                    data: buf,
                    offset: offsetInSamples / 44100 - sfz.samples[key].offset
                  }
                })
            )
          )
        })
        .then(() => {
          this.$emit('update:isReady', true)
        })
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
        nodes[i + 1] ? n.connect(nodes[i + 1]) : n.connect(this.gainNode)
      )
      ;(nodes[0] as AudioScheduledSourceNode).start(
        this.context.currentTime + fixedDelay
      )
      this.scheduledSourceNode.push(nodes[0] as AudioScheduledSourceNode)
      this.allSourceNode.push(nodes)
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
      source.buffer = this.samples[target.sample].data // 対応する音データをセット
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
            : target.loop_start / samplingFrequency +
              this.samples[target.sample].offset
        source.loopEnd =
          target.loop_end === undefined
            ? source.buffer.duration
            : target.loop_end / samplingFrequency +
              this.samples[target.sample].offset
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

      // フィルター対応
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

      // リミッター対応
      if (this.isLimiter) {
        const limiter = this.context.createDynamicsCompressor()
        limiter.threshold.value = -70 // 閾値 [-100,0] default=-24dB
        limiter.ratio.value = 20 // 圧縮比率 [1,20] default=12
        nodes.push(limiter)
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
      this.allSourceNode.forEach((nodes) => {
        nodes.forEach((node) => {
          node.disconnect()
        })
      })
      this.scheduledSourceNode = []
      this.allSourceNode = []
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
    },
    base64ToArrayBuffer(base64: string): ArrayBuffer {
      const Base64Binary = {
        _keyStr:
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        /* will return a  Uint8Array type */
        decodeArrayBuffer(input: string) {
          const bytes = (input.length / 4) * 3
          const ab = new ArrayBuffer(bytes)
          this.decode(input, ab)

          return ab
        },

        removePaddingChars(input: string) {
          const lkey = this._keyStr.indexOf(input.charAt(input.length - 1))
          // eslint-disable-next-line eqeqeq
          if (lkey == 64) {
            return input.substring(0, input.length - 1)
          }
          return input
        },

        decode(input: string, arrayBuffer: ArrayBuffer) {
          input = this.removePaddingChars(input)
          input = this.removePaddingChars(input)
          // @ts-ignore
          const bytes = parseInt((input.length / 4) * 3, 10)

          let uarray
          let chr1, chr2, chr3
          let enc1, enc2, enc3, enc4
          let i = 0
          let j = 0

          if (arrayBuffer) uarray = new Uint8Array(arrayBuffer)
          else uarray = new Uint8Array(bytes)

          input = input.replace(/[^A-Za-z0-9+/=]/g, '')

          for (i = 0; i < bytes; i += 3) {
            enc1 = this._keyStr.indexOf(input.charAt(j++))
            enc2 = this._keyStr.indexOf(input.charAt(j++))
            enc3 = this._keyStr.indexOf(input.charAt(j++))
            enc4 = this._keyStr.indexOf(input.charAt(j++))

            chr1 = (enc1 << 2) | (enc2 >> 4)
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            chr3 = ((enc3 & 3) << 6) | enc4

            uarray[i] = chr1
            // eslint-disable-next-line eqeqeq
            if (enc3 != 64) uarray[i + 1] = chr2
            // eslint-disable-next-line eqeqeq
            if (enc4 != 64) uarray[i + 2] = chr3
          }

          return uarray
        }
      }
      return Base64Binary.decodeArrayBuffer(base64)
    }
  }
})
</script>
