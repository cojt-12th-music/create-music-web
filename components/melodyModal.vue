<template>
  <div id="component-frame">
    <v-card>
      <!-- 編集画面上部 -->
      <v-card-title class="top-area">
        メロディー編集画面
        <v-btn icon dark class="btn-back" @click="dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- 曲調選択 -->
      <v-card-title class="guideline-area">
        <v-row align="center">
          <v-col class="d-flex" cols="3" sm="1">ガイドライン</v-col>
          <v-col class="d-flex" cols="5" sm="2">
            <select v-model="selected" class="guideline-input">
              <option
                v-for="item in guideLines"
                :key="item.text"
                :value="item.value"
                >{{ item.text }}</option
              >
            </select>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- 編集エリア -->
      <v-card
        id="edit-area"
        class="edit-area"
        @mousedown="touchstart($event)"
        @mousemove="touchmove($event)"
        @mouseup="touchend($event)"
      >
        <div v-for="(key, index) in keys" :key="index" class="scale">
          <div
            v-for="n in 5"
            id="grid"
            :key="n"
            class="grid"
            :style="{
              width: widthPerNote + 2 * borderWidth + 'px',
              height: heightPerKey + 'px'
            }"
          ></div>
          <div
            v-for="sound in sounds"
            id="block"
            :key="sound.id"
            class="block"
            :style="{
              height: heightPerKey + 'px',
              top:
                sound.key * heightPerKey +
                (2 * sound.key + 1) * borderWidth +
                'px',
              left:
                sound.delay * widthPerNote +
                (2 * sound.delay - 1) * borderWidth +
                'px',
              width: sound.duration * widthPerNote + 'px'
            }"
            @click="setId(sound.id)"
          ></div>
        </div>
      </v-card>

      <!-- 再生エリア -->
      <v-card-title class="play-area">
        <div v-if="isPlaying">
          <v-btn icon @click="isPlaying = false">
            <v-icon size="400%" color="#F96500">mdi-stop</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn icon @click="isPlaying = true">
            <v-icon size="400%" color="#F96500">mdi-play</v-icon>
          </v-btn>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlockHash, Sound } from '../types/music'

export default Vue.extend({
  components: {},
  props: {
    blockName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      guideLines: [
        { text: '明るい', value: ['ド#', 'レ#', 'ファ#', 'ソ#', 'ラ#'] },
        { text: '悲しい' },
        { text: 'お洒落' }
      ],
      isClick: false,
      isDurationChanged: false,
      isPlaying: false,
      widthPerNote: 50,
      heightPerKey: 20,
      keys: [...Array(100).keys()].map(() => true),
      borderWidth: 0.5,
      selectedBlockId: 1,
      selectedBlockType: '',
      leftPos: 0
    }
  },
  computed: {
    dragOptions() {
      return {
        // animation: 300,
        disabled: false
      }
    },
    sounds(): Sound[] {
      return this.melodyPresets[this.blockName].sounds
    },
    melodyPresets: {
      get(): BlockHash {
        return this.$accessor.music.blocks.melody
      }
    }
  },
  watch: {
    async isPlaying() {
      if (this.isPlaying) {
        this.$accessor.player.stopPresetPreview()
        await this.$nextTick()
        this.$accessor.player.playPresetPreview({
          part: 'melody',
          name: 'メロ1'
        })
      }
    }
  },
  methods: {
    dialog() {
      this.$emit('dialog', false)
    },
    setId(id: number) {
      this.selectedBlockId = id
      console.log('setid' + this.selectedBlockId)
    },
    touchstart(e) {
      this.isClick = true

      this.selectedBlockType = e.target.id
      this.leftPos = e.clientX - e.offsetX
    },
    touchmove(e) {
      // 押下中だったら
      if (this.isClick) {
        const x = e.clientX

        // duration更新
        if (this.selectedBlockType === 'block') {
          this.isDurationChanged = true
          const updSound: Sound = {
            id: this.selectedBlockId,
            key: this.sounds[0].key,
            delay: this.sounds[0].delay,
            duration: (x - this.leftPos) / this.widthPerNote
          }
          this.$accessor.music.updateSound({
            part: 'melody',
            blockName: this.blockName,
            sound: updSound
          })
        }
      }
    },
    touchend(e) {
      if (this.isClick) {
        // blockがなければ追加する
        if (this.selectedBlockType === 'grid') {
          const x = e.clientX
          const y = e.clientY - e.currentTarget.getBoundingClientRect().top

          const addSound: Sound = {
            key: Math.floor(
              (y - this.borderWidth) /
                (this.heightPerKey + 2 * this.borderWidth)
            ),
            delay:
              Math.floor(
                ((x + this.borderWidth) /
                  (this.widthPerNote + 2 * this.borderWidth)) *
                  2
              ) / 2,
            duration: 1
          }
          this.$accessor.music.addSound({
            part: 'melody',
            blockName: this.blockName,
            sound: addSound
          })
        }
        // blockがあれば削除する
        else if (
          this.selectedBlockType === 'block' &&
          !this.isDurationChanged
        ) {
          this.$accessor.music.deleteSound({
            part: 'melody',
            blockName: this.blockName,
            soundId: 1
          })
          // idの更新
          for (let i = 0; i < this.sounds.length; i++) {
            const updSound: Sound = {
              id: this.sounds[i].id - 1,
              key: this.sounds[i].key,
              delay: this.sounds[i].delay,
              duration: this.sounds[i].duration
            }
            this.$accessor.music.updateSound({
              part: 'melody',
              blockName: this.blockName,
              sound: updSound
            })
          }
        }

        this.isClick = false
        this.isDurationChanged = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}

.top-area {
  font-size: 80%;
  background-color: $-gray-900;
}

.guideline-area {
  font-size: 80%;
  background-color: $-gray-800;
}

.edit-area {
  background-color: $-gray-700;
  height: 100%;
  width: 100%;
  position: relative;
}

.play-area {
  background-color: $-gray-900;
  position: fixed;
  bottom: 0px;
  height: 81px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-card__title {
  color: $-gray-50;
}

.guideline-input {
  padding: 0 0 0 10px;
  border-radius: 4px;
  border: 1px solid $-primary-500;
  width: 100%;
}
.d-flex {
  padding: 0;
}

.grid {
  border-right: 0.5px dashed $-gray-500;
}

.block {
  position: absolute;
  background-color: $-primary-500;
}
.scale {
  display: flex;
  border-top: 0.5px solid $-gray-500;
}

.btn-back {
  margin: 0 0 0 auto;
}
</style>
