/**
 * store/music.ts
 * ユーザが作成する楽譜に関するstore
 */

import Vue from 'vue'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { Music, Block, Sound, ScorePart } from '@/types/music'
import { MELODY_BLOCKS, CHORD_BLOCKS, RHYTHM_BLOCKS } from '@/lib/presets'
import { firestoreAccessor } from '@/plugins/firebase'

export const state = (): Music => ({
  id: '',
  userId: '',
  title: '無題のタイトル',
  composer: '名無しの作曲者',
  bpm: 100,
  melody: {
    instrument: '',
    blockNames: [],
    gain: 1
  },
  chord: {
    instrument: '',
    blockNames: [],
    gain: 1
  },
  rhythm: {
    instrument: '',
    blockNames: [],
    gain: 1
  },
  blocks: {
    // プリセットなどはとりあえず @/lib/presets.ts に定義している
    melody: MELODY_BLOCKS,
    chord: CHORD_BLOCKS,
    rhythm: RHYTHM_BLOCKS
  }
})

export type MusicState = ReturnType<typeof state>

export const getters = getterTree(state, {
  /**
   * テンプレートのブロック配列を返す系のgetters
   * 編集時に使用する
   */
  // メロディー
  melodyTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.melody),
  // コード
  chordTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.chord),
  // リズム
  rhythmTemplates: (state: MusicState): Block[] =>
    Object.values(state.blocks.rhythm),
  // 以上を関数化したもの
  partTemplates: (state: MusicState): ((part: ScorePart) => Block[]) => (
    part: ScorePart
  ) => Object.values(state.blocks[part]),

  /**
   * 実際に再生する順番でblocksを返す系のgetters
   * 音源の再生時に使用する
   */
  // メロディー
  melodyBlocks: (state: MusicState): Block[] =>
    state.melody.blockNames.map((name) => state.blocks.melody[name]),
  // コード
  chordBlocks: (state: MusicState): Block[] =>
    state.chord.blockNames.map((name) => state.blocks.chord[name]),
  // リズム
  rhythmBlocks: (state: MusicState): Block[] =>
    state.rhythm.blockNames.map((name) => state.blocks.rhythm[name]),
  // 以上を関数化したもの
  partBlocks: (state: MusicState): ((part: ScorePart) => Block[]) => (
    part: ScorePart
  ) => state[part].blockNames.map((name) => state.blocks[part][name]),

  /**
   * 各パートの楽器名を返す系のgetters
   */
  // メロディー
  melodyInstrument: (state: MusicState): string => state.melody.instrument,
  // コード
  chordInstrument: (state: MusicState): string => state.chord.instrument,
  rhythmInstrument: (state: MusicState): string => state.rhythm.instrument,

  maxDuration: (state: MusicState): number => {
    const rhythmDuration = state.rhythm.blockNames.reduce(
      (p: number, name: string) => p + state.blocks.rhythm[name].duration,
      0
    )
    const chordDuration = state.chord.blockNames.reduce(
      (p: number, name: string) => p + state.blocks.chord[name].duration,
      0
    )
    const melodyDuration = state.melody.blockNames.reduce(
      (p: number, name: string) => p + state.blocks.melody[name].duration,
      0
    )

    return Math.max(rhythmDuration, chordDuration, melodyDuration)
  },
  durationAccumurations: (
    state: MusicState
  ): ((part: ScorePart) => number[]) => (part: ScorePart) => {
    let accDuration = 0
    return state[part].blockNames.map((name) => {
      accDuration += state.blocks[part][name].duration
      return accDuration
    })
  }
})

