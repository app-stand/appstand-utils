<template>
  <ion-grid class="_iosMargin">
    <ion-row>
      <ion-col
        size="12"
        :size-sm="fullWidth ? '12' : '10'"
        :offset-sm="fullWidth ? '0' : '1'"
        :size-md="fullWidth ? '12' : '10'"
        :offset-md="fullWidth ? '0' : '1'"
        :size-lg="fullWidth ? '12' : '6'"
        :offset-lg="fullWidth ? '0' : '3'"
      >
        <slot name="abovetitle" />
        <h1 v-if="title" class="pageTitle">
          {{ title }}
        </h1>
        <slot />
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script lang="ts" setup>
import {IonGrid, IonRow, IonCol} from '@ionic/vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  fullscreen: {
    default: false,
    type: Boolean,
  },
  fullWidth: {
    default: false,
    type: Boolean,
  },
})
</script>

<style scoped>
.pageTitle {
  color: white;
  font-size: 35px;
  text-align: center;
}
</style>
