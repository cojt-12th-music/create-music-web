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

type DataType = {
  dialog: boolean
}

export default {
  components: {
    MusicalScore,
    OperationArea,
    Player
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
