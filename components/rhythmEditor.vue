<template>
  <div ref="editInner" class="score-part-container" @click="addscore">
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
    soundBlock(): Block {
      return this.$accessor.music.blocks.rhythm[this.blockName]
    }
  },
  methods: {
    async addscore(event: any) {
      if (!this.$accessor.player.editEnabled) return

      if (!this.$refs.editInner) throw new Error('ref参照がありません')

      const inner = this.$refs.editInner as HTMLElement
      const coordinate = event.pageX - inner.getBoundingClientRect().left
      console.log(coordinate)
      if (coordinate > 100) {
        this.$accessor.music.addSound({
          part: 'rhythm',
          blockName: this.soundBlock.name,
          sound: {
            key: this.drumKey,
            delay: (coordinate - 100) / 40,
            duration: 0.5
          }
        })

        this.$accessor.player.stopUnitSoundPreview()
        await this.$nextTick()
        this.$accessor.player.playUnitSoundPreview({
          part: 'rhythm',
          key: this.drumKey
        })
        this.$emit('edit-block')
      }
    },
    deletescore(soundId: number) {
      if (!this.$accessor.player.editEnabled) return

      console.log('deleteSoundId:' + soundId)
      this.$accessor.music.deleteSound({
        part: 'rhythm',
        blockName: this.blockName,
        soundId
      })
      this.$emit('edit-block')
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
  width: 500vw;
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
