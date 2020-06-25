<template>
  <div id="component-frame">
    <div id="musical-score-wrapper">
      <musical-score />
    </div>

    <div id="operation-area-wrapper">
      <operation-area />
    </div>
    <player />
  </div>
</template>

<script lang="ts">
import MusicalScore from '@/components/musicalScore.vue'
import OperationArea from '@/components/operationArea.vue'
import Player from '@/components/Player.vue'
import { Music } from '@/types/music'
import { db } from '@/plugins/firebase'

type DataType = {
  dialog: boolean
}

export default {
  components: {
    MusicalScore,
    OperationArea,
    Player
  },
  async fetch({ route, store }) {
    const scoreId = route.query.id
    if (scoreId && typeof scoreId === 'string') {
      // scoreIdをidとする楽譜データを持ってくる
      const doc = await db
        .collection('scores')
        .doc(scoreId)
        .get()
      const data = doc.data() as Music

      // fetchのときは直接dispatchせざるを得ない屈辱
      store.commit('SET_SCORE', { ...data, id: doc.id })
    }
  },
  data(): DataType {
    return {
      dialog: false
    }
  }
}
</script>

<style lang="scss" scoped>
#component-frame {
  background-color: $-gray-800;
  height: 100vh;
  color: $-gray-500;
}

#musical-score-wrapper {
  height: 65vh;
  margin-bottom: 3vh;
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

#block-list-wrapper {
  height: 15vh;
  margin-bottom: 3vh;
}

#operation-area-wrapper {
  height: 10vh;
  width: 100vw;
  position: fixed;
  bottom: 0;
}

@include pc {
}
</style>
