<template>
  <div id="melody-modal">
    <v-app-bar extension-height="64px" dark>
      <v-toolbar-title>メロディ編集</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('dialog', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <template v-slot:extension>
        <v-select
          class="mt-4"
          :items="guidelines"
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
      >
        <div
          v-for="(a, i) in keys"
          :key="`row-${i}`"
          class="row"
          :style="rowStyle()"
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
  startPos: { x: number; y: number }
  startOffsetInBlock: { x: number; y: number }
  editMode: 'border' | 'move' | null
  keys: boolean[]
  guidelines: string[]
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
      xBorderWidth: 5,
      isMouseDown: false,
      startPos: { x: 0, y: 0 },
      startOffsetInBlock: { x: 0, y: 0 },
      editMode: null,
      keys: [...Array(100).keys()].map((_) => true),
      guidelines: ['明るい', '暗い']
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
      return this.soundBlock.duration
    },
    selectedSound(): Sound | undefined {
      return this.sounds.find((s) => s.id === this.selectedSoundID)
    }
  },
  methods: {
    calcBlock(s: Sound): Rect {
      return {
        top: this.heightPerBlock * s.key,
        left: this.widthPerNote * s.delay,
        width: this.widthPerNote * s.duration,
        height: this.heightPerBlock
      }
    },
    posToSound(x: number, y: number): { key: number; delay: number } {
      return {
        key: Math.floor(y / this.heightPerBlock),
        delay: Math.round(x / this.widthPerNote / this.quantize) * this.quantize
      }
    },
    rowStyle() {
      return {
        height: `${this.heightPerBlock}px`
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
      const pos = this.calcPosInEditInner(e.clientX, e.clientY)
      this.startOffsetInBlock = { x: e.offsetX, y: e.offsetX }
      this.handleStart(pos.x, pos.y)
      this.isMouseDown = true
    },
    mouseMove(e: MouseEvent) {
      if (this.isMouseDown) {
        const pos = this.calcPosInEditInner(e.clientX, e.clientY)
        this.handleMove(pos.x, pos.y)
      }
    },
    mouseUp(e: MouseEvent) {
      const pos = this.calcPosInEditInner(e.clientX, e.clientY)
      this.handleEnd(pos.x, pos.y)
      this.isMouseDown = false
    },
    handleStart(x: number, y: number) {
      this.startPos = { x, y }
      const target = this.findBlockFromCoordinate(x, y)
      if (target) {
        this.selectedSoundID = target.sound.id || null
        this.editMode = target.type
      } else {
        const newPos = this.posToSound(x, y)
        const newID = this.sounds.length + 1
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
        this.selectedSoundID = newID
        this.editMode = 'move'
      }
    },
    handleMove(x: number, y: number) {
      if (!this.selectedSound) return
      if (this.editMode === 'move') {
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
      } else if (this.editMode === 'border') {
        const newPos = this.posToSound(x, y)
        this.$accessor.music.updateSound({
          part: 'melody',
          blockName: this.soundBlock.name,
          sound: {
            id: this.selectedSound.id,
            duration: newPos.delay - this.selectedSound.delay,
            delay: this.selectedSound.delay,
            key: this.selectedSound.key
          }
        })
      }
    },
    handleEnd(_: number, __: number) {
      this.selectedSoundID = null
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
  width: 100%;
  flex-grow: 1;
  .inner {
    position: relative;
  }
}
.row {
  width: 100%;
  border-bottom: 1px solid $-gray-500;
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
  &::after {
    content: '';
    background: $-gray-700;
    position: absolute;
    right: 5px;
    top: 10%;
    height: 80%;
    width: 4px;
  }
}
</style>
