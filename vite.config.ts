import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
<<<<<<< HEAD
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
=======
>>>>>>> ac19ec8b35e579b93b6f95d36d90e49db24319b4
});