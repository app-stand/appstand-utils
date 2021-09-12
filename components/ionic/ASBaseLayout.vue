<template>
  <ion-page>
    <slot name="toolbar" />
    <DesktopToolbar class="ion-hide-lg-down" />
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

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonContent } from '@ionic/vue'
import DesktopToolbar from '@/components/_base/desktop/DesktopToolbar.vue'

export default defineComponent({
  props: {
    fullscreen: {
      type: Boolean,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    IonPage,
    IonContent,
    DesktopToolbar,
  },
})
</script>

<style scoped>
ion-content {
  --background: transparent;
}
</style>
