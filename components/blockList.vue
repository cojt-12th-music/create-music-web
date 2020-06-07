<template>
  <div id="component-frame">
    <v-card>
      <v-tabs v-model="tab" background-color="indigo" dark>
        <v-tab v-for="item in items" :key="item.tab">
          {{ item.tab }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" :touchless="true">
        <v-tab-item v-for="item in items" :key="item.tab">
          <div class="boxContainer">
            <draggable
              :group="{ name: 'block', pull: 'clone', put: false }"
              v-bind="dragOptions"
            >
              <block
                v-for="element in item.list"
                :key="element.id"
                class="child"
                :text="element.name"
              />
            </draggable>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- <block text="aaa" /> -->
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import block from './block'
export default {
  components: {
    draggable,
    block
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
  },
  computed: {
    dragOptions() {
      return {
        animation: 300,
        disabled: false
      }
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
.child {
  display: inline-block;
  width: 100px;
  height: 60px;
  line-height: 30px;
  margin: 10px;
  text-align: center;
}
</style>
