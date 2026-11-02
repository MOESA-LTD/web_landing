import { ROUTES } from '../../../i18n/routes'

/**
 * Safety net for layout tests that navigate to every ROUTES path. Since Task 9 every page exists, so this adds
 * nothing for real paths (tests/unit/page-stubs.test.ts guards that; stubs carry `meta.pageStub`). Register a stub route for every
 * entry of ROUTES that the app does not (yet) have, named `<base>___<locale>` like the i18n module names
 * its routes, so `useSwitchLocalePath()` can pair the EN and TR route. Real routes are never replaced or
 * shadowed: a path that a real route already matches (e.g. `/services/:slug`) gets no stub.
 */
export function addPageStubs() {
  const router = useRouter()
  const stub = { render: () => null }
  for (const [name, paths] of Object.entries(ROUTES)) {
    const base = name === 'home' ? 'index' : name.replace(/\//g, '-')
    for (const locale of ['en', 'tr', 'de', 'bg'] as const) {
      const routeName = `${base}___${locale}`
      if (router.hasRoute(routeName) || router.resolve(paths[locale]).matched.length > 0) continue
      router.addRoute({ name: routeName, path: paths[locale], component: stub, meta: { pageStub: true } })
    }
  }
}
