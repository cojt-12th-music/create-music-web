/**
 * music.d.ts
 * ユーザが作成する楽譜に関するデータ型
 */

/**
 * Sound: 音に関するデータ型
 * key: 再生する音源のキー
 * delay: 音源を再生する相対時刻
 */
export interface Sound {
  key: number
  delay: number
}
/**
 * Block: ブロックに関するデータ型. 編集画面のブロックの部分である.
 * label: ブロックのラベル
 * sounds: ブロックの構成する音
 */
export interface Block {
  label: string
  sounds: Sound[]
}

/**
 * Melody: 楽譜の内メロディ全体に関するデータ型
 * blocks: メロディを構成するブロック配列
 */
export interface Melody {
  blockLabels: string[]
}

// コードに関するデータ型
export interface Chord {}

// リズムに関するデータ型
export interface Rhythm {}

// 楽譜全体に関するデータ型
export interface Music {
  melody: Melody
  chord: Chord
  rhythm: Rhythm
  blocks: {
    melody: { [label: string]: Block }
    chord: { [label: string]: Block }
    rhythm: { [label: string]: Block }
  }
}
