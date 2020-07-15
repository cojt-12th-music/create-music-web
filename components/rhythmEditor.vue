<template>
  <div class="score-part-container" @click="addscore">
    <div class="column-title">
      <div class="part-title-container">
        <v-icon large class="icon">fa-drum</v-icon>
        <div class="part-title">{{ inst }}</div>
      </div>
    </div>

    <div
      v-for="i in myKeyMusicalScore"
      :key="i.id"
      class="tap-block"
      :style="{ left: i.delay * 40 + 100 + 'px' }"
      @click.stop="deletescore(i.id)"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '@/types/music'

export default Vue.extend({
  components: {},
  props: {
    drumKey: {
      type: Number,
      required: true
    },
    inst: {
      type: String,
      required: true
    },
    blockName: {
      required: true,
      type: String
    }
  },
  data() {
    return {}
  },
  computed: {
    // 自分のパートの楽譜だけ返す
    myKeyMusicalScore(): Array<Object> {
      const newMusicalScore: Array<Object> = []
      this.soundBlock.sounds.forEach((elm) => {
        if (elm.key === this.drumKey) {
          newMusicalScore.push(elm)
        }
      })
      return newMusicalScore
    },
    maxLength(): number {
      // 各partにおけるdurationの合計の最大値 / 2 + 1 (追加ボタン分)
      // TODO: fetch from store
      return Math.floor(13 / 2) + 1
    },
    blocks: {
      get(): Block[] {
        return {
          rhythm: this.$accessor.music.rhythmBlocks
        }.rhythm
      },
      set(blocks: Block[]) {
        const blockNames = blocks.map((block) => block.name)
        this.$accessor.music.setBlockNames({ part: 'rhythm', blockNames })
      }
    },
    soundBlock(): Block {
      return this.$accessor.music.blocks.rhythm[this.blockName]
    }
  },
  methods: {
    addscore(event: any) {
      console.log(event.clientX)
      if (event.clientX > 100) {
        this.$accessor.music.addSound({
          part: 'rhythm',
          blockName: this.soundBlock.name,
          sound: {
            key: this.drumKey,
            delay: (event.clientX - 100) / 40,
            duration: 0.5
          }
        })
      }
    },
    deletescore(soundId: number) {
      console.log('deleteSoundId:' + soundId)
      this.$accessor.music.deleteSound({
        part: 'rhythm',
        blockName: this.blockName,
        soundId
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.score-part-container {
  display: flex;
  align-items: center;
  justify-content: left;
  box-sizing: border-box;
  border-bottom: 1px solid $-gray-500;
}

.column-title {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $-gray-200;
  height: 100%;
  margin: 0;
  padding: 1rem;
  box-sizing: border-box;
  border-right: 1px solid $-gray-500;
  width: 100px;

  .part-title-container {
    text-align: center;

    .part-title {
      width: 4rem;
      &.disabled {
        color: $-gray-500;
      }
    }
    i.icon {
      color: $-gray-200;
      display: block;
      margin: auto;
      width: 3rem;
      &.disabled {
        color: $-gray-500;
      }
    }
  }
}

.tap-block {
  position: absolute;
  box-sizing: border-box;
  background-color: $-gray-200;
  height: 20px;
  width: 20px;
  border: 1px solid $-gray-200;
  border-radius: 4px;
}

@include pc {
}
</style>
