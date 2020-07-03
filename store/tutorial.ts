import { mutationTree, actionTree } from 'typed-vuex'

export const state = () => ({
  steps: [
    {
      element: '#share-button',
      popover: {
        title: 'とりまやっていこう',
        description: 'ボタンを押すんや',
        position: 'top-left'
      }
    },
    {
      element: '#rhythm-score',
      popover: {
        title: 'リズムパート',
        description: 'ドラムなどリズム隊を担当します',
        position: 'bottom-left'
      },
      disableTouch: true
    },
    {
      element: '#rhythm-plus-button',
      popover: {
        title: '試しに追加してみようぜ',
        description: 'このボタンを押してみてくれ',
        position: 'bottom-left',
        showButtons: false
      },
      nextEvent: {
        elemId: '#rhythm-plus-button'
      },
      delay: 500
    },
    {
      element: '#rhythm-block-list',
      popover: {
        title: 'いいね!',
        description: '次はブロックを選択して追加してみてくれ',
        position: 'top-right',
        showButtons: false
      },
      nextEvent: {
        elemId: '#rhythm-block-list-add'
      }
    },
    {
      element: '#rhythm-score',
      popover: {
        title: '追加成功',
        description:
          '追加されたのを確認してくれ<br/>これでこのレッスンは終わりです!',
        position: 'bottom-left'
      }
    }
  ]
})

export type TutorialState = ReturnType<typeof state>

export const mutations = mutationTree(state, {})

export const actions = actionTree({ state, mutations }, {})
