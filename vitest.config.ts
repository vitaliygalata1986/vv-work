import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: [
        'src/api/**/*.ts',
        'src/hooks/**/*.ts',
        'src/features/jobs/**/*.{ts,tsx}',
        'src/features/applications/**/*.{ts,tsx}',
        'src/pages/ContactsPage.tsx',
        'src/pages/PartnerPage.tsx',
        'src/features/home/PartnersSection.tsx',
      ],
      exclude: ['**/*.test.{ts,tsx}'],
      thresholds: { statements: 60, branches: 60, functions: 60, lines: 60 },
    },
  },
})
