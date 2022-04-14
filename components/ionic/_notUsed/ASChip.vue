<template>
  <ion-chip>
    <ion-label>
      <slot />
    </ion-label>
  </ion-chip>
</template>

<script lang="ts" setup>
import { IonChip, IonLabel } from '@ionic/vue'
</script>
