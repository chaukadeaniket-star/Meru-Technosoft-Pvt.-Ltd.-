import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.GITHUB_ACTIONS === 'true'
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}/`
    : '/',
})
