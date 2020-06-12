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
    blockNames: ['メロ1', 'メロ2', 'メロ3', 'メロ4'],
    gain: 1
  },
  chord: {
    blockNames: ['王道', 'カノン', '小室', 'Let it Be', '下降転調'],
    gain: 1
  },
  rhythm: {
    blockNames: ['2ビート', '8ビート', '16ビート'],
    gain: 1
  },
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
  // blockListの名前のみを返す
  melodyBlockNames: (state: MusicState): string[] =>
    Object.keys(state.blocks.melody),
  // メロディーのblocksを返す
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockNames.map((name) => state.blocks.melody[name])
})

export const mutations = mutationTree(state, {
  /**
   * blockをメロディにクローンする
   * @param blockName ブロックの名前
   * @param index 追加する場所
   */
  CLONE_BLOCK(
    state: MusicState,
    { blockName, index }: { blockName: string; index: number }
  ) {
    state.melody.blockNames.splice(index, 0, blockName)
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
    const names = state.melody.blockNames.splice(oldIndex, 1)
    state.melody.blockNames.splice(newIndex, 0, names[0])
  },
  /**
   * ブロックをブロックリストに追加する
   * @param block 追加するブロック
   */
  ADD_BLOCK_TO_LIST(state: MusicState, block: Block) {
    state.blocks.melody[block.name] = block
  },
  /**
   * ブロックに新しいsoundを追加する
   * @param blockName 追加するブロックの名前
   * @param sound 追加するsound
   */
  ADD_SOUND(
    state: MusicState,
    { blockName, sound }: { blockName: string; sound: Sound }
  ) {
    sound.id = state.blocks.melody[blockName].sounds.length + 1
    state.blocks.melody[blockName].sounds.push(sound)
  },
  /**
   * ブロックのsoundを変更する
   * @param blockName 変更する音が存在しているブロックの名前
   * @param sound 変更後のsound
   */
  UPDATE_SOUND(
    state: MusicState,
    { blockName, sound }: { blockName: string; sound: Sound }
  ) {
    state.blocks.melody[blockName].sounds.splice((sound.id || 0) - 1, 1, sound)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    /**
     * blockをメロディにクローンする
     * @param blockName ブロックの名前
     * @param index 追加する場所
     */
    cloneBlock(
      { commit },
      { blockName, index }: { blockName: string; index: number }
    ) {
      commit('CLONE_BLOCK', { blockName, index })
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
     * @param blockName 追加するブロックの名前
     * @param sound 追加するsound
     */
    addSound(
      { commit },
      { blockName, sound }: { blockName: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { blockName, sound })
    },
    /**
     * ブロックのsoundを変更する
     * @param blockName 変更する音が存在しているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      { blockName, sound }: { blockName: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { blockName, sound })
    }
  }
)
