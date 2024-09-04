<template>
  <div class="device-list">
    <h2>Available Devices</h2>
    <ul>
      <li v-for="device in devices" :key="device.username">
        {{ device.username }}
        <button @click="requestScreenShare(device.username)">
          View Screen
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useDeviceStore } from "@/store/deviceStore";
import { requestScreenShare } from "@/services/websocketService";

export default defineComponent({
  setup() {
    const deviceStore = useDeviceStore();

    const requestScreenShare = (username: string) => {
      requestScreenShare(username);
    };

    return {
      devices: deviceStore.devices,
      requestScreenShare,
    };
  },
});
</script>
