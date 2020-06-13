<template>
  <div id="component-frame" :style="{ 'background-color': styleObject }">
    <p>{{ text }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  computed: {
    styleObject() {
      // return this.blockType
      return this.backGroundColor
    },
    backGroundColor() {
      switch (this.text) {
        case '16ビート':
          return '#4527A0'
        case '8ビート':
          return '#283593'
        case '2ビート':
          return '#1565C0'
        case '王道':
          return '#00695C'
        case 'カノン':
          return '#2E7D32'
        case '小室':
          return '#558B2F'
        case 'Let it Be':
          return '#9E9D24'
        case '下降転調':
          return '#C0CA33'
        case 'メロ1':
          return '#F9A825'
        case 'メロ2':
          return '#FF8F00'
        case 'メロ3':
          return '#EF6C00'
        case 'メロ4':
          return '#D84315'
        default:
          return '#757575'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div#component-frame {
  // background-color: background;
  color: white;
  border-radius: 0.2rem;
  -webkit-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  -moz-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  -ms-filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(1px 3px 5px rgba(0, 0, 0, 0.2));
}
</style>
