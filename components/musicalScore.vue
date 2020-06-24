<template>
  <div id="component-frame">
    <ul id="rhythm">
      <li class="column-title">リズム</li>
      <li>
        <draggable
          v-model="rhythmBlocks"
          class="score-draggable"
          group="rhythm"
          v-bind="dragOptions"
        >
          <div v-for="(block, index) in rhythmBlocks" :key="index">
            <block :text="block" />
          </div>
        </draggable>
      </li>
      <li>
        <v-icon large="true" color="#F96500" @click.stop="rythmDialog = true"
          >mdi-plus-circle-outline</v-icon
        >
        <v-dialog v-model="rythmDialog">
          <RhythmBlockList />
        </v-dialog>
      </li>
    </ul>
    <ul id="chord">
      <li class="column-title">コード</li>
      <li>
        <draggable
          v-model="chordBlocks"
          class="score-draggable"
          group="chord"
          v-bind="dragOptions"
        >
          <div v-for="(block, index) in chordBlocks" :key="index">
            <block :text="block" />
          </div>
        </draggable>
      </li>
      <li>
        <v-icon large="true" color="#F96500" @click.stop="chrodDialog = true"
          >mdi-plus-circle-outline</v-icon
        >
        <v-dialog v-model="chrodDialog">
          <ChordBlockList />
        </v-dialog>
      </li>
    </ul>
    <ul id="melody">
      <li class="column-title">メロディ</li>
      <li>
        <draggable
          v-model="melodyBlocks"
          class="score-draggable"
          group="melody"
          v-bind="dragOptions"
        >
          <div
            v-for="(block, index) in melodyBlocks"
            :key="index"
            class="block-wrapper"
          >
            <block :text="block" />
          </div>
        </draggable>
      </li>
      <li>
        <v-icon large="true" color="#F96500" @click.stop="melodyDialog = true"
          >mdi-plus-circle-outline</v-icon
        >
        <v-dialog v-model="melodyDialog">
          <MelodyBlockList />
        </v-dialog>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import RhythmBlockList from '@/components/rhythmBlockList.vue'
import ChordBlockList from '@/components/chordBlockList.vue'
import MelodyBlockList from '@/components/melodyBlockList.vue'

import block from '~/components/block.vue'
export default Vue.extend({
  components: {
    draggable,
    RhythmBlockList,
    ChordBlockList,
    MelodyBlockList,
    block
  },
  data() {
    return {
      rythmDialog: false,
      chrodDialog: false,
      melodyDialog: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
    },
    rhythmBlocks: {
      get(): string[] {
        return this.$accessor.music.rhythm.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'rhythm', blockNames })
      }
    },
    chordBlocks: {
      get(): string[] {
        return this.$accessor.music.chord.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'chord', blockNames })
      }
    },
    melodyBlocks: {
      get(): string[] {
        return this.$accessor.music.melody.blockNames
      },
      set(blockNames: string[]) {
        this.$accessor.music.setBlockNames({ part: 'melody', blockNames })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/style/draggable.scss';

div#component-frame {
  height: 100%;
}

ul {
  padding: 0;
  list-style: none;
  display: flex;
  border: 1px solid $-gray-500;
  padding: 1rem;

  div {
    display: flex;
    margin-left: 1rem;
  }
}

@include pc {
}
</style>
