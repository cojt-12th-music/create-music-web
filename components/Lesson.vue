<template><div /></template>

<script lang="ts">
import Vue from 'vue'
import { Element } from '@/types/lesson'

export default Vue.extend({
  beforeMount() {
    Object.assign(this.$driver.options, {
      allowClose: false,
      opacity: 0,
      nextBtnText: 'OK!',
      prevBtnText: '戻る',
      closeBtnText: 'やめる',
      doneBtnText: '終わる',
      showButtons: true,
      onNext: (step: Element) => {
        if (step && step.options.delay) {
          const currentIndex = this.$driver.currentStep
          this.$driver.preventMove()
          this.$driver.reset()
          setTimeout(() => {
            this.setSteps()
            this.$driver.start(currentIndex + 1)
          }, step.options.delay)
        }
      },
      onHighlightStarted: (step: Element) => {
        const moveNext = step.options.moveNext
        if (moveNext) {
          const elem = document.getElementById(moveNext.element.slice(1))
          if (!elem) {
            return
          }
          const f = () => {
            this.$driver.handleNext()
            elem.removeEventListener('click', f, false)
          }
          elem.addEventListener('click', f, false)
        }
      },
      onHighlighted: (step: Element) => {
        if (step.options.disableContent) {
          step.node.classList.remove('driver-highlighted-element')
        }
      }
    })
  },
  mounted() {
    if (this.$accessor.lesson.isAvailable) {
      this.lessonStart()
    }
  },
  methods: {
    lessonStart() {
      this.setSteps()
      this.$driver.start()
    },
    setSteps() {
      this.$driver.defineSteps(
        this.$accessor.lesson.steps.map((step, index) => ({ ...step, index }))
      )
    }
  }
})
</script>
