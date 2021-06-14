<template>
  <ion-header class="ion-no-border">
    <ion-toolbar mode="md">
      <ion-title> {{ title }} </ion-title>
      <ion-buttons slot="end">
        <ion-button
          @click="modalController.dismiss()"
          slot="icon-only"
          size="large"
        >
          <ion-icon :icon="closeCircleIcon" size="large"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <slot />
  </ion-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  IonContent,
  modalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/vue'
import { closeCircle as closeCircleIcon } from 'ionicons/icons'

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  components: {
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
  },
  setup() {
    return {
      modalController,
      closeCircleIcon,
    }
  },
})
</script>

<style scoped>
ion-modal ion-content {
  --background: var(--ion-color-primary);
  --color: white;
}

ion-modal ion-toolbar {
  --background: var(--ion-color-primary);
  --color: white;
}
</style>
