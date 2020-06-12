<template>
  <div id="component-frame">
    <v-container>
      <div id="musical-score-wrapper">
        <musical-score />
      </div>

      <div id="block-list-wrapper">
        <block-list />
      </div>

      <div id="operation-area-wrapper">
        <operation-area />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import MusicalScore from '@/components/musicalScore.vue'
import BlockList from '@/components/blockList.vue'
import OperationArea from '@/components/operationArea.vue'

export default {
  components: {
    MusicalScore,
    BlockList,
    OperationArea
  }
}
</script>

<style lang="scss" scoped>
#component-frame {
  background-color: #424242;
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
}
</style>
