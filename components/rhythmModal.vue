<template>
  <div id="component-frame">
    <v-card>
      <!-- 編集画面上部 -->
      <v-card-title class="top-area">
        リズム編集画面
        <v-btn icon dark @click="dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- 編集エリア -->
      <v-card class="edit-area">
        <rhythmEditor v-for="i in instrument_keys" :key="i" :drum-key="i" />
      </v-card>

      <!-- 再生エリア -->
      <v-card-title class="play-area">
        <v-btn icon dark>
          <v-icon color="#F96500" large>play_arrow</v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import rhythmEditor from '@/components/rhythmEditor.vue'

export default Vue.extend({
  components: {
    rhythmEditor
  },
  data() {
    return {
      // 一時的なサンプルデータ
      ドラム1: {
        name: 'ドラム1',
        sounds: [
          { id: 1, key: 48, delay: 0.0, duration: 0.5 },
          { id: 2, key: 60, delay: 0.5, duration: 0.5 },
          { id: 3, key: 64, delay: 1.0, duration: 0.5 },
          { id: 4, key: 60, delay: 1.5, duration: 0.5 },
          { id: 5, key: 64, delay: 2.0, duration: 0.5 },
          { id: 6, key: 60, delay: 2.5, duration: 0.5 }
        ],
        duration: 4
      }
    }
  },
  computed: {
    // ドラムの種類（キー）を配列にして返す
    instrument_keys(): Array<number> {
      const keyList: Array<number> = []
      this.ドラム1.sounds.forEach((elm) => {
        if (!keyList.includes(elm.key)) {
          keyList.push(elm.key)
        }
      })
      return keyList
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

.v-select {
  color: white;
}

.top-area {
  font-size: 80%;
  background-color: $-gray-900;
}

.play-area {
  background-color: $-gray-900;
  position: fixed;
  bottom: 0px;
  height: 81px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-card__title {
  color: $-gray-50;
}

.edit-area {
  background-color: $-gray-800;
  height: 100vh;
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
</style>
