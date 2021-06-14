<template>
  <div class="appstore-badge-wrapper">
    <div class="appstore-badge-badge">
      <a v-if="ios" :href="ios" target="_blank">
        <img
          src="../assets/appStoreBadges/appple-app-store.svg"
          :height="size"
        />
      </a>
    </div>
    <div class="appstore-badge-badge">
      <a v-if="android" :href="android" target="_blank">
        <img
          src="../assets/appStoreBadges/android-play-store.svg"
          :height="size"
        />
      </a>
    </div>
    <div class="appstore-badge-badge">
      <a v-if="website" :href="website" target="_blank">
        <img src="../assets/appStoreBadges/visit-website.svg" :height="size" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    android: {
      type: String,
      required: false,
    },
    ios: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      default: "49",
    },
  },
};
</script>

<style scoped>
.appstore-badge-badge {
  display: inline-block;
}

.appstore-badge-badge img {
  margin-left: 2px;
  margin-right: 2px;
}

a + a {
  margin-left: 10px;
}
</style>
