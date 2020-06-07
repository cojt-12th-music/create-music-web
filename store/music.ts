/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound } from '@/types/music'
import { MELODY_PRESETS, CHORD_PRESETS, RHYTHM_PRESETS } from '@/lib/presets'

export const state = (): Music => ({
  melody: {
    // init, init というブロックの並び
    blockLabels: ['init', 'init'],
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
    state.melody.blockLabels.map((label) => state.blocks.melody[label])
})

export const mutations = mutationTree(state, {
  // blockを新しく作る
  ADD_BLOCK(state: MusicState, block: Block) {
    state.blocks.melody[block.label] = block
  },
  // メロディーの特定のブロックに新しいsoundを追加する
  ADD_SOUND(
    state: MusicState,
    { blockLabel, sound }: { blockLabel: string; sound: Sound }
  ) {
    sound.id = state.blocks.melody[blockLabel].sounds.length + 1
    state.blocks.melody[blockLabel].sounds.push(sound)
  },
  // soundを変更する
  UPDATE_SOUND(
    state: MusicState,
    { blockLabel, sound }: { blockLabel: string; sound: Sound }
  ) {
    state.blocks.melody[blockLabel].sounds.splice((sound.id || 0) - 1, 1, sound)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    // blockを新しく作るaction
    addBlock({ commit }, block: Block) {
      commit('ADD_BLOCK', block)
    },
    // soundを追加するaction
    addSound(
      { commit },
      { blockLabel, sound }: { blockLabel: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { blockLabel, sound })
    },
    // soundを追加するaction
    updateSound(
      { commit },
      { blockLabel, sound }: { blockLabel: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { blockLabel, sound })
    }
  }
)
