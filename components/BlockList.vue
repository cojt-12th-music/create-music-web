<template>
  <div id="component-frame">
    <v-card class="mx-auto">
      <v-card-title>
        <p>{{ partName }}の追加</p>
      </v-card-title>

      <v-chip-group v-model="selection" column>
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
      </v-chip-group>

      <v-card-actions>
        <v-btn block class="white--text " color="#F96500" @click="addBlock">
          Add to Score
        </v-btn>
      </v-card-actions>
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
  selection: number
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
      selection: -1,
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
    }
  },
  methods: {
    addBlock() {
      if (this.selection >= 0) {
        this.$accessor.music.cloneBlock({
          part: this.part,
          blockName: this.selectedBlockName
        })
        this.$accessor.player.stopPresetPreview()
        this.$emit('closeDialog')
      } else {
        this.showsAttention = true
      }
    },
    async setSelectedBlockName(block: Block) {
      this.selectedBlockName = block.name
      this.$accessor.player.stopPresetPreview()
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
  background-color: $-gray-900;
  color: $-gray-50;
  p {
    margin: 0;
  }
}
div#component-frame {
  height: 100%;
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
  background-color: $-gray-900;
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
</style>
