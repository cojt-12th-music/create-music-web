<template>
  <div id="component-frame">
    <v-card>
      <v-tabs v-model="tab" background-color="indigo" dark>
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-card flat>
            <div class="boxContainer">
              <draggable>
                <v-card-text v-for="element in item.list" :key="element.name">
                  {{ element.name }}
                </v-card-text>
              </draggable>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data() {
    return {
      tab: null,
      items: [
        {
          tab: 'リズム',
          list: [
            { name: '8ビート', id: 0 },
            { name: '16ビート', id: 1 },
            { name: '2ビート', id: 2 }
          ]
        },
        {
          tab: 'コード',
          list: [
            { name: '王道', id: 0 },
            { name: 'カノン', id: 1 },
            { name: '小室', id: 2 },
            { name: 'Let it be', id: 3 },
            { name: '下降転調', id: 4 }
          ]
        },
        {
          tab: 'メロディ',
          list: [
            { name: 'メロ1', id: 0 },
            { name: 'メロ2', id: 1 },
            { name: 'メロ3', id: 2 },
            { name: 'メロ4', id: 3 }
          ]
        }
      ],
      enabled: true,
      dragging: false
    }
  }
}
</script>

<style lang="scss" scoped>
div#component-frame {
  height: 100%;
}
.boxContainer {
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.v-card__text {
  background-color: #efefef;
  display: inline-block;
  width: 100px;
  height: 60px;
  line-height: 30px;
  margin: 5px;
  text-align: center;
}
</style>
