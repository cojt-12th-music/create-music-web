<template>
  <div id="component-frame">
    <div id="musical-score-wrapper">
      <musical-score />
    </div>

    <div id="operation-area-wrapper">
      <operation-area />
    </div>
    <player />
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'

import MusicalScore from '@/components/musicalScore.vue'
import OperationArea from '@/components/operationArea.vue'
import Player from '@/components/Player.vue'
import { firebaseAuth, firestoreAccessor } from '@/plugins/firebase'
import { Music } from '@/types/music'

type DataType = {
  dialog: boolean
}

export default {
  components: {
    MusicalScore,
    OperationArea,
    Player
  },
  async fetch({ route, store }: Context) {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log(user.isAnonymous)
        console.log(user.uid)
      } else {
        // User is signed out.
      }
    })

    await firebaseAuth.signInAnonymously().catch((error) => {
      // Handle Errors here.
      console.log(error.code)
      console.log(error.message)
    })

    const scoreId = route.query.id

    if (scoreId && typeof scoreId === 'string') {
      await firestoreAccessor.scores
        .show(scoreId)
        .then((score: Music) => {
          // fetchのときは直接dispatchせざるを得ない屈辱
          store.commit('music/SET_SCORE', score)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  data(): DataType {
    return {
      dialog: false
    }
  },
  mounted() {
    this.$driver.options.allowClose = false
    this.$driver.options.opacity = 0
    this.$driver.options.nextBtnText = 'OK!'
    this.$driver.options.prevBtnText = '戻る'
    this.$driver.options.closeBtnText = 'やめる'
    this.$driver.options.doneBtnText = '終わる'
    this.$driver.options.showButtons = true

    this.$driver.options.onNext = (step) => {
      if (step && step.options.delay) {
        const currentIndex = this.$driver.currentStep
        this.$driver.preventMove()
        this.$driver.reset()
        setTimeout(() => {
          this.setSteps()
          this.$driver.start(currentIndex + 1)
        }, step.options.delay)
      }
    }

    this.$driver.options.onHighlightStarted = (step) => {
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
    }

    this.$driver.options.onHighlighted = (step) => {
      if (step.options.disableTouch) {
        step.node.classList.remove('driver-highlighted-element')
      }
    }

    this.setSteps()
    this.$driver.start()
  },
  methods: {
    setSteps() {
      this.$driver.defineSteps(
        this.$accessor.tutorial.steps.map((step, index) => ({ ...step, index }))
      )
    }
  }
}
</script>

<style lang="scss" scoped>
#component-frame {
  background-color: $-gray-800;
  height: 100vh;
  color: $-gray-500;
  position: relative;
}

#musical-score-wrapper {
  height: calc(100% - 10vh);
  margin-bottom: 3vh;
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

#block-list-wrapper {
  height: 15vh;
  margin-bottom: 3vh;
}

#operation-area-wrapper {
  height: 10vh;
  width: 100%;
  position: fixed;
  bottom: 0;
}

@include pc {
}
</style>
