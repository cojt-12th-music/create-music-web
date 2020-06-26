import { accessorType } from '@/store'
import { firestoreAccessor } from '@/plugins/firebase'

/**
 * nuxt-typed-vuex用
 */
declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $firebase: typeof firestoreAccessor
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $firebase: typeof firestoreAccessor
  }
}
