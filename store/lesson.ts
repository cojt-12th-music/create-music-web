import { mutationTree, actionTree } from 'typed-vuex'
import { LessonState } from '@/types/lesson'

export const state = (): LessonState => ({
  isAvailable: true,
  steps: [
    {
      element: '#score-title',
      popover: {
        title: 'とりまやっていこう',
        description: 'ボタンを押すんや',
        position: 'bottom-left'
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
        element: '#rhythm-plus-button',
        eventType: 'click'
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
        element: '#rhythm-block-list-add',
        eventType: 'click'
      }
    },
    {
      element: '#rhythm-score',
      popover: {
        title: '追加成功',
        description:
          '追加されたのを確認してくれ<br/>ブロックを動かすこともできるぞ',
        position: 'bottom-left'
      }
    },
    {
      element: '#play-button',
      popover: {
        title: '再生してみよう',
        description: '美しい旋律に酔いしれような',
        position: 'top-center',
        showButtons: false
      },
      nextEvent: {
        element: '#play-button',
        eventType: 'click'
      }
    },
    {
      element: '#share-button',
      popover: {
        title: '良い曲ですね...',
        description: 'よければシェアしてください',
        position: 'top-center'
      }
    }
  ]
})

export const mutations = mutationTree(state, {})

export const actions = actionTree({ state, mutations }, {})
