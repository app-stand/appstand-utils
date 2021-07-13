<template>
  <img class="app-icon" :height="size" :src="src" :style="dynStyle" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    src: {
      required: true,
    },
    size: {
      type: String,
      default: '250',
    },
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const dynStyle = computed(() => {
      if (!props.shadow) return {}
      return {
        '-webkit-filter': 'drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2))',
        '-moz-filter': 'drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2))',
        filter: 'drop-shadow(10px 5px 3px rgba(232, 232, 232, 0.2))',
      }
    })

    return { dynStyle }
  },
})
</script>

<style scoped>
.app-icon {
  border-radius: 25%;
  /* No Select */
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
