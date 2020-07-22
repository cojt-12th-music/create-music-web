<template>
  <div id="melody-modal">
    <v-app-bar extension-height="64px" dark>
      <v-toolbar-title>{{ blockName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('dialog', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-select
          v-model="selectedGuideLineName"
          class="mt-4"
          :items="Object.keys(guidelines)"
          label="ガイドライン"
          solo
        ></v-select>
      </template>
    </v-app-bar>
    <div class="edit-area">
      <div
        ref="editInner"
        class="inner"
        @mousedown.prevent.stop="mouseDown"
        @mousemove.prevent.stop="mouseMove"
        @mouseup.prevent.stop="mouseUp"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div
          v-for="(a, i) in keys"
          :key="`row-${i}`"
          class="row"
          :style="rowStyle()"
          :class="{ guide: keys[i] }"
        />
        <div
          v-for="gridIndex in blockDuration"
          :key="`grid-${gridIndex}`"
          class="grid"
          :style="gridStyle(gridIndex - 1)"
        />
        <div
          v-for="sound in sounds"
          :key="sound.id"
          class="block"
          :style="blockStyle(sound)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Sound, Block } from '../types/music'

type Rect = { top: number; left: number; height: number; width: number }
type DataType = {
  heightPerBlock: number
  widthPerNote: number
  quantize: number
  selectedSoundID: number | null
  xBorderWidth: number
  isMouseDown: boolean
  mouseDeleteFlag: boolean
  startPos: { x: number; y: number }
  startOffsetInBlock: { x: number; y: number }
  editMode: 'border' | 'move' | null
  guidelines: { [key: string]: number[] }
  selectedGuideLineName: string
}

export default Vue.extend({
  props: {
    blockName: {
      required: true,
      type: String
    }
  },
  data(): DataType {
    return {
      heightPerBlock: 25,
      widthPerNote: 60,
      quantize: 0.5,
      selectedSoundID: null,
      xBorderWidth: 10,
      isMouseDown: false,
      mouseDeleteFlag: false,
      startPos: { x: 0, y: 0 },
      startOffsetInBlock: { x: 0, y: 0 },
      editMode: null,
      guidelines: {
        明るい: [0, 2, 4, 5, 7, 9, 11],
        暗い: [0, 2, 3, 5, 7, 9, 11]
      },
      selectedGuideLineName: '明るい'
    }
  },
  computed: {
    sounds(): Sound[] {
      return this.soundBlock.sounds
    },
    soundBlock(): Block {
      return this.$accessor.music.blocks.melody[this.blockName]
    },
    blockDuration(): number {
      return Math.ceil(this.soundBlock.duration)
    },
    selectedSound(): Sound | undefined {
      return this.sounds.find((s) => s.id === this.selectedSoundID)
    },
    keys(): boolean[] {
      const guideline = this.guidelines[this.selectedGuideLineName]
      return [...Array(this.maxkey - this.minkey).keys()].map((k) =>
        guideline.some((g) => (this.maxkey - k) % 12 === g)
      )
    },
    maxkey() {
      return (
        this.$accessor.player.instruments.find(
          (i) => i.path === this.$accessor.music.melodyInstrument
        )?.hiKey || 100
      )
    },
    minkey() {
      return (
        this.$accessor.player.instruments.find(
          (i) => i.path === this.$accessor.music.melodyInstrument
        )?.loKey || 0
      )
    }
  },
  methods: {
    calcBlock(s: Sound): Rect {
      return {
        top: this.heightPerBlock * (this.maxkey - s.key),
        left: this.widthPerNote * s.delay,
        width: this.widthPerNote * s.duration,
        height: this.heightPerBlock
      }
    },
    posToSound(x: number, y: number): { key: number; delay: number } {
      return {
        key: this.maxkey - Math.floor(y / this.heightPerBlock),
        delay: Math.round(x / this.widthPerNote / this.quantize) * this.quantize
      }
    },
    rowStyle() {
      return {
        left: '0',
        height: `${this.heightPerBlock}px`,
        width: `${this.widthPerNote * this.blockDuration}px`
      }
    },
    blockStyle(sound: Sound) {
      const rect = this.calcBlock(sound)
      return {
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        height: `${rect.height}px`,
        width: `${rect.width}px`
      }
    },
    gridStyle(delay: number) {
      return {
        left: `${this.widthPerNote * delay}px`,
        width: `${this.widthPerNote}px`
      }
    },
    findBlockFromCoordinate(
      x: number,
      y: number
    ): { sound: Sound; type: 'border' | 'move' } | undefined {
      const target = this.sounds.find((s) => {
        const rect = this.calcBlock(s)
        return (
          rect.left <= x &&
          x <= rect.left + rect.width &&
          rect.top <= y &&
          y <= rect.top + rect.height
        )
      })
      if (!target) return undefined

      const rect = this.calcBlock(target)
      if (
        rect.left + rect.width - this.xBorderWidth <= x &&
        x <= rect.left + rect.width &&
        rect.top <= y &&
        y <= rect.top + rect.height
      )
        return { sound: target, type: 'border' }
      else if (
        rect.left <= x &&
        x <= rect.left + rect.width &&
        rect.top <= y &&
        y <= rect.top + rect.height
      )
        return { sound: target, type: 'move' }
    },
    calcPosInEditInner(
      clientX: number,
      clientY: number
    ): { x: number; y: number } {
      if (!this.$refs.editInner) throw new Error('ref参照がありません')
      const inner = this.$refs.editInner as HTMLElement
      const pos = {
        x: clientX - inner.getBoundingClientRect().left,
        y: clientY - inner.getBoundingClientRect().top
      }
      return pos
    },
    mouseDown(e: MouseEvent) {
      if ('ontouchstart' in window) return
      const pos = this.calcPosInEditInner(e.clientX, e.clientY)
      this.startOffsetInBlock = { x: e.offsetX, y: e.offsetX }
      this.startPos = { x: pos.x, y: pos.y }
      const target = this.findBlockFromCoordinate(pos.x, pos.y)
      if (target) {
        this.mouseDeleteFlag = true
        this.selectedSoundID = target.sound.id || null
        this.editMode = target.type
      } else {
        this.mouseDeleteFlag = false
        this.selectedSoundID = this.addSoundFromPos(pos.x, pos.y)
        this.editMode = 'border'
      }
      this.isMouseDown = true
    },
    mouseMove(e: MouseEvent) {
      if ('ontouchmove' in window) return
      if (this.isMouseDown) {
        const pos = this.calcPosInEditInner(e.clientX, e.clientY)

        if (this.editMode === 'move') {
          this.moveSoundFromPos(pos.x, pos.y)
        } else if (this.editMode === 'border') {
          this.changeSoundDurationFromPos(pos.x, pos.y)
        }
      }
    },
    mouseUp(e: MouseEvent) {
      if ('ontouchend' in window) return
      const pos = this.calcPosInEditInner(e.clientX, e.clientY)

      if (
        this.startPos.x === pos.x &&
        this.startPos.y === pos.y &&
        this.selectedSoundID &&
        this.mouseDeleteFlag
      ) {
        this.deleteSound(this.selectedSoundID)
      }
      this.selectedSoundID = null
      this.isMouseDown = false
    },
    touchStart(e: TouchEvent) {
      const pos = this.calcPosInEditInner(
        e.touches[0].clientX,
        e.touches[0].clientY
      )
      this.startPos = pos
      const target = this.findBlockFromCoordinate(pos.x, pos.y)
      if (target) {
        const rect = (e.target as HTMLElement).getBoundingClientRect()
        this.startOffsetInBlock = {
          x: e.touches[0].pageX - rect.left,
          y: e.touches[0].pageY - rect.top
        }
        this.selectedSoundID = target.sound.id || null
        this.editMode = target.type
      } else {
        this.selectedSoundID = null
      }
    },
    touchMove(e: TouchEvent) {
      if (!this.selectedSoundID) return
      e.preventDefault()
      const pos = this.calcPosInEditInner(
        e.touches[0].clientX,
        e.touches[0].clientY
      )
      if (this.editMode === 'move') this.moveSoundFromPos(pos.x, pos.y)
      else if (this.editMode === 'border')
        this.changeSoundDurationFromPos(pos.x, pos.y)
    },
    touchEnd(e: TouchEvent) {
      const pos = this.calcPosInEditInner(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      )
      if (this.startPos.x === pos.x && this.startPos.y === pos.y) {
        if (!this.$accessor.player.editEnabled) return

        if (!this.selectedSoundID) {
          this.addSoundFromPos(pos.x, pos.y)
        } else {
          this.deleteSound(this.selectedSoundID)
        }
      }
      this.selectedSoundID = null
    },
    addSoundFromPos(x: number, y: number): number {
      const newPos = this.posToSound(x, y)
      const newID =
        this.sounds.length > 0
          ? this.sounds[this.sounds.length - 1].id!! + 1
          : 1
      this.$accessor.music.addSound({
        part: 'melody',
        blockName: this.soundBlock.name,
        sound: {
          id: newID,
          key: newPos.key,
          delay: newPos.delay,
          duration: this.quantize
        }
      })
      this.$accessor.player.playUnitSoundPreview({
        part: 'melody',
        key: newPos.key
      })
      return newID
    },
    moveSoundFromPos(x: number, y: number) {
      if (!this.selectedSound) return
      const newPos = this.posToSound(x - this.startOffsetInBlock.x, y)
      this.$accessor.music.updateSound({
        part: 'melody',
        blockName: this.soundBlock.name,
        sound: {
          id: this.selectedSound.id,
          duration: this.selectedSound.duration,
          ...newPos
        }
      })
      this.$accessor.player.playUnitSoundPreview({
        part: 'melody',
        key: newPos.key
      })
    },
    changeSoundDurationFromPos(x: number, y: number) {
      if (!this.selectedSound) return
      const newPos = this.posToSound(x, y)
      this.$accessor.music.updateSound({
        part: 'melody',
        blockName: this.soundBlock.name,
        sound: {
          id: this.selectedSound.id,
          duration: Math.max(
            this.quantize,
            newPos.delay - this.selectedSound.delay
          ),
          delay: this.selectedSound.delay,
          key: this.selectedSound.key
        }
      })
    },
    deleteSound(soundId: number) {
      this.$accessor.music.deleteSound({
        part: 'melody',
        blockName: this.blockName,
        soundId
      })
    }
  }
})
</script>

<style scoped lang="scss">
#melody-modal {
  width: 100%;
  height: 100%;
  background: $-gray-900;
  display: flex;
  flex-direction: column;
}
.edit-area {
  overflow: auto;
  flex-grow: 1;
  .inner {
    position: relative;
    min-width: 100%;
  }
}
.row {
  width: 100%;
  border-bottom: 1px solid $-gray-500;
  margin: 0;
  &.guide {
    background: $-gray-700;
  }
}
.grid {
  top: 0;
  position: absolute;
  border-right: 1px dashed $-gray-500;
  height: 100%;
}
.block {
  background: $-primary-500;
  position: absolute;
  border-radius: 4px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.2);
  &::after {
    content: '';
    background: $-gray-700;
    position: absolute;
    right: 5px;
    top: 10%;
    height: 80%;
    width: 4px;
    border-radius: 2px;
  }
}
</style>
