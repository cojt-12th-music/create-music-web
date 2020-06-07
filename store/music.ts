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
  // メロディーのblocksを返す
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockLabels.map((label) => state.blocks.melody[label])
})

export const mutations = mutationTree(state, {
  /**
   * blockをメロディにクローンする
   * @param blockLabel ブロックの名前
   * @param index 追加する場所
   */
  CLONE_BLOCK(
    state: MusicState,
    { blockLabel, index }: { blockLabel: string; index: number }
  ) {
    state.melody.blockLabels.splice(index, 0, blockLabel)
  },
  /**
   * ブロックを移動させる
   * @param oldIndex 移動前のindex
   * @param newIndex 移動後のindex
   */
  MOVE_BLOCK(
    state: MusicState,
    { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
  ) {
    const labels = state.melody.blockLabels.splice(oldIndex, 1)
    state.melody.blockLabels.splice(newIndex, 0, labels[0])
  },
  /**
   * ブロックをブロックリストに追加する
   * @param block 追加するブロック
   */
  ADD_BLOCK_TO_LIST(state: MusicState, block: Block) {
    state.blocks.melody[block.label] = block
  },
  /**
   * ブロックに新しいsoundを追加する
   * @param blockLabel 追加するブロックの名前
   * @param sound 追加するsound
   */
  ADD_SOUND(
    state: MusicState,
    { blockLabel, sound }: { blockLabel: string; sound: Sound }
  ) {
    sound.id = state.blocks.melody[blockLabel].sounds.length + 1
    state.blocks.melody[blockLabel].sounds.push(sound)
  },
  /**
   * ブロックのsoundを変更する
   * @param blockLabel 変更する音が存在しているブロックの名前
   * @param sound 変更後のsound
   */
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
    /**
     * blockをメロディにクローンする
     * @param blockLabel ブロックの名前
     * @param index 追加する場所
     */
    cloneBlock(
      { commit },
      { blockLabel, index }: { blockLabel: string; index: number }
    ) {
      commit('CLONE_BLOCK', { blockLabel, index })
    },
    /**
     * ブロックを移動させる
     * @param oldIndex 移動前のindex
     * @param newIndex 移動後のindex
     */
    moveBlock(
      { commit },
      { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
    ) {
      commit('MOVE_BLOCK', { oldIndex, newIndex })
    },
    /**
     * ブロックをブロックリストに追加する
     * @param block 追加するブロック
     */
    addBlock({ commit }, block: Block) {
      commit('ADD_BLOCK_TO_LIST', block)
    },
    /**
     * ブロックに新しいsoundを追加する
     * @param blockLabel 追加するブロックの名前
     * @param sound 追加するsound
     */
    addSound(
      { commit },
      { blockLabel, sound }: { blockLabel: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { blockLabel, sound })
    },
    /**
     * ブロックのsoundを変更する
     * @param blockLabel 変更する音が存在しているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      { blockLabel, sound }: { blockLabel: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { blockLabel, sound })
    }
  }
)
