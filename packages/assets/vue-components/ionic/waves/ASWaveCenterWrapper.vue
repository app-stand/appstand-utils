<script lang="ts" setup></script>

<template>
  <div class="wrapperSpace _iosMargin">
    <slot />
  </div>
</template>

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
</style>
