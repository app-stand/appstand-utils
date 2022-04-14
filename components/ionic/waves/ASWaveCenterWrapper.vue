<template>
  <div class="wrapperSpace _iosMargin">
    <slot />
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.wrapperSpace {
  height: 89%;
  padding-top: 2%;
  display: flex;
  align-items: center;
}

@media (min-width: 992px) {
  .wrapperSpace {
    padding-top: 2%;
    height: 77%;
  }
}

@media (min-width: 1120px) {
  .wrapperSpace {
    padding-top: 1.5%;
    height: 73%;
  }
}

/* Not supported screen sized*/
/*@media (min-aspect-ratio: 48/17), (max-aspect-ratio: 7/22) {
  .wrapperSpace {
    background: red;
  }
}*/
</style>
