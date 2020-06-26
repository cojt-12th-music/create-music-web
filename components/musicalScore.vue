<template>
  <div id="component-frame">
    <v-container>
      <div class="score-container">
        <div id="rhythm" class="UL">
          <div class="column-title">
            <div class="title-container">
              <v-icon :large="true" color="#C2C2C2">fas fa-drum</v-icon>
              <div>リズム</div>
            </div>
          </div>
          <div class="GUIDE" :style="{ width: 5 * maxDuration + 5 + 'rem' }">
            <div v-for="i in maxDuration" :key="i" class="guide"></div>
          </div>

          <div class="HOGE">
            <draggable
              v-model="rhythmBlocks"
              class="score-draggable"
              group="rhythm"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in rhythmBlocks"
                :key="index"
                class="block-item-wrapper"
              >
                <block-item :block="block" />
              </div>
            </draggable>
            <div class="button-wrapper">
              <v-icon
                :large="true"
                color="#F96500"
                @click.stop="rythmDialog = true"
              >
                mdi-plus-circle-outline
              </v-icon>
            </div>
          </div>
        </div>
        <div id="chord" class="UL">
          <div class="column-title">
            <div class="title-container">
              <v-icon :large="true" color="#C2C2C2">fas fa-guitar</v-icon>
              <div>コード</div>
            </div>
          </div>
          <div class="GUIDE" :style="{ width: 5 * maxDuration + 5 + 'rem' }">
            <div v-for="i in maxDuration" :key="i" class="guide"></div>
          </div>
          <div class="HOGE">
            <draggable
              v-model="chordBlocks"
              class="score-draggable"
              group="chord"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in chordBlocks"
                :key="index"
                class="block-item-wrapper"
              >
                <block-item :block="block" />
              </div>
            </draggable>
            <div class="button-wrapper">
              <v-icon
                :large="true"
                color="#F96500"
                @click.stop="chrodDialog = true"
                >mdi-plus-circle-outline</v-icon
              >
            </div>
          </div>
        </div>
        <div id="melody" class="UL">
          <div class="column-title">
            <div class="title-container">
              <v-icon :large="true" color="#C2C2C2">music_note</v-icon>
              <div>メロディ</div>
            </div>
          </div>
          <div class="GUIDE" :style="{ width: 5 * maxDuration + 5 + 'rem' }">
            <div v-for="i in maxDuration" :key="i" class="guide"></div>
          </div>
          <div class="HOGE">
            <draggable
              v-model="melodyBlocks"
              class="score-draggable"
              group="melody"
              v-bind="dragOptions"
            >
              <div
                v-for="(block, index) in melodyBlocks"
                :key="index"
                class="block-item-wrapper"
              >
                <block-item :block="block" />
              </div>
            </draggable>
            <div class="button-wrapper">
              <v-icon
                :large="true"
                color="#F96500"
                @click.stop="melodyDialog = true"
                >mdi-plus-circle-outline</v-icon
              >
            </div>
          </div>
        </div>
        <li class="open-blocklist">
          <v-icon :large="true" color="#F96500" @click.stop="rythmDialog = true"
            >mdi-plus-circle-outline</v-icon
          >
          <v-dialog v-model="rythmDialog" max-width="800">
            <rhythm-block-list />
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
              <block-item :block="block" />
            </div>
          </draggable>
        </li>
        <li class="open-blocklist">
          <v-icon :large="true" color="#F96500" @click.stop="chrodDialog = true"
            >mdi-plus-circle-outline</v-icon
          >
          <v-dialog v-model="chrodDialog" max-width="800">
            <chord-block-list />
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
              <block-item :block="block" @click.native="melodyEditModal = true" />
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
          <v-dialog v-model="melodyDialog" max-width="800">
            <melody-block-list />
          </v-dialog>
        </div>
      </div>
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
import BlockItem from '@/components/block.vue'
import { Block } from '@/types/music'

export default Vue.extend({
  components: {
    draggable,
    RhythmBlockList,
    ChordBlockList,
    MelodyBlockList,
    MelodyModal,
    BlockItem
  },
  data() {
    return {
      rythmDialog: false,
      chrodDialog: false,
      melodyDialog: false,
      melodyEditModal: false,
      maxDuration: 10
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
      get(): Block[] {
        console.log(this.$accessor.music.rhythmBlocks)
        return this.$accessor.music.rhythmBlocks
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: 'rhythm', blockNames })
      }
    },
    chordBlocks: {
      get(): Block[] {
        return this.$accessor.music.chordBlocks
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: 'chord', blockNames })
      }
    },
    melodyBlocks: {
      get(): Block[] {
        return this.$accessor.music.melodyBlocks
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
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

.score-container {
  box-sizing: border-box;
  width: max-content;
  border-color: $-gray-500;
  border-style: solid solid none solid;
  border-width: 1px;
}

.column-title {
  box-sizing: border-box;
  margin: 0;
  color: $-gray-200;
  padding: 1rem;
  border-right: 1px solid $-gray-500;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .title-container {
    text-align: center;
    div {
      width: 4rem;
    }
    i {
      display: block;
      width: 3rem;
      margin: auto;
    }
  }
}

.GUIDE {
  display: flex;
  height: 100%;
  .guide {
    box-sizing: border-box;
    border-right: 1px dashed $-gray-500;
    width: 5rem;
    height: 100%;
    &:nth-child(odd) {
      border-color: $-gray-700;
    }
  }
}

.score-draggable {
  margin: 0;
  display: flex;
  align-items: center;

  .block-item-wrapper {
    margin-right: 1rem;
  }
}

.UL {
  box-sizing: border-box;
  width: max-content;
  height: 7rem;
  position: relative;
  display: flex;
  align-items: center;
  text-align: left;
  list-style: none;
  border-bottom: 1px solid $-gray-500;
}

.open-blocklist {
  margin-left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(-0.5rem);
}

.HOGE {
  display: flex;
  position: absolute;
  top: 0;
  left: 6.5rem;
  height: 100%;
  align-items: center;
}

.button-wrapper {
  width: 4rem;
  text-align: center;
  vertical-align: middle;
}

@include pc {
}
</style>
