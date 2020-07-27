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
    const userId = await firebaseAuth()
      .signInAnonymously()
      .then((cred) => cred.user?.uid || '')

    store.commit('player/SET_USER_ID', userId)

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
    firebaseAuth().onAuthStateChanged((user) => {
      let userId = this.$accessor.player.userId
      // 念のため
      if (!userId) {
        userId = user?.uid || ''
        this.$accessor.player.setUserId(userId)
        console.log('setted:', userId)
      }
      if (!this.$accessor.music.id || userId === this.$accessor.music.userId) {
        this.editEnabled = true
      }
    })
    await firebaseAuth()
      .signInAnonymously()
      .catch((error) => {
        console.error(error)
      })

    const scoreId = this.$route.query.id
    if (scoreId && typeof scoreId === 'string') {
      firestoreAccessor.scores.show(scoreId).then((score: Music) => {
        this.$accessor.music.SET_SCORE(score)
      })
    }
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
  },
  head() {
    return {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || ''
        },
        { hid: 'og:site_name', property: 'og:site_name', content: 'サイト名' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        // { hid: 'og:url', property: 'og:url', content: "https://earth-river.com/item/CRMOL001A1/" },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$accessor.music.composer + 'の曲'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$accessor.music.title
        },
        { hid: 'og:image', property: 'og:image', content: '' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
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
    -webkit-text-fill-color: $-gray-50;
    input {
      color: $-gray-50 !important;
    }
  }
  .score-header-creator {
    -webkit-text-fill-color: $-gray-50;
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
  height: calc(100% - #{$operation-area-height} * 2);
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
