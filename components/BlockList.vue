<template>
  <div id="component-frame">
    <v-card class="mx-auto">
      <v-card-title class="block-list-header">
        <p>{{ partName }}ブロックの追加</p>
        <v-btn icon @click="$emit('close-block-list')">
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-chip-group v-model="selection" column class="card-content-wrapper">
        <v-card-text
          v-for="(blocks, category, categoryIndex) in blockGroup"
          :key="categoryIndex"
        >
          <v-card-text>{{ category }}</v-card-text>
          <v-divider></v-divider>
          <v-chip
            v-for="(block, index) in blocks"
            :key="category + index"
            label
            large
            @click="setSelectedBlockName(block)"
          >
            <block-item :block="block" />
          </v-chip>
        </v-card-text>

        <v-card-text v-if="part !== 'chord'">
          <v-btn
            class="create-button"
            :class="{ disabled: !editEnabled }"
            @click="createBlock"
          >
            ブロックを作成する
          </v-btn>
        </v-card-text>
      </v-chip-group>

      <transition name="add">
        <v-card-actions
          v-if="editEnabled && selection != null"
          class="block-list-footer"
        >
          <v-btn block class="add-button" @click="addBlock">
            楽譜に追加する
          </v-btn>
        </v-card-actions>
      </transition>
    </v-card>

    <v-dialog v-model="showsAttention" max-width="1000">
      <v-card>
        <v-card-title class="attention-modal-title"
          ><span class="material-icons">warning</span></v-card-title
        >
        <v-card-text class="attention-modal-text">
          {{ partAttention }}
        </v-card-text>

        <v-card-actions class="attention-modal-btn">
          <v-spacer></v-spacer>
          <v-btn color="orange darken-1" text @click="showsAttention = false">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BlockItem from '@/components/BlockItem.vue'
import { Block, ScorePart } from '@/types/music'

type BlockGroup = { [category: string]: Block[] }
type DataType = {
  selection: number | null
  selectedBlockName: string
  showsAttention: boolean
}

export default Vue.extend({
  components: {
    BlockItem
  },
  props: {
    part: {
      required: true,
      type: String as Vue.PropType<ScorePart>
    }
  },
  data(): DataType {
    return {
      selection: null,
      selectedBlockName: '',
      showsAttention: false
    }
  },
  computed: {
    blockGroup(): BlockGroup {
      return this.$accessor.music
        .partTemplates(this.part)
        .reduce((acc: BlockGroup, cur: Block) => {
          if (!acc[cur.category]) {
            acc[cur.category] = []
          }
          acc[cur.category].push(cur)
          return acc
        }, {} as BlockGroup)
    },
    partName(): string {
      return {
        rhythm: 'リズム',
        chord: 'コード',
        melody: 'メロディー'
      }[this.part]
    },
    partAttention(): string {
      return {
        rhythm: 'ブロックを選択してください．クソが．',
        chord: 'ブロック選べや．ちょっと考えれば分かるやろ．',
        melody: 'ちゃんとブロック選択しいや'
      }[this.part]
    },
    editEnabled(): boolean {
      return this.$accessor.player.editEnabled
    }
  },
  methods: {
    async createBlock() {
      const newBlock = await this.$accessor.music.initBlock(this.part)
      this.$emit('close-block-list', newBlock)
    },
    addBlock() {
      if (this.selection != null) {
        this.$accessor.music.cloneBlock({
          part: this.part,
          blockName: this.selectedBlockName
        })
        this.$emit('close-block-list')
      } else {
        this.showsAttention = true
      }
    },
    async setSelectedBlockName(block: Block) {
      this.$accessor.player.stopPresetPreview()

      // ブロックの選択解除 (雑実装)
      if (this.selectedBlockName === block.name) {
        this.selectedBlockName = ''
        return
      }

      this.selectedBlockName = block.name
      await this.$nextTick()
      this.$accessor.player.playPresetPreview({
        part: this.part,
        name: this.selectedBlockName
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.v-card__title {
  background-color: $-gray-800;
  color: $-gray-50;
  p {
    margin: 0;
  }
}
div#component-frame {
  height: 100%;
  position: relative;
}
.v-card__text {
  color: $-gray-50;
  padding: 0;
  margin: 5px 5px 5px 10px;
}
.v-item-group {
  background-color: $-gray-700;
}
.v-chip.v-size--large {
  padding: 0;
  height: 64px;
}
.v-card__actions {
  background-color: $-gray-800;
  box-sizing: border-box;
  height: 2rem;
  padding: 10px;
}
.v-chip-group .v-chip--active {
  color: $-gray-300;
}
.theme--light.v-chip--active:hover::before,
.theme--light.v-chip--active::before {
  opacity: 0.2;
}
.v-divider {
  background-color: $-gray-500;
  margin-bottom: 5px;
}
.attention-modal-title {
  background-color: $-gray-700;
  .material-icons {
    color: $-primary-500;
    font-size: 30px;
  }
}
.attention-modal-text.v-card__text {
  background-color: $-gray-700;
  color: $-gray-50;
  text-align: center;
  margin: 0;
  padding: 30px;
}
.attention-modal-btn {
  background-color: $-gray-700;
}

.create-button {
  margin-top: 1rem;
  background-color: $-gray-600 !important;
  color: $-gray-50;
}

.mx-auto {
  position: relative;
  background-color: $-gray-700;

  .block-list-header {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    display: flex;
    justify-content: space-between;
  }

  .block-list-footer {
    position: -webkit-sticky;
    position: sticky;
    height: 4rem;
    bottom: 0;
  }
}

.add-button {
  background-color: $-primary-500 !important;
  color: $-gray-50;
  font-size: 1rem;
}

.v-btn {
  &.disabled {
    background-color: $-gray-400 !important;
    pointer-events: none;
  }
}

.add-enter-active,
.add-leave-active {
  transform: translateY(0) translateZ(0);
  transition: transform 150ms linear 100ms;
}

.add-enter,
.add-leave-to {
  transform: translateY(10vh) translateZ(0);
}

// ホントは良くないけど、一時しのぎ
.card-content-wrapper ::v-deep .v-slide-group__content {
  overflow-y: scroll;
}
</style>
