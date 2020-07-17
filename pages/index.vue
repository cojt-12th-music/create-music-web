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
}
</script>

<style lang="scss" scoped>
#component-frame {
  background-color: $-gray-800;
  height: 100vh;
  color: $-gray-500;
}

#musical-score-wrapper {
  height: 65vh;
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
  width: 100vw;
  position: fixed;
  bottom: 0;
}

@include pc {
}
</style>
