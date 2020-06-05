/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound } from '~/types/music'

export const state = (): Music => ({
  melody: {
    blockLabels: ['init', '', 'init'],
    gain: 1
  },
  chord: {},
  rhythm: {},
  blocks: {
    // 適当に初期ブロック「init」を入れている状態
    melody: { init: { label: 'init', sounds: [], totalTime: 1 } },
    chord: {},
    rhythm: {}
  },
  bpm: 120
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  // メロディーのblocksを返すgetter
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockLabels.map((label) => state.blocks.melody[label] || {})
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
