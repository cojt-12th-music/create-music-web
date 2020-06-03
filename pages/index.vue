<template>
  <div>
    <p>トップページ</p>
    <musical-score />
    <block-list />
    <operation-area />
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
