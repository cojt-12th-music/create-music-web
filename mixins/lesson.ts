import Vue from 'vue'

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
      onNext: (step) => {
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
      onHighlightStarted: (step) => {
        const nextEvent = step.options.nextEvent
        if (nextEvent) {
          const elem = document.getElementById(nextEvent.elemId.slice(1))
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
      onHighlighted: (step) => {
        if (step.options.disableTouch) {
          step.node.classList.remove('driver-highlighted-element')
        }
      }
    })
  },
  methods: {
    lessonStart() {
      this.setSteps()
      this.$driver.start()
    },
    setSteps() {
      this.$driver.defineSteps(
        this.$accessor.tutorial.steps.map((step, index) => ({ ...step, index }))
      )
    }
  }
})
