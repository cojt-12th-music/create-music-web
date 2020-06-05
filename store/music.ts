/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound } from '@/types/music'
import { MELODY_PRESETS, CHORD_PRESETS, RHYTHM_PRESETS } from '@/lib/presets'

export const state = (): Music => ({
  melody: {
    // init, 空白, init というブロックの並び
    blockLabels: ['init', '', 'init'],
    gain: 1
  },
  chord: {},
  rhythm: {},
  blocks: {
    // プリセットはとりあえず @/lib/presets.ts に定義している
    melody: MELODY_PRESETS,
    chord: CHORD_PRESETS,
    rhythm: RHYTHM_PRESETS
  },
  bpm: 100
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
