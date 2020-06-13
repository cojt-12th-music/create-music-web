/**
 * music.d.ts
 * ユーザが作成する楽譜に関するデータ型
 * 各ブロックはblocks以下に置き, メロディ, コード, リズムそれぞれではblockの参照を持つ
 * 楽譜内における時間は, 4分音符1つ分を1とする
 */

/**
 * Sound: 音に関するデータ型
 * id: Block内における識別子. auto incrementが良さそう
 * key: 再生する音源のキー
 * delay: 音源を再生する相対時刻
 * duration: 音源を再生する相対時間
 */
export interface Sound {
  id?: number
  key: number
  delay: number
  duration: number
}

/**
 * Block: ブロックに関するデータ型. 編集画面のブロックの部分である.
 * name: ブロックのラベル (Firestoreにおける主キー)
 * sounds: ブロックの構成する音
 * duration: ブロックを再生するのにかかる時間
 */
export interface Block {
  name: string
  sounds: Sound[]
  duration: number
}

// ブロックのnameをキーとするオブジェクト
interface BlockHash {
  [blockName: string]: Block
}

/**
 * Preset: プリセットに関するデータ型. コードやリズムにおいて使用?
 * name: プリセット名
 * blockNames: プリセットを構成するブロックの並び
 */
export interface Preset {
  name: string
  blockNames: string[]
}

// プリセットのnameをキーとするオブジェクト
interface PresetHash {
  [presetName: string]: Preset
}

/**
 * Melody: 楽譜の内メロディ全体に関するデータ型
 * instrument: メロディを再生する際の楽器
 * blockNames: メロディを構成するブロック配列
 * gain: メロディ全ての音源のゲイン (楽器の音調節用)
 */
export interface Melody {
  instrument: string
  blockNames: string[]
  gain: number
}

// コードに関するデータ型
export interface Chord {
  instrument: string
  blockNames: string[]
  gain: number
}

// リズムに関するデータ型
export interface Rhythm {
  instrument: string
  blockNames: string[]
  gain: number
}

/**
 * Music: 楽譜全体に関するデータ型
 * bpm: 楽曲再生時のbpm
 * melody: メロディの楽譜情報
 * chord: コードの楽譜情報
 * rhythm: リズムの楽譜情報
 * blocks: melody, chord, rhytmそれぞれのブロック
 */
export interface Music {
  bpm: number
  melody: Melody
  chord: Chord
  rhythm: Rhythm
  blocks: {
    melody: BlockHash
    chord: BlockHash
    rhythm: BlockHash
  }
}
