// @vitest-environment node
/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getJobs, getPartnerPage, getPartners } from './catalog'

const partnersJson = readFileSync(
  new URL('../../public/mock/partners.json', import.meta.url),
  'utf8',
)
const jobsJson = readFileSync(
  new URL('../../public/mock/jobs.json', import.meta.url),
  'utf8',
)

describe('catalog API', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.9)
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) =>
        Promise.resolve(
          new Response(url.includes('partners') ? partnersJson : jobsJson),
        ),
      ),
    )
  })

  it('validates fixtures and limits jobs to the selected partner', async () => {
    const request = getPartnerPage(
      'forma-industry',
      new AbortController().signal,
    )
    await vi.runAllTimersAsync()
    const result = await request
    expect(result.partner.name).toBe('Forma Industry')
    expect(result.jobs).toHaveLength(7)
    expect(
      result.jobs.every((job) => job.partnerSlug === 'forma-industry'),
    ).toBe(true)
  })

  it('serves all 18 jobs for the VV Work collection', async () => {
    const request = getPartnerPage('vv-work', new AbortController().signal)
    await vi.runAllTimersAsync()
    expect((await request).jobs).toHaveLength(18)
  })

  it('returns a meaningful 404 for unknown partners', async () => {
    const rejected = expect(
      getPartnerPage('missing', new AbortController().signal),
    ).rejects.toMatchObject({ status: 404 })
    await vi.runAllTimersAsync()
    await rejected
  })

  it.each([getJobs, getPartners])(
    'rejects malformed API data',
    async (load) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('[{"unexpected":true}]')),
      )
      const rejected = expect(
        load(new AbortController().signal),
      ).rejects.toThrow('Некоректні дані')
      await vi.runAllTimersAsync()
      await rejected
    },
  )
})
