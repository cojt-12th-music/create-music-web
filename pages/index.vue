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

    <transition name="trash">
      <div v-if="!isPlaying && trashPart" class="score-trash-wrapper">
        <draggable class="score-draggable-trash" :group="trashPart" />
        <v-icon class="icon">fa-trash</v-icon>
      </div>
    </transition>

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
    <v-btn @click="twitterLogin">Twitterログイン</v-btn>
    <v-btn @click="signOut">Sign Out</v-btn>
    <v-btn @click="test">test</v-btn>
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
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('signed in.')
        console.log('isAnonymous:' + user.isAnonymous)
        console.log(firebaseAuth().currentUser?.isAnonymous)
        console.log(firebaseAuth().currentUser?.uid)
        console.log(firebaseAuth().currentUser?.providerData)
      } else {
        // User is signed out.
      }
    })

    console.log('now')
    console.log(firebaseAuth().currentUser?.isAnonymous)
    console.log(firebaseAuth().currentUser?.uid)

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
    }
  },
  async mounted() {
    await firebaseAuth()
      .getRedirectResult()
      .then(function(result) {
        console.log('accessToken:' + result.credential?.accessToken)
        console.log('secret:' + result.credential?.secret)
        console.log('user:' + result.user)
      })
      .catch(function(error) {
        console.log(error)
      })
  },
  methods: {
    twitterLogin() {
      firebaseAuth()
        .signInWithPopup(twitterProvider)
        .then((result) => {
          console.log('accessToken:' + result.credential.accessToken)
          console.log('secret:' + result.credential.secret)
          console.log('user:' + result.user)
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
          // singed out
          console.log('sign out successful')
        })
        .catch((error) => {
          console.log(error.code)
          console.log(error.message)
        })
    },
    test() {
      console.log(firebaseAuth())
      console.log(firebaseAuth().currentUser?.isAnonymous)
      console.log(firebaseAuth().currentUser?.uid)
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
      font-size: 16px;
      font-weight: bold;
      color: $-gray-100;
    }

    .mode-switch {
      margin: 0 0 -1rem 0;
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
