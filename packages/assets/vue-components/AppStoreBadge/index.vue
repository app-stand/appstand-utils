<script lang="ts" setup>
import {computed} from 'vue'
import appleAppStoreBadge from './img/apple-app-store.svg?url'
import androidPlayStoreBadge from './img/android-play-store.svg?url'
import visitWebsiteBadge from './img/visit-website.svg?url'

const props = defineProps({
  android: {
    type: String,
    required: false,
  },
  ios: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  size: {
    type: String,
    default: '49',
  },
})

const normalizedSize = computed(() => {
  const trimmed = props.size.trim()
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed
})
</script>

<template>
  <div class="appstore-badge-wrapper">
    <div class="appstore-badge-badge" :style="{height: normalizedSize}">
      <a v-if="ios" :href="ios" target="_blank">
        <img :src="appleAppStoreBadge" />
      </a>
    </div>
    <div
      v-if="android"
      class="appstore-badge-badge"
      :style="{height: normalizedSize}"
    >
      <a :href="android" target="_blank">
        <img :src="androidPlayStoreBadge" />
      </a>
    </div>
    <div class="appstore-badge-badge" :style="{height: normalizedSize}">
      <a v-if="website" :href="website" target="_blank">
        <img :src="visitWebsiteBadge" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.appstore-badge-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* keep consistent spacing even when wrapping vertically */
}

.appstore-badge-badge {
  display: flex;
}

.appstore-badge-badge img {
  display: block;
  height: 100%;
  width: auto;
}
</style>
