<template>
  <div id="component-frame">
    <v-container>
      <ul id="rhythm">
        <li class="column-title">
          <div>
            <v-icon :large="true" color="#C2C2C2">fas fa-drum</v-icon>
            <div><p>リズム</p></div>
          </div>
        </li>
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
        <li class="open-blocklist">
          <v-icon :large="true" color="#F96500" @click.stop="rythmDialog = true"
            >mdi-plus-circle-outline</v-icon
          >
          <v-dialog v-model="rythmDialog">
            <RhythmBlockList />
          </v-dialog>
        </li>
      </ul>
      <ul id="chord">
        <li class="column-title">
          <div>
            <v-icon :large="true" color="#C2C2C2">fas fa-guitar</v-icon>
            <div><p>コード</p></div>
          </div>
        </li>
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
        <li class="open-blocklist">
          <v-icon :large="true" color="#F96500" @click.stop="chrodDialog = true"
            >mdi-plus-circle-outline</v-icon
          >
          <v-dialog v-model="chrodDialog">
            <ChordBlockList />
          </v-dialog>
        </li>
      </ul>
      <ul id="melody">
        <li class="column-title">
          <div>
            <v-icon :large="true" color="#C2C2C2">music_note</v-icon>
            <div><p>メロディ</p></div>
          </div>
        </li>
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
              <block :text="block" @click.native="melodyEditModal = true" />
            </div>
          </draggable>
        </li>
        <li class="open-blocklist">
          <v-icon
            :large="true"
            color="#F96500"
            @click.stop="melodyDialog = true"
            >mdi-plus-circle-outline</v-icon
          >
          <v-dialog v-model="melodyDialog">
            <MelodyBlockList />
          </v-dialog>
        </li>
      </ul>
    </v-container>
    <!-- ブロックが押されたら編集画面表示 -->
    <v-dialog v-model="melodyEditModal" fullscreen hide-overlay>
      <melody-modal @dialog="melodyEditModal = $event" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import draggable from 'vuedraggable'
import RhythmBlockList from '@/components/rhythmBlockList.vue'
import ChordBlockList from '@/components/chordBlockList.vue'
import MelodyBlockList from '@/components/melodyBlockList.vue'
import MelodyModal from '@/components/melodyModal.vue'
import block from '~/components/block.vue'
export default Vue.extend({
  components: {
    draggable,
    RhythmBlockList,
    ChordBlockList,
    MelodyBlockList,
    block,
    MelodyModal
  },
  data() {
    return {
      rythmDialog: false,
      chrodDialog: false,
      melodyDialog: false,
      melodyEditModal: false
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
div#component-frame {
  height: 100%;
}

li.column-title {
  display: block;
  div {
    margin: auto;
    display: block;
    width: 4rem;
    color: $-gray-200;
    i {
      display: block;
      width: 3rem;
      margin: auto;
    }
  }
}
div.score-draggable {
  margin: 0;
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

li.open-blocklist {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-0.5rem);
}

@include pc {
}
</style>
