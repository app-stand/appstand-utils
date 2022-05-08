<template>
  <ion-page>
    <slot name="toolbar" />
    <ion-content
      forceOverscroll="false"
      :fullscreen="fullscreen"
      :scrollY="scrollY"
    >
      <slot />
    </ion-content>
    <slot name="footer"></slot>
  </ion-page>
</template>

<script lang="ts" setup>
import {IonPage, IonContent} from '@ionic/vue'

defineProps({
  fullscreen: {
    type: Boolean,
  },
  scrollY: {
    type: Boolean,
    default: true,
  },
})
</script>

<style scoped>
ion-content {
  --background: transparent;
}
</style>
