import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        // 引入全局变量文件
        additionalData: `@import "${resolve(__dirname, './src/assets/less/theme-colors.less')}";`,
      }
    }
  }
})
