<script lang="ts" setup>
const props = defineProps<{
  href: string
  src: string
  alt?: string
  height: string
}>()
</script>

<template>
  <div class="badge-link" :style="{'--badge-height': height}">
    <a
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="alt || 'Store badge'"
    >
      <img :src="src" :alt="alt || 'Store badge'" loading="lazy" />
    </a>
  </div>
</template>

<style scoped>
.badge-link {
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.badge-link a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--badge-height, 49px);
}

.badge-link img {
  display: block;
  height: 100%;
  width: auto;
}
</style>
