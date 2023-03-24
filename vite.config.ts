import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '',
    rollupOptions: {
      input: 'src/scripts/tracker.ts',
      output: {
        format: 'umd',
        name: 'tracker',
        entryFileNames: 'tracker.js',
        globals: {
          window: 'window',
        },
      },
    },
  },
});
