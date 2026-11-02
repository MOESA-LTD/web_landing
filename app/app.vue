<script setup lang="ts">
// `<html lang>` follows the active locale on every page (EN "en", TR "tr"), not only on pages that call usePageSeo.
const { locale } = useI18n()
useHead({ htmlAttrs: { lang: locale } })
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
