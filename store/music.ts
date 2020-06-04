/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound } from '~/types/music'

export const state = (): Music => ({
  melody: {
    blockLabels: ['init']
  },
  chord: {},
  rhythm: {},
  blocks: {
    melody: { init: { label: 'init', sounds: [] } },
    chord: {},
    rhythm: {}
  }
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  // メロディーのblocksを返すgetter
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockLabels.map((label) => state.blocks.melody[label]),
  // メロディーのsoundsを一連で返すgetter
  melodySounds: (state: MusicState): Sound[] =>
    state.melody.blockLabels
      .map((label) => state.blocks.melody[label].sounds)
      .flat()
})

export const mutations = mutationTree(state, {
  // メロディーの特定のブロックに新しいsoundを追加する
  pushSoundToMelody(
    state: MusicState,
    { blockLabel, sound }: { blockLabel: string; sound: Sound }
  ) {
    state.blocks.melody[blockLabel].sounds.push(sound)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    // soundを追加するaction
    pushSound(
      { commit },
      { blockLabel, sound }: { blockLabel: string; sound: Sound }
    ) {
      commit('pushSoundToMelody', { blockLabel, sound })
    }
  }
)
