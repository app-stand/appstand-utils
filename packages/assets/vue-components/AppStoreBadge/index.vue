<script lang="ts" setup>
import {computed} from 'vue'
import BadgeLink from './BadgeLink.vue'
import appleAppStoreBadge from './img/apple-app-store.svg?url'
import androidPlayStoreBadge from './img/android-play-store.svg?url'
import visitWebsiteBadge from './img/visit-website.svg?url'
import visitWebconsoleBadge from './img/visit-webconsole.svg?url'

type BadgeDefinition = {
  key: string
  href: string
  src: string
  alt: string
}

const {
  android,
  ios,
  website,
  webconsole,
  size = '49',
  gap = '12',
} = defineProps<{
  android?: string
  ios?: string
  website?: string
  webconsole?: string
  size?: string
  gap?: string
}>()

const normalizeDimension = (value?: string): string => {
  if (!value) return ''
  const trimmed = value.trim()
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
}

const normalizedSize = computed(() => normalizeDimension(size) || '49px')
const normalizedGap = computed(() => normalizeDimension(gap) || '12px')

const badges = computed<BadgeDefinition[]>(() => {
  const items: Array<BadgeDefinition | null> = [
    ios
      ? {
          key: 'ios',
          href: ios,
          src: appleAppStoreBadge,
          alt: 'Download on the App Store',
        }
      : null,
    android
      ? {
          key: 'android',
          href: android,
          src: androidPlayStoreBadge,
          alt: 'Get it on Google Play',
        }
      : null,
    website
      ? {
          key: 'website',
          href: website,
          src: visitWebsiteBadge,
          alt: 'Visit website',
        }
      : null,
    webconsole
      ? {
          key: 'webconsole',
          href: webconsole,
          src: visitWebconsoleBadge,
          alt: 'Open web console',
        }
      : null,
  ]

  return items.filter((badge): badge is BadgeDefinition => Boolean(badge))
})
</script>

<template>
  <div
    class="appstore-badge-wrapper"
    :style="{'--appstore-badge-gap': normalizedGap}"
    role="group"
    aria-label="App badges"
  >
    <BadgeLink
      v-for="badge in badges"
      :key="badge.key"
      :href="badge.href"
      :src="badge.src"
      :alt="badge.alt"
      :height="normalizedSize"
    />
  </div>
</template>

<style scoped>
.appstore-badge-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--appstore-badge-gap, 12px);
}
</style>
