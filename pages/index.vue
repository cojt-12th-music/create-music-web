<template>
  <div id="component-frame">
    <div id="musical-score-wrapper">
      <musical-score :trash-part.sync="trashPart" />
    </div>

    <transition name="trash">
      <div v-if="!isPlaying && trashPart" class="score-trash-wrapper">
        <draggable class="score-draggable-trash" :group="trashPart" />
        <v-icon class="icon">fa-trash</v-icon>
      </div>
    </transition>

    <div id="operation-area-wrapper">
      <operation-area />
    </div>
    <player />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Context } from '@nuxt/types'
import draggable from 'vuedraggable'

import MusicalScore from '@/components/musicalScore.vue'
import OperationArea from '@/components/operationArea.vue'
import Player from '@/components/Player.vue'
import { firebaseAuth, firestoreAccessor } from '@/plugins/firebase'
import { Music, ScorePart } from '@/types/music'

type DataType = {
  dialog: boolean
  trashPart: ScorePart | null
}

export default Vue.extend({
  components: {
    draggable,
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
      dialog: false,
      trashPart: null
    }
  }
})
</script>

<style lang="scss" scoped>
$operation-area-height: 10vh;

#component-frame {
  background-color: $-gray-800;
  height: 100vh;
  color: $-gray-500;
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
  height: $operation-area-height;
  width: 100vw;
  position: fixed;
  bottom: 0;
}

.score-trash-wrapper {
  position: absolute;
  left: 0;
  bottom: $operation-area-height;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 5rem;
  width: 100%;

  .score-draggable-trash {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $-gray-500;
    border-radius: 50%;
    height: 4rem;
    width: 4rem;
    opacity: 0.5;
  }

  .icon {
    position: absolute;
    color: $-gray-50;
  }
}

.trash-enter-active,
.trash-leave-active {
  transform: translateY(0) translateZ(0);
  transition: transform 100ms linear 100ms;
}

.trash-enter,
.trash-leave-to {
  transform: translateY(10vh) translateZ(0);
}

@include pc {
}
</style>
