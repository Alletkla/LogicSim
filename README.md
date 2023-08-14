# LogicSim
A concise browser based logic simulation

# Local execution
For local execution build the app with this plugin in vite.config.ts

import { defineConfig } from 'vite'
import { viteSingleFile } from "vite-plugin-singlefile"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
})
