<template>
  <div class="screen-share-view">
    <h2>Viewing Screen: {{ selectedDevice.username }}</h2>
    <video id="remoteVideo" autoplay playsinline></video>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDeviceStore } from "@/store/deviceStore";

export default defineComponent({
  setup() {
    const deviceStore = useDeviceStore();

    return {
      selectedDevice: deviceStore.selectedDevice,
    };
  },
});
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
  border: 1px solid #ccc;
}
</style>
