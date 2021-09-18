<template>
  <ion-page>
    <slot name="toolbar" />
    <Toolbar :class="toolbarClasses" />
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
import Toolbar from '@/components/_base/Toolbar.vue'

export default defineComponent({
  props: {
    fullscreen: {
      type: Boolean,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
    toolbarClasses: {
      type: String,
      required: false,
    },
  },
  components: {
    IonPage,
    IonContent,
    Toolbar,
  },
})
</script>

<style scoped>
ion-content {
  --background: transparent;
}
</style>
