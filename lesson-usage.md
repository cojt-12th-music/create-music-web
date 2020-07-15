# レッスンの作り方

p○izaの講座とかみたいなのを作る方法です.  
レッスンは [Driver.js](https://github.com/kamranahmedse/driver.js)ベースで作っています.

レッスンは複数のステップで構成されます.  
各ステップでは強調するコンポーネントや吹き出しの中身を設定できます.  
強調されたコンポーネント以外のコンポーネントには触れません.

とりあえず動かしていろいろ察しろ.

json例:

```typescript
{
  steps: [
    {
      element: '#rhythm-score',
      popover: {
        title: 'リズムパート',
        description: 'ドラムなどリズム隊を担当します',
        position: 'bottom-left'
      },
      disableContent: true
    },
    {
      element: '#rhythm-plus-button',
      popover: {
        title: '試しに追加してみようぜ',
        description: 'このボタンを押してみてくれ',
        position: 'bottom-left',
        showButtons: false
      },
      moveNext: {
        element: '#rhythm-plus-button',
        eventType: 'click'
      }
    },
    {
      element: '#rhythm-block-list',
      popover: {
        title: 'ブロックリストが開きました',
        description: '次はブロックを選択して追加してみてくれ',
        position: 'top-right',
        showButtons: false
      },
      moveNext: {
        element: '#rhythm-block-list-add',
        eventType: 'click'
      },
      delay: 500
    }
  ]
}
```

## 作成上の注意

使用用途と違うのか実DOMをいじりまくる設計のせいなのか, バグが多発します.  
この辺直したいなら多分1からライブラリ作る方が早いです.

- 1つのレッスン内で同じ要素を強調させることができない
  - 謎バグ
- `overflow: scroll`ではみ出た部分をハイライトしようとするとバグる
  - 吹き出しは`position: absolute`で座標を直接指定して表示させるため仕方がない
  - スマホ版だと楽譜が基本overflowするので絶望
- 値の変化をトリガーに次のステップへ進むことはできない
  - なので「リズムのブロックが追加されたら次のステップへ行く」みたいなことはできない
  - `delay`を設定して適当に時間開けるようにくれ
  - 変更のwatchをするのめんどいんや...
- 「戻る」のボタンを押しても前のステップへ行くだけで変更が戻るわけではない
  - undo機能実装していないので
  - 「戻る」ボタンは非表示にしている

## ステップの設定

ステップは [Driver.js](https://github.com/kamranahmedse/driver.js)の`Step`型を拡張した型の配列で構成されます

```typescript
interface Step {
  /**
   * 元からDriver.jsにあるプロパティ
  */
  element: string // 強調させる要素のID
  popover: { // ポップオーバーの設定
    className: string // なんかポップオーバーにクラスを追加できるみたい (使わない)
    title: string // タイトル
    description: string // ボディ
    position: string // ポップオーバーを表示させる位置 (bottom-left, left, ...)
    showButtons: boolean // ポップオーバーのボタンを表示させるかどうか
    doneBtnText: string // 完了ボタンのテキスト
    closeBtnText: string // レッスンをやめるボタンのテキスト
    nextBtnText: string // 次のステップへ行くボタンのテキスト
    // prevBtnText: string // 前のステップへ行くボタンのテキスト
  }
  /**
   * 拡張したプロパティ
  */
  disableContent?: boolean // ハイライトした要素には触らせたくない時
  delay?: number // delay [ms] だけ表示を遅らせる. ダイアログなど最初は表示されていないものをハイライトしたいときに使ってくれ.
  moveNext?: { // 次のステップに進むトリガーをボタンなどのクリックにしたい時
    element: string // イベントターゲットのID
    eventType: string // イベントのタイプ (まだclickしか検証していない)
  }
}
```

## element IDの種類

こいつらを強調やイベントトリガーに指定する.  
`{part}`は `rhythm`, `chord`, `melody`の各パートを表す.

|  ID  |  要素の種類  |
| ---- | ---- |
|  #score-title  |  楽譜のタイトル  |
|  #score-composer  |  楽譜の作曲者  |
|  #menu-button  |  設定メニューボタン  |
|  #play-button  |  再生ボタン  |
|  #share-button  |  シェアボタン  |
|  #{part}-score  |  パートの楽譜  |
|  #{part}-header  |  パートのヘッダ部分 (アイコンとパート名がある部分)  |
|  #{part}-edit-area  |  パートの編集エリア (draggable部分)  |
|  #{part}-plus-button  |  パートのブロック追加ボタン  |
|  #{part}-block-list  |  パートのブロックリストモーダル  |
