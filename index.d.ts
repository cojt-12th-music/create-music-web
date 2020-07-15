import { accessorType } from '@/store'
import { firestoreAccessor } from '@/plugins/firebase'
import { Driver } from '@/types/lesson'

/**
 * nuxt-typed-vuex用
 */
declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $driver: Driver
    $firebase: typeof firestoreAccessor
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $driver: Driver
    $firebase: typeof firestoreAccessor
  }
}
