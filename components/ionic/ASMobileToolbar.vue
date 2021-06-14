<template>
  <ion-header class="ion-no-border ion-hide-lg-up">
    <ion-toolbar class="ion-padding-top">
      <ion-buttons slot="start">
        <ion-back-button default-href="/base" />
      </ion-buttons>
      <ion-buttons slot="end" v-if="buttons">
        <ion-button
          slot="icon-only"
          v-for="button in buttons"
          :key="button.link"
          :router-link="button.link"
          :class="{ 'my-item-selected': $route.path === '/settings' }"
          routerDirection="root"
        >
          <ion-icon :icon="button.icon"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
} from '@ionic/vue'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    buttons: {
      type: Array,
      default: null,
    },
  },
  setup(props, { slots }) {
    return {
      hasButtonsSlot: computed(() => !!slots.buttons),
    }
  },
  components: {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
  },
})
</script>

<style scoped>
ion-toolbar {
  --background: transparent;
}

ion-header {
  border-bottom: none;
}

ion-buttons {
  align-items: start;
  margin-top: -4px;
  margin-right: 10px;
}

ion-back-button {
  --color: white;
}
</style>
