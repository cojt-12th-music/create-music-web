<template>
  <div id="component-frame">
    <v-card>
      <!-- 編集画面上部 -->
      <v-card-title class="top-area rounded-0">
        <h2>{{ blockName }}</h2>
        <v-btn icon dark @click="dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- 編集エリア -->
      <v-card class="edit-area rounded-0">
        <rhythmEditor
          v-for="i in key_inst"
          :key="i.drum_key"
          :drum-key="i.drum_key"
          :inst="i.inst"
          :block-name="blockName"
          @edit-block="editBlock"
        />
      </v-card>

      <!-- 再生エリア -->
      <v-card-title class="play-area">
        <div v-if="isPlaying">
          <v-btn icon dark @click="stopPreview()">
            <v-icon size="350%" color="#F96500">mdi-stop</v-icon>
          </v-btn>
        </div>
        <div v-else>
          <v-btn icon dark @click="playPreview()">
            <v-icon size="350%" color="#F96500">mdi-play</v-icon>
          </v-btn>
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '../types/music'
import rhythmEditor from '@/components/rhythmEditor.vue'

export default Vue.extend({
  components: {
    rhythmEditor
  },
  props: {
    blockName: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      key_inst: [
        { drum_key: 48, inst: 'Bass Drum' },
        { drum_key: 49, inst: 'Side Stick' },
        { drum_key: 50, inst: 'Side Stick 2' },
        { drum_key: 51, inst: 'Snare Drum' },
        { drum_key: 52, inst: 'Snare Drum 2' },
        { drum_key: 53, inst: 'Snare Drum Dry' },
        { drum_key: 54, inst: 'Low Tom' },
        { drum_key: 55, inst: 'Mid Tom' },
        { drum_key: 56, inst: 'High Tom' },
        { drum_key: 57, inst: 'Closed Hi-Hat' },
        { drum_key: 58, inst: 'Open Hi-Hat' },
        { drum_key: 59, inst: 'Semi Open Hi-Hat' },
        { drum_key: 60, inst: 'Long Open Hi-Hat' },
        { drum_key: 61, inst: 'Cymbal 16i Crash' },
        { drum_key: 62, inst: 'Cymbal 16i Ride' },
        { drum_key: 63, inst: 'Cymbal 16i Cup' },
        { drum_key: 64, inst: 'Cymbal 20i Crash' },
        { drum_key: 65, inst: 'Cymbal 20i Ride' },
        { drum_key: 66, inst: 'Cymbal 20i Cup' },
        { drum_key: 67, inst: 'Double Low Tom' },
        { drum_key: 68, inst: 'Double Mid Tom' },
        { drum_key: 69, inst: 'Double High Tom' }
      ],
      isEdited: false,
      isPlaying: false
    }
  },
  computed: {
    // ドラムの種類（キー）を配列にして返す
    instrument_keys(): Array<number> {
      console.log('blockName:' + this.blockName)
      const keyList: Array<number> = []
      this.soundBlock.sounds.forEach((elm) => {
        if (!keyList.includes(elm.key)) {
          keyList.push(elm.key)
        }
      })
      keyList.sort(function(a, b) {
        return a < b ? -1 : 1
      })
      return keyList
    },
    soundBlock(): Block {
      return this.$accessor.music.blocks.rhythm[this.blockName]
    }
  },
  methods: {
    dialog() {
      this.$emit('dialog', this.isEdited)
    },
    editBlock() {
      this.isEdited = true
    },
    playPreview() {
      this.$accessor.player.playPresetPreview({
        part: 'rhythm',
        name: this.blockName
      })
      this.isPlaying = true
    },
    stopPreview() {
      this.$accessor.player.stopPresetPreview()
      this.isPlaying = false
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}

.v-select {
  color: white;
}

.top-area {
  font-size: 80%;
  background-color: $-gray-900;
  display: flex;
  justify-content: space-between;
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

.edit-area {
  background-color: $-gray-800;
  height: 100vh;
  overflow: scroll;

  // for IE, Edge
  -ms-overflow-style: none;
  // for Firefox
  scrollbar-width: none;
  // for Chrome, Safari
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
