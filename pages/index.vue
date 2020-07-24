<template>
  <div id="component-frame">
    <div class="score-header">
      <div class="score-title-wrapper">
        <h2 class="score-header-title">
          <input
            v-model="scoreTitle"
            :disabled="!editEnabled"
            placeholder="Add Music Name"
          />
        </h2>
        <div class="score-header-creator">
          <input
            v-model="scoreComposer"
            :disabled="!editEnabled"
            placeholder="Add Your Name"
          />
        </div>
      </div>

      <!-- <div class="login-button-wrapper">
        <v-btn v-if="currentUser" @click="signOut">ログアウト</v-btn>
        <v-btn v-else @click="twitterLogin">ログイン</v-btn>
      </div> -->

      <div class="mode-switch-wrapper">
        <v-switch
          v-model="editEnabled"
          dark
          class="mode-switch"
          color="orange"
        />
        <div class="mode-switch-label">Edit</div>
      </div>
    </div>

    <div id="musical-score-wrapper">
      <musical-score :trash-part.sync="trashPart" />
    </div>

    <div id="operation-area-wrapper">
      <transition name="trash">
        <div v-if="!isPlaying && trashPart" class="score-trash-wrapper">
          <draggable class="score-draggable-trash" :group="trashPart" />
          <v-icon class="icon">fa-trash</v-icon>
        </div>
      </transition>

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
import {
  firestoreAccessor,
  twitterProvider,
  firebaseAuth
} from '@/plugins/firebase'
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
    if (!firebaseAuth().currentUser) {
      firebaseAuth()
        .signInAnonymously()
        .catch((error) => {
          // Handle Errors here.
          console.log('anonymous error.')
          console.log(error.code)
          console.log(error.message)
        })
    }

    const scoreId = route.query.id
    if (scoreId && typeof scoreId === 'string') {
      await firestoreAccessor.scores.show(scoreId).then((score: Music) => {
        // fetchのときは直接dispatchせざるを得ない屈辱
        store.commit('music/SET_SCORE', score)
      })
    }
  },
  data(): DataType {
    return {
      dialog: false,
      trashPart: null
    }
  },
  computed: {
    scoreTitle: {
      get() {
        return this.$accessor.music.title
      },
      set(input: string) {
        this.$accessor.music.setTitle(input)
      }
    },
    scoreComposer: {
      get() {
        return this.$accessor.music.composer
      },
      set(input: string) {
        this.$accessor.music.setComposer(input)
      }
    },
    editEnabled: {
      get() {
        return this.$accessor.player.editEnabled
      },
      set(enabled: boolean) {
        this.$accessor.player.setEditEnabled(enabled)
      }
    },
    isPlaying(): boolean {
      return this.$accessor.player.isPlaying
    }
  },
  async mounted() {
    await firebaseAuth()
      .getRedirectResult()
      .catch(function(error) {
        console.log(error)
      })
    this.$accessor.music.setUserId(firebaseAuth().currentUser?.uid || '')
  },
  methods: {
    twitterLogin() {
      firebaseAuth()
        .signInWithPopup(twitterProvider)
        .then(() => {
          console.log('signed in successfully')
        })
        .catch((error) => {
          console.log(error.code)
          console.log(error.message)
        })
    },
    signOut() {
      firebaseAuth()
        .signOut()
        .then(() => {
          console.log('signed out successfully')
        })
        .catch((error) => {
          console.log(error.code)
          console.log(error.message)
        })
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
  position: relative;
}

.score-header {
  height: $operation-area-height;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $-gray-900;

  .score-header-title {
    margin-bottom: 0.2rem;
    input {
      color: $-gray-50 !important;
    }
  }
  .score-header-creator {
    input {
      color: $-gray-100;
    }
  }

  .mode-switch-wrapper {
    text-align: center;

    .mode-switch-label {
      font-size: 14px;
      font-weight: bold;
      color: $-gray-100;
    }

    .mode-switch {
      margin: 1rem 0 -1rem 0;
    }
  }
}

#musical-score-wrapper {
  height: calc(100% - $operation-area-height * 2);
  margin: $operation-area-height 0;
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
  width: 100%;
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
