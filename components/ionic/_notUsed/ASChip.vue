<template>
  <ion-chip>
    <ion-label>
      <slot />
    </ion-label>
  </ion-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonChip, IonLabel } from '@ionic/vue'

export default defineComponent({
  components: {
    IonChip,
    IonLabel,
  },
})
</script>
