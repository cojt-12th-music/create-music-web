/**
 * music.d.ts
 * ユーザが作成する楽譜に関するデータ型
 */

/**
 * Sound: 音に関するデータ型
 * key: 再生する音源のキー
 * delay: 音源を再生する相対時刻
 * duration: 音源を再生する相対時間
 * TODO: 4分音符1つ分を1とした時間にする?
 */
export interface Sound {
  key: number
  delay: number
  duration: number
}
/**
 * Block: ブロックに関するデータ型. 編集画面のブロックの部分である.
 * label: ブロックのラベル
 * sounds: ブロックの構成する音
 * totalTime: ブロックの時間
 * TODO: 4分音符1つ分を1とした時間にする?
 */
export interface Block {
  label: string
  sounds: Sound[]
  totalTime: number
}

/**
 * Melody: 楽譜の内メロディ全体に関するデータ型
 * blockLabels: メロディを構成するブロック配列
 */
export interface Melody {
  blockLabels: string[]
  gain: number
}

// コードに関するデータ型
export interface Chord {}

// リズムに関するデータ型
export interface Rhythm {}

// 楽譜全体に関するデータ型
export interface Music {
  bpm: number
  melody: Melody
  chord: Chord
  rhythm: Rhythm
  blocks: {
    melody: { [label: string]: Block }
    chord: { [label: string]: Block }
    rhythm: { [label: string]: Block }
  }
}
