import colors from 'vuetify/es5/util/colors'
import { Configuration } from '@nuxt/types'
import { InstPlugin } from './tools/im/plugin'
import { ReverbPlugin } from './tools/reverb/plugin'

const instPlugin = new InstPlugin()
const reverbPlugin = new ReverbPlugin()

const config: Configuration = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'ja',
      prefix: 'og: http://ogp.me/ns#'
    },
    titleTemplate: '%s - サブタイトル',
    title: '気軽に音楽を作ろう',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      },
      { hid: 'og:site_name', property: 'og:site_name', content: 'サイト名' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.google.co.jp'
      },
      { hid: 'og:title', property: 'og:title', content: 'サイトタイトル' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '共通ディスクリプション'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://create-music-web.web.app/ogp.png'
      }
      // { name: 'twitter:card', content: 'summary' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['plugins/vuetify', '~/plugins/firebase'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: {
        family: 'Noto Sans JP'
      }
    },
    theme: {
      dark: false,
      default: 'light',
      disable: false,
      options: {},
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  styleResources: {
    scss: ['@/assets/style/main.scss']
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transpile: [/typed-vuex/],
    extend(config, ctx) {
      if (ctx.isClient) {
        if (config.plugins) config.plugins.push(instPlugin, reverbPlugin)
        else config.plugins = [instPlugin, reverbPlugin]
      }
    },
    babel: {
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    }
  }
}

export default config
