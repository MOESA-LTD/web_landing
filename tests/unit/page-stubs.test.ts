import { describe, expect, it } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import { ROUTES } from '../../i18n/routes'

/**
 * Every page now exists, so `addPageStubs` must never stand in for a real ROUTES path: stubs are only for
 * test-only routes. A stub on a real path would let a layout test pass against a blank page.
 */
describe('page stubs', () => {
  it('no ROUTES path (EN or TR) resolves to a page stub', () => {
    addPageStubs()
    const router = useRouter()
    const stubbed = Object.values(ROUTES)
      .flatMap((p) => [p.en, p.tr])
      .filter((path) => {
        const r = router.resolve(path)
        return r.matched.length === 0 || r.meta.pageStub === true
      })
    expect(stubbed).toEqual([])
  })
})
