<template>
  <img class="app-icon" :height="size" :src="src" />
</template>

<script>
export default {
  props: {
    src: {
      required: true,
    },
    size: {
      type: String,
      default: 250,
    },
  },
};
</script>

<style scoped>
.app-icon {
  border-radius: 25%;
  /* Shadow */
  -webkit-filter: drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2));
  -moz-filter: drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2));
  filter: drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2));
  /* No Select */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
