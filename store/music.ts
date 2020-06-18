/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound } from '@/types/music'
import {
  MELODY_BLOCKS,
  CHORD_BLOCKS,
  CHORD_PRESETS,
  RHYTHM_BLOCKS
} from '@/lib/presets'

export const state = (): Music => ({
  melody: {
    instrument: 'guitar',
    blockNames: ['メロ1', 'メロ2', 'メロ3', 'メロ4'],
    gain: 1
  },
  chord: {
    instrument: 'guitar',
    blockNames: [],
    gain: 1
  },
  rhythm: {
    instrument: 'guitar',
    blockNames: [],
    gain: 1
  },
  blocks: {
    // プリセットなどはとりあえず @/lib/presets.ts に定義している
    melody: MELODY_BLOCKS,
    chord: CHORD_BLOCKS,
    rhythm: RHYTHM_BLOCKS
  },
  bpm: 100
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  // blockListの名前のみを返す
  melodyTemplateNames: (state: MusicState): string[] =>
    Object.keys(state.blocks.melody),
  // メロディーのblocksを返す
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockNames.map((name) => state.blocks.melody[name])
})

export const mutations = mutationTree(state, {
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
    if (sound.id) {
      state.blocks.melody[blockName].sounds.splice(sound.id - 1, 1, sound)
    }
  },
  /**
   * 楽譜のブロック配列を置き換える
   * v-modelで変更を観測したときに呼ぶ
   * @param blockNames 変更後のブロック配列
   */
  SET_BLOCK_NAMES(state: MusicState, blockNames: string[]) {
    state.melody.blockNames.splice(
      0,
      state.melody.blockNames.length,
      ...blockNames
    )
  },
  /**
   * コードのプリセットをセットする
   * @param presetName セットするプリセット名
   */
  SET_CHORD_PRESET(state: MusicState, presetName: string) {
    const preset = CHORD_PRESETS[presetName]
    const namesLength = state.chord.blockNames.length
    state.chord.blockNames.splice(0, namesLength, ...preset.blockNames)
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
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
    addBlockToList({ commit }, block: Block) {
      commit('ADD_BLOCK_TO_LIST', block)
    },
    /**
     * blockをディープコピーし, 新たなblockを追加する
     * hoge というblockをコピーする場合, hoge' というblockを新しく生成する
     * @param blockName コピーするブロックの名前
     */
    copyBlock({ state, commit }, blockName: string) {
      const block = JSON.parse(JSON.stringify(state.blocks.melody[blockName]))
      block.name = `${block.name}'`
      commit('ADD_BLOCK_TO_LIST', block)
    },
    /**
     * ブロックに新しいsoundを追加する
     * @param blockName soundを追加するブロックの名前
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
     * @param blockName 変更するsoundを持っているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      { blockName, sound }: { blockName: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { blockName, sound })
    },
    /**
     * 楽譜のブロック配列を置き換える
     * v-modelで変更を観測したときに呼ぶ
     * @param blockNames 変更後のブロック配列
     */
    setBlockNames({ commit }, blockNames: string[]) {
      commit('SET_BLOCK_NAMES', blockNames)
    },
    /**
     * コードのプリセットをセットする
     * @param presetName セットするプリセット名
     */
    setChordPreset({ commit }, presetName: string) {
      commit('SET_CHORD_PRESET', presetName)
    }
  }
)
