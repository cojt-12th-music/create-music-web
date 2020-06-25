<template>
  <div id="component-frame">
    <v-card>
      <!-- 編集画面上部 -->
      <v-card-title>
        メロディー編集画面
        <v-btn icon dark @click="dialog">
          <v-icon right>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- 曲調選択 -->
      <v-card-title>
        <v-select
          id="select"
          :items="guideLines"
          outlined
          autofocus="true"
          label="ガイドライン"
          color="#F96500"
        ></v-select>
      </v-card-title>

      <!-- 編集エリア -->
      <v-chip class="edit-area">
        編集するぞ
      </v-chip>

      <!-- 再生エリア -->
      <v-card-title>
        <v-btn icon dark>
          <v-icon color="#F96500" large>play_arrow</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      guideLines: ['明るい', '悲しい', 'お洒落', '激しい']
    }
  },
  methods: {
    dialog() {
      this.$emit('dialog', false)
    }
  }
})
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}

div.v-select__selection--comma {
  color: white;
}

.v-card__title {
  background-color: $-gray-900;
  color: $-gray-50;
  p {
    margin: 0;
  }
}

.edit-area {
  background-color: orange;
  height: 544.81px;
  width: 100%;
}
</style>
