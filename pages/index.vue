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
    <player />
  </div>
</template>

<script lang="ts">
import MusicalScore from '@/components/musicalScore.vue'
import BlockList from '@/components/blockList.vue'
import OperationArea from '@/components/operationArea.vue'
import Player from '@/components/Player.vue'

export default {
  components: {
    MusicalScore,
    BlockList,
    OperationArea,
    Player
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

@include pc {
  // #component-frame {
  //   display: -webkit-box;
  //   display: -webkit-flex;
  //   display: -ms-flexbox;
  //   display: flex;
  //   -webkit-flex-wrap: wrap;
  //   -ms-flex-wrap: wrap;
  //   flex-wrap: wrap;
  // }
  // #musical-score-wrapper {
  //   -webkit-box-ordinal-group: 2;
  //   -ms-flex-order: 2;
  //   -webkit-order: 2;
  //   order: 2;
  // }
  // #block-list-wrapper {
  //   -webkit-box-ordinal-group: 3;
  //   -ms-flex-order: 3;
  //   -webkit-order: 3;
  //   order: 3;
  // }
  // #operation-area-wrapper {
  //   -webkit-box-ordinal-group: 1;
  //   -ms-flex-order: 1;
  //   -webkit-order: 1;
  //   order: 1;
  // }
}
</style>
