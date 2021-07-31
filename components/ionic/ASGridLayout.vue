<template>
  <ASBaseLayout>
    <ion-grid class="_iosMargin">
      <ion-row>
        <ion-col
          size="12"
          size-sm="10"
          offset-sm="1"
          size-md="10"
          offset-md="1"
          size-lg="6"
          offset-lg="3"
        >
          <h1 v-if="title" class="pageTitle">
            {{ title }}
          </h1>
          <slot />
        </ion-col>
      </ion-row>
    </ion-grid>
  </ASBaseLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ASBaseLayout from './ASBaseLayout.vue'
import { IonGrid, IonRow, IonCol } from '@ionic/vue'

export default defineComponent({
  props: ['title'],
  components: {
    ASBaseLayout,
    IonGrid,
    IonRow,
    IonCol,
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
