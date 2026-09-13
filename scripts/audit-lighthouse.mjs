import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'

const url = process.env.AUDIT_URL || 'http://127.0.0.1:4180/'
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ['--headless', ...(process.env.CHROME_NO_SANDBOX === '1' ? ['--no-sandbox'] : [])],
})

try {
  // Default Lighthouse mobile emulation, simulated throttling, fresh storage.
  // Do not override the application's latency or random API failures.
  const result = await lighthouse(url, {
    port: chrome.port, output: ['html', 'json'], logLevel: 'error',
  })
  assert.ok(result, 'Lighthouse did not produce a report')
  await mkdir('docs/audits', { recursive: true })
  await writeFile('docs/audits/lighthouse.html', result.report[0])
  await writeFile('docs/audits/lighthouse.json', result.report[1])
  const { lhr } = result
  console.log(Object.fromEntries(Object.entries(lhr.categories).map(([id, category]) => [id, Math.round(category.score * 100)])))
  assert.ok(!lhr.runtimeError, lhr.runtimeError?.message)
  assert.ok(lhr.categories.performance.score >= 0.9, 'Performance must be at least 90')
} finally {
  await chrome.kill()
}
