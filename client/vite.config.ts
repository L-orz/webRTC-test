import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ROOT_PATH = path.resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(ROOT_PATH, 'src') },
      { find: /^~/, replacement: '' },
    ],
  },
  css: {
    preprocessorOptions: {
      less: {
        relativeUrls: true,
        javascriptEnabled: true,
      },
    },
  },
})
