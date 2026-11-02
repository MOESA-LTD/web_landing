<script setup lang="ts">
import type { Cta } from '#content/types'

/**
 * Message page body (bundle.js `MessagePage`: `ThankYouState` / `NotFound`, bundle.css `.ms-message*`): a check icon
 * (`kind="thanks"`) or an eyebrow code (`kind="notFound"`), the page's single h1, the lead, then a titled list —
 * numbered steps for thanks, the DS `.ms-linklist` for 404 (ruled rows with an arrow) — and an optional titled note. Actions are optional (the pages
 * use the approved FinalCTA instead).
 * The DS column (max 720) hugs the left edge of the viewport; here it sits in the 1200 site container so it lines up
 * with the header. `condensed` is the approved TR running sentence, shown above the translated list.
 * In `info.body`, `email` (when given) is rendered as a mailto link; the text stays verbatim.
 */
const props = withDefaults(
  defineProps<{
    kind?: 'thanks' | 'notFound'
    code?: string
    title: string
    body?: string
    listTitle?: string
    steps?: string[]
    links?: Cta[]
    condensed?: string
    info?: { title: string; body: string }
    email?: string
    actions?: Cta[]
  }>(),
  {
    kind: 'thanks',
    code: '404',
    body: undefined,
    listTitle: undefined,
    steps: () => [],
    links: () => [],
    condensed: undefined,
    info: undefined,
    email: undefined,
    actions: () => [],
  },
)

/** `info.body` split around the email address, so the address can be a link. */
const infoParts = computed(() => {
  const body = props.info?.body ?? ''
  const at = props.email ? body.indexOf(props.email) : -1
  return at < 0 ? { before: body, email: '', after: '' } : { before: body.slice(0, at), email: props.email!, after: body.slice(at + props.email!.length) }
})
</script>

<template>
  <section data-message-state class="@container bg-white">
    <div class="container-site">
      <div class="grid max-w-[720px] justify-items-start gap-6 py-24 @max-[720.98px]:py-16">
        <span v-if="props.kind === 'thanks'" class="inline-flex size-14 items-center justify-center rounded-sm bg-pale text-blue" aria-hidden="true">
          <Glyph name="check" :size="28" />
        </span>
        <p v-else class="text-eyebrow text-blue">{{ props.code }}</p>

        <h1 class="max-w-[22ch] text-h1 @max-[720.98px]:text-[34px] @max-[720.98px]:leading-10">{{ props.title }}</h1>
        <p v-if="props.body" class="max-w-[56ch] text-lead text-slate">{{ props.body }}</p>

        <div v-if="props.steps.length || props.links.length" data-message-list class="grid w-full gap-3">
          <h2 v-if="props.listTitle" class="text-h4 text-navy">{{ props.listTitle }}</h2>
          <p v-if="props.condensed" data-condensed class="text-body text-slate">{{ props.condensed }}</p>
          <ol v-if="props.kind === 'thanks'" class="m-0 grid list-decimal gap-2 pl-6 text-body text-slate marker:font-bold marker:text-blue">
            <li v-for="(s, i) in props.steps" :key="i">{{ s }}</li>
          </ol>
          <ul v-else class="m-0 list-none border-t border-line p-0">
            <li v-for="(l, i) in props.links" :key="i" class="border-b border-line">
              <NuxtLink
                :to="useLocalizedHref(l.href)"
                class="group flex items-center justify-between gap-4 py-4 text-label text-navy no-underline hover:text-blue"
              >
                <span>{{ l.label }}</span>
                <Glyph name="arrow" :size="18" class="flex-none transition-transform duration-150 group-hover:translate-x-[3px]" />
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="props.info" data-message-info class="grid gap-2 border-t border-line pt-6">
          <h2 class="text-h4 text-navy">{{ props.info.title }}</h2>
          <p class="text-body-sm text-slate">
            {{ infoParts.before }}<a v-if="infoParts.email" :href="`mailto:${infoParts.email}`" class="font-semibold text-blue underline hover:text-blue-dark">{{ infoParts.email }}</a>{{ infoParts.after }}
          </p>
        </div>

        <div v-if="props.actions.length" class="flex flex-wrap items-center gap-4">
          <Button v-for="(a, i) in props.actions" :key="i" :to="a.href" :variant="i === 0 ? 'primary' : 'secondary'">{{ a.label }}</Button>
        </div>
      </div>
    </div>
  </section>
</template>
