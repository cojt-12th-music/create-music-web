import { Plugin, Compiler } from 'webpack'
import fs from 'fs-extra'
import { main } from './index'
let ran = false
export class InstPlugin implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise('InstPlugin', async () => {
      if (ran) return
      ran = true
      if (!fs.existsSync('static/instruments')) await main()
    })
  }
}
