import { Plugin, Compiler } from 'webpack'
import fs from 'fs-extra'
import { main } from './index'
let ran = false
export class ReverbPlugin implements Plugin {
  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tapPromise('ReverbPlugin', async () => {
      if (ran) return
      ran = true
      if (!fs.existsSync('static/reverbs')) await main()
    })
  }
}
