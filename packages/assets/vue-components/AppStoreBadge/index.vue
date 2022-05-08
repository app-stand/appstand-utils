<template>
  <div class="appstore-badge-wrapper">
    <div class="appstore-badge-badge">
      <a v-if="ios" :href="ios" target="_blank">
        <img :src="appleAppStoreBadge" :height="size" />
      </a>
    </div>
    <div class="appstore-badge-badge">
      <a v-if="android" :href="android" target="_blank">
        <img :src="androidPlayStoreBadge" :height="size" />
      </a>
    </div>
    <div class="appstore-badge-badge">
      <a v-if="website" :href="website" target="_blank">
        <img :src="visitWebsiteBadge" :height="size" />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
</script>

<style scoped>
.appstore-badge-badge {
  display: inline-block;
}

.appstore-badge-badge img {
  margin-left: 2px;
  margin-right: 2px;
}

a + a {
  margin-left: 10px;
}
</style>
