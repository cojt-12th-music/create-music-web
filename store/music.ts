/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Sound } from '~/types/music'

export const state = (): Music => ({
  melody: {
    // とりあえず適当なブロックを入れている
    blocks: [{ label: 'init', sounds: [] }]
  },
  chord: {},
  rhythm: {}
})

export type State = ReturnType<typeof state>

export const getters = getterTree(state, {
  // メロディーのsoundを一連で返すgetter
  melodySounds: (state: State): Sound[] =>
    state.melody.blocks.map((block) => block.sounds).flat()
})

export const mutations = mutationTree(state, {
  // メロディーの特定のブロックに新しいsoundを追加する
  pushSoundToMelody(state: State, sound: Sound, blockIndex = 0) {
    state.melody.blocks[blockIndex].sounds.push(sound)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    // soundを追加するaction
    pushSound({ commit }, sound: Sound) {
      commit('pushSoundToMelody', sound)
    }
  }
)
