import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'

const baseURL = process.env.AUDIT_URL || 'http://127.0.0.1:4180'
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: 'chrome' }),
})
const report = { date: new Date().toISOString(), baseURL, browser: browser.version(), scans: [] }
const pageErrors = []

async function scan(page, name) {
  await page.evaluate(() => document.fonts.ready)
  const result = await new AxeBuilder({ page }).analyze()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  report.scans.push({
    name, url: page.url(), viewport: page.viewportSize(),
    engine: result.testEngine, passedRules: result.passes.length,
    violations: result.violations, incomplete: result.incomplete, overflow,
  })
  console.log(`${name}: ${result.violations.length} axe violations, overflow=${overflow}`)
  for (const violation of result.violations)
    console.log(`  ${violation.impact}: ${violation.id} — ${violation.nodes.map(node => node.target.join(' ')).join(', ')}`)
}

try {
  for (const width of [1440, 768, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } })
    // Only the audit browser is deterministic. Production retains random errors.
    await context.addInitScript(() => { Math.random = () => 0.9 })
    const page = await context.newPage()
    page.on('pageerror', error => pageErrors.push(error.message))
    await page.goto(baseURL)
    await page.locator('#partners li').first().waitFor()
    await scan(page, `home-${width}`)
    if (width === 375) {
      const toggle = page.getByRole('button', { name: 'Відкрити меню' })
      await toggle.click()
      await scan(page, 'mobile-menu')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Escape')
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
      assert.equal(await toggle.evaluate(element => element === document.activeElement), true)
    }
    await page.goto(`${baseURL}/partners/forma-industry`)
    await page.getByRole('heading', { name: 'Forma Industry', exact: true }).waitFor()
    await scan(page, `partner-${width}`)
    await page.goto(`${baseURL}/контакти`)
    await page.getByLabel('Ім’я', { exact: true }).waitFor()
    await scan(page, `contacts-${width}`)
    if (width === 375) {
      await page.getByRole('button', { name: 'Надіслати заявку' }).click()
      assert.equal(await page.locator('#application-name').evaluate(element => element === document.activeElement), true)
      await scan(page, 'form-invalid')
      await page.getByLabel('Ім’я', { exact: true }).fill('Олена')
      await page.getByLabel('Телефон або Telegram').fill('@olena_work')
      await page.evaluate(() => { Math.random = () => 0 })
      await page.getByRole('button', { name: 'Надіслати заявку' }).click()
      await page.getByRole('alert').waitFor()
      await scan(page, 'form-error')
      assert.equal(await page.getByLabel('Телефон або Telegram').inputValue(), '@olena_work')
      await page.evaluate(() => { Math.random = () => 0.9 })
      await page.getByRole('button', { name: 'Спробувати ще раз' }).click()
      await page.getByText('Демонстраційну заявку прийнято').waitFor()
      await scan(page, 'form-success')
      await page.getByRole('button', { name: 'Нова заявка' }).click()
      assert.equal(await page.getByLabel('Ім’я', { exact: true }).inputValue(), '')
      await page.getByRole('link', { name: 'Шукаю працівників', exact: true }).click()
      await page.getByRole('heading', { name: 'Розкажи про свою команду' }).waitFor()
      await scan(page, 'employer-form')
    }
    await context.close()
  }

  const context = await browser.newContext({ viewport: { width: 375, height: 812 } })
  await context.addInitScript(() => {
    Math.random = () => {
      // axe also creates a sandboxed iframe, which has no sessionStorage access.
      try { return sessionStorage.getItem('audit-failure') === '1' ? 0 : 0.9 }
      catch { return 0.9 }
    }
  })
  const page = await context.newPage()
  page.on('pageerror', error => pageErrors.push(error.message))
  for (const [name, path, ready] of [
    ['home', '/', '#partners li'],
    ['partner', '/partners/forma-industry', 'h1:has-text("Forma Industry")'],
    ['vacancy-form', '/контакти?job=job-07&partner=forma-industry', '#application-name'],
  ]) {
    // Hold JSON responses so loading remains visible for the entire axe scan.
    let release
    const gate = new Promise(resolve => { release = resolve })
    await page.route('**/mock/*.json', async route => { await gate; await route.continue() })
    await page.goto(`${baseURL}${path}`)
    await page.getByRole('status', { name: 'Завантаження даних' }).waitFor()
    await scan(page, `${name}-loading`)
    release()
    await page.locator(ready).first().waitFor()
    await page.unrouteAll({ behavior: 'wait' })
    await scan(page, `${name}-loaded`)
    await page.evaluate(() => sessionStorage.setItem('audit-failure', '1'))
    await page.reload()
    await page.getByRole('button', { name: 'Спробувати ще раз' }).waitFor()
    await scan(page, `${name}-error`)
    await page.evaluate(() => sessionStorage.removeItem('audit-failure'))
    await page.getByRole('button', { name: 'Спробувати ще раз' }).click()
    await page.locator(ready).first().waitFor()
    await scan(page, `${name}-retry-success`)
  }
  await page.goto(`${baseURL}/partners/vv-work?q=zzzzzz`)
  await page.getByRole('heading', { name: 'Поки немає таких вакансій' }).waitFor()
  await scan(page, 'empty-jobs')
  await context.close()
} finally {
  await browser.close()
  report.pageErrors = pageErrors
  await mkdir('docs/audits', { recursive: true })
  await writeFile('docs/audits/axe.json', JSON.stringify(report, null, 2) + '\n')
}

assert.equal(pageErrors.length, 0, 'Browser runtime errors')
assert.equal(report.scans.some(scan => scan.overflow || scan.violations.length), false,
  'Accessibility or overflow issues: see docs/audits/axe.json')
