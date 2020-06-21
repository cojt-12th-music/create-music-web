<template>
  <div id="component-frame">
    <div class="title">曲のタイトル</div>

    <div id="musical-score-wrapper">
      <musical-score />
    </div>

    <!-- <div id="block-list-wrapper">
        <block-list />
      </div> -->

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

export default {
  components: {
    MusicalScore,
    OperationArea,
    Player
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: $-gray-50;
  padding-top: 1rem;
  margin-left: 1rem;
  margin-bottom: 1rem;
}
#component-frame {
  background-color: $-gray-800;
  height: 100vh;
  color: $-gray-500;
}

#musical-score-wrapper {
  height: 65vh;
  margin-bottom: 3vh;
  overflow: scroll;
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