export const mutations = mutationTree(state, {
  /**
   * blockをメロディにクローンする
   * @param blockName ブロックの名前
   * @param index 追加する場所
   */
  CLONE_BLOCK(
    state: MusicState,
    { part, blockName }: { part: ScorePart; blockName: string }
  ) {
    state[part].blockNames.push(blockName)
  },
  /**
   * ブロックを変更する
   * @param part 変更するブロックのパート
   * @param block 変更するブロック
   */
  UPDATE_BLOCK_LIST(
    state: MusicState,
    { part, block }: { part: ScorePart; block: Block }
  ) {
    Vue.set(state.blocks[part], block.name, block)
  },
  /**
   * ブロックに新しいsoundを追加する
   * @param blockName 追加するブロックの名前
   * @param sound 追加するsound
   */
  ADD_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      sound
    }: { part: ScorePart; blockName: string; sound: Sound }
  ) {
    const sounds = state.blocks[part][blockName].sounds
    sound.id = (sounds[sounds.length - 1]?.id || 0) + 1
    sounds.push(sound)
  },
  /**
   * ブロックのsoundを削除する
   * @param blockName 削除するブロックの名前
   * @param soundId 削除するsoundのId
   */
  DELETE_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      soundId
    }: { part: ScorePart; blockName: string; soundId: number }
  ) {
    const i = state.blocks[part][blockName].sounds.findIndex(
      (e) => e.id === soundId
    )
    state.blocks[part][blockName].sounds.splice(i, 1)
  },
  /**
   * ブロックのsoundを変更する
   * @param blockName 変更する音が存在しているブロックの名前
   * @param sound 変更後のsound
   */
  UPDATE_SOUND(
    state: MusicState,
    {
      part,
      blockName,
      sound
    }: { part: ScorePart; blockName: string; sound: Sound }
  ) {
    if (sound.id) {
      const i = state.blocks[part][blockName].sounds.findIndex(
        (e) => e.id === sound.id
      )
      state.blocks[part][blockName].sounds.splice(i, 1, sound)
    }
  },
  /**
   * 指定したブロックのdurationを更新する
   * @param part 更新するブロックのパート
   * @param blockName 更新するブロックの名前
   */
  REFRESH_BLOCK_DURATION(
    state: MusicState,
    { part, blockName }: { part: ScorePart; blockName: string }
  ) {
    const blockHash = state.blocks[part]
    if (blockHash[blockName].sounds.length) {
      /*
        音が存在する場合はdurationの最大値以上の数値で最小の4の倍数をセット
        (4拍子を想定)
      */
      blockHash[blockName].duration =
        Math.ceil(
          blockHash[blockName].sounds.reduce(
            (d: number, sound: Sound) =>
              Math.max(sound.delay + sound.duration, d),
            0
          ) / 4
        ) * 4
    } else {
      // 音が存在しない場合は4をセット
      blockHash[blockName].duration = 4
    }
  },
  /**
   * 楽譜のブロック配列を置き換える
   * v-modelで変更を観測したときに呼ぶ
   * @param blockNames 変更後のブロック配列
   */
  SET_BLOCK_NAMES(
    state: MusicState,
    { part, blockNames }: { part: ScorePart; blockNames: string[] }
  ) {
    const blocksCount = state[part].blockNames.length
    state[part].blockNames.splice(0, blocksCount, ...blockNames)
  },
  /**
   * 楽譜の音量を変更する
   * @param part 音量を変更するパート
   * @param gain セットするゲインの値
   */
  SET_GAIN(
    state: MusicState,
    { part, gain }: { part: ScorePart; gain: number }
  ) {
    state[part].gain = gain
  },
  /**
   * 楽譜の楽器を変更する
   * @param part 楽器を変更するパート
   * @param inst セットする楽器名
   */
  SET_INSTRUMENT(
    state: MusicState,
    { part, inst }: { part: ScorePart; inst: string }
  ) {
    state[part].instrument = inst
  },
  /**
   * BPMを変更する
   * @param bpm セットするBPMの値
   */
  SET_BPM(state: MusicState, bpm: number) {
    state.bpm = bpm
  },
  /**
   * 楽曲名を変更する
   * @param input セットする楽曲名
   */
  SET_TITLE(state: MusicState, input: string) {
    state.title = input
  },
  /**
   * 作曲者を変更する
   * @param input セットする作曲者名
   */
  SET_COMPOSER(state: MusicState, input: string) {
    state.composer = input
  },
  SET_USER_ID(state: MusicState, userId: string) {
    state.userId = userId
  },
  /**
   * 楽譜データをFirestoreからfetchしてstateにセットする
   * @param presetName セットするプリセット名
   */
  SET_SCORE(state: MusicState, data: Music) {
    Object.assign(state, data)
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
      { part, blockName }: { part: ScorePart; blockName: string }
    ) {
      commit('CLONE_BLOCK', { part, blockName })
    },
    /**
     * ブロックをブロックリストに追加する
     * @param block 追加するブロック
     */
    addBlockToList(
      { commit },
      { part, block }: { part: ScorePart; block: Block }
    ) {
      commit('UPDATE_BLOCK_LIST', { part, block })
    },
    /**
     * ブロックを変更する
     * @param block 変更するブロック
     */
    updateBlock(
      { commit },
      { part, block }: { part: ScorePart; block: Block }
    ) {
      commit('UPDATE_BLOCK_LIST', { part, block })
    },
    /**
     * 初期ブロックを作成する
     * @param part ブロックのパート
     * @param blockName ブロックの名前
     */
    initBlock({ state, commit }, part: ScorePart): Block {
      const block: Block = {
        name: '無題',
        category: 'マイブロック',
        sounds: new Array<Sound>(0),
        duration: 4,
        isOriginal: true
      }
      // もしhoge'が存在しているならhoge''を見る, これを存在しないところまで繰り返す
      while (state.blocks[part][block.name]) {
        block.name = `${block.name}'`
      }
      commit('UPDATE_BLOCK_LIST', { part, block })
      commit('CLONE_BLOCK', { part, blockName: block.name })

      return block
    },
    /**
     * blockをディープコピーし, 新たなblockを追加する
     * hoge というblockをコピーする場合, hoge' というblockを新しく生成する
     * @param blockName コピーするブロックの名前
     */
    copyBlock(
      { state, commit },
      { part, blockName }: { part: ScorePart; blockName: string }
    ) {
      const block: Block = JSON.parse(
        JSON.stringify(state.blocks[part][blockName])
      )
      // もしhoge'が存在しているならhoge''を見る, これを存在しないところまで繰り返す
      while (state.blocks[part][block.name]) {
        block.name = `${block.name}'`
      }
      block.category = 'マイブロック'
      block.isOriginal = true
      // コピー後のブロックをリストに追加する
      commit('UPDATE_BLOCK_LIST', { part, block })

      // コピー前のブロック名をコピー後のものに置き換える
      const blockNames = state[part].blockNames.map((name: string) =>
        name === blockName ? block.name : name
      )
      commit('SET_BLOCK_NAMES', { part, blockNames })
    },
    /**
     * ブロックに新しいsoundを追加する
     * @param blockName soundを追加するブロックの名前
     * @param sound 追加するsound
     */
    addSound(
      { commit },
      {
        part,
        blockName,
        sound
      }: { part: ScorePart; blockName: string; sound: Sound }
    ) {
      commit('ADD_SOUND', { part, blockName, sound })
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
    },
    /**
     * ブロックのsoundを削除する
     * @param blockName 削除するブロックの名前
     * @param soundId 削除するsoundのId
     */
    deleteSound(
      { commit },
      {
        part,
        blockName,
        soundId
      }: { part: ScorePart; blockName: string; soundId: number }
    ) {
      commit('DELETE_SOUND', { part, blockName, soundId })
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
    },
    /**
     * ブロックのsoundを変更する
     * @param blockName 変更するsoundを持っているブロックの名前
     * @param sound 変更後のsound
     */
    updateSound(
      { commit },
      {
        part,
        blockName,
        sound
      }: { part: ScorePart; blockName: string; sound: Sound }
    ) {
      commit('UPDATE_SOUND', { part, blockName, sound })
      commit('REFRESH_BLOCK_DURATION', { part, blockName })
    },
    /**
     * 楽譜のブロック配列を置き換える
     * v-modelで変更を観測したときに呼ぶ
     * @param blockNames 変更後のブロック配列
     */
    setBlockNames(
      { commit },
      { part, blockNames }: { part: ScorePart; blockNames: string[] }
    ) {
      commit('SET_BLOCK_NAMES', { part, blockNames })
    },
    /**
     * 楽譜の音量を変更する
     * @param gain セットするゲインの値
     */
    setGain({ commit }, param: { part: ScorePart; gain: number }) {
      commit('SET_GAIN', param)
    },
    /**
     * メロディの楽器を変更する
     * @param inst セットする楽器名
     */
    setInstrument({ commit }, param: { part: ScorePart; inst: string }) {
      commit('SET_INSTRUMENT', param)
    },
    /**
     * BPMを変更する
     * @param bpm セットするBPMの値
     */
    setBpm({ commit }, bpm: number) {
      commit('SET_BPM', bpm)
    },
    setTitle({ commit }, Input: string) {
      commit('SET_TITLE', Input)
    },
    setComposer({ commit }, Input: string) {
      commit('SET_COMPOSER', Input)
    },
    setUserId({ commit }, userId: string) {
      commit('SET_USER_ID', userId)
    },
    /**
     * 楽譜をFirestoreに登録する
     */
    async addScore({ commit, state }) {
      await firestoreAccessor.scores
        .create({ ...state })
        .then((score) => commit('SET_SCORE', score))
    },
    updateScore({ state }) {
      firestoreAccessor.scores.update(state.id, { ...state })
    }
  }
)
