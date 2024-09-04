<template>
  <div class="dashboard">
    <DeviceList />
    <ScreenShareView v-if="selectedDevice.username" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeviceList from "@/components/DeviceList.vue";
import ScreenShareView from "@/components/ScreenShareView.vue";
import { useDeviceStore } from "@/store/deviceStore";

export default defineComponent({
  components: {
    DeviceList,
    ScreenShareView,
  },
  setup() {
    const deviceStore = useDeviceStore();

    return {
      selectedDevice: deviceStore.selectedDevice,
    };
  },
});
</script>
