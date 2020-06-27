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

      <!-- 曲調選択 -->
      <v-card-title class="guideline-area">
        <v-row align="center">
          <v-col class="d-flex" cols="3" sm="1">ガイドライン</v-col>
          <v-col class="d-flex" cols="5" sm="2">
            <select v-model="selected" class="guideline-input">
              <option
                v-for="item in guideLines"
                :key="item.text"
                :value="item.value"
                >{{ item.text }}
              </option>
            </select>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- 編集エリア -->
      <v-card class="edit-area">
        <div v-for="text in scale" :key="text" class="scale">
          <div class="scale-text">{{ text }}</div>
          <!-- <draggable v-model="melodyBlocks" class="score-draggable" v-bind="dragOptions">
            <div v-for="n in 5" :key="n" class="block">
              <melody-modal-block />
            </div>
          </draggable>-->
          <div v-for="n in 5" :key="n" class="block"></div>
        </div>
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
// import draggable from 'vuedraggable'
// import MelodyModalBlock from '@/components/melodyModalBlock.vue'

export default Vue.extend({
  components: {
    // MelodyModalBlock,
    // draggable
  },
  data() {
    return {
      selected: [],
      guideLines: [
        { text: '明るい', value: ['ド#', 'レ#', 'ファ#', 'ソ#', 'ラ#'] },
        { text: '悲しい' },
        { text: 'お洒落' }
      ],
      scale: [
        'ド',
        'ド#',
        'レ',
        'レ#',
        'ミ',
        'ファ',
        'ファ#',
        'ソ',
        'ソ#',
        'ラ',
        'ラ#',
        'シ'
      ],
      isClick: false
    }
  },
  computed: {
    dragOptions() {
      return {
        // animation: 300,
        disabled: false
      }
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

.guideline-area {
  //   height: 15%;

  font-size: 80%;
  background-color: $-gray-800;
}

.edit-area {
  background-color: $-gray-700;
  //   height: 544.81px;
  height: 100%;
  width: 100%;
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

.v-divider {
  background-color: $-gray-500;
  margin-top: 3px;
}

.guideline-input {
  padding: 0 0 0 10px;
  border-radius: 4px;
  border: 1px solid $-primary-500;
  width: 100%;
}
.d-flex {
  padding: 0;
}

.block {
  margin-top: 1px;
  height: 33.5px;
  width: 64px;
  border-right: 0.5px dashed $-gray-500;
}

.score-draggable {
  display: flex;
  margin-bottom: 1px;
}
.scale {
  display: flex;
  border-top: 0.5px solid $-gray-500;
}
.scale-text {
  width: 55px;
  border-right: 1px dashed $-gray-500;
}
</style>
