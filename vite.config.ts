import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/m.foerster/circuitSim/", //Set Base to ./ so that assets are found correctly on deployment
  plugins: [react()],
})
